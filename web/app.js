"use strict";

/* ---------- Constants ---------- */

const CATEGORIES = ["Chords", "Strumming", "Riffs", "Scales", "Technique", "Songs", "Vocals", "Theory", "Improv"];

// The skill tree mirrors the learning path: one group per phase
const DEFAULT_SKILLS = PHASES.map((p) => [`${p.icon} ${p.name}`, p.lessons.flatMap((l) => l.skills || [])]);
const PHASE_BADGE_NAMES = ["Plugged In", "Chord Crafter", "Powered Up", "Punk Engine", "Riff Lord", "Headliner"];

const LEVEL_TITLES = [
  [1, "Bedroom Strummer"], [3, "Callus Builder"], [5, "Chord Changer"], [8, "Riff Raider"],
  [12, "Fretboard Explorer"], [16, "Groove Keeper"], [20, "Stage Ready"], [25, "Shredder"],
  [30, "Guitar Sage"], [40, "Living Legend"],
];

const GENERIC_QUESTS = [
  "Play the chromatic 1-2-3-4 exercise with a metronome. Try 5 BPM over your best.",
  "Strum D-DU-UDU at 70 BPM for 5 minutes without stopping.",
  "Learn one new riff from a song you love.",
  "Record yourself for 2 minutes and listen back. Note one thing to fix.",
  "Play with your eyes closed for 5 minutes and feel your way around the fretboard.",
  "Name every note on the low E string up to the 12th fret.",
  "Muting drill: strum a chord, then silence the strings cleanly with your fretting hand.",
  "Improvise over a backing track for 5 minutes, using only 3 notes.",
  "Tune by ear, then check how close you got with a tuner.",
  "One-minute changes: pick two chords and count the clean switches in 60 seconds.",
  "Play a song you already know, but twice as slowly and perfectly clean.",
  "Fingertip workout: hold each open chord for 10 seconds and check that every string rings.",
  "Play along with a real recording of a song, start to finish.",
  "Spend 5 minutes on your weakest skill. You know which one it is.",
];

const XP = { minuteCapPerDay: 120, goalBonus: 20, quest: 25, skill: 50, song: 75, tempoPR: 10, lesson: 30, boss: 120, pitch: 15 };

/* ---------- Date helpers (local time) ---------- */

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => iso(new Date());
const mondayOf = (d) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const fmtDate = (s) => parse(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel) => document.querySelector(sel);

/* ---------- State & persistence ---------- */

let state = null;

const defaultSkills = () => DEFAULT_SKILLS.flatMap(([group, names]) =>
  names.map((name) => ({ id: uid(), name, group, status: "todo", masteredAt: null })));

function defaultState() {
  return {
    version: 3,
    settings: { name: "Bonsen", dailyGoal: PROFILE.minutesPerDay, weeklyDays: 5 },
    profile: { ...PROFILE },
    sessions: [],
    skills: defaultSkills(),
    songs: [],
    tempos: [],
    quests: {},
    path: { done: {}, unlocked: {} },
    pitch: [],
    voice: { comfy: null },
    seen: null,
  };
}

function migrate(data) {
  let s;
  if ((data.version || 1) >= 2) s = { ...defaultState(), ...data };
  else {
    // v1 → v2: swap the generic skill tree for the path-based one, keep everything else
    const mastered = new Set(data.skills.filter((k) => k.status === "mastered").map((k) => k.name));
    const custom = data.skills.filter((k) => !DEFAULT_SKILLS.some(([, n]) => n.includes(k.name)) && k.status !== "todo");
    s = {
      ...defaultState(), ...data, version: 2,
      skills: [...defaultSkills().map((k) => (mastered.has(k.name) ? { ...k, status: "mastered", masteredAt: today() } : k)), ...custom],
      settings: { ...data.settings, dailyGoal: data.sessions.length ? data.settings.dailyGoal : PROFILE.minutesPerDay },
    };
  }
  // v2 → v3: singing added, shows go from 25 to 30 minutes (unless you'd picked your own length)
  if (s.version < 3) {
    if (Number(s.settings.dailyGoal) === 25) s.settings = { ...s.settings, dailyGoal: 30 };
    s.version = 3;
  }
  // New lessons bring new skills: add any that are missing
  const have = new Set(s.skills.map((k) => k.name));
  for (const k of defaultSkills()) if (!have.has(k.name)) s.skills.push(k);
  return s;
}

// Two places progress can live:
//  "server" - running on the Mac via server.py (saved to data/progress.json)
//  "device" - the installed phone app on GitHub Pages (saved in this browser's storage)
const DATA_KEY = "bpg-progress";
let backend = "device";

async function load() {
  try {
    const res = await fetch("api/data", { cache: "no-store" });
    if (res.ok && (res.headers.get("content-type") || "").includes("json")) {
      const { data } = await res.json();
      backend = "server";
      state = data ? migrate(data) : defaultState();
      return;
    }
  } catch {}
  backend = "device";
  let data = null;
  try { data = JSON.parse(localStorage.getItem(DATA_KEY)); } catch {}
  state = data ? migrate(data) : defaultState();
  // Ask the browser not to clear our storage under pressure
  try { await navigator.storage?.persist?.(); } catch {}
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (backend === "device") {
      try { localStorage.setItem(DATA_KEY, JSON.stringify(state)); } catch { toast("⚠️ Couldn't save on this device. Is storage full or private browsing on?"); }
      return;
    }
    try {
      await fetch("api/data", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) });
    } catch {
      toast("⚠️ Save failed. Is the server still running?");
    }
  }, 250);
}

/* ---------- Game engine: everything is derived from raw data ---------- */

const xpForLevel = (L) => Math.round(60 * Math.pow(L - 1, 1.6));
function levelFor(xp) {
  let L = 1;
  while (xpForLevel(L + 1) <= xp) L++;
  return L;
}
const titleFor = (L) => LEVEL_TITLES.filter(([min]) => L >= min).pop()[1];

function compute(s) {
  const goal = Number(s.settings.dailyGoal) || 20;
  const byDay = new Map();
  for (const x of s.sessions) byDay.set(x.date, (byDay.get(x.date) || 0) + Number(x.minutes));

  const t = today();
  const dates = [...byDay.keys()].sort();
  let xp = 0, streak = 0, best = 0, freezes = 0, freezesUsed = 0, goalDays = 0, comebacks = 0, gap = 0;
  const frozen = new Set();

  if (dates.length) {
    for (let d = parse(dates[0]); iso(d) <= t; d = addDays(d, 1)) {
      const key = iso(d);
      const m = byDay.get(key) || 0;
      if (m > 0) {
        if (gap >= 3) comebacks++;
        gap = 0;
        streak++;
        best = Math.max(best, streak);
        if (streak % 7 === 0) freezes = Math.min(2, freezes + 1);
        xp += Math.min(m, XP.minuteCapPerDay) + Math.min(30, 2 * streak);
        if (m >= goal) { xp += XP.goalBonus; goalDays++; }
      } else if (key === t) {
        // today isn't over yet - streak is still alive
      } else if (freezes > 0 && streak > 0) {
        freezes--; freezesUsed++; frozen.add(key);
      } else {
        streak = 0; gap++;
      }
    }
  }

  // Weekly goal: weeks (Mon-Sun) with enough practice days
  const weeks = new Map();
  for (const d of dates) {
    const w = iso(mondayOf(parse(d)));
    weeks.set(w, (weeks.get(w) || 0) + 1);
  }
  const weeklyDays = Number(s.settings.weeklyDays) || 5;
  const weeksHit = [...weeks.values()].filter((n) => n >= weeklyDays).length;

  const mastered = s.skills.filter((k) => k.status === "mastered").length;
  const learned = s.songs.filter((k) => k.status === "learned").length;
  let tempoPRs = 0, topBpm = 0;
  for (const ex of s.tempos) {
    let max = 0;
    ex.entries.forEach((e, i) => { if (i > 0 && e.bpm > max) tempoPRs++; max = Math.max(max, e.bpm); });
    topBpm = Math.max(topBpm, max);
  }
  const questsDone = Object.values(s.quests).filter(Boolean).length;
  const done = s.path?.done || {};
  const lessonsDone = ALL_LESSONS.filter((l) => done[l.id]).length;
  const bossesDone = ALL_LESSONS.filter((l) => l.boss && done[l.id]).length;
  const vocalDone = ALL_LESSONS.filter((l) => l.vocal && done[l.id]).length;
  const phasesDone = PHASES.map((p) => p.lessons.every((l) => done[l.id]));
  xp += mastered * XP.skill + learned * XP.song + tempoPRs * XP.tempoPR + questsDone * XP.quest
    + lessonsDone * XP.lesson + bossesDone * XP.boss;

  // Pitch game: XP for up to 3 rounds a day
  const pitch = s.pitch || [];
  const roundsPerDay = {};
  for (const r of pitch) roundsPerDay[r.date] = (roundsPerDay[r.date] || 0) + 1;
  xp += Object.values(roundsPerDay).reduce((a, n) => a + Math.min(3, n), 0) * XP.pitch;
  const pitchGood = pitch.filter((r) => r.hits / r.total >= 0.75).length;
  const pitchPerfect = pitch.filter((r) => r.hits === r.total).length;

  const totalMin = [...byDay.values()].reduce((a, b) => a + b, 0);
  const cats = new Set(s.sessions.flatMap((x) => x.categories || []));

  const c = {
    byDay, frozen, streak, best, freezes, freezesUsed, goalDays, comebacks, weeksHit, weeks,
    mastered, learned, tempoPRs, topBpm, questsDone, totalMin, lessonsDone, bossesDone, vocalDone, phasesDone, pitchRounds: pitch.length, pitchGood, pitchPerfect,
    days: dates.length, sessions: s.sessions.length, maxDay: Math.max(0, ...byDay.values()), cats: cats.size,
  };

  c.badges = BADGES.map((b) => {
    const cur = b.value(c);
    return { ...b, cur: Math.min(cur, b.target), got: cur >= b.target };
  });
  xp += c.badges.filter((b) => b.got).reduce((a, b) => a + b.xp, 0);

  c.xp = xp;
  c.level = levelFor(xp);
  c.title = titleFor(c.level);
  c.levelStart = xpForLevel(c.level);
  c.levelEnd = xpForLevel(c.level + 1);
  return c;
}

const BADGES = [
  ...PHASES.map((p, i) => ({
    id: `phase-${p.id}`, icon: p.icon, name: PHASE_BADGE_NAMES[i] || p.name, desc: `Finish leg ${i + 1}: ${p.name}`,
    target: 1, xp: 50 + i * 30, value: (c) => (c.phasesDone[i] ? 1 : 0),
  })),
  { id: "lesson10", icon: "📚", name: "Student of Rock", desc: "Pass 10 tour dates", target: 10, xp: 50, value: (c) => c.lessonsDone },
  { id: "voice1", icon: "🎤", name: "Found My Voice", desc: "Pass your first sing & play date", target: 1, xp: 20, value: (c) => c.vocalDone },
  { id: "voice6", icon: "📣", name: "Frontperson", desc: "Pass all 6 sing & play dates", target: 6, xp: 150, value: (c) => c.vocalDone },
  { id: "pitch6", icon: "🎧", name: "In Tune", desc: "Score 6/8 or better in the pitch game", target: 1, xp: 25, value: (c) => c.pitchGood },
  { id: "pitch8", icon: "💎", name: "Perfect Pitch(ish)", desc: "Score 8/8 in the pitch game", target: 1, xp: 50, value: (c) => c.pitchPerfect },
  { id: "pitch20", icon: "👂", name: "Golden Ears", desc: "Play 20 rounds of the pitch game", target: 20, xp: 60, value: (c) => c.pitchRounds },
  { id: "first", icon: "🎵", name: "First Strum", desc: "Play your first show", target: 1, xp: 10, value: (c) => c.sessions },
  { id: "s3", icon: "🔥", name: "Hat Trick", desc: "3-day streak", target: 3, xp: 20, value: (c) => c.best },
  { id: "s7", icon: "📅", name: "Week Warrior", desc: "7-day streak", target: 7, xp: 50, value: (c) => c.best },
  { id: "s14", icon: "⚡", name: "Fortnight Fury", desc: "14-day streak", target: 14, xp: 75, value: (c) => c.best },
  { id: "s30", icon: "🌙", name: "Month of Rock", desc: "30-day streak", target: 30, xp: 150, value: (c) => c.best },
  { id: "s100", icon: "💯", name: "Centurion", desc: "100-day streak", target: 100, xp: 500, value: (c) => c.best },
  { id: "h1", icon: "⏱️", name: "Hour Power", desc: "1 hour total practice", target: 60, xp: 15, value: (c) => c.totalMin },
  { id: "h10", icon: "🎸", name: "Ten Hour Hero", desc: "10 hours total", target: 600, xp: 75, value: (c) => c.totalMin },
  { id: "h50", icon: "🖐️", name: "Calloused", desc: "50 hours total", target: 3000, xp: 200, value: (c) => c.totalMin },
  { id: "h100", icon: "🏔️", name: "Road to Mastery", desc: "100 hours total", target: 6000, xp: 400, value: (c) => c.totalMin },
  { id: "marathon", icon: "🏃", name: "Marathon", desc: "Practice 60+ minutes in one day", target: 60, xp: 30, value: (c) => c.maxDay },
  { id: "goal10", icon: "🎯", name: "Goal Getter", desc: "Hit your daily goal 10 times", target: 10, xp: 40, value: (c) => c.goalDays },
  { id: "d50", icon: "🗓️", name: "Regular", desc: "Practice on 50 different days", target: 50, xp: 100, value: (c) => c.days },
  { id: "weeks4", icon: "📈", name: "Consistent", desc: "Hit your weekly goal 4 times", target: 4, xp: 80, value: (c) => c.weeksHit },
  { id: "variety", icon: "🌈", name: "Well Rounded", desc: "Practice 6 different areas", target: 6, xp: 30, value: (c) => c.cats },
  { id: "quest7", icon: "🎲", name: "Daredevil", desc: "Complete 7 daily dares", target: 7, xp: 40, value: (c) => c.questsDone },
  { id: "skill1", icon: "🔓", name: "First Unlock", desc: "Master a skill", target: 1, xp: 15, value: (c) => c.mastered },
  { id: "skill10", icon: "🧩", name: "Skill Collector", desc: "Master 10 skills", target: 10, xp: 100, value: (c) => c.mastered },
  { id: "skill25", icon: "🌳", name: "Tree Climber", desc: "Master 25 skills", target: 25, xp: 250, value: (c) => c.mastered },
  { id: "song1", icon: "🎤", name: "First Song", desc: "Learn a full song", target: 1, xp: 25, value: (c) => c.learned },
  { id: "song5", icon: "📝", name: "Setlist", desc: "Learn 5 songs", target: 5, xp: 75, value: (c) => c.learned },
  { id: "song15", icon: "🏟️", name: "Gig Ready", desc: "Learn 15 songs", target: 15, xp: 200, value: (c) => c.learned },
  { id: "bpm120", icon: "🚀", name: "Speed Demon", desc: "Hit 120 BPM on any exercise", target: 120, xp: 50, value: (c) => c.topBpm },
  { id: "comeback", icon: "🦅", name: "Comeback Kid", desc: "Pick it back up after 3+ days off", target: 1, xp: 20, value: (c) => c.comebacks },
  { id: "ice", icon: "🤒", name: "Sick Note", desc: "Have a sick note save your streak", target: 1, xp: 10, value: (c) => c.freezesUsed },
];

/* ---------- Daily quest ---------- */

function hash(str) { let h = 2166136261; for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }

function questFor(date) {
  const h = hash(date);
  const learningSkills = state.skills.filter((k) => k.status === "learning");
  const learningSongs = state.songs.filter((k) => k.status === "learning");
  const pool = [...GENERIC_QUESTS];
  for (const k of learningSkills) pool.push(`Give "${k.name}" 10 focused minutes. Slow and clean beats fast and sloppy.`);
  for (const k of learningSongs) pool.push(`Play "${k.title}" from start to finish, even if it's slow.`);
  const cur = currentLesson();
  if (cur) pool.push(`Path test attempt: "${cur.lesson.doneWhen}" Give it 3 honest tries today.`);
  return pool[h % pool.length];
}


/* ---------- The tour (learning path) ---------- */

const VENUES = ["The Garage", "The Basement", "The Dive Bar", "The Club", "The Theatre", "The Festival"];

const lessonDone = (id) => !!state.path.done[id];
const phaseComplete = (p) => p.lessons.every((l) => lessonDone(l.id));
const phaseUnlocked = (i) => i === 0 || !!state.path.unlocked[PHASES[i].id] || phaseComplete(PHASES[i - 1]);
const songById = (id) => SONGS.find((s) => s.id === id);
const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
function stepLabel(steps, i) {
  if (steps[i][2]) return steps[i][2] === "Vocal warm-up" ? "🎤 Vocal warm-up" : steps[i][2];
  const hasGuitarWarmup = steps.some((s) => s[2] === "Guitar warm-up");
  if (i === steps.findIndex((s) => !s[2]) && !hasGuitarWarmup) return "Soundcheck";
  return i === steps.length - 1 && steps.length > 2 ? "Encore" : "Main set";
}
const fmtClock = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

function currentLesson() {
  for (let i = 0; i < PHASES.length; i++) {
    if (!phaseUnlocked(i)) continue;
    const idx = PHASES[i].lessons.findIndex((l) => !lessonDone(l.id));
    if (idx >= 0) return { phase: PHASES[i], phaseIndex: i, lesson: PHASES[i].lessons[idx], lessonIndex: idx };
  }
  return null;
}

function ytId(url) {
  const m = String(url || "").match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function videoHTML(v) {
  const id = ytId(v.url);
  const meta = `<a class="vid-meta" href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.title)}${v.author ? ` · <b>${esc(v.author)}</b>` : ""} ↗</a>`;
  if (!id) return `<div class="vid">${meta}</div>`;
  return `<div class="vid"><div class="yt" data-yt="${id}" title="Play here">
    <img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="" loading="lazy"><span class="play">▶ PLAY</span></div>${meta}</div>`;
}

function lessonVideos(l) {
  const seen = new Set();
  return (l.topics || []).flatMap((t) => VIDEOS[t] || []).filter((v) => !seen.has(v.url) && seen.add(v.url));
}

const diffHTML = (n) => `<span class="diff" title="Difficulty ${n}/5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;

function songBlockHTML(song, { head = true } = {}) {
  if (!song) return "";
  const std = /^standard/i.test(song.tuning || "Standard");
  return `<div class="song-block">
    ${head ? `<div class="song-head"><div><span class="title">${esc(song.title)}</span> <span class="small">· ${esc(song.artist)}</span></div>${diffHTML(song.difficulty)}</div>` : ""}
    <div class="song-meta">
      <span class="tag ${std ? "" : "warn"}">TUNING: ${esc(song.tuning || "Standard")}</span>
      ${song.capo ? `<span class="tag warn">CAPO ${esc(song.capo)}</span>` : ""}
      ${song.bpm ? `<span class="tag">♩ ${esc(song.bpm)} BPM</span>` : ""}
      ${(song.techniques || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
    </div>
    ${song.tuningNote ? `<p class="small">${esc(song.tuningNote)}</p>` : ""}
    ${song.beginnerTip ? `<p class="tip"><b>Tip:</b> ${esc(song.beginnerTip)}</p>` : ""}
    ${song.lesson ? `<div class="vids">${videoHTML(song.lesson)}</div>` : ""}
    ${song.lesson?.kind ? `<p class="small">Heads up: there's no proper lesson for this song yet. The video is a ${esc(song.lesson.kind)}, so use it with the tab.</p>` : ""}
    ${song.tab ? `<p><a class="btn tiny" href="${esc(song.tab)}" target="_blank" rel="noopener">Open the tab ↗</a></p>` : ""}
  </div>`;
}

function setlistHTML(l) {
  return `<ol class="setlist">${l.steps.map(([m, t], i) =>
    `<li><div><span class="sl-label">${stepLabel(l.steps, i)}</span>${esc(t)}</div><span class="sl-min">${m}′</span></li>`).join("")}</ol>`;
}

function lessonBodyHTML(l) {
  const vids = lessonVideos(l);
  return `
    <p class="why">${esc(l.why)}</p>
    <h4>The setlist</h4>${setlistHTML(l)}
    <div class="to-pass"><b>TO PASS:</b>${esc(l.doneWhen)}</div>
    ${vids.length ? `<h4>Watch</h4><div class="vids">${vids.map(videoHTML).join("")}</div>` : ""}
    ${l.song ? `<h4>The song</h4>${songBlockHTML(songById(l.song))}` : ""}`;
}

function markLessonDone(id) {
  const l = lessonById(id);
  state.path.done[id] = today();
  for (const name of l.skills || []) {
    const k = state.skills.find((s) => s.name === name);
    if (k && k.status !== "mastered") { k.status = "mastered"; k.masteredAt = today(); }
  }
  if (l.song && songById(l.song) && !l.vocal) setLadderStatus(l.song, "learned");
}

function completeLesson(id) {
  if (lessonDone(id)) { delete state.path.done[id]; commit(); return; }
  const l = lessonById(id);
  const before = C.xp;
  markLessonDone(id);
  commit();
  toast(`${l.boss ? "★ Headline show played" : "✓ Date passed"}: <b>${esc(l.title)}</b> · <b>+${C.xp - before} XP</b>`, 6000);
  if (l.boss) confetti();
}

function setLadderStatus(ladderId, status) {
  const song = songById(ladderId);
  let entry = state.songs.find((s) => s.ladderId === ladderId);
  if (!entry) { entry = { id: uid(), ladderId, title: song.title, artist: song.artist, status: "want", learnedAt: null, addedAt: today() }; state.songs.push(entry); }
  entry.status = status;
  entry.learnedAt = status === "learned" ? entry.learnedAt || today() : null;
}

/* ---------- Celebrations ---------- */

function toast(html, ms = 4500) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = html;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function confetti() {
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ["#e8202a", "#141210", "#ffe94d", "#fbf8f1"];
  const parts = Array.from({ length: 150 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight / 3, vx: (Math.random() - 0.5) * 15, vy: Math.random() * -13 - 3,
    w: Math.random() * 10 + 5, h: Math.random() * 6 + 3, c: colors[(Math.random() * colors.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3,
  }));
  let frame = 0;
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.33; p.vx *= 0.99; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.strokeStyle = "#141210"; ctx.lineWidth = 1;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    if (++frame < 160) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

function celebrate(c) {
  const got = c.badges.filter((b) => b.got).map((b) => b.id);
  if (!state.seen) { state.seen = { level: c.level, badges: got }; save(); return; }
  let party = false;
  for (const b of c.badges) {
    if (b.got && !state.seen.badges.includes(b.id)) { toast(`${b.icon} New badge for your jacket: <b>${esc(b.name)}</b> (+${b.xp} XP)`); party = true; }
  }
  if (c.level > state.seen.level) { toast(`★ <b>LEVEL ${c.level}!</b> New laminate: <b>${esc(c.title)}</b>`, 6000); party = true; }
  if (party) confetti();
  if (party || c.level !== state.seen.level) { state.seen = { level: c.level, badges: got }; save(); }
}

/* ---------- Rendering ---------- */

let C = null;

function commit() { save(); render(); }

function render() {
  C = compute(state);
  celebrate(C);
  renderMast(); renderTonight(); renderTour(); renderSetlist(); renderPitch(); renderDiary(); renderBadges(); renderProfile();
}

function tallySVG(n) {
  let out = "";
  for (let g = 0; g < Math.ceil(n / 5); g++) {
    const k = Math.min(5, n - g * 5);
    let lines = "";
    for (let i = 0; i < Math.min(k, 4); i++) {
      const x = 5 + i * 7;
      lines += `<line x1="${x}" y1="${3 + (i % 2)}" x2="${x + (i % 2 ? 1 : -1)}" y2="27"/>`;
    }
    if (k === 5) lines += `<line x1="0" y1="21" x2="31" y2="8" stroke="#e8202a"/>`;
    out += `<svg viewBox="0 0 32 30"><g stroke="#141210" stroke-width="2.6" stroke-linecap="round">${lines}</g></svg>`;
  }
  return out;
}

function renderMast() {
  const name = (state.settings.name || "Bonsen").toUpperCase().replace(/\s+/g, "");
  $("#logo-name").innerHTML = [...name].map((ch) => `<span>${esc(ch)}</span>`).join("");
  $("#tour-year").textContent = `'${String(new Date().getFullYear()).slice(2)}`;
  $("#hud-streak").textContent = C.streak;
  $("#hud-tally").innerHTML = tallySVG(Math.min(C.streak, 20));
  $("#hud-sick").innerHTML = [0, 1].map((i) => `<div class="sicknote ${i < C.freezes ? "" : "empty"}">SICK<br>NOTE</div>`).join("");
  $("#hud-level").textContent = C.level;
  $("#hud-title").textContent = C.title;
  $("#hud-xpfill").style.width = `${((C.xp - C.levelStart) / (C.levelEnd - C.levelStart)) * 100}%`;
  $("#hud-xptext").textContent = `${C.xp - C.levelStart} / ${C.levelEnd - C.levelStart} XP to LV ${C.level + 1}`;
}

function renderTonight() {
  const cur = currentLesson();
  const t = today();
  const mins = C.byDay.get(t) || 0;
  const name = esc(state.settings.name || "Bonsen");

  if (!cur) {
    $("#poster").innerHTML = `<article class="poster paper tape"><div class="poster-head"><div class="presents">${name} presents</div>
      <h1 class="poster-title">Tour complete.</h1></div><div class="poster-body"><p class="poster-why">You went from never holding a guitar to playing the Flatliners along with the record. Add your own songs to the setlist, keep the streak alive, and start a band.</p>
      <button class="play-btn" data-goto="setlist">Pick your next song</button></div></article>`;
  } else {
    const { phase, phaseIndex, lesson, lessonIndex } = cur;
    const total = lesson.steps.reduce((a, [m]) => a + m, 0);
    const song = lesson.song && songById(lesson.song);
    const vids = lessonVideos(lesson);
    const firstVid = vids[0] || song?.lesson;
    const nights = new Set(state.sessions.filter((s) => s.lessonId === lesson.id).map((s) => s.date)).size;
    const resuming = P && P.mode === "show" && P.lessonId === lesson.id;
    const questDone = !!state.quests[t];

    const mon = mondayOf(new Date());
    let practiced = 0, week = "";
    for (let i = 0; i < 7; i++) {
      const d = iso(addDays(mon, i));
      const m = C.byDay.get(d) || 0;
      if (m > 0) practiced++;
      week += `<div><div class="box ${d === t ? "today" : ""} ${C.frozen.has(d) ? "frozen" : ""}" title="${m} min">${m > 0 ? "✗" : C.frozen.has(d) ? "SICK" : ""}</div><span class="d">${"MTWTFSS"[i]}</span></div>`;
    }
    const wd = Number(state.settings.weeklyDays) || 5;

    $("#poster").innerHTML = `<div class="poster-grid">
      <article class="poster paper tape">
        ${mins > 0 ? `<div class="stamp played-stamp">Played tonight · ${mins} min</div>` : ""}
        <div class="poster-head">
          <div class="presents">${name} presents · leg ${phaseIndex + 1} of ${PHASES.length} · date ${lessonIndex + 1} of ${phase.lessons.length}</div>
          <div><span class="venue">@ ${esc(VENUES[phaseIndex])}</span><span class="tonight">TONIGHT</span></div>
          <h1 class="poster-title">${esc(lesson.title)}</h1>
          ${lesson.vocal ? `<div class="boss-banner sing">🎤 SING & PLAY 🎤</div>` : ""}
          ${lesson.boss ? `<div class="boss-banner">★ HEADLINE SHOW ★</div>` : ""}
        </div>
        <div class="poster-body">
          <p class="poster-why">${esc(lesson.why)}</p>
          <div class="doors"><span class="display sm" style="margin:0">The setlist</span><span class="stamp">Doors · ${total} min</span></div>
          ${setlistHTML(lesson)}
          <div class="to-pass"><b>TO PASS:</b>${esc(lesson.doneWhen)}</div>
          <button class="play-btn" data-play>${resuming ? `▶ Back on stage · ${fmtClock(showMs())}` : mins > 0 ? "▶ Play an encore" : "▶ Play the show"}</button>
          <div class="poster-sub small">
            <span>${nights ? `You've played this date ${plural(nights, "night")}. Suggested: ~${lesson.days}.` : `Suggested: ~${plural(lesson.days, "night")} on this date.`}</span>
            <button class="linkish" data-goto="tour">See the whole tour →</button>
          </div>
        </div>
      </article>
      <aside class="side-col">
        <div class="sticky ${questDone ? "done" : ""}">
          <h3>Tonight's dare</h3>
          <p>${esc(questFor(t))}</p>
          <button class="btn tiny" id="quest-done">${questDone ? "✓ Done (undo)" : "Done it · +25 XP"}</button>
        </div>
        <div class="paper side-card">
          <h3>This week</h3>
          <div class="week-row">${week}</div>
          <p class="small" style="margin:10px 0 0">${practiced >= wd ? `<span class="hl">Weekly goal smashed: ${practiced}/${wd} shows.</span>` : `${practiced}/${wd} shows this week.`}
          ${C.streak > 0 && mins === 0 ? ` <b class="red">Your ${C.streak}-night streak ends at midnight unless you play.</b>` : ""}</p>
        </div>
        <div class="paper side-card pg-nudge"><h3>🎤 Pitch game</h3>
          <p class="small" style="margin:0 0 10px">A 2-minute ear workout: hear a note, sing it back. ${(state.pitch || []).filter((r) => r.date === t).length ? `Rounds today: <b>${state.pitch.filter((r) => r.date === t).length}</b>.` : "Not played today."}</p>
          <button class="btn tiny" data-goto="pitch">Play a round →</button></div>
        ${firstVid ? `<div class="paper side-card tape"><h3>Watch before you play</h3>${videoHTML(firstVid)}
          ${song ? `<p class="small" style="margin:10px 0 0">Tonight's song: <b>${esc(song.title)}</b> · tuning: <b>${esc(song.tuning)}</b></p>` : ""}</div>` : ""}
      </aside>
    </div>`;
  }

  // Tour route
  $("#route").innerHTML = `<div class="route-head"><h2 class="display sm" style="margin:0">The tour route</h2>
    <span class="small">${C.lessonsDone} of ${ALL_LESSONS.length} dates played</span></div>
    <div class="route">${PHASES.map((p, i) => {
      const isCur = cur && cur.phase.id === p.id;
      const cls = phaseComplete(p) ? "done" : isCur ? "current" : phaseUnlocked(i) ? "" : "locked";
      return `<button class="stop ${cls}" data-leg="${p.id}">${isCur ? `<span class="here">you are here ↓</span>` : ""}
        <div class="dot">${phaseComplete(p) ? "✓" : i + 1}</div><div class="v">${esc(VENUES[i])}</div>
        <div class="p">${esc(p.name)} · ${esc(p.weeks)}</div></button>`;
    }).join("")}</div>`;
}

function keepOpen(container, draw) {
  const open = new Set([...container.querySelectorAll("details[open]")].map((d) => d.dataset.id));
  const first = !container.dataset.rendered;
  draw();
  container.dataset.rendered = "1";
  if (!first) container.querySelectorAll("details[data-id]").forEach((d) => { d.open = open.has(d.dataset.id); });
}

function renderTour() {
  const cur = currentLesson();
  $("#tour-intro").textContent = `${PHASES.length} venues, ${ALL_LESSONS.length} dates, about 26 weeks at ${state.settings.dailyGoal} minutes a night (5 of them singing). Play each date until you can pass its test, then tick it off. Some dates take longer than suggested, and that's normal.`;
  const wrap = $("#tour-legs");
  keepOpen(wrap, () => {
    wrap.innerHTML = PHASES.map((p, i) => {
      const unlocked = phaseUnlocked(i);
      const n = p.lessons.filter((l) => lessonDone(l.id)).length;
      return `<section class="leg paper ${phaseComplete(p) ? "complete" : ""} ${unlocked ? "" : "locked"}" id="leg-${p.id}">
        <div class="leg-head"><div class="leg-num">${pad(i + 1)}</div>
          <div class="leg-name"><div class="display">${esc(VENUES[i])}</div><div class="type">Leg ${i + 1}: ${esc(p.name)} · ${esc(p.weeks)}</div></div>
          <div class="leg-prog">${n}/${p.lessons.length}</div></div>
        <p class="leg-goal">${esc(p.goal)}</p>
        ${unlocked ? "" : `<div class="tba"><span class="display">Dates TBA</span><span class="small">Unlocks when you finish ${esc(VENUES[i - 1])}.</span><button class="btn tiny" data-unlock="${p.id}">I already know this · skip ahead</button></div>`}
        <div class="dates">${p.lessons.map((l, j) => {
          const d = lessonDone(l.id);
          const here = cur && cur.lesson.id === l.id;
          return `<details class="date ${d ? "done" : ""} ${here ? "next" : ""}" data-id="${l.id}" ${here ? "open" : ""}>
            <summary><span class="n">${pad(j + 1)}</span>
              <span class="t">${here ? `<span class="hl">${esc(l.title)}</span>` : esc(l.title)}${l.vocal ? `<span class="boss sing">🎤 SING</span>` : ""}${l.boss ? `<span class="boss">HEADLINER</span>` : ""}</span>
              <span class="nights">~${plural(l.days, "night")}</span>
              <span class="st">${d ? `<span class="stamp">Played</span>` : here ? `<span class="stamp">Next up</span>` : ""}</span></summary>
            <div class="date-body">${lessonBodyHTML(l)}
              <div class="song-actions">
                ${here ? `<button class="btn red" data-play>▶ Play this show</button>` : ""}
                <button class="btn" data-complete="${l.id}">${d ? `Played ${fmtDate(state.path.done[l.id])} · undo` : "✓ I passed the test"}</button>
              </div></div></details>`;
        }).join("")}</div></section>`;
    }).join("");
  });
}

function renderSetlist() {
  const wrap = $("#ladder");
  let lastPhase = -1;
  keepOpen(wrap, () => {
    wrap.innerHTML = SONGS.map((s, i) => {
      const status = state.songs.find((x) => x.ladderId === s.id)?.status || "want";
      const head = s.phase !== lastPhase ? `<div class="phase-break">LEG ${s.phase + 1} · ${esc(VENUES[s.phase]).toUpperCase()}</div>` : "";
      lastPhase = s.phase;
      return `${head}<details class="song-row ${status}" data-id="song-${s.id}">
        <summary><span class="n">${i + 1}</span>
          <span class="t"><span class="name">${esc(s.title)}</span><span class="a">${esc(s.artist)}${/^standard/i.test(s.tuning) ? "" : ` · <b class="red">${esc(s.tuning)}</b>`}${s.capo ? ` · capo ${esc(s.capo)}` : ""}</span></span>
          ${diffHTML(s.difficulty)}
          <span class="ctl">${status === "learned" ? `<span class="stamp">Nailed it</span>` : status === "learning" ? `<span class="hl small">learning</span>` : ""}</span></summary>
        <div class="body">${s.why ? `<p class="why">${esc(s.why)}</p>` : ""}${songBlockHTML(s, { head: false })}
          <div class="song-actions">
            <button class="btn tiny" data-ladder="${s.id}" data-to="want">Not started</button>
            <button class="btn tiny" data-ladder="${s.id}" data-to="learning">Learning it</button>
            <button class="btn tiny red" data-ladder="${s.id}" data-to="learned">Cross it off · I can play it!</button>
          </div></div></details>`;
    }).join("");
  });

  const reqs = state.songs.filter((s) => !s.ladderId);
  const label = { want: "Want to learn", learning: "Learning", learned: "Can play" };
  $("#requests").innerHTML = reqs.length ? reqs.map((s) => `<div class="req ${s.status}">
      <div><span class="t">${esc(s.title)}</span> <span class="small">${esc(s.artist)}</span></div>
      <div class="row" style="flex:0 0 auto"><button class="btn tiny" data-req="${s.id}">${label[s.status]} →</button><button class="del" data-del-req="${s.id}" title="Delete">✕</button></div>
    </div>`).join("") : `<p class="empty">No requests yet. Add any song you're dying to play.</p>`;
}

function sparkline(entries) {
  if (entries.length < 2) return "";
  const w = 120, h = 36, p = 4, vals = entries.map((e) => e.bpm);
  const lo = Math.min(...vals) - 3, hi = Math.max(...vals) + 3;
  const pts = vals.map((v, i) => `${p + (i / (vals.length - 1)) * (w - 2 * p)},${h - p - ((v - lo) / (hi - lo)) * (h - 2 * p)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}"><polyline fill="none" stroke="#e8202a" stroke-width="2.5" stroke-linejoin="round" points="${pts}"/></svg>`;
}

function renderDiary() {
  const t = today();
  const goal = Number(state.settings.dailyGoal) || 25;
  $("#stats").innerHTML = [
    [C.streak, "Night streak"], [C.best, "Best streak"], [(C.totalMin / 60).toFixed(1), "Hours on stage"],
    [C.days, "Shows played"], [`${C.lessonsDone}/${ALL_LESSONS.length}`, "Tour dates passed"], [C.learned, "Songs crossed off"],
  ].map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");

  const start = addDays(mondayOf(new Date()), -25 * 7);
  let hm = "";
  for (let i = 0; i < 26 * 7; i++) {
    const d = iso(addDays(start, i));
    const m = C.byDay.get(d) || 0;
    const lvl = m === 0 ? 0 : m < goal / 2 ? 1 : m < goal ? 2 : m < goal * 2 ? 3 : 4;
    hm += `<i class="${d > t ? "future" : C.frozen.has(d) ? "frozen" : `l${lvl}`}" title="${fmtDate(d)}: ${m} min"></i>`;
  }
  $("#heatmap").innerHTML = hm;

  const weeks = [];
  for (let w = 11; w >= 0; w--) {
    const m0 = addDays(mondayOf(new Date()), -7 * w);
    let sum = 0;
    for (let i = 0; i < 7; i++) sum += C.byDay.get(iso(addDays(m0, i))) || 0;
    weeks.push([m0, sum]);
  }
  const max = Math.max(60, ...weeks.map((w) => w[1]));
  $("#weekly-chart").innerHTML = weeks.map(([d, sum]) =>
    `<div class="bar" title="${sum} min"><em>${sum || ""}</em><div style="height:${(sum / max) * 100}%"></div><span>${d.getDate()}/${d.getMonth() + 1}</span></div>`).join("");

  const list = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  $("#history").innerHTML = list.length ? list.slice(0, 50).map((s) => {
    const l = s.lessonId && lessonById(s.lessonId);
    return `<div class="entry"><div class="when">${fmtDate(s.date)}</div>
      <div><span class="mins">${s.minutes} min</span> ${s.mood || ""}${l ? ` <span class="small">· ${esc(l.title)}</span>` : ""}
        ${s.notes ? `<div class="note">${esc(s.notes)}</div>` : ""}</div>
      <button class="del" data-del-session="${s.id}" title="Delete">✕</button></div>`;
  }).join("") : `<p class="empty">No shows yet. The first one is the hardest. Go play it.</p>`;

  $("#tempo-exercises").innerHTML = state.tempos.map((x) => `<option value="${esc(x.name)}">`).join("");
  $("#tempo-list").innerHTML = state.tempos.length ? state.tempos.map((x) => {
    const best = Math.max(...x.entries.map((e) => e.bpm));
    return `<div class="tempo"><div><div class="small">${esc(x.name)}</div><b>${best}</b> <span class="small">BPM best · started at ${x.entries[0].bpm}</span></div>
      ${sparkline(x.entries)}<button class="del" data-del-tempo="${x.id}" title="Delete">✕</button></div>`;
  }).join("") : `<p class="empty">No speed records yet.</p>`;
}

function renderBadges() {
  const got = C.badges.filter((b) => b.got).length;
  $("#badge-count").textContent = `${got} of ${C.badges.length} collected. Pin 'em on your jacket.`;
  $("#badge-grid").innerHTML = C.badges.map((b) => `<div class="pin ${b.got ? "" : "locked"}">
      <div class="btnface">${b.icon}</div>
      <div class="name">${esc(b.name)}</div><div class="desc">${esc(b.desc)}</div>
      ${b.got ? `<div class="xp">+${b.xp} XP</div>` : `<div class="meter"><div style="width:${(b.cur / b.target) * 100}%"></div></div><div class="desc">${b.cur} / ${b.target}</div>`}
    </div>`).join("");
}

async function exportBackup() {
  const name = `guitar-progress-${today()}.json`;
  const json = JSON.stringify(state, null, 2);
  const done = () => { state.lastBackup = today(); commit(); toast("Backup saved. Keep it somewhere safe (Files, iCloud, email to yourself)."); };
  const file = new File([json], name, { type: "application/json" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: "Guitar progress backup" }); done(); return; }
    catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  a.download = name; a.click();
  done();
}

function renderProfile() {
  const p = state.profile || PROFILE;
  $("#profile-box").innerHTML = `<h2 class="display sm">The artist</h2>
    <p class="small">${esc(p.level)} · ${esc(p.guitar)} · ${esc(p.style)}<br>Built around <b>${p.artists.map(esc).join(", ")}</b>.</p>`;
  $("#data-where").innerHTML = backend === "server"
    ? `Everything is saved in <code>data/progress.json</code> in the app folder, with a daily backup in <code>data/backups/</code>.`
    : `Your progress is saved <b>on this device only</b>. Back it up now and then: Export sends a file to Files, iCloud, AirDrop or email. Last backup: <b>${state.lastBackup ? fmtDate(state.lastBackup) : "never"}</b>.`;
}

/* ---------- Metronome (Web Audio) ---------- */

const M = { bpm: 80, on: false, ctx: null, next: 0, beat: 0, timer: null };

function audio() {
  // iOS 17+: play the metronome even when the ringer switch is on silent
  // (but leave it alone while the mic is on, or iOS mutes the mic)
  try { if (navigator.audioSession && !MIC.on && !MIC.starting) navigator.audioSession.type = "playback"; } catch {}
  M.ctx = M.ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (M.ctx.state === "suspended") M.ctx.resume();
  return M.ctx;
}

function tone(time, freq, vol, len) {
  const o = M.ctx.createOscillator(), g = M.ctx.createGain();
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(vol, time + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, time + len);
  o.connect(g).connect(M.ctx.destination);
  o.start(time); o.stop(time + len + 0.02);
}

function mSchedule() {
  while (M.next < M.ctx.currentTime + 0.12) {
    const b = M.beat;
    tone(M.next, b === 0 ? 1600 : 1050, b === 0 ? 0.6 : 0.35, 0.05);
    setTimeout(() => lightBeat(b), Math.max(0, (M.next - M.ctx.currentTime) * 1000));
    M.next += 60 / M.bpm;
    M.beat = (M.beat + 1) % 4;
  }
}

function lightBeat(b) {
  document.querySelectorAll("#m-beats i").forEach((el, i) => el.classList.toggle("on", i === b));
}

function mStart() { audio(); M.on = true; M.beat = 0; M.next = M.ctx.currentTime + 0.06; clearInterval(M.timer); M.timer = setInterval(mSchedule, 25); mUpdate(); }
function mStop() { M.on = false; clearInterval(M.timer); lightBeat(-1); mUpdate(); }
function mSet(bpm) { M.bpm = Math.max(30, Math.min(260, Math.round(bpm))); mUpdate(); }
function mUpdate() {
  if (!$("#m-bpm")) return;
  $("#m-bpm").textContent = M.bpm;
  $("#m-range").value = M.bpm;
  $("#m-toggle").textContent = M.on ? "■ Stop" : "▶ Start";
}

function chime() {
  try { audio(); const t = M.ctx.currentTime + 0.02; tone(t, 880, 0.4, 0.25); tone(t + 0.18, 1320, 0.4, 0.35); } catch {}
}

/* ---------- The show: guided session player ---------- */

const PLAYER_KEY = "bpg-player";
const CROWD = [["😫", "Tough crowd"], ["😐", "Meh"], ["🙂", "Good night"], ["🔥", "Sold out"]];
let P = (() => { try { return JSON.parse(localStorage.getItem(PLAYER_KEY)); } catch { return null; } })();
let playerTick = null;
let wakeLock = null;

// Keep the phone screen on during a show
async function keepAwake(on) {
  try {
    if (on && !wakeLock && "wakeLock" in navigator && !$("#player").hidden) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch {}
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") keepAwake(true);
  else if (MIC.on) { if (G.phase !== "idle") quitGame(); else micStop(); } // never leave the mic on in the background
});

function savePlayer() { try { P ? localStorage.setItem(PLAYER_KEY, JSON.stringify(P)) : localStorage.removeItem(PLAYER_KEY); } catch {} }
const showMs = () => (P ? P.acc + (P.start ? Date.now() - P.start : 0) : 0);
const stepMs = () => (P ? P.stepAcc + (P.start ? Date.now() - P.stepStart : 0) : 0);

function openPlayer() {
  const cur = currentLesson();
  if (!cur) return;
  if (!P || P.lessonId !== cur.lesson.id || P.mode === "result") {
    const n = Date.now();
    P = { lessonId: cur.lesson.id, mode: "show", step: 0, acc: 0, start: n, stepAcc: 0, stepStart: n, chimed: {}, mood: "", notes: "" };
  } else if (P.mode === "show" && !P.start) {
    P.start = P.stepStart = Date.now();
  }
  savePlayer();
  $("#player").hidden = false;
  document.body.style.overflow = "hidden";
  renderPlayer();
  clearInterval(playerTick);
  playerTick = setInterval(tickPlayer, 250);
  keepAwake(true);
}

function hidePlayer() {
  $("#player").hidden = true;
  document.body.style.overflow = "";
  clearInterval(playerTick);
  mStop();
  micStop();
  keepAwake(false);
  document.title = "Bonsen Plays Guitar";
  render();
}

function pauseShow() {
  if (!P?.start) return;
  const n = Date.now();
  P.acc += n - P.start; P.stepAcc += n - P.stepStart; P.start = null;
}

function goStep(i) {
  const l = lessonById(P.lessonId);
  if (i >= l.steps.length) { toWrap(); return; }
  if (P.start) { P.acc += Date.now() - P.start; P.start = Date.now(); }
  P.step = Math.max(0, i); P.stepAcc = 0; P.stepStart = Date.now();
  savePlayer(); renderPlayer();
}

function toWrap() {
  pauseShow();
  mStop();
  P.mode = "wrap";
  P.minutes = Math.max(1, Math.round(showMs() / 60000));
  savePlayer(); renderPlayer();
}

function renderPlayer() {
  const l = lessonById(P.lessonId);
  const phaseIndex = PHASES.findIndex((p) => p.id === l.phase);
  const venue = VENUES[phaseIndex];
  const el = $("#player-inner");
  if (P.mode !== "show") document.title = "Bonsen Plays Guitar";

  if (P.mode === "result") {
    el.innerHTML = `<div class="wrap result">
      <div class="small">${P.pass ? "DATE PASSED" : "SHOW LOGGED"} · ${esc(P.title)}</div>
      <div class="xp-stamp">+${P.gained} XP</div>
      <ul>
        <li>🔥 Streak: <b>${plural(C.streak, "night")}</b></li>
        <li>⏱ ${P.minutes} minutes on stage</li>
        <li>${P.pass ? (P.next ? `Next date: <b>${esc(P.next)}</b>` : "<b>That was the last date of the tour!</b>") : "Same date tomorrow. Every night gets you closer to passing."}</li>
      </ul>
      <button class="btn red" data-p="close">Back to the poster</button></div>`;
    return;
  }

  if (P.mode === "wrap") {
    el.innerHTML = `<div class="wrap">
      <h1>That's a <span>wrap.</span></h1>
      <p class="small">${esc(venue)} · ${esc(l.title)}</p>
      <label>Minutes played <input type="number" id="w-min" min="1" max="600" value="${P.minutes}"></label>
      <label>How was the crowd?</label>
      <div class="crowd">${CROWD.map(([e, t]) => `<button data-crowd="${e}" class="${P.mood === e ? "on" : ""}"><span>${e}</span>${t}</button>`).join("")}</div>
      <label>Notes for next time <textarea id="w-notes" rows="2" placeholder="e.g. G→C still slow, 24 changes a minute">${esc(P.notes)}</textarea></label>
      <div class="test-box">
        <div class="display">Tonight's test</div>
        <p style="font-size:1.15rem">${esc(l.doneWhen)}</p>
        <p class="small" style="color:#bdb4a6">Be honest. Passing too early just makes the next dates harder.</p>
        <div class="test-btns">
          <button class="btn red" data-wrap="pass">✓ Nailed it · next date</button>
          <button class="btn" data-wrap="again">Not yet · same show tomorrow</button>
        </div>
      </div>
      <p class="small" style="margin-top:22px;color:#8f877c">
        <button class="linkish" data-p="back">← Back on stage</button> &nbsp;·&nbsp; <button class="linkish" data-wrap="discard">Throw this show away</button></p>
    </div>`;
    return;
  }

  const n = l.steps.length;
  const [mins, text] = l.steps[P.step];
  const song = l.song && songById(l.song);
  const vids = [...lessonVideos(l).slice(0, 2), ...(song?.lesson ? [song.lesson] : [])];
  el.innerHTML = `
    <div class="show-top">
      <div><div class="venue">@ ${esc(venue)} · live tonight</div><div class="title">${esc(l.title)}</div></div>
      <div class="show-clock"><span id="p-total">00:00</span>
        <button class="btn tiny" data-p="leave">✕ Leave stage</button>
        <button class="btn tiny red" data-p="end">End show</button></div>
    </div>
    <div class="show-grid">
      <div>
        <div class="now-label">SONG ${P.step + 1} OF ${n} · ${stepLabel(l.steps, P.step).toUpperCase()}</div>
        <div class="now-text">${esc(text)}</div>
        <div class="countdown" id="p-count">${pad(mins)}:00</div>
        <div class="count-note" id="p-note"></div>
        <div class="step-bar"><div id="p-bar"></div></div>
        <div class="show-ctrl">
          <button class="btn" data-p="prev" ${P.step === 0 ? "disabled" : ""}>← Back</button>
          <button class="btn" data-p="pause" id="p-pause">⏸ Pause</button>
          <button class="btn red" data-p="next">${P.step === n - 1 ? "Finish the show →" : "Next song →"}</button>
        </div>
        <div class="show-setlist">${l.steps.map(([m, t], j) => `<button data-p="goto" data-i="${j}" class="${j < P.step ? "done" : j === P.step ? "now" : ""}">
          <b>${j + 1}. ${stepLabel(l.steps, j)} · ${m}′</b>${esc(t.length > 64 ? t.slice(0, 62) + "…" : t)}</button>`).join("")}</div>
      </div>
      <div>
        <div class="metro">
          <div class="metro-top"><span class="display">Metronome</span><span class="hint" id="m-hint"></span></div>
          <div class="bpm"><span id="m-bpm">${M.bpm}</span><small>BPM</small></div>
          <div class="beats" id="m-beats"><i></i><i></i><i></i><i></i></div>
          <div class="metro-ctl">
            <button class="btn red" data-m="toggle" id="m-toggle">▶ Start</button>
            <button class="btn" data-m="-5">−5</button><button class="btn" data-m="-1">−1</button>
            <button class="btn" data-m="1">+1</button><button class="btn" data-m="5">+5</button>
          </div>
          <input type="range" id="m-range" min="30" max="260" value="${M.bpm}">
          <div class="hint">Space = pause show · M = metronome · → = next song</div>
        </div>
        ${l.vocal || /Vocal/.test(stepLabel(l.steps, P.step)) ? `<div class="metro">
          <div class="metro-top"><span class="display">Voice tuner</span><button class="btn tiny" data-mic>${MIC.on ? "■ Mic off" : "🎤 Mic on"}</button></div>
          <div class="pg-note" data-vt-note>–</div>
          <div class="meter fine"><div class="zone"></div><div class="needle off" data-vt-needle></div></div>
          <div class="hint">Sing or hum. It shows your nearest note, and the needle centres when you're spot on.</div></div>` : ""}
        ${vids.length ? `<h4>WATCH</h4><div class="vids">${vids.map(videoHTML).join("")}</div>` : ""}
        <div class="to-pass"><b>TO PASS:</b>${esc(l.doneWhen)}</div>
      </div>
    </div>`;

  // Set the metronome from the step text ("at 70 BPM", "60–70 BPM")
  const m = text.match(/(\d{2,3})(?:\s*[–-]\s*\d{2,3})?\s*BPM/i);
  if (m && !M.on) { mSet(Number(m[1])); $("#m-hint").textContent = "set from this step"; }
  mUpdate();
  tickPlayer();
}

function tickPlayer() {
  if (!P || P.mode !== "show" || !$("#p-count")) return;
  const l = lessonById(P.lessonId);
  const planned = l.steps[P.step][0] * 60000;
  const left = planned - stepMs();
  $("#p-total").textContent = fmtClock(showMs());
  $("#p-count").textContent = left >= 0 ? fmtClock(left + 999) : `+${fmtClock(-left)}`;
  $("#p-count").classList.toggle("over", left < 0);
  $("#p-bar").style.width = `${Math.min(100, (stepMs() / planned) * 100)}%`;
  $("#p-pause").textContent = P.start ? "⏸ Pause" : "▶ Resume";
  $("#p-note").textContent = !P.start ? "Paused. Take a breather." : left < 0 ? (P.step === l.steps.length - 1 ? "Time's up. Finish the show when you're ready." : "Time's up. Next song when you're ready.") : "";
  if (left < 0 && P.start && !P.chimed[P.step]) { P.chimed[P.step] = true; savePlayer(); chime(); }
  document.title = `${P.start ? "▶" : "⏸"} ${fmtClock(showMs())} · Bonsen Plays Guitar`;
}

function finishShow(pass) {
  const l = lessonById(P.lessonId);
  const minutes = Math.max(1, Math.round(Number($("#w-min").value) || P.minutes));
  const before = C.xp;
  state.sessions.push({
    id: uid(), date: today(), minutes, categories: l.cats || [], mood: P.mood || "",
    notes: ($("#w-notes").value || "").trim(), createdAt: Date.now(), lessonId: l.id,
  });
  if (pass) markLessonDone(l.id);
  commit();
  P = { mode: "result", lessonId: l.id, pass, title: l.title, minutes, gained: C.xp - before, next: currentLesson()?.lesson.title };
  savePlayer();
  renderPlayer();
  confetti();
}

/* ---------- Voice: mic, pitch detection, pitch game ---------- */

const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const noteName = (midi) => NOTE_NAMES[((Math.round(midi) % 12) + 12) % 12];
const noteOctave = (midi) => Math.floor(Math.round(midi) / 12) - 1;
// Distance to the target in cents, ignoring octaves (any octave counts)
const centsOff = (midi, target) => { const d = (midi - target) * 100; return ((d % 1200) + 1800) % 1200 - 600; };
const IN_ZONE = 30;      // cents either side that count as "in tune"
const HOLD_MS = 1000;    // how long to hold the note
const NOTE_TIMEOUT = 15000;
const ROUND = 8;

const MIC = { stream: null, an: null, buf: null, raf: 0, on: false, starting: false, hist: [], cur: null, last: 0 };

// YIN pitch detection: returns frequency in Hz, or null for silence / noise
function detectPitch(buf, sr) {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  if (Math.sqrt(rms / buf.length) < 0.01) return null;
  const tauMin = Math.floor(sr / 1100), tauMax = Math.min(Math.floor(sr / 70), buf.length >> 1);
  const W = buf.length - tauMax;
  const c = new Float32Array(tauMax + 1);
  let running = 0;
  c[0] = 1;
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < W; i++) { const x = buf[i] - buf[i + tau]; sum += x * x; }
    running += sum;
    c[tau] = running ? (sum * tau) / running : 1;
  }
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if (c[t] < 0.15) { while (t + 1 <= tauMax && c[t + 1] < c[t]) t++; tau = t; break; }
  }
  if (tau < 1) return null;
  const x0 = c[tau - 1], x1 = c[tau], x2 = tau + 1 <= tauMax ? c[tau + 1] : c[tau];
  const denom = x0 + x2 - 2 * x1;
  return sr / (denom ? tau + (x0 - x2) / (2 * denom) : tau);
}

async function micStart() {
  if (MIC.on || MIC.starting) return MIC.on;
  MIC.starting = true;
  try { if (navigator.audioSession) navigator.audioSession.type = "play-and-record"; } catch {}
  const ctx = audio();
  try {
    MIC.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  } catch {
    MIC.starting = false;
    toast("🎤 Couldn't use the microphone. Allow mic access for this site (on iPhone: Settings → Apps → Safari → Microphone), then try again.", 8000);
    return false;
  }
  const src = ctx.createMediaStreamSource(MIC.stream);
  MIC.an = ctx.createAnalyser();
  MIC.an.fftSize = 2048;
  src.connect(MIC.an); // analyser only: never to the speakers, so no feedback
  MIC.buf = new Float32Array(MIC.an.fftSize);
  MIC.on = true; MIC.starting = false; MIC.last = performance.now();
  MIC.raf = requestAnimationFrame(micLoop);
  micButtons();
  return true;
}

function micStop() {
  if (!MIC.on) return;
  cancelAnimationFrame(MIC.raf);
  MIC.stream.getTracks().forEach((t) => t.stop());
  MIC.on = false; MIC.cur = null; MIC.hist = [];
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}
  tunerFrame();
  micButtons();
}

function micLoop(t) {
  const dt = Math.min(100, t - MIC.last);
  MIC.last = t;
  MIC.an.getFloatTimeDomainData(MIC.buf);
  const f = detectPitch(MIC.buf, M.ctx.sampleRate);
  if (f) {
    MIC.hist.push(69 + 12 * Math.log2(f / 440));
    if (MIC.hist.length > 5) MIC.hist.shift();
    MIC.cur = [...MIC.hist].sort((a, b) => a - b)[MIC.hist.length >> 1]; // median smooths out glitches
  } else { MIC.hist = []; MIC.cur = null; }
  tunerFrame();
  gameFrame(dt);
  MIC.raf = requestAnimationFrame(micLoop);
}

function micButtons() {
  document.querySelectorAll("[data-mic]").forEach((b) => { b.textContent = MIC.on ? "■ Mic off" : "🎤 Mic on"; });
}

// Free voice tuner: any element with data-vt-note / data-vt-needle shows the nearest note
function tunerFrame() {
  const notes = document.querySelectorAll("[data-vt-note]"), needles = document.querySelectorAll("[data-vt-needle]");
  if (!notes.length && !needles.length) return;
  const m = MIC.cur;
  const cents = m == null ? 0 : (m - Math.round(m)) * 100;
  notes.forEach((el) => { el.innerHTML = m == null ? (MIC.on ? "…" : "–") : `${noteName(m)}<sub>${noteOctave(m)}</sub>`; });
  needles.forEach((el) => {
    el.style.left = `${50 + cents}%`;
    el.classList.toggle("ok", m != null && Math.abs(cents) <= IN_ZONE);
    el.classList.toggle("off", m == null);
  });
}

// A plucked-string reference note (Karplus-Strong), so it sounds like a guitar, even on a phone speaker
function pluck(midi, dur = 1.6) {
  const ctx = audio();
  const sr = ctx.sampleRate, n = Math.floor(sr * dur);
  const buffer = ctx.createBuffer(1, n, sr), d = buffer.getChannelData(0);
  const period = Math.max(2, Math.round(sr / (440 * Math.pow(2, (midi - 69) / 12))));
  const ring = new Float32Array(period);
  for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
  for (let i = 0, idx = 0; i < n; i++) {
    const next = (idx + 1) % period;
    d[i] = ring[idx];
    ring[idx] = 0.997 * 0.5 * (ring[idx] + ring[next]);
    idx = next;
  }
  const src = ctx.createBufferSource(), g = ctx.createGain();
  src.buffer = buffer; g.gain.value = 0.55;
  src.connect(g).connect(ctx.destination);
  src.start();
  return dur * 1000;
}

const PITCH_MODES = [
  { id: "strings", name: "Open strings", desc: "Match A, D, G and B, the notes from your guitar. This is the Find Your Voice test.", calibrate: false },
  { id: "voice", name: "Around your voice", desc: "Notes close to where your voice sits comfortably.", calibrate: true, spread: 4 },
  { id: "wide", name: "Wider range", desc: "Bigger jumps, low and high. For when the easy ones feel easy.", calibrate: true, spread: 7 },
];

let G = { phase: "idle" };

function makeTargets(mode) {
  const out = [];
  for (let i = 0; i < ROUND; i++) {
    let t;
    do {
      t = mode.id === "strings"
        ? [45, 50, 55, 59][(Math.random() * 4) | 0]
        : state.voice.comfy + Math.round((Math.random() * 2 - 1) * mode.spread);
    } while (out.length && t === out[out.length - 1]);
    out.push(t);
  }
  return out;
}

async function startGame(modeId) {
  const mode = PITCH_MODES.find((m) => m.id === modeId);
  if (!(await micStart())) return;
  if (mode.calibrate && !state.voice?.comfy) { G = { phase: "calibrate", mode, stable: 0 }; renderGame(); return; }
  G = { phase: "play", mode, targets: makeTargets(mode), i: 0, hits: 0, hold: 0, log: [], results: [] };
  renderGame();
  playTarget(400);
}

function playTarget(delay = 0) {
  G.noteStart = performance.now() + delay;
  G.listenAfter = G.noteStart + 1500; // don't let the mic hear the reference note
  G.hold = 0;
  setTimeout(() => { if (G.phase === "play") pluck(G.targets[G.i]); }, delay);
}

function gameFrame(dt) {
  if (G.phase === "calibrate") {
    const m = MIC.cur;
    if (m != null && G.ref != null && Math.abs(m - G.ref) < 0.6) G.stable += dt; else { G.stable = 0; G.ref = m; }
    const bar = $("#pg-hold");
    if (bar) bar.style.width = `${Math.min(100, (G.stable / 1500) * 100)}%`;
    if (G.stable >= 1500) {
      state.voice = { comfy: Math.round(G.ref) };
      save();
      toast(`Your comfy note is <b>${noteName(G.ref)}${noteOctave(G.ref)}</b>. Targets will sit around it.`);
      startGame(G.mode.id);
    }
    return;
  }
  if (G.phase !== "play") return;
  const now = performance.now();
  const target = G.targets[G.i];
  const listening = now >= G.listenAfter;
  const m = MIC.cur;
  let cents = null;
  if (listening && m != null) {
    cents = centsOff(m, target);
    G.log.push(cents);
    if (Math.abs(cents) <= IN_ZONE) G.hold += dt; else G.hold = Math.max(0, G.hold - dt * 0.5);
  }
  const needle = $("#pg-needle"), hint = $("#pg-hint"), hold = $("#pg-hold"), you = $("#pg-you");
  if (needle) {
    needle.style.left = `${50 + Math.max(-50, Math.min(50, (cents ?? 0) / 2))}%`;
    needle.classList.toggle("ok", cents != null && Math.abs(cents) <= IN_ZONE);
    needle.classList.toggle("off", cents == null);
  }
  if (hold) hold.style.width = `${Math.min(100, (G.hold / HOLD_MS) * 100)}%`;
  if (you) you.innerHTML = m == null ? "" : `you: ${noteName(m)}<sub>${noteOctave(m)}</sub>`;
  if (hint) {
    hint.textContent = !listening ? "Listen…" : cents == null ? "Sing it: 'ah' or a hum"
      : Math.abs(cents) <= IN_ZONE ? "That's it. Hold it!" : cents < 0 ? "Too low ↑ sing higher" : "Too high ↓ sing lower";
    hint.className = `pg-hint ${cents != null && Math.abs(cents) <= IN_ZONE ? "ok" : ""}`;
  }

  if (G.hold >= HOLD_MS) finishNote(true);
  else if (now - G.noteStart > NOTE_TIMEOUT) finishNote(false);
}

function finishNote(hit) {
  const recent = G.log.slice(-40);
  G.results.push({ hit, bias: recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0 });
  G.log = [];
  if (hit) { G.hits++; chime(); }
  G.i++;
  if (G.i >= ROUND) { endGame(); return; }
  renderGame();
  playTarget(hit ? 700 : 300);
}

function endGame() {
  const before = C.xp;
  const misses = G.results.filter((r) => !r.hit);
  const all = G.results.map((r) => r.bias);
  const bias = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
  state.pitch.push({ date: today(), mode: G.mode.id, hits: G.hits, total: ROUND, bias: Math.round(bias) });
  G = { ...G, phase: "result", bias, misses: misses.length };
  commit();
  G.gained = C.xp - before;
  renderGame();
  if (G.hits >= 6) confetti();
}

function quitGame() { G = { phase: "idle" }; micStop(); renderGame(); }

function renderGame() {
  const el = $("#pg-game");
  if (!el) return;
  if (G.phase === "idle") {
    el.innerHTML = `<div class="pg-idle">
      <div><div class="display sm" style="margin:0">Pick a game above</div>
      <p class="small" style="margin:6px 0 0">Or just sing and watch the needle: it shows your nearest note.</p></div>
      <div class="pg-free"><div class="pg-note" data-vt-note>–</div>
        <div class="meter fine"><div class="zone"></div><div class="needle off" data-vt-needle></div></div>
        <button class="btn tiny" data-mic>${MIC.on ? "■ Mic off" : "🎤 Mic on"}</button></div></div>`;
    tunerFrame();
    return;
  }
  if (G.phase === "calibrate") {
    el.innerHTML = `<div class="pg-play"><div class="pg-top"><span class="display sm" style="margin:0">Find your comfy note</span><button class="btn tiny" data-pg="quit">✕</button></div>
      <p style="font-size:1.15rem">Sing an easy, comfortable "ah" (not high, not low, just your natural speaking-ish note) and hold it steady.</p>
      <div class="pg-note" data-vt-note>…</div>
      <div class="hold"><div id="pg-hold"></div></div></div>`;
    tunerFrame();
    return;
  }
  if (G.phase === "play") {
    const t = G.targets[G.i];
    el.innerHTML = `<div class="pg-play">
      <div class="pg-top"><span class="small">${esc(G.mode.name).toUpperCase()} · NOTE ${G.i + 1} OF ${ROUND}</span>
        <span class="pg-score">${tallySVG(G.hits)}<b>${G.hits}</b></span>
        <button class="btn tiny" data-pg="quit">✕ Quit</button></div>
      <div class="pg-target"><span class="small">SING</span><div class="pg-big">${noteName(t)}</div>
        <button class="btn tiny" data-pg="again">▶ Hear it again</button></div>
      <div class="meter big"><div class="zone"></div><div class="needle off" id="pg-needle"></div>
        <span class="lbl l">LOW</span><span class="lbl r">HIGH</span></div>
      <div class="pg-hint" id="pg-hint">Listen…</div>
      <div class="hold"><div id="pg-hold"></div></div>
      <div class="pg-you small" id="pg-you"></div>
      <div class="pg-dots">${Array.from({ length: ROUND }, (_, i) => `<i class="${i < G.results.length ? (G.results[i].hit ? "hit" : "miss") : i === G.i ? "now" : ""}"></i>`).join("")}</div>
      <p class="small muted" style="margin:10px 0 0">Can't hear it? Pluck the same note on your guitar. Any octave counts.</p>
    </div>`;
    return;
  }
  // result
  const tip = G.bias < -15 ? "You tend to sing a bit <b>flat</b> (under the note). Think \"up\", lift your eyebrows, and push more breath from your belly."
    : G.bias > 15 ? "You tend to sing a bit <b>sharp</b> (over the note). Relax, don't push, and let the note settle down into place."
    : "No consistent lean either way. Your aim is good, so keep doing reps.";
  el.innerHTML = `<div class="pg-result">
    <div class="xp-stamp sm">${G.hits}/${ROUND}</div>
    <p style="font-size:1.15rem;margin:0 0 8px">${G.hits === ROUND ? "Perfect round. Tone deaf? Not you." : G.hits >= 6 ? "In tune! Your ears and voice are talking." : G.hits >= 3 ? "Getting there. This is exactly how it starts." : "Tough round, and that's normal at the start. Try sliding your voice slowly until the needle centres."}</p>
    <p class="small">${tip}</p>
    <p class="small">${G.gained > 0 ? `<b class="red">+${G.gained} XP</b>` : "XP limit reached for today (3 rounds). Practice still counts!"}</p>
    <div class="row" style="justify-content:center"><button class="btn red" data-pg-mode="${G.mode.id}">Play again</button><button class="btn" data-pg="quit">Done</button></div>
  </div>`;
  micStop();
}

function renderPitch() {
  const rounds = state.pitch || [];
  const best = (id) => Math.max(0, ...rounds.filter((r) => r.mode === id).map((r) => r.hits));
  const todayN = rounds.filter((r) => r.date === today()).length;
  $("#pg-modes").innerHTML = PITCH_MODES.map((m) => `<button class="pg-mode paper" data-pg-mode="${m.id}">
      <span class="display">${esc(m.name)}</span><span class="small">${esc(m.desc)}</span>
      <span class="small"><b>Best: ${best(m.id)}/${ROUND}</b></span></button>`).join("");
  $("#pg-today").textContent = `Today: ${todayN} round${todayN === 1 ? "" : "s"} · XP for the first 3`;
  $("#pg-comfy").innerHTML = state.voice?.comfy
    ? `Your comfy note: <b>${noteName(state.voice.comfy)}${noteOctave(state.voice.comfy)}</b> <button class="linkish" data-pg="recal">find it again</button>`
    : "We'll find your comfy note the first time you play Around your voice.";
  const recent = rounds.slice(-14);
  $("#pg-history").innerHTML = recent.length ? `<div class="bars pg-bars">${recent.map((r) =>
    `<div class="bar" title="${fmtDate(r.date)} · ${r.hits}/${r.total}"><em>${r.hits}</em><div style="height:${(r.hits / r.total) * 100}%"></div><span>${r.mode === "strings" ? "str" : r.mode === "voice" ? "voc" : "wide"}</span></div>`).join("")}</div>`
    : `<p class="empty">No rounds yet. Your first score is just a starting line.</p>`;
  if (G.phase === "idle" && !$("#pg-game").innerHTML) renderGame();
}

/* ---------- Events ---------- */

function setupChips(container, options) {
  container.innerHTML = options.map((v) => `<button type="button" class="chip" data-v="${esc(v)}">${esc(v)}</button>`).join("");
  container.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) c.classList.toggle("on"); });
}

function switchTab(name) {
  if (name !== "pitch" && (G.phase !== "idle" || MIC.on)) quitGame();
  document.querySelectorAll(".tab").forEach((s) => s.classList.toggle("active", s.id === `tab-${name}`));
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  try { localStorage.setItem("bpg-tab", name); } catch {}
  scrollTo({ top: 0 });
}

function bind() {
  $("#nav").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) switchTab(b.dataset.tab); });

  document.addEventListener("click", (e) => {
    const q = (sel) => e.target.closest(sel);
    let el;
    if ((el = q("[data-yt]"))) {
      el.outerHTML = `<div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${el.dataset.yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
      return;
    }
    if ((el = q("[data-goto]"))) { switchTab(el.dataset.goto); return; }
    if ((el = q("[data-leg]"))) {
      switchTab("tour");
      setTimeout(() => document.getElementById(`leg-${el.dataset.leg}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      return;
    }
    if (q("[data-play]")) { openPlayer(); return; }
    if ((el = q("[data-pg-mode]"))) { startGame(el.dataset.pgMode); $("#pg-game").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if ((el = q("[data-pg]"))) {
      const a = el.dataset.pg;
      if (a === "quit") quitGame();
      else if (a === "again" && G.phase === "play") { G.listenAfter = performance.now() + 1500; G.hold = 0; pluck(G.targets[G.i]); }
      else if (a === "recal") { state.voice = { comfy: null }; save(); startGame("voice"); }
      return;
    }
    if (q("[data-mic]")) { MIC.on ? micStop() : micStart(); return; }
    if ((el = q("[data-complete]"))) { completeLesson(el.dataset.complete); return; }
    if ((el = q("[data-unlock]"))) { state.path.unlocked[el.dataset.unlock] = true; commit(); return; }
    if ((el = q("[data-ladder]"))) {
      const before = C.xp;
      setLadderStatus(el.dataset.ladder, el.dataset.to);
      commit();
      if (el.dataset.to === "learned" && C.xp > before) { toast(`Crossed off: <b>${esc(songById(el.dataset.ladder).title)}</b> · +${C.xp - before} XP`); confetti(); }
      return;
    }
    if ((el = q("[data-req]"))) {
      const s = state.songs.find((x) => x.id === el.dataset.req);
      s.status = { want: "learning", learning: "learned", learned: "want" }[s.status];
      s.learnedAt = s.status === "learned" ? today() : null;
      commit(); return;
    }
    if ((el = q("[data-del-req]"))) { if (confirm("Delete this song?")) { state.songs = state.songs.filter((s) => s.id !== el.dataset.delReq); commit(); } return; }
    if ((el = q("[data-del-session]"))) { if (confirm("Delete this show from the diary?")) { state.sessions = state.sessions.filter((s) => s.id !== el.dataset.delSession); commit(); } return; }
    if ((el = q("[data-del-tempo]"))) { if (confirm("Delete this exercise and its history?")) { state.tempos = state.tempos.filter((x) => x.id !== el.dataset.delTempo); commit(); } return; }
    if (e.target.id === "quest-done") {
      const t = today();
      if (state.quests[t]) delete state.quests[t];
      else { state.quests[t] = true; toast(`Dare done! <b>+${XP.quest} XP</b>`); }
      commit(); return;
    }

    // Player controls
    if ((el = q("[data-p]"))) {
      const a = el.dataset.p;
      if (a === "pause") { if (P.start) pauseShow(); else P.start = P.stepStart = Date.now(); savePlayer(); tickPlayer(); }
      else if (a === "next") goStep(P.step + 1);
      else if (a === "prev") goStep(P.step - 1);
      else if (a === "goto") goStep(Number(el.dataset.i));
      else if (a === "end") toWrap();
      else if (a === "leave") { pauseShow(); savePlayer(); hidePlayer(); }
      else if (a === "back") { P.mode = "show"; P.start = P.stepStart = Date.now(); savePlayer(); renderPlayer(); }
      else if (a === "close") { P = null; savePlayer(); hidePlayer(); }
      return;
    }
    if ((el = q("[data-m]"))) {
      const a = el.dataset.m;
      if (a === "toggle") (M.on ? mStop : mStart)();
      else mSet(M.bpm + Number(a));
      return;
    }
    if ((el = q("[data-crowd]"))) {
      P.mood = P.mood === el.dataset.crowd ? "" : el.dataset.crowd;
      document.querySelectorAll("[data-crowd]").forEach((b) => b.classList.toggle("on", b.dataset.crowd === P.mood));
      savePlayer(); return;
    }
    if ((el = q("[data-wrap]"))) {
      const a = el.dataset.wrap;
      if (a === "discard") { if (confirm("Throw this show away without logging it?")) { P = null; savePlayer(); hidePlayer(); } }
      else finishShow(a === "pass");
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "m-range") mSet(Number(e.target.value));
    if (P && (e.target.id === "w-notes" || e.target.id === "w-min")) {
      if (e.target.id === "w-notes") P.notes = e.target.value; else P.minutes = Number(e.target.value) || P.minutes;
      savePlayer();
    }
  });

  document.addEventListener("keydown", (e) => {
    if ($("#player").hidden || P?.mode !== "show" || e.target.matches("input, textarea")) return;
    if (e.code === "Space") { e.preventDefault(); document.querySelector('[data-p="pause"]')?.click(); }
    else if (e.key === "m" || e.key === "M") (M.on ? mStop : mStart)();
    else if (e.key === "ArrowRight") goStep(P.step + 1);
    else if (e.key === "ArrowLeft" && P.step > 0) goStep(P.step - 1);
  });

  // Off-tour log
  setupChips($("#cat-chips"), CATEGORIES);
  const form = $("#log-form");
  form.date.value = today();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const minutes = Math.round(Number(form.minutes.value));
    if (!minutes) return;
    const before = C.xp;
    state.sessions.push({
      id: uid(), date: form.date.value, minutes, categories: [...$("#cat-chips").querySelectorAll(".chip.on")].map((c) => c.dataset.v),
      mood: "", notes: form.notes.value.trim(), createdAt: Date.now(),
    });
    form.minutes.value = ""; form.notes.value = "";
    form.querySelectorAll(".chip.on").forEach((c) => c.classList.remove("on"));
    commit();
    toast(`Logged ${minutes} min · <b>+${C.xp - before} XP</b>`);
  });

  $("#song-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    state.songs.push({ id: uid(), title: f.title.value.trim(), artist: f.artist.value.trim(), status: "want", learnedAt: null, addedAt: today() });
    f.title.value = ""; f.artist.value = ""; commit();
  });

  $("#tempo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const name = f.exercise.value.trim(), bpm = Math.round(Number(f.bpm.value));
    let ex = state.tempos.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (!ex) { ex = { id: uid(), name, entries: [] }; state.tempos.push(ex); }
    const prev = ex.entries.length ? Math.max(...ex.entries.map((x) => x.bpm)) : null;
    ex.entries.push({ date: today(), bpm });
    if (prev !== null && bpm > prev) toast(`New speed record: <b>${bpm} BPM</b> (+${bpm - prev}) · +${XP.tempoPR} XP`);
    f.bpm.value = ""; commit();
  });

  const sf = $("#settings-form");
  sf.name.value = state.settings.name || "";
  sf.dailyGoal.value = state.settings.dailyGoal;
  sf.weeklyDays.value = state.settings.weeklyDays;
  sf.addEventListener("submit", (e) => {
    e.preventDefault();
    state.settings = { name: sf.name.value.trim(), dailyGoal: Number(sf.dailyGoal.value) || 25, weeklyDays: Number(sf.weeklyDays.value) || 5 };
    commit(); toast("Settings saved.");
  });

  $("#export-btn").addEventListener("click", exportBackup);
  $("#import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.sessions)) throw new Error("that's not a progress file");
      if (!confirm("Replace all current progress with this file?")) return;
      state = migrate(data);
      commit(); toast("Progress imported.");
    } catch (err) { toast(`Import failed: ${esc(err.message)}`); }
    e.target.value = "";
  });

  // Keep "today" fresh if the app stays open past midnight
  let lastDay = today();
  setInterval(() => { if (today() !== lastDay) { lastDay = today(); form.date.value = lastDay; render(); } }, 60000);
}

(async function init() {
  await load();
  bind();
  try { const tab = localStorage.getItem("bpg-tab"); if (tab && $(`#tab-${tab}`)) switchTab(tab); } catch {}
  render();
  save(); // writes the initial file on first run
  if (backend === "device" && C.days >= 3) {
    const since = state.lastBackup ? (parse(today()) - parse(state.lastBackup)) / 864e5 : Infinity;
    if (since >= 14) toast(`It's been a while since your last backup. <button class="linkish" data-goto="settings">Back up in Settings →</button>`, 8000);
  }
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
