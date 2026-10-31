"use strict";
/* Technique lesson videos. Every link was checked against YouTube when this file was generated. */
const VIDEOS = {
  "gear": [
    {
      "title": "Beginner Guide To Guitar Anatomy - Guitar Lesson Tutorial - Know Your Guitar",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=zpRoq0jcWfQ"
    },
    {
      "title": "Learn Your Guitar Amp!",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=MbKqz7oCDYU"
    },
    {
      "title": "Stratocaster Knobs Explained: Volume, Tone, and Pickup Selector",
      "author": "Conor Rocks",
      "url": "https://www.youtube.com/watch?v=vaqWlCP_qIs"
    }
  ],
  "tuning": [
    {
      "title": "How to Tune Your Guitar For Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=X2EmpWr9vUc"
    },
    {
      "title": "How to Tune A Guitar for Beginners (Guitar Basics - Lesson 4)",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=HfjWaIgRddI"
    }
  ],
  "hold": [
    {
      "title": "How to Hold a Guitar Pick & Best Guitar Picks",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=-04Et5qIoa4"
    },
    {
      "title": "How to (Really) Hold a Guitar When Playing",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=MlV6WhM9YhE"
    },
    {
      "title": "Holding the Guitar with Your Fretting Hand? | Guitar for Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=C-mt8td1teU"
    }
  ],
  "tab": [
    {
      "title": "How to Read Guitar TAB for Beginners :)",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=i10y_ZuOfjk"
    },
    {
      "title": "How to Read Guitar TABs made EASY for Beginners!",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=9xsG7n4Jalo"
    }
  ],
  "riff": [
    {
      "title": "Play Seven Nation Army the EASY WAY - Your First Riff - Beginner Guitar Lesson",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=YaR6mzdNjOw"
    },
    {
      "title": "Learn Seven Nation Army The White Stripes Guitar Lesson + Tutorial",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=fLCXZs6SWFQ"
    },
    {
      "title": "AC/DC, Queen, White Stripes, Super Easy Beginner Guitar Riffs on One string",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=1LjtJBtZxNM"
    }
  ],
  "chromatic": [
    {
      "title": "Best Finger Warmup Exercise for Guitar!",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=PO0LvJjnbI0"
    },
    {
      "title": "Guitar Technique: The Finger Gym - Strength Development - JustinGuitar - Guitar Lesson [TE-001]",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=XDt_4ha9Xjs"
    }
  ],
  "chords": [
    {
      "title": "How to Play the Em Chord | Guitar for Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=lqcd3jVysXY"
    },
    {
      "title": "Super Easy First Guitar Lesson - Guitar Lessons For Beginners - Stage 1 - The D Chord",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=yh6sPqDEZCY"
    },
    {
      "title": "Beginner Guitar Lessons - Stage 1: The A Chord - Your Second Super Easy Guitar Chord [BC-112]",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=VkkOFLouQDs"
    },
    {
      "title": "How To Play The G Chord + C Chord on Guitar | Fender Play™ | Fender",
      "author": "Fender",
      "url": "https://www.youtube.com/watch?v=AlNFSXxBX1Y"
    }
  ],
  "changes": [
    {
      "title": "Chord Combinations - One Minute Changes - Stage 2 Guitar Lesson - Guitar For Beginners [BC-124]",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=LXXFzXT-pQQ"
    },
    {
      "title": "Get FASTER Chord Changes On Guitar!",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=mAgc7hr44WM"
    }
  ],
  "strumming": [
    {
      "title": "Why Pick Angle & Strumming Mechanics are CRUCIAL! Guitar for Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=c5pipuvb-EM"
    },
    {
      "title": "11 Tips to Help You Strum Better!",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=kmzS-7KiNlw"
    }
  ],
  "powerchords": [
    {
      "title": "Your Ultimate Power Chords Guide for Beginners 🤘",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=ZBYoI7e3v5Y"
    },
    {
      "title": "Your Very First Guitar Power Chord Lesson",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=DVveuwoVmmY"
    }
  ],
  "palmmute": [
    {
      "title": "This Is How Rock Guitar Players Palm Mute",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=5H7Q6dSxuQc"
    },
    {
      "title": "Guitar Palm Muting and Strumming 101",
      "author": "Sean Daniel",
      "url": "https://www.youtube.com/watch?v=76ZOPqcjK8c"
    }
  ],
  "downpicking": [
    {
      "title": "Daily Downstroke Routine (For Speed and Stamina)",
      "author": "The-Art-of-Guitar",
      "url": "https://www.youtube.com/watch?v=HOAM5N_kd4E"
    },
    {
      "title": "Ramones Sheena Is a Punk Rocker Guitar Lesson + Tutorial",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=3fZ5eKqBTDY"
    },
    {
      "title": "Sheena Is A Punk Rocker Guitar Lesson | Ramones",
      "author": "JustinGuitar Songs",
      "url": "https://www.youtube.com/watch?v=LfGetELq-KA"
    }
  ],
  "altpicking": [
    {
      "title": "3 Tips to NAIL Alternate Picking | Guitar for Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=q8SHmo1-dac"
    },
    {
      "title": "Guitar Lesson Exercise to Practice Your Alternate Picking",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=SCNlFwCXLWQ"
    }
  ],
  "punkrhythm": [
    {
      "title": "Power Chord Shifts and Palm Mutes (Guitar Lesson BC-192) Guitar for beginners Stage 9",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=QJO5vYO4_8I"
    },
    {
      "title": "How To | Learn to Play Punk Power Chords | Fender",
      "author": "Fender",
      "url": "https://www.youtube.com/watch?v=zd09Y00EQ6Q"
    }
  ],
  "pentatonic": [
    {
      "title": "Minor Pentatonic Scale - Stage 7 Guitar Lesson - Guitar For Beginners [BC-176]",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=G-X1RemAzks"
    },
    {
      "title": "SUPER EASY Scale for Beginners | E Minor Pentatonic Scale",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=eEJpypexUDg"
    }
  ],
  "bends": [
    {
      "title": "How To Bend A String On Guitar",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=ShULWDbl8Uc"
    },
    {
      "title": "How To BEND the RIGHT WAY on Guitar",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=7yQLHM5H10c"
    },
    {
      "title": "Bending Vibrato (Guitar Lesson TE-009) How to play",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=06M2-51JF80"
    }
  ],
  "legato": [
    {
      "title": "Hammer-Ons Explained + Exercise For Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=7hDdZAjKBjY"
    },
    {
      "title": "Hammer-ons & Pull-offs | Intermediate Guitar Lesson",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=dYaeIXXyy1Y"
    },
    {
      "title": "Quick Hammer Ons Pull Offs Exercise - Guitar Technique Lesson",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=jT1daGH32k8"
    },
    {
      "title": "How To Legato Slide on Guitar for Beginners (stop doing this!)",
      "author": "Gibson App: Learn & Play Guitar",
      "url": "https://www.youtube.com/watch?v=063Eoa1i0Dk"
    }
  ],
  "barre": [
    {
      "title": "The Easiest F Chord Guitar Lesson You'll Find :)",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=4cR1sa1_d_8"
    },
    {
      "title": "E Shape Barre Chord Grip, Major and Minor (Guitar Lesson  IM-111) How to play IF Stage 1",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=-uJP2rWbMig"
    },
    {
      "title": "A Shape Major Barre Chords on Guitar (my best tricks and exercises)",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=C7k0CWgI-xI"
    }
  ],
  "muting": [
    {
      "title": "How to Mute Unwanted Notes When Playing Guitar",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=4SPgTAAiPw4"
    },
    {
      "title": "TOTW 11 Sound like a PRO | Muting your strings | Getting rid of noise |",
      "author": "Paul Davids",
      "url": "https://www.youtube.com/watch?v=1yVVq40ThGU"
    }
  ],
  "metronome": [
    {
      "title": "HOW and WHY to Use a Metronome | Guitar for Beginners",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=sNa44EmrsDc"
    },
    {
      "title": "How to Use a Metronome with Guitar - How to Play Guitar - Stage 2 Guitar Lesson [IM-124]",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=FLgq5VPRT6k"
    }
  ],
  "tunings": [
    {
      "title": "Eb Tuning Guitar Tutorial - Tune half a step down - How and why",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=FlYyS0ZTR2E"
    },
    {
      "title": "Everything You Need To Know About DROP D TUNING",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=KmFduBYtDYA"
    },
    {
      "title": "All About Drop D, Double Drop D, Open G, and Open D",
      "author": "JustinGuitar",
      "url": "https://www.youtube.com/watch?v=ixeFsasPjcI"
    }
  ]
};

/* Song ladder, sorted by the phase where you'll have the skills, then by difficulty.
   Tunings checked against Songsterr and Ultimate Guitar. */
const SONGS = [
  {
    "id": "seven-nation-army",
    "title": "Seven Nation Army",
    "artist": "The White Stripes",
    "phase": 0,
    "tuning": "Standard",
    "tuningNote": "The record is in Open A with a pitch-shifter pedal. This easy version uses standard tuning on the A string.",
    "capo": null,
    "bpm": 124,
    "difficulty": 1,
    "techniques": [
      "single-note riff",
      "one-finger sliding along one string",
      "power chords (chorus, optional)"
    ],
    "chords": [
      "riff on A string: 7-7-10-7-5-3-2",
      "A5 / G5 power chords (chorus)"
    ],
    "why": "The whole song is one slow single-note riff on one or two strings - the classic first riff and the fastest win for a new player.",
    "beginnerTip": "Play the riff on the A string in standard tuning (JustinGuitar's easy version); ignore the slide solo and just loop the riff along with the record.",
    "lesson": {
      "title": "Seven Nation Army Easy Riff Guitar Lesson | The White Stripes",
      "author": "JustinGuitar Songs",
      "url": "https://www.youtube.com/watch?v=2LEO5xc9rEA"
    },
    "tab": "https://www.songsterr.com/a/wsa/white-stripes-seven-nation-army-tab-s265"
  },
  {
    "id": "hotel-yorba",
    "title": "Hotel Yorba",
    "artist": "The White Stripes",
    "phase": 1,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": null,
    "difficulty": 2,
    "techniques": [
      "open chords",
      "strumming",
      "quick chord changes"
    ],
    "chords": [
      "G",
      "C",
      "D",
      "(F once in the bridge)"
    ],
    "why": "Only G, C and D for almost the whole song, but the tempo is brisk so the chord changes need to be clean.",
    "beginnerTip": "Strum just one downstroke per beat at first, then add the up-strums; skip the single F chord or replace it with a C.",
    "lesson": {
      "title": "Play Hotel Yorba by The White Stripes w/ the EASY chords G, C and D!",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=7yEvoJ_x_-s"
    },
    "tab": "https://www.songsterr.com/a/wsa/white-stripes-hotel-yorba-tab-s21429"
  },
  {
    "id": "hang-my-head",
    "title": "Hang My Head",
    "artist": "The Flatliners",
    "phase": 1,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": "2",
    "bpm": 157,
    "difficulty": 2,
    "techniques": [
      "open chords",
      "strumming",
      "palm muting (verses)"
    ],
    "chords": [
      "Em",
      "D",
      "C",
      "G",
      "Am"
    ],
    "why": "UG rates the chord sheet 'novice': five open chords and a repeating C-G-Em-D chorus loop; the hardest part is the punk tempo.",
    "beginnerTip": "Capo 2 and strum the open chords in eighth notes; if the tempo is too fast, play one strum per chord change and build up.",
    "lesson": {
      "title": "02.  Hang My Head - The Flatliners (Guitar Cover)",
      "author": "Liam B",
      "url": "https://www.youtube.com/watch?v=4AV34R7W4Qk",
      "kind": "cover"
    },
    "tab": "https://tabs.ultimate-guitar.com/tab/the-flatliners/hang-my-head-chords-1991101"
  },
  {
    "id": "blue-jeans-and-white-t-shirts",
    "title": "Blue Jeans and White T-Shirts",
    "artist": "The Gaslight Anthem",
    "phase": 1,
    "tuning": "D standard",
    "tuningNote": "Whole step down (D G C F A D). Play it in standard tuning to learn it, then tune down to play along.",
    "capo": null,
    "bpm": null,
    "difficulty": 2,
    "techniques": [
      "open chords",
      "anchor fingers (3rd/4th fingers stay on B & high E)",
      "strumming"
    ],
    "chords": [
      "Em7",
      "C",
      "G",
      "Dsus",
      "D"
    ],
    "why": "UG rates it 'novice': Em7-C-G-C over and over with two fingers anchored, so the changes are very forgiving.",
    "beginnerTip": "Play it in standard tuning first (it will just sound higher than the record); tune down a whole step only when you want to play along.",
    "lesson": {
      "title": "The Gaslight Anthem - Blue Jeans & White T-Shirts Guitar Tutorial Lesson",
      "author": "Andy Hillier Guitar Channel",
      "url": "https://www.youtube.com/watch?v=eJNltsRh-3w"
    },
    "tab": "https://www.songsterr.com/a/wsa/gaslight-anthem-blue-jeans-and-white-t-shirts-tab-s357492"
  },
  {
    "id": "swing-life-away",
    "title": "Swing Life Away",
    "artist": "Rise Against",
    "phase": 1,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down. Learn it in standard, then tune down to play along.",
    "capo": null,
    "bpm": 185,
    "difficulty": 2,
    "techniques": [
      "open chords",
      "palm muting",
      "picking individual strings",
      "strumming pattern"
    ],
    "chords": [
      "Em",
      "G",
      "Cadd9",
      "Dsus2"
    ],
    "why": "Easy chord shapes, but the UG tabber notes that getting the palm-muted strum pattern right is the real challenge - a great palm-muting lesson.",
    "beginnerTip": "Strum the chords plainly first, then add the palm-muted picking; works fine on electric with a clean tone.",
    "lesson": {
      "title": "Rise Against - Swing Life Away - Guitar Lesson Tutorial",
      "author": "GuitarJamz",
      "url": "https://www.youtube.com/watch?v=pfdYu2SfrI0"
    },
    "tab": "https://www.songsterr.com/a/wsa/rise-against-swing-life-away-tab-s16258"
  },
  {
    "id": "heres-looking-at-you-kid",
    "title": "Here's Looking at You, Kid",
    "artist": "The Gaslight Anthem",
    "phase": 1,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": "4",
    "bpm": null,
    "difficulty": 2,
    "techniques": [
      "open chords",
      "arpeggio picking pattern",
      "strumming"
    ],
    "chords": [
      "G",
      "Em",
      "C",
      "D",
      "A"
    ],
    "why": "G-Em-C-D shapes with a capo (UG top-rated sheet, 375 votes), plus a simple picking pattern - gentle but introduces fingerpicked/arpeggiated chords.",
    "beginnerTip": "Strum the G-Em-C-D progression first; add the picked pattern (bass note then 4-2-3-4-3) once the changes are smooth.",
    "lesson": {
      "title": "\"Heres Looking At You Now Kid\" Guitar lesson (The Gaslight Anthem)",
      "author": "Almost Easy",
      "url": "https://www.youtube.com/watch?v=88Kj1Gxa7EU"
    },
    "tab": "https://www.songsterr.com/a/wsa/gaslight-anthem-heres-looking-at-you-kid-tab-s2663706"
  },
  {
    "id": "fell-in-love-with-a-girl",
    "title": "Fell in Love with a Girl",
    "artist": "The White Stripes",
    "phase": 2,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 96,
    "difficulty": 2,
    "techniques": [
      "power chords",
      "fast downpicking",
      "palm muting (light)"
    ],
    "chords": [
      "B5",
      "A5",
      "E5",
      "D5",
      "F#5"
    ],
    "why": "Short, loud and built from movable two/three-string power chords - a perfect first power-chord song, just quick.",
    "beginnerTip": "Use two-finger root + fifth power chords and practise the changes at 70% speed with Songsterr's slowdown before playing along.",
    "lesson": {
      "title": "The White Stripes Fell in Love with a Girl Guitar Lesson + Tutorial",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=DQym7z7XvRQ"
    },
    "tab": "https://www.songsterr.com/a/wsa/white-stripes-fell-in-love-with-a-girl-tab-s10130"
  },
  {
    "id": "dead-leaves-and-the-dirty-ground",
    "title": "Dead Leaves and the Dirty Ground",
    "artist": "The White Stripes",
    "phase": 2,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 81,
    "difficulty": 2,
    "techniques": [
      "power chords",
      "sliding power chords",
      "open chords (quiet verse)",
      "dynamics"
    ],
    "chords": [
      "A5",
      "G5",
      "F#5",
      "F5",
      "C",
      "D",
      "G",
      "F"
    ],
    "why": "Loud intro riff is just power chords walking down the low E string; the verse adds a few open chords - medium tempo, very forgiving.",
    "beginnerTip": "Learn the A5-G5-F#5-F5 intro riff as two-finger power chords first; the verses can be simplified to the same power chords.",
    "lesson": {
      "title": "The White Stripes Dead Leaves and the Dirty Ground Guitar Lesson + Tutorial",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=G-med9S7t-E"
    },
    "tab": "https://www.songsterr.com/a/wsa/white-stripes-dead-leaves-and-the-dirty-ground-tab-s6744"
  },
  {
    "id": "great-expectations",
    "title": "Great Expectations",
    "artist": "The Gaslight Anthem",
    "phase": 2,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 124,
    "difficulty": 3,
    "techniques": [
      "power chords",
      "fast eighth-note strumming/downpicking",
      "lead melody (optional)"
    ],
    "chords": [
      "A",
      "F#m",
      "D",
      "E"
    ],
    "why": "Only four chords (A-F#m-D-E), but it's driving, fast punk-rock strumming and F#m is a barre chord.",
    "beginnerTip": "Use power chords (A5, F#5, D5, E5) with steady downstrokes; ignore the lead melody track.",
    "lesson": {
      "title": "The Gaslight Anthem Great Expectations Guitar Cover",
      "author": "keithk93",
      "url": "https://www.youtube.com/watch?v=Vjlnba7rPrA",
      "kind": "cover"
    },
    "tab": "https://www.songsterr.com/a/wsa/gaslight-anthem-great-expectations-tab-s80446"
  },
  {
    "id": "satellite",
    "title": "Satellite",
    "artist": "Rise Against",
    "phase": 3,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down.",
    "capo": null,
    "bpm": 135,
    "difficulty": 3,
    "techniques": [
      "power chords",
      "palm muting",
      "fast downpicking",
      "single-note lead riff"
    ],
    "chords": [
      "Em",
      "G",
      "D",
      "Am"
    ],
    "why": "A simple four-chord Em-G-D-Am progression, but played as fast palm-muted power chords with a lead riff on top.",
    "beginnerTip": "Play the rhythm part as root-note power chords, skip Zach Blair's lead lines, and slow Songsterr to 70%.",
    "lesson": {
      "title": "Rocksmith 2014 - DLC - Guitar - Rise Against \"Satellite\"",
      "author": "Riff Repeater",
      "url": "https://www.youtube.com/watch?v=LvOQjp-nI1M",
      "kind": "play-along"
    },
    "tab": "https://www.songsterr.com/a/wsa/rise-against-satellite-tab-s77466"
  },
  {
    "id": "savior",
    "title": "Savior",
    "artist": "Rise Against",
    "phase": 3,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down. Some chord sheets use standard + capo 1, which is simpler but won't match the record.",
    "capo": null,
    "bpm": 113,
    "difficulty": 3,
    "techniques": [
      "power chords",
      "palm muting",
      "fast downpicking",
      "single-note riff/lead"
    ],
    "chords": [
      "Em",
      "G",
      "C",
      "D"
    ],
    "why": "The chord sheet is just Em-G-C-D (UG 'novice'), but the real song is fast palm-muted power chords with a signature lead riff.",
    "beginnerTip": "Start by strumming the Em-G-C-D chord version, then move to power chords and palm muting; learn the lead riff last.",
    "lesson": {
      "title": "How To Play \"Savior\" By Rise Against (Full Song Tutorial With TAB!)",
      "author": "MZ guitar",
      "url": "https://www.youtube.com/watch?v=qbgDNrzrj0Y"
    },
    "tab": "https://www.songsterr.com/a/wsa/rise-against-savior-tab-s23752"
  },
  {
    "id": "45",
    "title": "45",
    "artist": "The Gaslight Anthem",
    "phase": 3,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down (UG writes it as D standard + capo 1, which is the same pitch).",
    "capo": null,
    "bpm": 178,
    "difficulty": 3,
    "techniques": [
      "power chords",
      "fast downpicking",
      "palm muting",
      "lead lines (optional)"
    ],
    "chords": [
      "E5",
      "B5",
      "C#m (C#5)",
      "A5",
      "G#m (G#5)"
    ],
    "why": "Brian Fallon plays it with power-chord shapes (per UG), but it's fast; the lead guitar track is rated 4/5 on Songsterr.",
    "beginnerTip": "Rhythm only: E5-B5-C#5-A5 power chords with downstrokes; skip Alex Rosamilia's lead part.",
    "lesson": {
      "title": "The Gaslight Anthem \"45\" Guitar Lesson Tutorial -  EASY Acoustic!",
      "author": "Andy Guitar",
      "url": "https://www.youtube.com/watch?v=50PaITUGvK0"
    },
    "tab": "https://www.songsterr.com/a/wsa/gaslight-anthem-45-tab-s389422"
  },
  {
    "id": "give-it-all",
    "title": "Give It All",
    "artist": "Rise Against",
    "phase": 3,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down.",
    "capo": null,
    "bpm": 103,
    "difficulty": 4,
    "techniques": [
      "fast downpicking",
      "palm muting",
      "power chords",
      "single-note riff"
    ],
    "chords": [
      "power chords (riff-based)"
    ],
    "why": "Relentless fast punk picking and muting from start to finish (Songsterr guitar 3/5) - stamina is the hard part.",
    "beginnerTip": "Practise the palm-muted chug and power chords at 60% on Songsterr, using alternate picking until downpicking stamina builds.",
    "lesson": {
      "title": "How to play Give it all on Guitar by Rise Against (Lesson/Tutorial)",
      "author": "Guitar Smith",
      "url": "https://www.youtube.com/watch?v=RRHjfJXyEPU"
    },
    "tab": "https://www.songsterr.com/a/wsa/rise-against-give-it-all-tab-s17200"
  },
  {
    "id": "steady-as-she-goes",
    "title": "Steady, As She Goes",
    "artist": "The Raconteurs",
    "phase": 4,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 124,
    "difficulty": 3,
    "techniques": [
      "barre chords",
      "power chords",
      "muted strumming",
      "single-note lead lines"
    ],
    "chords": [
      "Bm",
      "F#",
      "A",
      "E",
      "G",
      "B"
    ],
    "why": "One repeating Bm-F#-A-E loop at a medium groove, but Bm and F# are barre shapes; the lead guitar track is rated 4/5 on Songsterr.",
    "beginnerTip": "Play B5-F#5-A5-E5 power chords instead of full barres and skip the lead lines (Songsterr rhythm track is rated 2/5).",
    "lesson": {
      "title": "The Raconteurs Steady As She Goes Guitar Lesson + Tutorial",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=3xm6a5ON4ic"
    },
    "tab": "https://www.songsterr.com/a/wsa/raconteurs-steady-as-she-goes-tab-s23574"
  },
  {
    "id": "american-slang",
    "title": "American Slang",
    "artist": "The Gaslight Anthem",
    "phase": 4,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 132,
    "difficulty": 3,
    "techniques": [
      "open chords",
      "F barre",
      "hammer-ons and pull-offs (lead lick)",
      "strumming"
    ],
    "chords": [
      "C",
      "F",
      "G",
      "Am"
    ],
    "why": "C-F-G-Am chords are simple, but the signature lick uses hammer-ons/pull-offs and F is a full barre; Brian Fallon and Alex Rosamilia teach the riff themselves in the TotalGuitar video.",
    "beginnerTip": "Strum C-F-G with a small F (xx3211) first; learn the 3h5p3 lick slowly as a separate exercise.",
    "lesson": {
      "title": "The Gaslight Anthem Guitar Lesson: Three Riffs In Three Minutes (TG213)",
      "author": "TotalGuitar",
      "url": "https://www.youtube.com/watch?v=KCxHN6_rPzk",
      "kind": "main riffs only"
    },
    "tab": "https://www.songsterr.com/a/wsa/gaslight-anthem-american-slang-tab-s425180"
  },
  {
    "id": "icky-thump",
    "title": "Icky Thump",
    "artist": "The White Stripes",
    "phase": 4,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 98,
    "difficulty": 4,
    "techniques": [
      "single-note riff",
      "fast picking",
      "bends",
      "octave/whammy effect",
      "lead solo"
    ],
    "chords": [
      "riff-based (no chord progression)"
    ],
    "why": "The main riff is single notes but syncopated and quick; Songsterr rates the guitar 3/5 and the solo 4/5.",
    "beginnerTip": "Learn only the main riff at 60-70% speed and loop it; leave the solo and Whammy parts for later.",
    "lesson": {
      "title": "The White Stripes Icky Thump Guitar Lesson + Tutorial",
      "author": "Marty Music",
      "url": "https://www.youtube.com/watch?v=C7FcachanP0"
    },
    "tab": "https://www.songsterr.com/a/wsa/white-stripes-icky-thump-tab-s23238"
  },
  {
    "id": "hero-of-war",
    "title": "Hero of War",
    "artist": "Rise Against",
    "phase": 5,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down.",
    "capo": null,
    "bpm": 77,
    "difficulty": 3,
    "techniques": [
      "open chords",
      "barre chords",
      "arpeggio picking",
      "strumming"
    ],
    "chords": [
      "E",
      "G#m",
      "C#m",
      "A",
      "B"
    ],
    "why": "Slow and acoustic-style, but G#m, C#m and B are barre chords - the first real barre-chord test on the ladder.",
    "beginnerTip": "Swap the barre chords for power-chord/partial versions (G#5, C#5, B5) until barres are comfortable; tempo is slow, so focus on clean changes.",
    "lesson": {
      "title": "Hero Of War - Rise Against Guitar Lesson ★ How To Play Acoustic Guitar Song Tutorial",
      "author": "Nail Guitar - Song Lessons",
      "url": "https://www.youtube.com/watch?v=sXh5uz7ol1I"
    },
    "tab": "https://www.songsterr.com/a/wsa/rise-against-hero-of-war-tab-s23818"
  },
  {
    "id": "carry-the-banner",
    "title": "Carry the Banner",
    "artist": "The Flatliners",
    "phase": 5,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": null,
    "difficulty": 3,
    "techniques": [
      "open chords",
      "barre chords",
      "power chords",
      "fast strumming"
    ],
    "chords": [
      "G",
      "Em",
      "C",
      "Am",
      "Bm",
      "F#"
    ],
    "why": "UG rates the chords 'novice' (mostly open G/Em/C), but it uses a G barre variation plus Bm and F#, and the electric version is fast.",
    "beginnerTip": "Stick to open G-Em-C for the intro/verses and use power chords for Bm/F#; play along to the acoustic version first.",
    "lesson": {
      "title": "02.  Carry The Banner - The Flatliners (Guitar Cover)",
      "author": "Liam B",
      "url": "https://www.youtube.com/watch?v=PF6m75_oOg4",
      "kind": "cover"
    },
    "tab": "https://tabs.ultimate-guitar.com/tab/the-flatliners/carry-the-banner-chords-1005141"
  },
  {
    "id": "the-59-sound",
    "title": "The '59 Sound",
    "artist": "The Gaslight Anthem",
    "phase": 5,
    "tuning": "D standard",
    "tuningNote": "Songsterr says D standard (whole step down), but an acoustic chord sheet says E♭. Learn it in standard first.",
    "capo": null,
    "bpm": 168,
    "difficulty": 3,
    "techniques": [
      "open chords",
      "F barre/Fmaj7",
      "fast strumming"
    ],
    "chords": [
      "Am",
      "E",
      "Fmaj7",
      "G",
      "C"
    ],
    "why": "Open-position Am-E-Fmaj7-G-C, but it's quick and the F shape is tricky for beginners.",
    "beginnerTip": "Use Fmaj7 (easier than full F) and play in standard tuning until the changes are solid; slow it down on Songsterr.",
    "lesson": {
      "title": "HOW TO PLAY \"The '59 Sound\" by The Gaslight Anthem on Acoustic Guitar",
      "author": "Strawman Dan",
      "url": "https://www.youtube.com/watch?v=EDLgIcHLvMg"
    },
    "tab": "https://www.songsterr.com/a/wsa/gaslight-anthem-the-59-sound-tab-s58963"
  },
  {
    "id": "eulogy",
    "title": "Eulogy",
    "artist": "The Flatliners",
    "phase": 5,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": null,
    "difficulty": 3,
    "techniques": [
      "power chords",
      "palm muting",
      "fast eighth-note strumming",
      "barre chords"
    ],
    "chords": [
      "E",
      "E/G#",
      "A",
      "C#m",
      "F#m"
    ],
    "why": "E-A-C#m-F#m progression played as fast punk power chords/barres with palm-muted verses (UG tab shows the barre shapes).",
    "beginnerTip": "Convert everything to power chords (E5, A5, C#5, F#5) and palm-mute the verses; get it clean at 70% speed.",
    "lesson": {
      "title": "The Flatliners - Eulogy (Guitar Cover)",
      "author": "Probie Gatz",
      "url": "https://www.youtube.com/watch?v=VhJPfBIKnJc",
      "kind": "cover"
    },
    "tab": "https://tabs.ultimate-guitar.com/tab/the-flatliners/eulogy-chords-659235"
  },
  {
    "id": "tail-feathers",
    "title": "Tail Feathers",
    "artist": "The Flatliners",
    "phase": 5,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 121,
    "difficulty": 3,
    "techniques": [
      "open chords",
      "barre chords",
      "strumming"
    ],
    "chords": [
      "C",
      "F",
      "Am",
      "G",
      "Em",
      "Dm",
      "Bb"
    ],
    "why": "Described by the UG tabber as the softest song on Dead Language, but it needs F and Bb barre chords (UG rates it 'intermediate').",
    "beginnerTip": "Use small F (xx3211) and a Bb power chord (x133xx) until full barres are comfortable.",
    "lesson": {
      "title": "Tail Feathers (Cover) - The Flatliners",
      "author": "Liam B",
      "url": "https://www.youtube.com/watch?v=2TbpgmmEOP0",
      "kind": "cover"
    },
    "tab": "https://tabs.ultimate-guitar.com/tab/the-flatliners/tail-feathers-chords-1423985"
  },
  {
    "id": "monumental",
    "title": "Monumental",
    "artist": "The Flatliners",
    "phase": 5,
    "tuning": "Standard",
    "tuningNote": null,
    "capo": null,
    "bpm": 154,
    "difficulty": 4,
    "techniques": [
      "power chords",
      "fast downpicking",
      "palm muting",
      "lead lines",
      "two-guitar arrangement"
    ],
    "chords": [
      "Ab",
      "Bb",
      "Cm",
      "Eb",
      "F",
      "G",
      "Gm (mostly as power chords)"
    ],
    "why": "Fast punk power-chord movement across many shapes with interlocking lead lines (UG tab is two guitars).",
    "beginnerTip": "Learn Guitar 1 as power chords only; or try the slower acoustic version (UG acoustic chord sheet) first.",
    "lesson": {
      "title": "07.  Monumental - The Flatliners (Guitar Cover)",
      "author": "Liam B",
      "url": "https://www.youtube.com/watch?v=nGoX0ZblsBk",
      "kind": "cover"
    },
    "tab": "https://tabs.ultimate-guitar.com/tab/the-flatliners/monumental-tabs-1469517"
  },
  {
    "id": "prayer-of-the-refugee",
    "title": "Prayer of the Refugee",
    "artist": "Rise Against",
    "phase": 5,
    "tuning": "E♭ standard",
    "tuningNote": "Half step down.",
    "capo": null,
    "bpm": 196,
    "difficulty": 4,
    "techniques": [
      "single-note lead riff",
      "fast downpicking",
      "palm muting",
      "power chords"
    ],
    "chords": [
      "power chords (riff-based)"
    ],
    "why": "Songsterr rates the lead 4/5 and rhythm 3/5; the clean intro riff is approachable but the heavy chorus is very fast.",
    "beginnerTip": "Learn just the intro/verse single-note riff first; play the chorus as one power chord per bar until your picking hand catches up.",
    "lesson": {
      "title": "How To Play \"Prayer Of The Refugee\" By Rise Against (Full Song Tutorial With TAB!)",
      "author": "MZ guitar",
      "url": "https://www.youtube.com/watch?v=sqi83vqIC9A"
    },
    "tab": "https://www.songsterr.com/a/wsa/rise-against-prayer-of-the-refugee-tab-s12087"
  }
];
