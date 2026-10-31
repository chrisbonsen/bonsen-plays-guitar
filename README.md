# 🎸 Bonsen Plays Guitar

A local, gamified tracker for your guitar practice. No installs, no accounts, no cloud.

## Start it
- Double-click **`Start Guitar App.command`** in Finder, or
- run `python3 server.py` in this folder

It opens http://127.0.0.1:8765 in your browser. Leave the terminal window open while you use it.

## On your phone
The app is published at **https://chrisbonsen.github.io/bonsen-plays-guitar/**. Pushing to `main` redeploys it.

1. Open that link in **Safari** on your iPhone (on Android, use Chrome).
2. Tap **Share → Add to Home Screen**.
3. Open it from the home-screen icon. It runs full-screen, works offline, and keeps the screen awake during a show.

On the phone, progress is saved **on the phone itself**, separate from the Mac version.
Back it up now and then with **Settings → Export backup**, which goes to Files, iCloud, AirDrop or email.
To move progress between devices, export on one and import on the other.

## Your data
On the Mac version, everything is saved in `data/progress.json`, and a daily backup goes in `data/backups/`.
Settings → Export / Import also works for backups.

## Your learning path
A 6-phase, ~26-week plan for a total beginner on electric guitar, heading for rock and punk, with singing while you play. 30 minutes a day, 5 of them singing.
It's built around The Flatliners, Rise Against, Jack White and The Gaslight Anthem.

| Phase | Weeks | You learn | Boss song |
|---|---|---|---|
| 🔌 Plug In | 1–2 | Gear, tuning, tab, spider warm-up, 🎤 find your voice | Seven Nation Army (riff) |
| 🎼 First Chords | 3–6 | 7 open chords, one-minute changes, strumming, 🎤 sing & strum | Hotel Yorba |
| ⚡ Power Up | 7–10 | Power chords, palm muting, string muting, downpicking, 🎤 sing over power chords | Great Expectations |
| 🏎️ Punk Engine | 11–14 | Alternate picking, fast changes, E♭/Drop D tuning, song maps, 🎤 punk voice (safely) | Savior |
| 🎸 Riffs & Lead | 15–19 | Hammer-ons, slides, pentatonic, bends, blues, 🎤 sing what you play | Icky Thump (riff) |
| 🏟️ Full Band | 20–26 | F and Bm barre chords, speed building, 🎤 front the band | Monumental (Flatliners) |

Every lesson has a 30-minute session plan that opens with a vocal warm-up, a **"Done when"** test, and lesson videos.
The **song ladder** has 23 songs by your bands, ordered by difficulty, each with its tuning, a beginner tip, a lesson video and a tab.

- Lessons are in `web/curriculum.js`
- Videos and songs are in `web/library.js`. Every YouTube link and tab page was checked when the file was generated.

## How it works
- **Tonight:** today's lesson as a gig poster. Hit **▶ PLAY THE SHOW**.
- **The show:** a full-screen guided session, with a countdown per step, a built-in metronome (it sets itself from steps that say "at 70 BPM") and the lesson videos. Keys: Space = pause, M = metronome, → = next step.
- **Wrap-up:** log the minutes, rate the crowd and take tonight's test honestly. Pass it and the next date unlocks.
- **The tour:** 6 venues (the Garage to the Festival), 37 dates, 6 of them 🎤 sing & play. You can skip ahead if you already know a leg.
- **Setlist:** the song ladder. Cross songs off as you nail them, and add your own songs as requests.
- **Pitch game:** hear a note, sing it back, and hold it in the zone. Any octave counts. Modes: Open strings, Around your voice and Wider range. Your voice is analysed on the device only. There's also a live voice tuner in the show during vocal warm-ups.
- **Gig diary:** streak, calendar, minutes per week, history, speed records and off-tour practice.
- **Badges:** 32 pin badges.
- **Streaks:** practise every day to keep the tally going. Every 7 nights in a row earns a **sick note** (max 2), which covers a missed day.
- **XP and levels:** for minutes played, full-length shows, passed dates, headline shows, songs, dares, speed records and badges.
