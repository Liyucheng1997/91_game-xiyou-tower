"""Generate the original 3-minute seamless chiptune BGM used by the game."""

from pathlib import Path
import wave

import numpy as np


RATE = 22_050
TEMPO = 96
BEAT = 60 / TEMPO
BARS = 72
DURATION = BARS * 4 * BEAT  # exactly 180 seconds
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/audio/journey-tower-bgm.wav"
RNG = np.random.default_rng(81081)


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


mix = np.zeros(round(DURATION * RATE), dtype=np.float32)


def add_voice(start: float, duration: float, midi: float, volume: float, voice: str) -> None:
    i0 = max(0, round(start * RATE))
    count = min(round(duration * RATE), len(mix) - i0)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float32) / RATE
    f = hz(midi)
    attack = np.minimum(1, t / (0.012 if voice == "pluck" else 0.08))
    release = np.minimum(1, np.maximum(0, duration - t) / (0.06 if voice == "pluck" else 0.16))
    env = attack * release
    if voice == "pluck":
        phase = 2 * np.pi * f * t
        signal = (np.sign(np.sin(phase)) * 0.38 + np.sin(phase) * 0.42 + np.sin(phase * 2) * 0.15)
        signal *= np.exp(-3.3 * t / max(duration, 0.1))
    elif voice == "flute":
        vibrato = 0.006 * np.sin(2 * np.pi * 5.2 * t)
        phase = 2 * np.pi * f * t + vibrato
        signal = np.sin(phase) + 0.22 * np.sin(phase * 2) + 0.08 * np.sin(phase * 3)
        signal += RNG.normal(0, 0.025, count).astype(np.float32)
    elif voice == "bass":
        phase = 2 * np.pi * f * t
        signal = 0.72 * np.sin(phase) + 0.28 * np.sign(np.sin(phase))
        env *= np.exp(-0.9 * t / max(duration, 0.1))
    else:
        signal = np.sin(2 * np.pi * f * t)
    mix[i0:i0 + count] += signal * env * volume


def add_drum(start: float, kind: str, volume: float = 1.0) -> None:
    duration = {"kick": 0.34, "tom": 0.28, "hat": 0.11, "gong": 1.8}[kind]
    i0 = round(start * RATE)
    count = min(round(duration * RATE), len(mix) - i0)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float32) / RATE
    if kind == "kick":
        phase = 2 * np.pi * (70 * t + 45 * (1 - np.exp(-16 * t)) / 16)
        signal = np.sin(phase) * np.exp(-13 * t)
    elif kind == "tom":
        signal = (np.sin(2 * np.pi * (105 - 35 * t) * t) + 0.18 * RNG.normal(0, 1, count)) * np.exp(-11 * t)
    elif kind == "hat":
        signal = RNG.normal(0, 1, count) * np.exp(-38 * t)
    else:
        signal = (np.sin(2 * np.pi * 92 * t) + 0.45 * np.sin(2 * np.pi * 137 * t)) * np.exp(-2.6 * t)
    mix[i0:i0 + count] += signal.astype(np.float32) * volume


# D minor / Chinese pentatonic colors: D, F, G, A, C.
scale = [62, 65, 67, 69, 72, 74, 77, 79, 81]
motifs = [
    [0, 2, 3, 2, 1, 0, 1, 2],
    [3, 4, 5, 4, 3, 2, 1, 0],
    [0, 1, 3, 2, 4, 3, 2, 1],
    [5, 4, 3, 2, 3, 1, 2, 0],
]
roots = [38, 38, 41, 36, 38, 41, 36, 33]

for bar in range(BARS):
    bar_start = bar * 4 * BEAT
    section = 0 if bar < 8 else 1 if bar < 32 else 2 if bar < 48 else 3 if bar < 64 else 4
    root = roots[bar % len(roots)]

    # Drone/bass pulse and guqin-like offbeats.
    for beat in range(4):
        add_voice(bar_start + beat * BEAT, BEAT * 0.82, root + (12 if beat == 2 else 0), 0.075, "bass")
        if section >= 1 and beat in (1, 3):
            add_voice(bar_start + beat * BEAT + BEAT * 0.5, BEAT * 0.38, root + 24, 0.045, "pluck")

    motif = motifs[(bar // 4 + section) % len(motifs)]
    density = 4 if section == 0 else 8
    for step in range(density):
        index = motif[step * 2] if density == 4 else motif[step]
        octave = 0 if section < 2 else (12 if step in (3, 7) else 0)
        start = bar_start + step * (4 * BEAT / density)
        duration = (4 * BEAT / density) * (0.72 if section == 2 else 0.86)
        add_voice(start, duration, scale[index] + octave, 0.095 if section == 0 else 0.12, "flute")

    # Layer a brighter response in the ascent, then thin out before looping.
    if section == 3 and bar % 2 == 1:
        for step, index in enumerate(reversed(motifs[(bar // 2) % 4][:4])):
            add_voice(bar_start + (step * 2 + 1) * BEAT * 0.5, BEAT * 0.34, scale[index] + 12, 0.055, "pluck")

    for beat in range(4):
        if section > 0 or beat in (0, 2):
            add_drum(bar_start + beat * BEAT, "kick" if beat in (0, 2) else "tom", 0.16 if section != 2 else 0.22)
        if section >= 1:
            add_drum(bar_start + (beat + 0.5) * BEAT, "hat", 0.025)
    if bar in (0, 8, 32, 48, 64):
        add_drum(bar_start, "gong", 0.055)


# A quiet periodic cave drone. Its frequencies complete whole cycles at 180 s.
t = np.arange(len(mix), dtype=np.float32) / RATE
mix += (np.sin(2 * np.pi * 55 * t) * 0.018 + np.sin(2 * np.pi * 110 * t) * 0.006).astype(np.float32)

# Gentle master compression and headroom.
mix = np.tanh(mix * 1.35)
peak = float(np.max(np.abs(mix)))
mix = mix / max(peak, 1e-6) * 0.88
pcm = np.round(mix * 32767).astype("<i2")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUTPUT), "wb") as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(RATE)
    wav.writeframes(pcm.tobytes())

print(f"Wrote {OUTPUT} ({DURATION:.1f}s, {OUTPUT.stat().st_size / 1024 / 1024:.2f} MiB)")
