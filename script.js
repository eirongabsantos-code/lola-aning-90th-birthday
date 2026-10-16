/*
  Lola Aning's 90th Birthday Invitation
  -------------------------------------
  RSVP setup: this static site does not send responses anywhere by default.
  To collect RSVPs online, set RSVP_ENDPOINT below to a form endpoint you control
  (for example, a FormSubmit endpoint or your own serverless form handler).
  If left blank, the page clearly tells guests that the form is in preview mode.
*/
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbz3RIYhocbScGIjY-leOCt5A1x5r7fws8UDfNcrCe4g372M-ZGrek6aI_UbqzoAKK0juA/exec"; // Paste the deployed URL ending in /exec
const EVENT_DATE = new Date(2026, 11, 12, 10, 30, 0); // December 12, 2026 at 10:30 AM local time

const opening = document.getElementById('opening');
const openButton = document.getElementById('openInvitation');
const envelopeWrap = document.getElementById('envelopeWrap');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const rsvpForm = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');
const backgroundMusic = document.getElementById('backgroundMusic');

// Add vehicle fields from JavaScript so index.html does not need to be replaced.
if (rsvpForm && !rsvpForm.querySelector('[name=\"bringingVehicle\"]')) {
  const guestCountField = rsvpForm.querySelector('[name=\"guestCount\"]');
  const messageField = rsvpForm.querySelector('[name=\"message\"]');
  const vehicleBlock = document.createElement('div');
  vehicleBlock.className = 'vehicle-rsvp-fields';
  vehicleBlock.innerHTML = `
    <label>Will you be bringing a vehicle? <span>*</span></label>
    <div class="attendance-options">
      <label class="radio-card"><input type="radio" name="bringingVehicle" value="Yes" required><span class="radio-dot"></span><span>Yes</span></label>
      <label class="radio-card"><input type="radio" name="bringingVehicle" value="No" required><span class="radio-dot"></span><span>No</span></label>
    </div>
    <label for="vehiclePlate">Vehicle plate number(s) <span class="optional">REQUIRED IF BRINGING A VEHICLE</span></label>
    <input id="vehiclePlate" name="vehiclePlate" type="text" placeholder="e.g. ABC 1234" autocomplete="off" disabled>
    <p class="form-note">If bringing more than one vehicle, separate the plate numbers with commas.</p>
  `;
  if (guestCountField && guestCountField.parentElement) {
    guestCountField.parentElement.insertAdjacentElement('afterend', vehicleBlock);
  } else if (messageField && messageField.parentElement) {
    messageField.parentElement.insertAdjacentElement('beforebegin', vehicleBlock);
  } else {
    rsvpForm.appendChild(vehicleBlock);
  }
  const vehicleInputs = vehicleBlock.querySelectorAll('input[name=\"bringingVehicle\"]');
  const plateInput = vehicleBlock.querySelector('[name=\"vehiclePlate\"]');
  vehicleInputs.forEach(input => input.addEventListener('change', () => {
    const bringing = vehicleBlock.querySelector('[name=\"bringingVehicle\"]:checked')?.value === 'Yes';
    plateInput.disabled = !bringing;
    plateInput.required = bringing;
    if (!bringing) plateInput.value = '';
  }));
}

const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

document.body.classList.add('locked');
function openInvite() {
  if (opening.classList.contains('opening-active')) return;
  opening.classList.add('opening-active');
  openButton.disabled = true;
  window.setTimeout(() => {
    opening.classList.add('is-open');
    document.body.classList.remove('locked');
    document.getElementById('main').setAttribute('tabindex', '-1');
    document.getElementById('main').focus({ preventScroll: true });
  }, 1050);
  // Starting playback from the guest's click respects browser autoplay restrictions.
  if (backgroundMusic) {
    backgroundMusic.volume = 0.42;
    backgroundMusic.play().then(() => setMusicState(true)).catch(() => {
      setMusicState(false);
      if (musicLabel) musicLabel.textContent = 'Tap for music';
    });
  }
}
function setMusicState(isPlaying) {
  if (!musicToggle) return;
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  musicToggle.title = isPlaying ? 'Pause background music' : 'Play background music';
  if (musicLabel) musicLabel.textContent = isPlaying ? 'Pause music' : 'Play music';
}
if (musicToggle && backgroundMusic) {
  musicToggle.addEventListener('click', async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        setMusicState(true);
      } catch (error) {
        setMusicState(false);
        if (musicLabel) musicLabel.textContent = 'Music unavailable';
      }
    } else {
      backgroundMusic.pause();
      setMusicState(false);
    }
  });
  backgroundMusic.addEventListener('ended', () => setMusicState(false));
  backgroundMusic.addEventListener('pause', () => setMusicState(false));
  backgroundMusic.addEventListener('play', () => setMusicState(true));
}
openButton.addEventListener('click', openInvite);
envelopeWrap.addEventListener('click', openInvite);

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('is-open', !expanded);
});
siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

function updateCountdown() {
  const now = new Date();
  const distance = EVENT_DATE.getTime() - now.getTime();
  const values = distance <= 0
    ? { days: '00', hours: '00', minutes: '00', seconds: '00' }
    : {
        days: String(Math.floor(distance / 86400000)).padStart(2, '0'),
        hours: String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0'),
        minutes: String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0'),
        seconds: String(Math.floor((distance % 60000) / 1000)).padStart(2, '0')
      };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.getElementById(key);
    if (node) node.textContent = value;
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  formStatus.classList.remove('error');
  const data = Object.fromEntries(new FormData(rsvpForm).entries());
  if (!data.name || !data.attendance || !data.bringingVehicle) {
    formStatus.textContent = 'Please enter your name, choose an attendance response, and answer the vehicle question.';
    formStatus.classList.add('error');
    return;
  }
  if (data.bringingVehicle === 'Yes' && !String(data.vehiclePlate || '').trim()) {
    formStatus.textContent = 'Please enter the plate number for each vehicle you are bringing.';
    formStatus.classList.add('error');
    return;
  }

  if (!RSVP_ENDPOINT || RSVP_ENDPOINT.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
    formStatus.textContent = 'The RSVP form is not connected yet. Please contact the family directly to confirm.';
    formStatus.classList.add('error');
    return;
  }

  const submitButton = rsvpForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending… <span>↗</span>';
  try {
    // Apps Script reads e.parameter.payload, so send URL-encoded form data, not raw JSON.
    const payload = {
      ...data,
      guestCount: data.guestCount || '1',
      message: data.message || '',
      contact: data.contact || '',
      event: "Lola Aning's 90th Birthday",
      eventDate: '2026-12-12',
      eventTime: '10:30 AM'
    };
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({ payload: JSON.stringify(payload) })
    });
    // With no-cors, the browser hides the response; the request is sent to Apps Script.
    formStatus.textContent = 'Thank you! Your RSVP has been submitted. If you need to change your response, please contact the family.';
    rsvpForm.reset();
    const plateInput = rsvpForm.querySelector('[name="vehiclePlate"]');
    if (plateInput) { plateInput.disabled = true; plateInput.required = false; }
  } catch (error) {
    formStatus.textContent = 'We could not send your RSVP. Please contact the family directly to confirm.';
    formStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send your RSVP <span>↗</span>';
  }
});
