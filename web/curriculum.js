"use strict";
/*
  Bonsen's learning path.
  Built for: total beginner, electric guitar, rock & punk, 30 min/day (incl. 5 min of singing).
  Favourite bands: The Flatliners, Rise Against, Jack White, The Gaslight Anthem.

  Each lesson:
    steps     – what to do in a ~25 min session: [minutes, instruction]
    doneWhen  – the test you must pass before moving on (be honest!)
    topics    – keys into VIDEOS (technique lessons)
    song      – key into SONGS (song lessons + tabs)
    skills    – skill-tree entries that get mastered when you complete the lesson
*/

const PROFILE = {
  level: "Total beginner",
  guitar: "Electric",
  style: "Rock & punk",
  minutesPerDay: 30,
  artists: ["The Flatliners", "Rise Against", "Jack White", "The Gaslight Anthem"],
};

/* VIDEOS and SONGS live in library.js */

const PHASES = [
  {
    id: "p1", icon: "🔌", name: "Plug In", weeks: "Weeks 1–2",
    goal: "Get comfortable holding the guitar, reading tab and playing your first real riff.",
    lessons: [
      {
        id: "p1-gear", title: "Meet your gear & tune up", days: 1, cats: ["Technique"],
        why: "An out-of-tune guitar makes everything sound wrong, even when you're playing it right. Tune up every single time.",
        steps: [
          [5, "Learn the parts: headstock, tuners, nut, frets, pickups, pickup selector, volume and tone knobs."],
          [5, "Amp basics: guitar volume on full, amp gain low (clean), master volume low. Turn the amp on last and off first."],
          [10, "Tune all 6 strings with a tuner (E A D G B E, thickest to thinnest). Then detune them and do it again."],
          [5, "Learn the string names: say \"Eddie Ate Dynamite, Good Bye Eddie\" while plucking each string."],
        ],
        doneWhen: "You can tune all 6 strings by yourself in under 3 minutes and name every string.",
        topics: ["gear", "tuning"], skills: ["Tune the guitar", "Amp basics"],
      },
      {
        id: "p1-hold", title: "Hold it right: posture, pick & fingers", days: 2, cats: ["Technique"],
        why: "Good habits now save months of fixing bad ones later. A relaxed grip makes you faster and stops it hurting.",
        steps: [
          [5, "Posture: sit up, guitar body on your right leg, neck angled slightly up. Use a strap if you stand."],
          [5, "Pick grip: between your thumb pad and the side of your index finger, with only a little tip showing. Stay relaxed."],
          [10, "Fingertips just behind the fret, thumb behind the neck. Play frets 1-2-3-4 on each string and listen for buzz."],
          [5, "Pick each open string 4 times, low E to high E, looking at your fretting hand instead of the pick."],
        ],
        doneWhen: "Every note from fret 1 to 4 rings clearly on all 6 strings, without buzzing.",
        topics: ["hold"], skills: ["Pick grip & posture"],
      },
      {
        id: "p1-tab", title: "Read tab", days: 1, cats: ["Theory"],
        why: "Almost every rock and punk song online is written in tab. Once you can read it, every song is open to you.",
        steps: [
          [8, "Watch the tab lesson. Six lines = six strings (thin string on top!), numbers = frets."],
          [12, "Open Songsterr and play through the first 2 lines of any song on the ladder, slowly and note by note."],
          [5, "Write your own 4-note riff in tab on paper and play it."],
        ],
        doneWhen: "You can read and play a 2-line tab without help.",
        topics: ["tab"], skills: ["Read tab"],
      },
      {
        id: "p1-spider", title: "The spider warm-up + metronome", days: 3, cats: ["Technique"],
        why: "This is your daily warm-up for the next few months. It builds finger independence and gets you used to playing in time.",
        steps: [
          [3, "Get a free metronome (app or Google \"metronome\"). Set it to 60 BPM."],
          [10, "Play frets 1-2-3-4 on the low E string with fingers 1-2-3-4, one note per click. Then the A string, and so on up to the high E, then back down."],
          [7, "Alternate your picking: down-up-down-up. Keep fingers close to the frets."],
          [5, "Shift the pattern to frets 5-6-7-8 and repeat."],
        ],
        doneWhen: "You can play 1-2-3-4 across all 6 strings and back at 60 BPM, one note per click, without stopping.",
        topics: ["chromatic", "metronome"], skills: ["Spider warm-up", "Play with a metronome"],
      },
      {
        id: "p1-voice", title: "Find your voice", days: 2, cats: ["Vocals"], vocal: true,
        why: "Anyone can learn to sing in tune. It's a skill, not a gift. Today you find where your voice sits, and you learn to check yourself with a tuner.",
        steps: [
          [5, "Breathing: lie down with a book on your belly. Breathe in so the book rises (not your shoulders). Then 4 slow breaths: in for 4, out for 8 on a long 'sss'.", "Vocal warm-up"],
          [8, "Lip trills (a motorboat sound), then gentle sirens on 'ooo' from low to high and back down. It should feel easy, so back off if anything scratches."],
          [8, "Pitch matching: pluck the open A string, listen, hum it, then sing it on 'ah'. The voice tuner on screen shows how close you are. Then try the D and G strings, and finish with a round of the Pitch Game (Open strings)."],
          [4, "Find your range: slide down to your lowest comfortable note and up to your highest without straining. Write both in the session notes."],
        ],
        doneWhen: "You can score 6/8 or better in the Pitch Game's Open strings mode, which means matching A, D, G and B.",
        topics: ["breathing", "warmup", "pitch"], skills: ["Breathing for singing", "Pitch matching"],
      },
      {
        id: "p1-sna", title: "First riff: Seven Nation Army", days: 4, cats: ["Songs", "Riffs"],
        why: "Jack White's most famous riff is played on a single string, so it's the perfect first riff. It'll make you feel like a rockstar on day one.",
        steps: [
          [5, "Spider warm-up at 60 BPM."],
          [10, "Learn the easy version of the riff on the A string from the song lesson. Say the fret numbers out loud as you play."],
          [5, "Loop it slowly with the metronome until there are no gaps."],
          [5, "Play along with the original recording. Jack White uses a pitch-shifter pedal, so the record sounds deeper than your guitar, and that's fine."],
        ],
        doneWhen: "You can play the riff 4 times in a row along with the recording.",
        topics: ["riff"], song: "seven-nation-army", skills: ["First riff"], boss: true,
      },
    ],
  },
  {
    id: "p2", icon: "🎼", name: "First Chords", weeks: "Weeks 3–6",
    goal: "Learn the core open chords, switch between them in time and strum your first full song.",
    lessons: [
      {
        id: "p2-ead", title: "Your first chords: E minor, A & D", days: 4, cats: ["Chords"],
        why: "These shapes are the building blocks of thousands of songs. Your fingertips will hurt a bit at first. That's calluses forming, and it's a good sign.",
        steps: [
          [5, "Spider warm-up at 60–70 BPM."],
          [12, "Learn Em, A and D one at a time. Place your fingers, strum, then pick each string to find any dead notes. Fix them and repeat."],
          [8, "Take your hand off, then put the shape back on. Repeat 10 times per chord. You're training muscle memory."],
        ],
        doneWhen: "You can make each chord with every string ringing, within 3 seconds and without looking.",
        topics: ["chords"], skills: ["E minor", "A major", "D major"],
      },
      {
        id: "p2-omc", title: "One-minute changes", days: 4, cats: ["Chords"],
        why: "Switching between chords smoothly is the main thing that separates \"knowing chords\" from \"playing songs\". This exercise is the fastest way to get there.",
        steps: [
          [5, "Spider warm-up."],
          [3, "Em ↔ A: strum once per chord, counting every clean change for 1 minute. Write the number down."],
          [3, "A ↔ D: same thing for 1 minute."],
          [3, "D ↔ Em: same thing for 1 minute."],
          [11, "Slowly practise whichever pair scored lowest, then retest it. Log your scores in the session notes."],
        ],
        doneWhen: "You hit 30+ changes in one minute on every pair.",
        topics: ["changes"], skills: ["One-minute changes (30+)"],
      },
      {
        id: "p2-strum", title: "Steady strumming", days: 3, cats: ["Strumming"],
        why: "Rhythm matters more than fancy chords. A band can survive a wrong note, but not someone who's out of time.",
        steps: [
          [5, "One-minute changes on your weakest pair."],
          [8, "Metronome at 70 BPM: 4 down strums per chord (one per click), changing chords every bar. Em-A-D-A."],
          [7, "Now 8 strums per bar (down on the click, up in between). Keep your wrist loose and your arm swinging like a pendulum."],
          [5, "Strum along to any song you like at a comfortable speed."],
        ],
        doneWhen: "You can strum Em-A-D-A with eighth notes at 70 BPM for 1 minute without stopping on a chord change.",
        topics: ["strumming"], skills: ["Steady strumming"],
      },
      {
        id: "p2-gc", title: "G, C, E & A minor", days: 6, cats: ["Chords"],
        why: "Add these and you have the 7 essential open chords. Most Gaslight Anthem acoustic songs and campfire songs use these.",
        steps: [
          [5, "Spider warm-up at 70 BPM."],
          [12, "Learn G, C, E and Am the same way as before: shape, pick each string, fix, repeat."],
          [8, "One-minute changes: G ↔ C, C ↔ Am, E ↔ Am, G ↔ D. Log your scores."],
        ],
        doneWhen: "You can play all 7 chords (Em A D G C E Am) cleanly, with 30+ changes a minute on G ↔ C.",
        topics: ["chords", "changes"], skills: ["G major", "C major", "E major", "A minor"],
      },
      {
        id: "p2-sing", title: "Sing & strum: hands on autopilot", days: 5, cats: ["Vocals", "Strumming", "Songs"], vocal: true,
        why: "Singing and playing at once feels impossible at first, because your brain wants your hands and your voice to follow the same rhythm. The fix is to make the strumming so automatic you stop thinking about it, then add the words one layer at a time.",
        steps: [
          [5, "Lip trills ×5, then a round of the Pitch Game (Open strings or Around your voice).", "Vocal warm-up"],
          [6, "Strum G-Em-C-D with 4 down strums per chord at 70 BPM, until you can do it while talking about your day. That's autopilot."],
          [7, "Keep strumming and SPEAK the verse lyrics of \"Here's Looking at You, Kid\" in rhythm. Then sing them all on one note. Then sing the real melody."],
          [7, "Capo trick: if the melody feels too high or too low, move the capo a fret or two until it sits comfortably. That fret is your key."],
        ],
        doneWhen: "You can strum and sing one full verse and chorus without your strumming stopping or speeding up.",
        topics: ["singplay", "singplay2", "range"], song: "heres-looking-at-you-kid", skills: ["Sing & strum", "Pick your key with a capo"],
      },
      {
        id: "p2-song", title: "Chord song: Hotel Yorba", days: 5, cats: ["Songs", "Chords"],
        why: "This is a joyful White Stripes stomper built on G, C and D. It's your first full song. There's one F chord: swap it for C until you reach barre chords.",
        steps: [
          [5, "One-minute changes on the song's chord pairs."],
          [10, "Learn the chord progression section by section from the lesson and tab."],
          [10, "Play along with the recording, and keep going even if you fluff a change."],
        ],
        doneWhen: "You can play the whole song along with the recording without stopping.",
        song: "hotel-yorba", skills: ["First full song"], boss: true,
      },
    ],
  },
  {
    id: "p3", icon: "⚡", name: "Power Up", weeks: "Weeks 7–10",
    goal: "Power chords and palm muting are the engine of punk. After this phase you can play a huge amount of rock.",
    lessons: [
      {
        id: "p3-pc6", title: "Power chords on the low E string", days: 3, cats: ["Chords", "Technique"],
        why: "This is the punk unlock. Two fingers, one shape, and you can slide it anywhere. Turn on some overdrive now!",
        steps: [
          [5, "Spider warm-up at 80 BPM."],
          [5, "Set your amp: some gain/overdrive. Learn the shape: index on the root (low E string), ring finger 2 frets up on the A string."],
          [10, "Play G5 (3rd fret), A5 (5th), C5 (8th), F5 (1st). Strum only those 2 strings with 4 downstrokes each, to a metronome at 80."],
          [5, "Lift your fingers slightly between chords to stop the sound, then slide to the next one."],
        ],
        doneWhen: "You can move between G5, A5, C5 and F5 in time at 80 BPM, with no other strings ringing.",
        topics: ["powerchords"], skills: ["Power chords (6th string)"],
      },
      {
        id: "p3-pc5", title: "Power chords on the A string", days: 4, cats: ["Chords", "Technique"],
        why: "Moving between the E and A strings means you barely have to move your hand, which is how punk players change chords fast.",
        steps: [
          [5, "Spider warm-up at 80 BPM."],
          [10, "Same shape with the root on the A string: D5 (5th fret), C5 (3rd), E5 (7th)."],
          [10, "Practise G5 (6th string, 3rd fret) → C5 (5th string, 3rd fret) → D5 → C5. Your hand moves up and down by one string, not along the neck."],
        ],
        doneWhen: "You can play G5-C5-D5-C5 with 8 downstrokes each at 90 BPM, looped 4 times.",
        topics: ["powerchords"], skills: ["Power chords (5th string)"],
      },
      {
        id: "p3-pm", title: "Palm muting", days: 3, cats: ["Technique"],
        why: "That tight \"chug\" in punk verses comes from resting the edge of your picking hand on the strings by the bridge. Then you open up for the chorus, and it sounds huge.",
        steps: [
          [5, "Power chord changes warm-up."],
          [10, "Rest the side of your picking palm right where the strings leave the bridge. Too far forward = dead thud, too far back = no mute. Find the chug."],
          [10, "Metronome at 90: 8 muted eighth notes on G5, then 8 unmuted. Switch between muted and open."],
        ],
        doneWhen: "You can switch between palm-muted and open power chords every bar at 100 BPM.",
        topics: ["palmmute"], skills: ["Palm muting"],
      },
      {
        id: "p3-mute", title: "Kill the noise", days: 2, cats: ["Technique"],
        why: "Distortion makes every stray string scream. Pros sound clean because they mute what they're not playing.",
        steps: [
          [5, "Palm-muting warm-up."],
          [10, "Let the underside of your index finger lightly touch the higher strings while you play power chords. Strum all 6 strings, and only the power chord should sound."],
          [10, "Practise power chord changes with full, wild strums, keeping the noise silent."],
        ],
        doneWhen: "You can strum all 6 strings hard on a power chord and hear only the 2–3 notes you're fretting.",
        topics: ["muting"], skills: ["Muting string noise"],
      },
      {
        id: "p3-down", title: "Downpicking stamina", days: 7, cats: ["Technique"],
        why: "Fast punk rhythm is mostly relentless downstrokes. This is stamina, so do it daily and it builds like a muscle.",
        steps: [
          [5, "Spider warm-up."],
          [12, "Palm-muted eighth-note downstrokes on the low E string. Start at 120 BPM for 1 minute, rest 30 seconds, then go up 5 BPM. Stop when your arm gets tense."],
          [8, "Play the same rhythm on power chords (G5-C5-D5-C5). Log your top clean BPM in the Tempo tab."],
        ],
        doneWhen: "60 seconds of non-stop palm-muted eighth-note downstrokes at 150 BPM, staying relaxed.",
        topics: ["downpicking", "metronome"], skills: ["Downpicking @150"],
      },
      {
        id: "p3-sing", title: "Sing over power chords", days: 4, cats: ["Vocals", "Chords"], vocal: true,
        why: "This is the punk singer-guitarist's main job: chugging eighth notes while singing on top. The trick is that your picking hand never changes, whatever your voice is doing.",
        steps: [
          [5, "Sirens on 'ng' (as in 'sing') from your lowest note to your highest and back, ×5. Then sing do-re-mi-fa-so while you play it on the A string (frets 0-2-4-5-7).", "Vocal warm-up"],
          [7, "Palm-muted eighth-note downstrokes on A5 at 90 BPM. Count \"1-and-2-and\" out loud as you play. Counting out loud is singing practice in disguise."],
          [8, "Stay on A5 and sing any long notes on top, keeping the chug steady underneath. Then try a line from any song you know."],
          [5, "Play the Great Expectations chorus and sing just the last word of each line. Add more words each day."],
        ],
        doneWhen: "You can sing the whole Great Expectations chorus over the palm-muted power chords without the chugging stopping.",
        topics: ["singplay2", "pitch"], song: "great-expectations", skills: ["Sing over power chords"],
      },
      {
        id: "p3-song", title: "Power chord song: Great Expectations", days: 6, cats: ["Songs", "Chords"],
        why: "This is The Gaslight Anthem at full tilt: driving power chords and steady downstrokes, in standard tuning. It's everything you just learned. Ignore the lead guitar part for now.",
        steps: [
          [5, "Downpicking warm-up."],
          [10, "Learn one section at a time from the lesson and tab: intro, verse, chorus."],
          [10, "Play along. Use Songsterr's speed control at 70–80% first."],
        ],
        doneWhen: "You can play along with the whole song at full speed. Small mistakes are OK, but don't stop.",
        song: "great-expectations", skills: ["First punk song"], boss: true,
      },
    ],
  },
  {
    id: "p4", icon: "🏎️", name: "Punk Engine", weeks: "Weeks 11–14",
    goal: "Get faster and tighter, learn other tunings, and play full songs the way the record does.",
    lessons: [
      {
        id: "p4-alt", title: "Alternate picking", days: 4, cats: ["Technique"],
        why: "Downstrokes run out at high speed. Alternate picking (down-up) lets you play faster single notes and riffs.",
        steps: [
          [5, "Downpicking at your best BPM."],
          [12, "Spider exercise with strict down-up picking. Start at 80 BPM with 2 notes per click (eighth notes) and go up 5 BPM when it's clean."],
          [8, "Play 4 notes per click on one string at a slow tempo, keeping the pick movements tiny."],
        ],
        doneWhen: "You can play the spider exercise in eighth notes with strict alternate picking at 100 BPM.",
        topics: ["altpicking", "metronome"], skills: ["Alternate picking"],
      },
      {
        id: "p4-fast", title: "Fast power chord changes", days: 5, cats: ["Chords", "Technique"],
        why: "Punk is fast chord changes that don't leave gaps. The trick is to move early and land on the beat.",
        steps: [
          [5, "Downpicking warm-up."],
          [12, "Change every 2 beats on a loop (G5-B♭5-C5-E♭5 etc.), then every beat. Start slow, then go up 5 BPM at a time."],
          [8, "Practise jumps: low E string 3rd fret → A string 5th fret → E string 8th fret. Look at where you're going, not where you are."],
        ],
        doneWhen: "You can change power chords every 2 beats at 140 BPM in eighth-note downstrokes, with no gaps.",
        topics: ["punkrhythm"], skills: ["Fast power chord changes"],
      },
      {
        id: "p4-tunings", title: "Alternate tunings: Drop D & half-step down", days: 2, cats: ["Theory", "Technique"],
        why: "Every Rise Against song on your ladder is in E♭ (half step down), and some Gaslight songs are in D standard. If you play along in the wrong tuning, it will sound wrong.",
        steps: [
          [8, "Drop D: tune only the low E string down to D. One finger across the bottom 3 strings now makes a power chord!"],
          [8, "Half-step down (E♭ standard): every string drops a semitone (E♭ A♭ D♭ G♭ B♭ E♭). Most tuners have a mode for it."],
          [4, "D standard (whole step down) is what a few Gaslight Anthem songs use. Same idea, but two semitones down."],
          [5, "Play the one-finger Drop D power chords up and down the neck: fret 0, 3, 5, 7."],
        ],
        doneWhen: "You can switch between standard, Drop D and E♭ tuning with a tuner in under 2 minutes each.",
        topics: ["tunings"], skills: ["Drop D & E♭ tuning"],
      },
      {
        id: "p4-structure", title: "Learn a whole song, not just the riff", days: 3, cats: ["Songs"],
        why: "Most beginners only learn intros. Learning a song's map (verse, chorus, bridge) is what lets you play it start to finish.",
        steps: [
          [10, "Pick your phase song. Listen through once and write down the sections: Intro / Verse / Chorus / Bridge / Outro, plus how many times each repeats."],
          [10, "Learn one section per day. Loop the hard bits at slow speed in Songsterr."],
          [5, "Play along with the record and keep going even if you mess up."],
        ],
        doneWhen: "You've written down a full song map for your next song and can play along with the first verse and chorus.",
        skills: ["Song structure"],
      },
      {
        id: "p4-voice", title: "Punk voice, safely", days: 4, cats: ["Vocals"], vocal: true,
        why: "Punk vocals are loud, but singers who last for decades get their power from breath support, not from a squeezed throat. Learn this now and you can belt a chorus night after night. If your throat ever hurts, stop for the day. Screaming isn't part of this plan.",
        steps: [
          [5, "Belly pulses: 'ha! ha! ha!' ×10. Your stomach kicks in and your throat stays loose. Then lip trills to relax.", "Vocal warm-up"],
          [7, "'Hey!' calls: start at speaking volume and get louder in 4 steps, keeping the same easy feeling in your throat. Stop at the volume where it starts to scratch. That's your limit for now."],
          [8, "Sing the Savior chorus along with the record, loud and supported from your belly. Then try it while playing the chords."],
          [5, "Cool down: gentle humming slides from high to low, then a big glass of water."],
        ],
        doneWhen: "You can sing the Savior chorus at full volume along with the record 3 times through, with no scratchiness or soreness afterwards.",
        topics: ["rockvoice", "breathing"], song: "savior", skills: ["Supported rock voice"],
      },
      {
        id: "p4-song", title: "Rise Against: Savior", days: 7, cats: ["Songs"],
        why: "Your first Rise Against song. Tune down to E♭ first! Start with the simple chord version, then move to power chords and palm muting, and save the lead riff for last.",
        steps: [
          [5, "Fast power chord changes warm-up."],
          [12, "Work through the song section by section using your song map."],
          [8, "Play along at 75% speed, then build up toward full speed."],
        ],
        doneWhen: "You can play along with the whole song at 85%+ speed without stopping.",
        song: "savior", skills: ["First Rise Against song"], boss: true,
      },
    ],
  },
  {
    id: "p5", icon: "🎸", name: "Riffs & Lead", weeks: "Weeks 15–19",
    goal: "Jack White territory: bends, slides, blues riffs and your first improvised solos.",
    lessons: [
      {
        id: "p5-legato", title: "Hammer-ons, pull-offs & slides", days: 4, cats: ["Technique"],
        why: "These make riffs sound smooth and expressive, and they're all over Jack White's playing.",
        steps: [
          [5, "Spider warm-up with alternate picking."],
          [7, "Hammer-ons: pick fret 5, then slam a finger down on fret 7 without picking again. Do it on every string."],
          [7, "Pull-offs: fret 5 and 7 together, pick, then pull the top finger off with a little flick so fret 5 sounds."],
          [6, "Slides: pick fret 5, then slide to 7 while keeping the pressure on. Then slide down."],
        ],
        doneWhen: "Your hammer-on, pull-off and slide notes are as loud as your picked notes.",
        topics: ["legato"], skills: ["Hammer-ons & pull-offs", "Slides"],
      },
      {
        id: "p5-penta", title: "Minor pentatonic box 1", days: 5, cats: ["Scales"],
        why: "This is the scale behind most rock and blues solos. Learn this one box shape and you can start improvising.",
        steps: [
          [5, "Hammer-on/pull-off warm-up."],
          [10, "Learn the A minor pentatonic box at the 5th fret, up and down, with alternate picking at 70 BPM."],
          [10, "Make up licks: 3–5 notes from the box, repeated. Make it sound like a riff, not a scale."],
        ],
        doneWhen: "You can play the box up and down at 90 BPM in eighth notes, from memory.",
        topics: ["pentatonic"], skills: ["Minor pentatonic box 1"],
      },
      {
        id: "p5-bends", title: "Bends & vibrato", days: 5, cats: ["Technique"],
        why: "Bends make the guitar sing and scream, which is Jack White's whole vibe. Vibrato makes a held note sound alive.",
        steps: [
          [5, "Pentatonic box warm-up."],
          [10, "Bend the G string at fret 7 up a whole step. Check it against fret 9 (the target note), then use 2–3 fingers to push and keep it in tune."],
          [10, "Vibrato: on a held note, wiggle slightly up and back in rhythm. Try it on the B string at fret 8."],
        ],
        doneWhen: "Your whole-step bend on the G string matches the pitch of fret 9.",
        topics: ["bends"], skills: ["String bends", "Vibrato"],
      },
      {
        id: "p5-blues", title: "Blues shuffle & improvising", days: 5, cats: ["Improv", "Scales"],
        why: "Jack White's roots are in the blues. A 12-bar shuffle plus the pentatonic scale is enough to jam with almost anyone.",
        steps: [
          [5, "Bends warm-up."],
          [10, "Learn the 12-bar blues in A with power chords (A5 / D5 / E5), with a boogie shuffle rhythm."],
          [10, "Put on an \"A minor blues backing track\" on YouTube and improvise with box 1. Use bends, slides and repeated licks."],
        ],
        doneWhen: "You can solo over a backing track for 2 minutes without stopping, and it sounds like music.",
        topics: ["pentatonic"], skills: ["12-bar blues", "Improvise a solo"],
      },
      {
        id: "p5-sing", title: "Sing what you play", days: 3, cats: ["Vocals", "Riffs"], vocal: true,
        why: "Singing a riff while you play it connects your ears to your fingers. It's the best ear training there is. Seven Nation Army is the riff entire football stadiums sing, so it's the perfect place to start.",
        steps: [
          [5, "Lip trills and sirens. Then play 3-note licks from the pentatonic box and sing each one back.", "Vocal warm-up"],
          [8, "Play the Seven Nation Army riff and sing it on 'oh' at the same time. No words, just match the notes."],
          [7, "Play a pentatonic lick, sing it back without the guitar, then play and sing it together. Make up 5 licks."],
          [5, "Hum along to your blues shuffle and make up a vocal line over it."],
        ],
        doneWhen: "You can play and sing the Seven Nation Army riff together, in tune, 4 times through.",
        topics: ["pitch"], song: "seven-nation-army", skills: ["Sing what you play"],
      },
      {
        id: "p5-song", title: "Jack White riff: Icky Thump", days: 7, cats: ["Songs", "Riffs"],
        why: "This is a monster single-note riff with bends, and pure Jack White. Learn the main riff first at 60–70% speed. The solo and Whammy-pedal parts are a bonus for later.",
        steps: [
          [5, "Pentatonic and bends warm-up."],
          [12, "Learn the riff and song sections from the lesson and tab."],
          [8, "Play along with the record."],
        ],
        doneWhen: "You can play the main riff along with the recording at full speed.",
        song: "icky-thump", skills: ["Jack White riff"], boss: true,
      },
    ],
  },
  {
    id: "p6", icon: "🏟️", name: "Full Band", weeks: "Weeks 20–26",
    goal: "Barre chords, full-speed punk and playing a whole set. This is the Flatliners final boss.",
    lessons: [
      {
        id: "p6-barre-e", title: "F barre chord (E shape)", days: 8, cats: ["Chords"],
        why: "This is the hardest beginner milestone, and once you crack it any chord, anywhere on the neck, is yours. Expect it to take a while.",
        steps: [
          [5, "Power chord warm-up."],
          [12, "Build the barre gradually: power chord first, then add the barre and the remaining fingers. Roll your index finger slightly onto its bony side."],
          [8, "Move the E shape to fret 3 (G) and 5 (A), which is easier higher up. Strum 4 times, then rest. Don't squeeze until it hurts!"],
        ],
        doneWhen: "You can play F at fret 1 with all 6 strings ringing (one or two muffled notes is OK), and change Am → F in time at 60 BPM.",
        topics: ["barre"], skills: ["F barre chord"],
      },
      {
        id: "p6-barre-a", title: "B minor & the A-shape barre", days: 6, cats: ["Chords"],
        why: "With the E and A shapes you can play any major or minor chord. That opens up the Gaslight Anthem songs that aren't power-chord based.",
        steps: [
          [5, "F barre warm-up."],
          [12, "Learn Bm (A-shape minor, 2nd fret) and the A-shape major (C at fret 3)."],
          [8, "One-minute changes: G ↔ Bm, D ↔ Bm, Am ↔ F."],
        ],
        doneWhen: "You can play 20+ changes per minute on G ↔ Bm.",
        topics: ["barre"], skills: ["B minor / A-shape barre"],
      },
      {
        id: "p6-speed", title: "Speed ladder to full tempo", days: 5, cats: ["Technique"],
        why: "Flatliners songs are FAST. Speed comes from playing slightly above your limit, then backing off, again and again.",
        steps: [
          [5, "Downpicking at your best BPM."],
          [12, "Take the hardest part of your next song. Play it 3× at 70% speed, 3× at 80%, 3× at 90%, then 1× at 100%. Go back to 85% and repeat."],
          [8, "Log your top clean BPM in the Tempo tab."],
        ],
        doneWhen: "You can play the hardest part of Monumental at 90% of full tempo (about 140 BPM).",
        topics: ["metronome", "downpicking"], skills: ["Speed building"],
      },
      {
        id: "p6-gaslight", title: "Gaslight Anthem: The '59 Sound", days: 7, cats: ["Songs", "Chords"],
        why: "This is the anthem itself: open chords plus the F barre you just learned, at a fast strum. Learn it in standard tuning first, then tune down to D standard to play along with the record.",
        steps: [
          [5, "Barre chord changes warm-up."],
          [12, "Learn the song section by section."],
          [8, "Play along with the record."],
        ],
        doneWhen: "You can play along with the whole song without stopping.",
        song: "the-59-sound", skills: ["Barre chord song"],
      },
      {
        id: "p6-front", title: "Front the band", days: 7, cats: ["Vocals", "Songs"], vocal: true, boss: true,
        why: "The singer-guitarist's final exam: one whole song, sung and played from start to finish, like you're on stage.",
        steps: [
          [5, "The full routine: breaths, lip trills, 'ng' sirens and 'ha' pulses.", "Vocal warm-up"],
          [10, "Pick your song: The '59 Sound, Here's Looking at You, Kid or Swing Life Away. Set the capo to your key, then work through it section by section, singing and playing."],
          [10, "Full run-through. Record yourself on your phone and listen back."],
        ],
        doneWhen: "You can sing and play a whole song start to finish without stopping, and you'd be happy to send the recording to a friend.",
        topics: ["singplay", "range", "rockvoice"], song: "the-59-sound", skills: ["Sing & play a whole song"],
      },
      {
        id: "p6-flatliners", title: "FINAL BOSS: The Flatliners – Monumental", days: 10, cats: ["Songs"],
        why: "This is fast, melodic Canadian punk at 154 BPM. Learn the Guitar 1 rhythm part as power chords. If you can play this along with the record, you're officially a punk rhythm guitarist.",
        steps: [
          [5, "Downpicking at full speed."],
          [12, "Speed ladder on the hardest sections."],
          [8, "Full play-along. Record yourself and listen back."],
        ],
        doneWhen: "You can play the Guitar 1 rhythm part along with the record at full speed. Record it, because you earned it.",
        song: "monumental", skills: ["Flatliners at full speed"], boss: true,
      },
    ],
  },
];

/* A 5-minute vocal warm-up opens every guitar lesson. It builds up over the tour.
   (Sing & play lessons have their own warm-up step.) */
const VOCAL_WARMUPS = [
  "4 slow belly breaths (in for 4, out for 8 on a long 'sss'). Then lip trills (a motorboat sound) from low to high and back, ×5. Then hum along with your open A string.",
  "Lip trills, low to high, ×5. Then sing 'ah' to match the open A, D and G strings, and check yourself on the voice tuner. Or play a round of the Pitch Game.",
  "Sirens on 'ng' (as in 'sing') from your lowest note to your highest and back, ×5. Then sing do-re-mi-fa-so while you play it on the A string (frets 0-2-4-5-7).",
  "Belly 'ha! ha! ha!' pulses ×10, with your stomach doing the work, not your throat. Then 'hey!' calls at medium volume, and lip trills to relax.",
  "Lip trills and sirens. Then play 3-note licks from the pentatonic box and sing each one back.",
  "The full routine. Breaths, lip trills, 'ng' sirens and 'ha' pulses, then sing one verse of any song at half volume.",
];
// ...and sing & play lessons get a guitar warm-up so your hands stay in shape
const GUITAR_WARMUPS = [
  "Spider 1-2-3-4 across all strings at 60 BPM.",
  "One-minute changes on your weakest chord pair.",
  "Palm-muted downpicking on the low E string. Start at 120 BPM and go up 5 BPM per minute.",
  "Fast power chord changes every 2 beats, starting at 120 BPM.",
  "Pentatonic box 1 up and down at 80 BPM, then a few bends.",
  "One-minute changes on Am ↔ F and G ↔ Bm.",
];
PHASES.forEach((p, i) => p.lessons.forEach((l) => {
  if (l.vocal) l.steps.splice(1, 0, [5, GUITAR_WARMUPS[i], "Guitar warm-up"]);
  else l.steps = [[5, VOCAL_WARMUPS[i], "Vocal warm-up"], ...l.steps];
}));

const ALL_LESSONS = PHASES.flatMap((p) => p.lessons.map((l) => ({ ...l, phase: p.id })));
