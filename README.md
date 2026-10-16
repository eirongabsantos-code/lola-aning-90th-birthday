# Mama Aning's 90th Birthday Invitation

A responsive, single-page birthday invitation website with an animated envelope opening, elegant botanical artwork, event countdown, celebration details, and an RSVP form.

## Files

- `index.html` — page structure and invitation content
- `styles.css` — layout, typography, responsive styling, and animations
- `script.js` — envelope interaction, countdown, mobile navigation, scroll reveals, RSVP behavior, and music controls
- `assets/lola-aning.png` — Mama Aning’s portrait (included)
- `assets/dancing-queen-chorus.mp3` — short background music excerpt from the uploaded audio

## Preview locally

1. Download and unzip the folder.
2. Open `index.html` in a current browser (Chrome, Edge, Safari, or Firefox).
3. For the most reliable local preview, use a simple static server. If Python is installed, open a terminal in this folder and run:

   ```bash
   python -m http.server 8000
   ```

4. Visit `http://localhost:8000`.

The page loads Google Fonts from the internet. If you preview offline, fallback fonts will be used.

## Confirmed event details

- Date: **Saturday, December 12, 2026**
- Time: **10:30 AM**
- Venue: **Lakambini Hall, Villamor Airbase, Villamor, Pasay City**
- Dress code: **Filipiniana with Flair** (optional)
- Google Maps: https://maps.app.goo.gl/vkZe12u5t4oL7w2Q9

The original, unedited portrait is included as `assets/lola-aning.png` and is used in both portrait areas. Keep that asset path unchanged when uploading the website.

## Background music

The music player and play/pause button are included. A 30-second excerpt from the uploaded “Dancing Queen” MP3 is included as `assets/dancing-queen-chorus.mp3`, beginning a few seconds before the chorus and fading in/out. Playback is attempted after the guest clicks to open the invitation. Use of copyrighted recordings may be subject to copyright and hosting-platform restrictions; personal use alone does not automatically remove those restrictions.

## Important: configure RSVP collection

The RSVP form validates required fields and submits responses to the configured Google Apps Script Web App. Verify each test RSVP appears in the connected spreadsheet before sharing the link. The configured Google Apps Script endpoint is included in `script.js`. Keep it unchanged unless replacing the RSVP backend.

To accept responses online:

1. Choose a form endpoint that accepts JSON POST requests, or create a small serverless function connected to a spreadsheet/database.
2. Set `RSVP_ENDPOINT` in `script.js` to that endpoint URL.
3. Ensure the endpoint accepts the fields `name`, `attendance`, `guestCount`, `message`, `event`, and `eventDate`, and returns a successful HTTP status when it saves the response.
4. Test both an accepting and declining RSVP before sharing the link.

Do not put private API keys or secrets in client-side JavaScript. If you use a service with a different submission format, adjust the submit handler to match its documentation.

## Publish free with GitHub Pages

1. Sign in to GitHub and create a new public repository, for example `lola-aning-90th-invitation`.
2. Upload `index.html`, `styles.css`, `script.js`, and this README to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under the build/deployment source, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for GitHub Pages to publish. The Pages section will show the public website URL.
7. Open that URL on a phone and test all sections and the RSVP workflow before sending it to guests.

GitHub Pages is suitable for static files; it does not run a private server or database for RSVP submissions. Use a separate form endpoint or serverless backend for collecting responses.

## Custom domain (optional)

You can connect a domain you own through **Settings → Pages → Custom domain** and follow GitHub's DNS instructions. A custom domain usually has a registration cost.


## Background music and portrait

- Mama Aning's portrait is included at `assets/lola-aning.png`.
- A 30-second excerpt from the user-provided ABBA “Dancing Queen” audio is included at `assets/dancing-queen-chorus.mp3`, starting shortly before the chorus. The excerpt is intended to play as the invitation opens and loop while the page is open.
- Guests can use the floating music control to pause or resume playback.
- Playback starts after a guest clicks to open the invitation, because browsers generally block sound autoplay before user interaction.

**Copyright note:** Using a song for a personal invitation does not automatically make it copyright-free. If you publish the site publicly, the recording may still be subject to copyright or hosting-platform restrictions. For a public-facing version, consider licensed/royalty-free music or get permission from the rights holder.


Personalization: the signature has been updated to “Mama Aning.” The same original, unedited portrait is used in both photo areas.
