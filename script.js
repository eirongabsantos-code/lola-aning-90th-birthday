/*
  Lola Aning's 90th Birthday Invitation
  -------------------------------------
  RSVP setup: this static site does not send responses anywhere by default.
  To collect RSVPs online, set RSVP_ENDPOINT below to a form endpoint you control
  (for example, a FormSubmit endpoint or your own serverless form handler).
  If left blank, the page clearly tells guests that the form is in preview mode.
*/
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbz3RIYhocbScGIjY-leOCt5A1x5r7fws8UDfNcrCe4g372M-ZGrek6aI_UbqzoAKK0juA/exec"; // Google Apps Script Web App URL
const EVENT_DATE = new Date(2026, 11, 12, 10, 30, 0); // December 12, 2026 at 10:30 AM local time // Local browser time; month 11 = December

const opening = document.getElementById('opening');
const openButton = document.getElementById('openInvitation');
const envelopeWrap = document.getElementById('envelopeWrap');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const rsvpForm = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');
const backgroundMusic = document.getElementById('backgroundMusic');
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

const vehicleRadios = rsvpForm.querySelectorAll('input[name="bringingVehicle"]');
const vehiclePlateInput = rsvpForm.querySelector('#vehiclePlate');
vehicleRadios.forEach(radio => radio.addEventListener('change', () => {
  const bringingVehicle = rsvpForm.querySelector('input[name="bringingVehicle"]:checked')?.value === 'Yes';
  if (vehiclePlateInput) {
    vehiclePlateInput.disabled = !bringingVehicle;
    vehiclePlateInput.required = bringingVehicle;
    if (!bringingVehicle) vehiclePlateInput.value = '';
  }
}));

rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  formStatus.classList.remove('error');
  const data = Object.fromEntries(new FormData(rsvpForm).entries());
  data.name = String(data.name || '').trim();
  data.vehiclePlate = String(data.vehiclePlate || '').trim();

  if (!data.name || !data.attendance || !data.bringingVehicle) {
    formStatus.textContent = 'Please enter your name, choose an attendance response, and answer the vehicle question.';
    formStatus.classList.add('error');
    return;
  }
  if (data.bringingVehicle === 'Yes' && !data.vehiclePlate) {
    formStatus.textContent = 'Please enter the plate number for the vehicle you will bring.';
    formStatus.classList.add('error');
    if (vehiclePlateInput) vehiclePlateInput.focus();
    return;
  }
  if (data.bringingVehicle !== 'Yes') data.vehiclePlate = '';

  const submitButton = rsvpForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending… <span>↗</span>';
  try {
    // Apps Script expects the JSON inside e.parameter.payload.
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
    // no-cors hides the response, so do not try to read response.json().
    formStatus.textContent = 'Thank you! Your RSVP has been submitted. We look forward to celebrating with you.';
    rsvpForm.reset();
    if (vehiclePlateInput) {
      vehiclePlateInput.disabled = true;
      vehiclePlateInput.required = false;
    }
  } catch (error) {
    console.error('RSVP submission failed:', error);
    formStatus.textContent = 'We could not send your RSVP. Please contact the family directly to confirm.';
    formStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send your RSVP <span>↗</span>';
  }
});
