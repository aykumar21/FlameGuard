# FlameGuard

Live app: https://flameguard-gray.vercel.app

FlameGuard is a local, cited interpreter of NASA’s public microgravity combustion record for the Space Apps challenge **Flame in Freefall**. It does not call an external language model, and it does not certify a material or a vehicle.

The comparison it is built to make: NASA-STD-6001 Test 1 at 1 g is not the worst published case for every material. In Olson & Ferkul (AIAA 2012-3492, Table I), the upward limiting oxygen index of some witnesses is lower at lunar (0.166 g) or Martian (0.38 g) gravity than at either 1 g or forced-flow 0 g. A large fire near the exploration atmosphere, 8.2 psia and 34% O₂, has been flown in microgravity (Saffire-VI) and has not been flown at partial gravity and vehicle scale. That empty cell is what the lunar and Martian presets are scoring.

## Run

```bash
npm install
npm run check
npm run dev
```

Vite prints the local URL. `npm run check` runs the numeric self-check in `src/lib/selfcheck.ts`. `npm run build` typechecks and writes `dist/`. The app is a static Vite, React, and TypeScript client. Session state stays in the browser (`sessionStorage` key `flameguard-v1`).

## Cabins

Six presets. Oxygen is a mole fraction. Partial pressure is shown beside it and is not inside the score. Flow is the forced ventilation used when a spread ratio is allowed.

| Preset | g | O₂ | P | Flow | Resupply |
| --- | --- | --- | --- | --- | --- |
| ISS cabin | 0 | 21% | 14.7 psia | 15 cm/s | yes |
| ISS pre-EVA | 0 | 30% | 10.2 psia | 15 cm/s | yes |
| Deep-space transit | 0 | 34% | 8.2 psia | 20 cm/s | no |
| Lunar surface | 0.166 | 34% | 8.2 psia | 20 cm/s | no |
| Mars surface | 0.38 | 34% | 8.2 psia | 20 cm/s | no |
| Test 1 bench | 1 | 34% | 8.2 psia | 20 cm/s | yes |

Lunar surface is the default. The 8.2 psia / 34% O₂ row is the Exploration Atmospheres Working Group case cited as the exploration worst case, not a claim that a named vehicle has already certified that recipe. Sliders override the preset; resupply stays with the preset.

## Limits

Three witnesses have a gravity table, transcribed from Olson & Ferkul, Table I:

- Nomex HT90-40, measured at 14.7 psia. Lunar ULOI\* 21.0%, MOC\* 19.9%, published shift versus the 1 g mean −2.35 points.
- Ultem 1000, measured at 10.2 psia. Lunar ULOI\* 21.0%, MOC\* 19.9%, shift −2.8 points.
- Mylar G, measured at 10.2 psia. Lunar ULOI\* 15.6%, MOC\* 14.1%, shift −5.75 points.

ULOI\* is the upward limiting oxygen index: the lowest oxygen at which the sample still burned. MOC\* is the maximum oxygen concentration that still self-extinguished. Starred low-g values use a drop of about 5 seconds, which is not the 15 cm burn of Test 1. The 0 g row is a forced-flow test and is not plotted as the left end of the partial-g curve. Between lunar and 1 g the line is linear and labeled interpolated. Below lunar g the lunar value is held, not extrapolated. Catalog materials without a row in that table (SIBAL, cotton, PMMA, silicone, beta cloth) are not given an invented limit.

Mole fraction is compared directly to the table. If the cabin pressure is not the witness test pressure, Ember states the offset and does not invent a pressure correction. At the default lunar Nomex case, 34.0% oxygen is 13.0 points above the lunar ULOI\* of 21.0%. ISS air at 21% is 1.0 point under Nomex’s microgravity MOC\* of 22.0%.

## Exposure index

The index is the unweighted mean of four scores, each clamped to 0–100. It ranks cabins. It is not a fire probability.

- Limit. On the extinguishing side of MOC\*, `42 − 4 × (MOC* − O₂)`, clamped to 8–52. Inside the MOC\*–ULOI\* band, 60. On the burning side of ULOI\*, `62 + 3.2 × (O₂ − ULOI*)`, clamped to 62–100.
- Oxygen. `(O₂% − 17) × 3.6`.
- Detection. 58 at g ≤ 0.02, 44 from just above free fall up to g < 0.75, 16 at Earth-normal gravity. Add 16 if forced flow is under 8 cm/s. Add 18 in the cool-flame scenario.
- Suppression. `22 + 2.6 × max(0, O₂% − 21)`, plus 8 in microgravity, plus 10 when the preset has no resupply.

Bands: under 40 Guarded, under 55 Watch, under 66 Elevated, otherwise Severe. For Nomex the six presets land at about 35 Guarded (ISS air), 61 Elevated (pre-EVA), 73 Severe (transit), 68 Severe (Moon), 68 Severe (Mars), and 57 Elevated (1 g bench). Mars has the larger limit overrun; transit has the higher index, because detection and suppression are harder in free fall with no resupply. Those are different questions, and the page says so.

The microgravity spread ratio is reported only at g ≤ 0.02:

`Vf / 0.18 cm/s = (O₂ / 21.7) × √(P / 102 kPa) × (U / 20 cm/s)`

The anchor is Saffire-I large-duct SIBAL, 0.18 cm/s at 21.7% O₂, 102 kPa, and 20 cm/s. Outside that neighborhood the ratio is labeled extrapolated. At lunar or Martian g the ratio is withheld: buoyancy can exceed the fan, so the Cygnus duct scaling does not apply.

## Rank and Ember

The atlas score is gravity match, plus distance from the cabin atmosphere to the nearest published test atmosphere, plus overlap with the hazard that is currently loudest (limits, detection, suppression, spread, scale, cool flame, or the partial-g gap). A limit table whose gravity matches the cabin is not punished for a pressure mismatch. FM2 is kept high for a lunar exploration-air question and then reduced by 10 points, because it is a planned payload rather than a finished table.

Ember retrieves from that ranked corpus by token overlap, a small synonym list, and intent patterns (limits, detection, suppression, spread, scale, the gap, and which flight). A question with no lexical overlap returns a thin confidence instead of a nearest-neighbor guess. Changing the mission rewrites an answer that is already on screen. Every number in the answer is either a cited measurement or one of the screening rules above.

## What to show a judge

1. Open **Lunar surface** with Nomex. The headline is the Table I lunar ULOI\*, 13.0 points below the 34% cabin, with the 14.7 psia versus 8.2 psia caveat.
2. Open **Same witness, six cabins**. ISS air is the only Guarded Nomex case. Exploration air is above the published limit in every gravity. The lowest overrun and the highest index are not the same mission.
3. Switch the witness to **Mylar**. The lunar mean limit is 5.75 points below the 1 g mean, and the lunar overrun at 34% O₂ is larger than the microgravity exploration overrun.
4. Ask Ember whether a Test 1 pass keeps a material safe on the Moon. The answer should cite the partial-g table and refuse to treat 1 g as the worst case.
5. **Brief** prints the same state: limit, detection, suppression, spread, the open gap, and the method.

## Corpus

Cited in the atlas, not recomputed:

- Olson & Ferkul, AIAA 2012-3492, DOI 10.2514/6.2012-3492, Table I.
- Saffire I–V concurrent spread rows, Combustion and Flame, DOI 10.1016/j.combustflame.2022.112559, Table 1. The Saffire-I anchor used by the ratio is 0.18 cm/s.
- Saffire-VI atmospheres, heat release, CO/CO₂, and the 1 mg/m³ smoke threshold at 981 s, NTRS 20240002981. The Nomex swatch that did not ignite is not entered as a limit.
- Cool flames, Nayagam et al., Combustion and Flame, DOI 10.1016/j.combustflame.2012.07.012. The detector implication (CO and formaldehyde, little soot) is marked as interpretation.
- Detector placement and the partial-g gap, OCHMO-TB-008.
- FM2, NTRS 20240015307. Planned lunar payload: a downward SIBAL burn in lunar air where the same downward burn extinguishes at 1 g.

## Team

FlameGuard, National Chung Cheng University (CCU). Independent Space Apps project. Not a NASA product and not a flight certification.
