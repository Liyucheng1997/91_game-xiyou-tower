// 八十一难 · 程序化音频引擎
// 纯 Web Audio 合成：9 域各自的循环 BGM + 分层音效，无需任何音频文件。
// 对外暴露 window.JourneyAudio：{ setRegion, playTitle, resume, stop, setEnabled, duck, sfx }
window.JourneyAudio = (() => {
  'use strict';
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return { setRegion(){}, playTitle(){}, resume(){}, stop(){}, setEnabled(){}, duck(){}, sfx(){} };

  let ctx, master, comp, reverb, reverbReturn, musicBus, musicSend, sfxBus, sfxSend;
  let enabled = true;
  let timer = null;          // 前瞻调度器
  let nextStepTime = 0, step = 0, bar = 0, mel = 6, mel2 = 3;
  let current = null;        // 当前主题 key
  let theme = null;
  let musicTarget = 0.2, ducked = 1;
  const BATTLE_HIT_SRC = 'assets/audio/Sword%20Hit%201%20-%20QuickSounds.com.mp3';
  const battleHitPool = [];
  let battleHitIndex = 0;
  const LOOKAHEAD = 0.12, INTERVAL = 25;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const rand = () => Math.random();

  // ---------- 音频图 ----------
  function makeImpulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return buf;
  }
  function buildGraph() {
    master = ctx.createGain(); master.gain.value = 0.85;
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 24; comp.ratio.value = 3.2; comp.attack.value = 0.004; comp.release.value = 0.25;
    master.connect(comp).connect(ctx.destination);
    reverb = ctx.createConvolver(); reverb.buffer = makeImpulse(2.8, 3.0);
    reverbReturn = ctx.createGain(); reverbReturn.gain.value = 0.9; reverb.connect(reverbReturn).connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
    musicSend = ctx.createGain(); musicSend.gain.value = 0.3; musicBus.connect(musicSend).connect(reverb);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.6; sfxBus.connect(master);
    sfxSend = ctx.createGain(); sfxSend.gain.value = 0.14; sfxBus.connect(sfxSend).connect(reverb);
  }
  function ensureCtx() { if (!ctx) { ctx = new Ctx(); buildGraph(); } return ctx; }

  // ---------- 基础发声 ----------
  function tone(t, freq, dur, o = {}) {
    const osc = ctx.createOscillator(); osc.type = o.type || 'sine'; osc.frequency.value = freq; if (o.detune) osc.detune.value = o.detune;
    const amp = ctx.createGain(); amp.gain.value = 0; let node = osc;
    if (o.cutoff) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.cutoff; if (o.q) f.Q.value = o.q; osc.connect(f); node = f; }
    node.connect(amp).connect(o.bus || musicBus);
    const g = o.gain == null ? 0.2 : o.gain, a = o.attack == null ? 0.008 : o.attack, r = o.release == null ? Math.min(0.5, dur * 0.6) : o.release;
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, g), t + a);
    amp.gain.setValueAtTime(Math.max(0.0002, g), t + Math.max(a, dur - r));
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t); osc.stop(t + dur + 0.03);
  }
  function bell(t, freq, dur, gain, bus) {
    [[1, 1], [2.0, 0.5], [3.01, 0.28], [4.7, 0.16]].forEach(([m, a]) => tone(t, freq * m, dur, { type: 'sine', gain: gain * a, attack: 0.004, release: dur * 0.85, bus: bus || musicBus }));
  }
  function noiseBurst(t, dur, o = {}) {
    const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const amp = ctx.createGain(); let node = src;
    if (o.cutoff) { const f = ctx.createBiquadFilter(); f.type = o.filterType || 'lowpass'; f.frequency.value = o.cutoff; if (o.q) f.Q.value = o.q; src.connect(f); node = f; }
    node.connect(amp).connect(o.bus || sfxBus);
    const g = o.gain == null ? 0.2 : o.gain;
    amp.gain.setValueAtTime(g, t); amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.start(t); src.stop(t + dur + 0.02);
  }
  function kick(t, o = {}) {
    const osc = ctx.createOscillator(); osc.type = 'sine'; const amp = ctx.createGain();
    osc.connect(amp).connect(o.bus || musicBus);
    const f0 = o.freq || 140, f1 = o.freq2 || 45, g = o.gain == null ? 0.5 : o.gain, dur = o.dur || 0.3;
    osc.frequency.setValueAtTime(f0, t); osc.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6);
    amp.gain.setValueAtTime(g, t); amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t); osc.stop(t + dur + 0.02);
  }
  function ensureBattleHitPool() {
    if (battleHitPool.length) return;
    for (let i = 0; i < 4; i++) {
      const sample = new Audio(BATTLE_HIT_SRC);
      sample.preload = 'auto'; sample.volume = 0.78;
      battleHitPool.push(sample);
    }
  }
  function playBattleHit() {
    ensureBattleHitPool();
    const sample = battleHitPool[battleHitIndex++ % battleHitPool.length];
    sample.pause(); sample.currentTime = 0;
    const playback = sample.play();
    if (playback?.catch) playback.catch(() => {});
  }

  // ---------- 九域主题 ----------
  // scale：相对根音的半音偏移；lead.oct：旋律抬高的八度；steps：16 分音符里允许触发的位置。
  const PENT_MIN = [0, 3, 5, 7, 10], PENT_MAJ = [0, 2, 4, 7, 9];
  const DARK = [0, 1, 5, 7, 8], EXOTIC = [0, 2, 4, 6, 8, 10];
  const T = (o) => o;
  const THEMES = {
    title: T({ root: 57, scale: PENT_MIN, bpm: 64, reverb: 0.5,
      lead: { wave: 'sine', gain: 0.16, oct: 1, cutoff: 2600, steps: [0, 6, 10, 13], bell: true },
      pad: { wave: 'triangle', gain: 0.05, every: 2 }, bass: { wave: 'sine', gain: 0.16, steps: [0] },
      kick: [], snare: [], hat: [] }),
    r0: T({ root: 57, scale: PENT_MIN, bpm: 84, reverb: 0.34,           // 双叉岭·幽林初探
      lead: { wave: 'triangle', gain: 0.15, oct: 1, cutoff: 2400, steps: [0, 3, 6, 8, 11, 14] },
      pad: { wave: 'sawtooth', gain: 0.035, every: 2 }, bass: { wave: 'sine', gain: 0.2, steps: [0, 8] },
      kick: [0, 8], snare: [], hat: [4, 12], woodblock: true }),
    r1: T({ root: 55, scale: PENT_MIN, bpm: 70, reverb: 0.52,           // 黑风山·禅院夜
      lead: { wave: 'sine', gain: 0.14, oct: 1, cutoff: 2000, steps: [0, 6, 10, 14], bell: true },
      pad: { wave: 'triangle', gain: 0.05, every: 2 }, bass: { wave: 'sine', gain: 0.18, steps: [0] },
      kick: [0], snare: [], hat: [], templeBell: true }),
    r2: T({ root: 53, scale: PENT_MIN, bpm: 98, reverb: 0.3,            // 黄风岭·大漠苍凉
      lead: { wave: 'sawtooth', gain: 0.12, oct: 1, cutoff: 2800, steps: [0, 2, 4, 7, 8, 11, 13] },
      pad: { wave: 'square', gain: 0.03, every: 1 }, bass: { wave: 'triangle', gain: 0.2, steps: [0, 4, 8, 12] },
      kick: [0, 8], snare: [4, 12], hat: [2, 6, 10, 14] }),
    r3: T({ root: 50, scale: PENT_MIN, bpm: 66, reverb: 0.6,            // 流沙河·水府幽寒
      lead: { wave: 'sine', gain: 0.13, oct: 2, cutoff: 1800, steps: [0, 7, 12], bell: true },
      pad: { wave: 'triangle', gain: 0.05, every: 2 }, bass: { wave: 'sine', gain: 0.2, steps: [0] },
      kick: [0], snare: [], hat: [8] }),
    r4: T({ root: 48, scale: DARK, bpm: 122, reverb: 0.24,              // 火云洞·烈火嗔怒
      lead: { wave: 'sawtooth', gain: 0.13, oct: 1, cutoff: 3200, steps: [0, 2, 4, 6, 8, 10, 12, 14] },
      pad: { wave: 'sawtooth', gain: 0.035, every: 1 }, bass: { wave: 'sawtooth', gain: 0.18, steps: [0, 4, 8, 12], detune: 6 },
      kick: [0, 3, 6, 8, 11, 14], snare: [4, 12], hat: [2, 6, 10, 14] }),
    r5: T({ root: 60, scale: PENT_MAJ, bpm: 88, reverb: 0.44,           // 女儿国·柔情
      lead: { wave: 'triangle', gain: 0.15, oct: 1, cutoff: 2600, steps: [0, 4, 7, 10, 14] },
      pad: { wave: 'sine', gain: 0.05, every: 2 }, bass: { wave: 'sine', gain: 0.17, steps: [0, 8] },
      kick: [0, 8], snare: [], hat: [4, 12] }),
    r6: T({ root: 45, scale: DARK, bpm: 74, reverb: 0.42,               // 狮驼岭·绝望黑暗
      lead: { wave: 'sawtooth', gain: 0.12, oct: 1, cutoff: 1600, steps: [0, 7, 12], detune: 8 },
      pad: { wave: 'sawtooth', gain: 0.045, every: 1 }, bass: { wave: 'sawtooth', gain: 0.22, steps: [0, 10], detune: 10 },
      kick: [0, 10], snare: [], hat: [], taiko: true }),
    r7: T({ root: 59, scale: EXOTIC, bpm: 106, reverb: 0.5,             // 盘丝洞·诡谲
      lead: { wave: 'square', gain: 0.1, oct: 1, cutoff: 3000, steps: [0, 2, 3, 6, 9, 11, 14] },
      pad: { wave: 'triangle', gain: 0.035, every: 1 }, bass: { wave: 'triangle', gain: 0.18, steps: [0, 8] },
      kick: [0, 8], snare: [12], hat: [1, 3, 5, 7, 9, 11, 13, 15] }),
    r8: T({ root: 64, scale: PENT_MAJ, bpm: 60, reverb: 0.72,           // 灵山·庄严梵音
      lead: { wave: 'sine', gain: 0.16, oct: 1, cutoff: 3000, steps: [0, 5, 9, 13], bell: true },
      pad: { wave: 'sine', gain: 0.06, every: 2 }, bass: { wave: 'sine', gain: 0.16, steps: [0] },
      kick: [0], snare: [], hat: [], gong: true })
  };

  // ---------- 序列器 ----------
  function degToFreq(scale, root, octShift, n) {
    const L = scale.length, oct = Math.floor(n / L), idx = ((n % L) + L) % L;
    return mtof(root + 12 * (octShift + oct) + scale[idx]);
  }
  function walk(cur, range) { const move = [-2, -1, -1, 0, 1, 1, 2][Math.floor(rand() * 7)]; let n = cur + move; if (n < 0) n = 1; if (n > range) n = range - 2; return n; }
  function scheduleStep(t) {
    if (!theme) return;
    const stepDur = (60 / theme.bpm) / 4, L = theme.scale.length;
    // 低音
    if (theme.bass.steps.includes(step)) {
      const isFifth = step !== 0, deg = isFifth ? 3 : 0;
      tone(t, degToFreq(theme.scale, theme.root, -1, deg), stepDur * (theme.bass.steps.length > 2 ? 1.6 : 3.2),
        { type: theme.bass.wave, gain: theme.bass.gain, cutoff: 900, detune: theme.bass.detune || 0 });
    }
    // 铺底和弦（整小节，按 every 小节刷新）
    if (step === 0 && bar % (theme.pad.every || 1) === 0) {
      const barDur = stepDur * 16;
      [0, 2, 4].forEach((d, i) => tone(t, degToFreq(theme.scale, theme.root, 0, d), barDur,
        { type: theme.pad.wave, gain: theme.pad.gain * (i === 0 ? 1 : 0.8), attack: 0.6, release: barDur * 0.7, cutoff: 1500 }));
    }
    // 旋律
    if (theme.lead.steps.includes(step) && rand() > 0.12) {
      mel = walk(mel, L * 2 + 1);
      const f = degToFreq(theme.scale, theme.root, theme.lead.oct, mel), dur = stepDur * (1.4 + rand());
      if (theme.lead.bell) bell(t, f, dur * 1.6, theme.lead.gain);
      else tone(t, f, dur, { type: theme.lead.wave, gain: theme.lead.gain, cutoff: theme.lead.cutoff, detune: theme.lead.detune || 0, release: dur * 0.6 });
      if (rand() > 0.6) { mel2 = walk(mel2, L * 2); tone(t + stepDur * 0.5, degToFreq(theme.scale, theme.root, theme.lead.oct, mel2), dur * 0.6, { type: theme.lead.wave, gain: theme.lead.gain * 0.5, cutoff: theme.lead.cutoff }); }
    }
    // 打击
    if (theme.kick.includes(step)) {
      if (theme.gong) bell(t, mtof(theme.root - 12), 2.4, 0.22);
      else if (theme.taiko) kick(t, { freq: 180, freq2: 60, gain: 0.55, dur: 0.5 });
      else if (theme.templeBell) bell(t, mtof(theme.root + 19), 1.8, 0.16);
      else kick(t, { freq: theme.woodblock ? 220 : 150, freq2: theme.woodblock ? 160 : 48, gain: theme.woodblock ? 0.3 : 0.45, dur: theme.woodblock ? 0.12 : 0.3 });
    }
    if (theme.snare.includes(step)) noiseBurst(t, 0.16, { gain: 0.12, cutoff: 2400, filterType: 'highpass', bus: musicBus });
    if (theme.hat.includes(step)) noiseBurst(t, 0.05, { gain: 0.05, cutoff: 7000, filterType: 'highpass', bus: musicBus });
  }
  function tick() {
    if (!ctx || !theme) return;
    if (nextStepTime < ctx.currentTime) nextStepTime = ctx.currentTime + 0.05;
    while (nextStepTime < ctx.currentTime + LOOKAHEAD) {
      scheduleStep(nextStepTime);
      nextStepTime += (60 / theme.bpm) / 4;
      step = (step + 1) % 16; if (step === 0) bar++;
    }
  }
  function startScheduler() { if (!timer) timer = setInterval(tick, INTERVAL); }
  function stopScheduler() { if (timer) { clearInterval(timer); timer = null; } }

  // ---------- 对外 API ----------
  function applyMusicGain() { if (musicBus) musicBus.gain.setTargetAtTime(enabled ? musicTarget * ducked : 0.0001, ctx.currentTime, 0.4); }
  function setRegion(index) {
    if (!enabled) { current = index < 0 ? 'title' : 'r' + index; return; }
    ensureCtx();
    const key = index < 0 ? 'title' : 'r' + index;
    if (key === current && theme) { startScheduler(); return; }
    current = key;
    const next = THEMES[key] || THEMES.r0;
    // 短促的呼吸式过渡：先压低，再切主题升起
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.16);
    setTimeout(() => {
      if (current !== key) return;   // 期间已被新的切换或 stop() 取代，放弃这次升起
      theme = next; step = 0; bar = 0; mel = 6; mel2 = 3;
      musicSend.gain.setTargetAtTime(next.reverb, ctx.currentTime, 0.3);
      nextStepTime = ctx.currentTime + 0.06;
      startScheduler(); applyMusicGain();
    }, 360);
  }
  function playTitle() { setRegion(-1); }
  function resume() { ensureCtx(); ensureBattleHitPool(); if (ctx.state === 'suspended') ctx.resume(); }
  function stop() { stopScheduler(); theme = null; current = null; if (musicBus) musicBus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2); }
  function setEnabled(on) {
    enabled = on;
    if (!on) { battleHitPool.forEach(sample => { sample.pause(); sample.currentTime = 0; }); if (ctx) musicBus && musicBus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2); }
    else { resume(); if (theme) startScheduler(); applyMusicGain(); }
  }
  function duck(on) { ducked = on ? 0.45 : 1; if (ctx) applyMusicGain(); }

  // ---------- 音效 ----------
  function sfx(name) {
    if (!enabled) return; ensureCtx(); if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime, B = sfxBus;
    switch (name) {
      case 'step': tone(t, 150, 0.06, { type: 'sine', gain: 0.06, bus: B }); break;
      case 'bump': tone(t, 84, 0.12, { type: 'square', gain: 0.12, cutoff: 400, bus: B }); noiseBurst(t, 0.06, { gain: 0.05, cutoff: 600, bus: B }); break;
      case 'battle': playBattleHit(); break;
      case 'enemyHit': noiseBurst(t, 0.12, { gain: 0.16, cutoff: 1400, bus: B }); tone(t, 110, 0.14, { type: 'square', gain: 0.12, cutoff: 800, bus: B }); break;
      case 'door': noiseBurst(t, 0.5, { gain: 0.12, cutoff: 700, filterType: 'lowpass', bus: B }); tone(t, 70, 0.5, { type: 'sawtooth', gain: 0.07, cutoff: 300, bus: B }); break;
      case 'stairs': case 'cloud': { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
        o.frequency.setValueAtTime(name === 'cloud' ? 300 : 380, t); o.frequency.exponentialRampToValueAtTime(name === 'cloud' ? 900 : 760, t + 0.4);
        g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45); o.connect(g).connect(B); o.start(t); o.stop(t + 0.5);
        noiseBurst(t, 0.4, { gain: 0.05, cutoff: 4000, filterType: 'highpass', bus: B }); break; }
      case 'item': [880, 1320].forEach((f, i) => bell(t + i * 0.06, f, 0.35, 0.12, B)); break;
      case 'key': [784, 988, 1319].forEach((f, i) => tone(t + i * 0.05, f, 0.22, { type: 'triangle', gain: 0.13, bus: B })); break;
      case 'heal': [523, 659, 784].forEach((f, i) => tone(t + i * 0.07, f, 0.5, { type: 'sine', gain: 0.1, attack: 0.05, release: 0.4, bus: B })); break;
      case 'helper': [659, 880].forEach((f, i) => bell(t + i * 0.08, f, 0.5, 0.12, B)); break;
      case 'reward': [659, 784, 988, 1319].forEach((f, i) => tone(t + i * 0.08, f, 0.3, { type: 'triangle', gain: 0.13, bus: B })); break;
      case 'relic': [523, 784, 1047, 1568].forEach((f, i) => bell(t + i * 0.07, f, 0.6, 0.13, B)); break;
      case 'levelup': [523, 659, 784, 1047, 1319].forEach((f, i) => tone(t + i * 0.09, f, 0.4, { type: 'triangle', gain: 0.14, attack: 0.01, release: 0.3, bus: B })); break;
      case 'skill': [988, 740, 1175].forEach((f, i) => tone(t + i * 0.06, f, 0.3, { type: 'sine', gain: 0.12, bus: B })); noiseBurst(t, 0.3, { gain: 0.04, cutoff: 5000, filterType: 'highpass', bus: B }); break;
      case 'bossIntro': { bell(t, mtof(36), 2.2, 0.2, B); tone(t, mtof(31), 1.6, { type: 'sawtooth', gain: 0.08, cutoff: 500, bus: B });
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(60, t + 1.4);
        g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6); o.connect(g).connect(B); o.start(t); o.stop(t + 1.7); break; }
      case 'bossWin': [392, 523, 659, 784, 1047].forEach((f, i) => bell(t + i * 0.1, f, 0.8, 0.14, B)); break;
      case 'backlash': { // 紧箍反噬：刺耳金属颤音
        const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(); o.type = 'square'; o2.type = 'sawtooth';
        o.frequency.setValueAtTime(1200, t); o2.frequency.setValueAtTime(1270, t);
        o.frequency.exponentialRampToValueAtTime(700, t + 0.4); o2.frequency.exponentialRampToValueAtTime(720, t + 0.4);
        g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45); o.connect(g); o2.connect(g); g.connect(B); o.start(t); o2.start(t); o.stop(t + 0.5); o2.stop(t + 0.5); break; }
      case 'rescue': [784, 1047, 1319, 1760].forEach((f, i) => bell(t + i * 0.06, f, 0.7, 0.13, B)); break;
      case 'reveal': { bell(t, mtof(64), 1.6, 0.16, B); bell(t + 0.25, mtof(71), 1.6, 0.13, B); tone(t, mtof(40), 1.4, { type: 'sine', gain: 0.06, bus: B }); break; }
      case 'win': ['523,0', '659,0.14', '784,0.28', '1047,0.42', '1319,0.56', '1568,0.7'].forEach(s => { const [f, d] = s.split(','); bell(t + +d, +f, 1.2, 0.16, B); }); break;
      case 'death': { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(40, t + 1.1);
        g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2); o.connect(g).connect(B); o.start(t); o.stop(t + 1.3);
        bell(t, mtof(33), 1.6, 0.12, B); break; }
      default: tone(t, 440, 0.1, { gain: 0.08, bus: B });
    }
  }

  return { setRegion, playTitle, resume, stop, setEnabled, duck, sfx, ensureCtx };
})();
