import type { Finding, Investigation, SpreadRow } from "./types";

export const investigations: Investigation[] = [
  {
    id: "olson-2012",
    name: "Olson & Ferkul gravity limits",
    years: "2011–2012",
    platform: "GRC Zero Gravity Facility centrifuge and 1 g White Sands tests",
    regimes: ["micro", "lunar", "mars", "earth"],
    topics: ["limits", "lunar", "mars", "materials", "solids"],
    atmospheres: [
      { oxygenPct: 21, pressureKpa: 101 },
      { oxygenPct: 18, pressureKpa: 70 },
    ],
    summary:
      "The only table in this corpus that puts the same materials at Earth, Martian, lunar, and forced-flow microgravity and publishes the oxygen limit at each.",
    why: "It is the measurement behind the partial-gravity penalty. Three materials. Upward spread. A short drop, so the low-g criterion is stricter about time and looser about burn length than Test 1.",
    citation: "Olson & Ferkul, AIAA 2012-3492, Table I.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "saffire-1",
    name: "Saffire-I",
    years: "2016",
    platform: "Cygnus after departure from ISS",
    regimes: ["micro"],
    topics: ["spread", "scale", "large-scale", "solids", "atmosphere"],
    atmospheres: [{ oxygenPct: 21.7, pressureKpa: 102 }],
    summary:
      "First intentional large fire on an uncrewed spacecraft. A 94 cm by 40.6 cm SIBAL sheet at 20 cm/s concurrent flow.",
    why: "The flame stayed bounded. It did not accelerate the way an upward 1 g flame of this size does. Anchor for the spread ratio: 0.18 cm/s.",
    citation: "PSI-98, DOI 10.60555/0t15-1z43. Spread from Combustion and Flame, DOI 10.1016/j.combustflame.2022.112559, Table 1.",
    url: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98",
  },
  {
    id: "saffire-2",
    name: "Saffire-II",
    years: "2016",
    platform: "Cygnus",
    regimes: ["micro"],
    topics: ["spread", "materials", "solids", "large-scale"],
    atmospheres: [{ oxygenPct: 22.1, pressureKpa: 103 }],
    summary:
      "Nine smaller samples in one flow duct: silicone at three thicknesses, SIBAL, PMMA, and a PMMA/Nomex pair, concurrent and opposed.",
    why: "Shows the flight record is not one fabric. Thickness and material change the burn. Ember does not invent pass/fail calls the papers do not make.",
    citation: "Companion flight to PSI-98 and PSI-100. Sample card from the NASA Saffire I–III summary.",
    url: "https://ntrs.nasa.gov/citations/20170008805",
  },
  {
    id: "saffire-3",
    name: "Saffire-III",
    years: "2017",
    platform: "Cygnus",
    regimes: ["micro"],
    topics: ["spread", "scale", "large-scale", "solids"],
    atmospheres: [{ oxygenPct: 21.2, pressureKpa: 99 }],
    summary:
      "Repeat of the large SIBAL card at higher flow. The review table lists 25 cm/s and 0.23 cm/s spread. The PSI narrative says 30 cm/s.",
    why: "Spread rose almost in proportion to flow between Saffire-I at 20 cm/s and this test. Ember uses the peer-reviewed table when the catalog disagrees.",
    citation: "PSI-100, DOI 10.60555/040q-4h36. Flow and spread: Combustion and Flame Table 1 (2022).",
    url: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-100",
  },
  {
    id: "saffire-45",
    name: "Saffire-IV and V",
    years: "2020–2021",
    platform: "Cygnus, smaller duct",
    regimes: ["micro"],
    topics: ["spread", "atmosphere", "scale", "large-scale", "solids"],
    atmospheres: [
      { oxygenPct: 23.1, pressureKpa: 99 },
      { oxygenPct: 22.0, pressureKpa: 100 },
      { oxygenPct: 27.7, pressureKpa: 76 },
      { oxygenPct: 26.2, pressureKpa: 70.7 },
    ],
    summary:
      "Moved the cabin toward exploration air. Saffire V was depressurized and oxygen-enriched: about 26–28% O2 near 71–76 kPa.",
    why: "The oxygen-times-square-root-of-pressure ratio matched the spread ratio between a SIBAL row and a cotton row. Duct height also changed the rate. Atmosphere is not the only scale.",
    citation: "Combustion and Flame DOI 10.1016/j.combustflame.2022.112559; ICES Saffire VI paper Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "saffire-6",
    name: "Saffire-VI",
    years: "2024",
    platform: "Cygnus, free volume about 17 m³",
    regimes: ["micro"],
    topics: ["large-scale", "atmosphere", "detection", "smoke", "materials", "solids", "gap"],
    atmospheres: [
      { oxygenPct: 31.0, pressureKpa: 54.1 },
      { oxygenPct: 30.3, pressureKpa: 54.6 },
      { oxygenPct: 28.8, pressureKpa: 55.2 },
    ],
    summary:
      "Closest large fire yet flown to an exploration atmosphere: SIBAL at 31% O2 and 54.1 kPa, then thick PMMA near 29–30% O2 and 55 kPa. Flow 20 cm/s.",
    why: "Heat stayed local. Carbon monoxide and carbon dioxide did not. A smoke threshold of 1 mg/m³ was crossed at 981 s, after most of the toxic gas was already out. The Nomex swatch did not ignite. The authors say partial gravity is still untested at this scale.",
    citation: "Preliminary Results from the Saffire VI Experiment, NTRS 20240002981.",
    url: "https://ntrs.nasa.gov/citations/20240002981",
  },
  {
    id: "bass",
    name: "BASS and BASS-II",
    years: "ISS increment era",
    platform: "ISS, small flow tunnel",
    regimes: ["micro"],
    topics: ["spread", "scale", "solids", "materials"],
    atmospheres: [{ oxygenPct: 21.5, pressureKpa: 101 }],
    summary:
      "Small solid samples in a duct a few centimeters across. The predecessor geometry to Saffire.",
    why: "SIBAL rows in the same review table spread at 0.27 and 0.51 cm/s, faster than Saffire-I's 0.18 cm/s. Width and duct changed together. Small tunnels do not stand in for a cabin.",
    citation: "Combustion and Flame DOI 10.1016/j.combustflame.2022.112559, Table 1, BASS rows.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "flex",
    name: "FLEX and FLEX-2",
    years: "2009–2017",
    platform: "ISS Combustion Integrated Rack",
    regimes: ["micro"],
    topics: ["droplets", "suppression", "cool-flame", "limits", "atmosphere"],
    atmospheres: [
      { oxygenPct: 21, pressureKpa: 101 },
      { oxygenPct: 18, pressureKpa: 70 },
    ],
    summary:
      "Single droplets in a quiescent chamber, used as a clean geometry for suppressant effectiveness. Oxygen, pressure, and diluent were varied on purpose.",
    why: "After the visible hot flame went out, large n-alkane droplets kept burning as a cool flame the eye cannot see. That is a detection problem, not only a chemistry paper.",
    citation: "Nayagam et al., Combustion and Flame, 2012, DOI 10.1016/j.combustflame.2012.07.012.",
    url: "https://doi.org/10.1016/j.combustflame.2012.07.012",
  },
  {
    id: "acme",
    name: "ACME, including BRE",
    years: "2017–2020s",
    platform: "ISS Combustion Integrated Rack",
    regimes: ["micro"],
    topics: ["solids", "materials", "limits", "atmosphere"],
    atmospheres: [{ oxygenPct: 21, pressureKpa: 101 }],
    summary:
      "Gaseous flames standing in for condensed fuels. Burning Rate Emulator ran 59 burns to map heat flux and flame size against the way solid materials are screened.",
    why: "Connects a gas-jet measurement to the question Test 1 is supposed to answer: will this solid keep burning.",
    citation: "NASA, Studying Combustion and Fire Safety (Glenn / ISS).",
    url: "https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/",
  },
  {
    id: "same",
    name: "SAME and SAME-R",
    years: "ISS",
    platform: "ISS",
    regimes: ["micro"],
    topics: ["smoke", "detection"],
    atmospheres: [{ oxygenPct: 21, pressureKpa: 101 }],
    summary:
      "Smoke aerosol measurements in microgravity, flown because particle size sets what a detector can see.",
    why: "Detector design inherits the particle distribution. Earth smoke and spacecraft smoke are not the same aerosol.",
    citation: "NASA Physical Sciences Informatics, combustion / spacecraft fire safety investigations.",
    url: "https://www.nasa.gov/physical-sciences-informatics-psi/psi-investigations-by-research-area/",
  },
  {
    id: "fm2",
    name: "FM2, Flammability of Materials on the Moon",
    years: "In development",
    platform: "CLPS lunar lander payload",
    regimes: ["lunar"],
    topics: ["lunar", "limits", "materials", "gap", "atmosphere", "solids"],
    atmospheres: [
      { oxygenPct: 21, pressureKpa: 101 },
      { oxygenPct: 34, pressureKpa: 56.5 },
    ],
    summary:
      "A robotic chamber for the lunar surface. Planned burns of SIBAL in air and acrylic in exploration air, upward and downward.",
    why: "Ground centrifuges give five seconds. FM2 is the proposal to hold lunar gravity long enough to watch a real burn in 34% oxygen at 8.2 psia.",
    citation: "NTRS 20240015307, Flammability of Materials on the Moon.",
    url: "https://ntrs.nasa.gov/citations/20240015307",
  },
  {
    id: "std-6001",
    name: "NASA-STD-6001 Test 1",
    years: "Current standard",
    platform: "1 g laboratory",
    regimes: ["earth"],
    topics: ["limits", "materials", "atmosphere"],
    atmospheres: [
      { oxygenPct: 30, pressureKpa: 70.3 },
      { oxygenPct: 34, pressureKpa: 56.5 },
    ],
    summary:
      "Upward flame spread. A material fails if it burns more than 15 cm. The test is run at the worst cabin the material will see.",
    why: "This is the pass/fail number programs actually use. It is a 1 g test. The exploration worst case it must now cover is 34% oxygen at 8.2 psia.",
    citation: "NASA-STD-6001 Test 1, as discussed by Olson & Ferkul 2012 and NASA fire-safety gap briefings.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "ochmo",
    name: "OCHMO-TB-008 Fire Protection",
    years: "Rev A",
    platform: "NASA human-system standard brief",
    regimes: ["micro", "lunar", "mars", "earth"],
    topics: ["detection", "suppression", "smoke", "gap", "atmosphere"],
    atmospheres: [],
    summary:
      "The crew-health view of fire: prevention, detection, suppression, cleanup, and the deep-space gaps that ISS hardware does not close.",
    why: "Names the operational chain Ember scores: materials, detection, suppression, and the partial-gravity hole in all three.",
    citation: "NASA OCHMO-TB-008 Rev A, derived from NASA-STD-3001.",
    url: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf",
  },
];

export const findings: Finding[] = [
  {
    id: "mylar-lunar",
    investigationId: "olson-2012",
    claim:
      "Mylar G reached its lowest limiting oxygen at lunar gravity: ULOI* 15.6% and MOC* 14.1% at 10.2 psia, 5.75 points below its 1 g mean.",
    detail:
      "Earth ULOI 21.2 and MOC 20.0. Martian ULOI* 18.0 and MOC* 17.0. Forced-flow microgravity ULOI* 17.0 and MOC* 16.0. The lunar point is the bottom of the published set. Mylar melts, so hot liquid stays in the flame instead of dripping away.",
    tags: ["mylar", "lunar", "limit", "uloi", "goldilocks", "melting"],
    topics: ["limits", "lunar", "materials"],
    confidence: "measured",
    citation: "Olson & Ferkul 2012, Table I.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "ultem-lunar",
    investigationId: "olson-2012",
    claim:
      "Ultem's microgravity limit was slightly higher than its 1 g limit. The penalty showed up at lunar gravity, not at zero.",
    detail:
      "Ultem 1000 at 10.2 psia: 1 g ULOI 23.5, MOC 23.0. Microgravity ULOI* 24.0, MOC* 23.0, delta +0.25. Lunar ULOI* 21.0, MOC* 19.9, delta −2.8. Martian ULOI* 22.0, MOC* 21.1, delta −1.7. Char helps at zero g and helps less when a little buoyancy remains.",
    tags: ["ultem", "lunar", "microgravity", "charring", "limit"],
    topics: ["limits", "lunar", "materials"],
    confidence: "measured",
    citation: "Olson & Ferkul 2012, Table I.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "nomex-mars",
    investigationId: "olson-2012",
    claim:
      "For Nomex HT90-40 the lowest published limit is Martian, not lunar and not microgravity.",
    detail:
      "At 14.7 psia: 1 g ULOI 23.5, MOC 22.1. Microgravity ULOI* 23.0, MOC* 22.0, delta −0.3. Lunar ULOI* 21.0, MOC* 19.9, delta −2.35. Martian ULOI* 19.9, MOC* 19.0, delta −3.35. Which partial gravity is worst depends on the material.",
    tags: ["nomex", "mars", "lunar", "limit", "charring"],
    topics: ["limits", "mars", "lunar", "materials"],
    confidence: "measured",
    citation: "Olson & Ferkul 2012, Table I.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "drop-caveat",
    investigationId: "olson-2012",
    claim:
      "The low-g limits used a drop of about five seconds. That is a different extinction rule than the 15 cm burn in Test 1.",
    detail:
      "Olson and Ferkul mark low-g values with a star for this reason. Near-limit Nomex and Ultem flames were still shrinking at impact, so some of those limits may be conservative. The sign of the partial-gravity penalty is repeated across the three materials; the exact tenth of a percent is not a flight allow-able.",
    tags: ["caveat", "test 1", "drop tower", "criterion"],
    topics: ["limits", "gap"],
    confidence: "reported",
    citation: "Olson & Ferkul 2012, Sections II–IV.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "goldilocks",
    investigationId: "olson-2012",
    claim:
      "There is a band of gravity, below Earth and above free fall, where these materials burn at lower oxygen than the 1 g test allows.",
    detail:
      "Less buoyancy means less convective cooling, so the flame needs less oxygen to pay for the heat that reaches fresh fuel. Enough buoyancy remains to bring oxidizer in. The paper's Mylar plot is U-shaped: too little flow and the flame starves, too much and it cools.",
    tags: ["goldilocks", "partial gravity", "mechanism"],
    topics: ["limits", "lunar", "mars"],
    confidence: "reported",
    citation: "Olson & Ferkul 2012, discussion of Figure 7.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "test1-rule",
    investigationId: "std-6001",
    claim:
      "Test 1 fails a material that burns more than 15 cm upward, and it is run at the worst atmosphere that material will see, at 1 g.",
    detail:
      "Shuttle and ISS pre-EVA screening used 30% oxygen at 10.2 psia. Exploration atmospheres extend the worst case to 34% oxygen at 8.2 psia. A pass at the older atmosphere does not answer the new one, and a pass at 1 g does not answer lunar g.",
    tags: ["test 1", "6001", "pass", "certification", "34", "exploration"],
    topics: ["limits", "atmosphere", "materials"],
    confidence: "reported",
    citation: "Olson & Ferkul 2012, Introduction; NASA exploration fire-safety gap notes.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "saffire-anchor",
    investigationId: "saffire-1",
    claim:
      "Saffire-I SIBAL spread at 0.18 cm/s in a large duct at 21.7% O2, 102 kPa, and 20 cm/s, and the flame did not run away.",
    detail:
      "Sample 94 cm by 40.6 cm. Estimated average power about 1.2 kW ± 0.3 kW. In 1 g an upward flame on a sheet this size grows and accelerates. In microgravity, with only forced flow, it stayed constrained after ignition.",
    tags: ["saffire", "sibal", "spread", "scale", "concurrent"],
    topics: ["spread", "large-scale", "scale"],
    confidence: "measured",
    citation: "Combustion and Flame 2022 Table 1; NASA Saffire summary, NTRS 20180005168.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "saffire-flow",
    investigationId: "saffire-3",
    claim:
      "Raising concurrent flow from 20 cm/s on Saffire-I to 25 cm/s on Saffire-III raised large-sample SIBAL spread from 0.18 to 0.23 cm/s.",
    detail:
      "The ratio of speeds is close to the ratio of flows. The PSI catalog text says Saffire-III ran at 30 cm/s. The sample table in the 2022 review lists 25 cm/s and 21.2% O2 at 99 kPa. Ember cites the table.",
    tags: ["saffire", "flow", "spread", "sibal"],
    topics: ["spread", "atmosphere"],
    confidence: "measured",
    citation: "Combustion and Flame DOI 10.1016/j.combustflame.2022.112559, Table 1; PSI-100 narrative.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "scale-warning",
    investigationId: "bass",
    claim:
      "The same SIBAL fabric spread faster in the small BASS duct (0.27 and 0.51 cm/s) than in the large Saffire-I duct (0.18 cm/s).",
    detail:
      "BASS samples were about 10 cm long and only a few centimeters wide, at 19–22 cm/s and ~21.5% O2. Saffire-IV, in a shorter duct than Saffire-I, also spread faster (0.36 cm/s on one SIBAL row). Sample width, duct height, and hot-gas acceleration moved together. A small-tunnel rate is not a cabin rate.",
    tags: ["bass", "scale", "duct", "sibal"],
    topics: ["scale", "spread"],
    confidence: "measured",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "spread-scaling",
    investigationId: "saffire-45",
    claim:
      "Across Saffire IV and V, concurrent spread tracked oxygen percentage times the square root of pressure.",
    detail:
      "One published correlation used for those rows is Vf ∝ O2% · P^1/2, with a further near-linear flow term between Saffire I and III. Ember uses that product only as a ratio to the Saffire-I anchor, and only in microgravity. It is not a burn-time prediction, and it is the wrong regime once buoyancy competes with the fan.",
    tags: ["scaling", "pressure", "oxygen", "spread", "correlation"],
    topics: ["spread", "atmosphere"],
    confidence: "reported",
    citation: "Combustion and Flame DOI 10.1016/j.combustflame.2022.112559.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "saffire6-air",
    investigationId: "saffire-6",
    claim:
      "Saffire-VI burned SIBAL at 31.0% oxygen and 54.1 kPa, the closest large spacecraft fire to the 34% / 8.2 psia exploration case.",
    detail:
      "VI-2 SIBAL, VI-3 two-sided PMMA at 30.3% and 54.6 kPa, VI-4 one-sided PMMA at 28.8% and 55.2 kPa. All concurrent at 20 cm/s. Free volume 16.7 m³. 8.2 psia is 56.5 kPa, so pressure is close and oxygen is a few points lower than 34%.",
    tags: ["saffire vi", "exploration", "34", "atmosphere", "pmma", "sibal"],
    topics: ["atmosphere", "large-scale"],
    confidence: "measured",
    citation: "Saffire VI, NTRS 20240002981, Table 1.",
    url: "https://ntrs.nasa.gov/citations/20240002981",
  },
  {
    id: "saffire6-toxic",
    investigationId: "saffire-6",
    claim:
      "On Saffire-VI the crew hazard was toxic gas, not cabin temperature. PMMA crossed the 1-hour CO2 limit and the 24-hour CO limit.",
    detail:
      "Fires were about 1.5 to 3.2 kW in a 17–19 m³ volume. Temperature rose near the duct and barely moved at the far sensor. VI-3 CO2 partial pressure rose 3.51 mmHg against a 3 mmHg 1-hour limit, and CO rose 308 ppm against a 100 ppm 24-hour SMAC. VI-4 CO rose 320 ppm.",
    tags: ["saffire vi", "co", "co2", "toxicity", "heat", "smac"],
    topics: ["detection", "large-scale"],
    confidence: "measured",
    citation: "Saffire VI, NTRS 20240002981, Table 2 and conclusion.",
    url: "https://ntrs.nasa.gov/citations/20240002981",
  },
  {
    id: "saffire6-alarm",
    investigationId: "saffire-6",
    claim:
      "A 1 mg/m³ smoke threshold on Saffire-VI was reached at 981 seconds, after most of the hazardous gas had already been released.",
    detail:
      "Ionization and light-scattering both saw the smoke. The late threshold is the operational sentence: a detector can be working and still report the fire after the atmosphere is already injured. Smoke also fell after the peak, consistent with particles lost to walls.",
    tags: ["detector", "alarm", "smoke", "late", "saffire vi"],
    topics: ["detection", "smoke"],
    confidence: "measured",
    citation: "Saffire VI, NTRS 20240002981.",
    url: "https://ntrs.nasa.gov/citations/20240002981",
  },
  {
    id: "saffire6-nomex",
    investigationId: "saffire-6",
    claim:
      "The Nomex fabric sample on Saffire-VI did not ignite. That is one swatch, one igniter, and one flow. It is not a limiting oxygen.",
    detail:
      "The fire-results paper leaves Nomex out of the heat-release table because it did not ignite. Do not read it as Nomex being acceptable at 34% oxygen or at lunar gravity. The Olson table is the limit measurement; this is a single no-ignition.",
    tags: ["nomex", "saffire vi", "ignition"],
    topics: ["materials", "limits"],
    confidence: "reported",
    citation: "Saffire VI, NTRS 20240002981.",
    url: "https://ntrs.nasa.gov/citations/20240002981",
  },
  {
    id: "saffire6-gap",
    investigationId: "saffire-6",
    claim:
      "The Saffire-VI authors say these vehicle-scale results still have to be extended to lunar and Martian gravity.",
    detail:
      "Large exploration-atmosphere fires exist in microgravity. Partial-gravity limits exist for three thin materials in a drop tower. The intersection — a large fire at exploration oxygen and lunar or Martian g — has not been flown.",
    tags: ["gap", "lunar", "mars", "partial gravity", "saffire vi"],
    topics: ["gap", "lunar", "mars"],
    confidence: "reported",
    citation: "Saffire VI, NTRS 20240002981, conclusion.",
    url: "https://ntrs.nasa.gov/citations/20240002981",
  },
  {
    id: "fm2-downward",
    investigationId: "fm2",
    claim:
      "SIBAL has burned downward in air at lunar gravity, in centrifuge and parabolic-flight tests, where the same downward burn extinguishes immediately in 1 g.",
    detail:
      "Test 1 is an upward test. This result is a different direction. It still matters: a geometry that looks self-extinguishing on Earth can keep burning on the Moon. FM2 plans to repeat SIBAL in air and acrylic rods in 34% oxygen at 8.2 psia, upward and downward, on the lunar surface.",
    tags: ["fm2", "sibal", "downward", "lunar", "opposed"],
    topics: ["lunar", "limits", "gap"],
    confidence: "reported",
    citation: "NTRS 20240015307.",
    url: "https://ntrs.nasa.gov/citations/20240015307",
  },
  {
    id: "cool-flame",
    investigationId: "flex",
    claim:
      "After the visible hot flame of a large n-alkane droplet went out, FLEX found a quasi-steady cool flame the eye cannot see.",
    detail:
      "Radiative extinction of the hot flame was followed by low-temperature burning in the negative-temperature-coefficient regime. The droplet diameter-squared kept falling. The cool flame later extinguished at a finite diameter. Fuels reported in the follow-on work include n-heptane, n-octane, and n-decane, in oxygen from about 14% to 25%.",
    tags: ["cool flame", "flex", "invisible", "extinction", "droplet"],
    topics: ["cool-flame", "detection", "droplets"],
    confidence: "measured",
    citation: "Nayagam et al., Combustion and Flame 2012, DOI 10.1016/j.combustflame.2012.07.012.",
    url: "https://doi.org/10.1016/j.combustflame.2012.07.012",
  },
  {
    id: "cool-products",
    investigationId: "flex",
    claim:
      "Cool flames produce carbon monoxide and formaldehyde rather than the carbon dioxide and water of a hot flame, and they make little of the yellow soot a camera or a smoke detector expects.",
    detail:
      "NASA's public account of FLEX states the product shift directly. A particulate detector has little soot to catch, and a color camera has little light. Cabin CO monitoring is the channel that still has a chemical to see. Ember treats the detector implication as an interpretation of that chemistry, not as a separate flight test of a named alarm.",
    tags: ["cool flame", "co", "formaldehyde", "soot", "detector"],
    topics: ["cool-flame", "detection"],
    confidence: "interpretation",
    citation: "NASA, Studying Combustion and Fire Safety.",
    url: "https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/",
  },
  {
    id: "smoke-path",
    investigationId: "ochmo",
    claim:
      "In microgravity, smoke does not rise. Detectors belong in the ventilation return, not on the ceiling.",
    detail:
      "Buoyancy is what carries smoke up on Earth. With the fan as the only organized flow, a detector outside the return path can miss a fire that is already making gas. If the fan is off, smoke can sit in a rack. Pale blue near-limit flames are also easy to miss by eye.",
    tags: ["smoke", "ventilation", "detector", "ceiling", "fan"],
    topics: ["detection", "smoke"],
    confidence: "reported",
    citation: "OCHMO-TB-008 Rev A.",
    url: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf",
  },
  {
    id: "extinguishers",
    investigationId: "ochmo",
    claim:
      "The US segment of ISS carries gaseous carbon dioxide and fine water mist. The Russian segment carries water-based foam.",
    detail:
      "Neither agent falls onto a fire when buoyancy is gone. Carbon dioxide stays in the cabin and is toxic, so the crew needs breathing protection while it is discharged into a small volume. Mist hangs and follows the fan, which helps it reach a flame and also carries water toward equipment. Deep-space vehicles have less stored diluent and no quick resupply.",
    tags: ["co2", "water mist", "extinguisher", "suppression", "foam"],
    topics: ["suppression"],
    confidence: "reported",
    citation: "NASA spacecraft fire-safety briefing NTRS 20180004258; OCHMO-TB-008.",
    url: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf",
  },
  {
    id: "dilution",
    investigationId: "ochmo",
    claim:
      "Suppression by dilution has to cross the material's limiting oxygen. A cabin at 34% has more oxygen to remove than a cabin at 21% before it reaches the same limit.",
    detail:
      "Partial pressure of oxygen can stay near a sea-level breath while the mole fraction climbs: 8.2 psia at 34% is about 2.8 psia of oxygen, close to the 3.1 psia in sea-level air. The flame responds to the mole fraction and to the flow. Ember does not compute a bottle size. It ranks how far the cabin sits above the published limit.",
    tags: ["dilution", "nitrogen", "oxygen", "partial pressure", "suppression"],
    topics: ["suppression", "atmosphere"],
    confidence: "interpretation",
    citation: "Olson & Ferkul 2012 on normoxic exploration atmospheres; OCHMO-TB-008.",
    url: "https://doi.org/10.2514/6.2012-3492",
  },
  {
    id: "ochmo-gaps",
    investigationId: "ochmo",
    claim:
      "NASA's own fire brief lists partial gravity, dust, radiation aging, and suppressants that must work with and without buoyancy as open risks for Moon and Mars.",
    detail:
      "ISS practice is the inheritance, not the design case. Ground Test 1 has been a useful screen for low gravity and has no terrestrial facility that can certify the partial-gravity result for a full material set. Communications delay also removes the ground from the first minutes of a response.",
    tags: ["gap", "dust", "radiation", "ochmo", "partial gravity"],
    topics: ["gap", "suppression", "detection"],
    confidence: "reported",
    citation: "OCHMO-TB-008 Rev A, deep-space challenges.",
    url: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf",
  },
  {
    id: "bre-59",
    investigationId: "acme",
    claim:
      "ACME's Burning Rate Emulator used 59 gaseous burns to imitate the heat flux of solid and liquid fuels in microgravity.",
    detail:
      "The point of the emulator is to ask whether a 1 g flammability test is asking the right question. It does not replace a limit table for a named fabric.",
    tags: ["acme", "bre", "flammability", "gaseous"],
    topics: ["materials", "limits"],
    confidence: "reported",
    citation: "NASA, Studying Combustion and Fire Safety.",
    url: "https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/",
  },
  {
    id: "pale-flames",
    investigationId: "ochmo",
    claim:
      "Near-limit and low-oxygen flames in spacecraft are often pale blue and nearly invisible.",
    detail:
      "Color is a poor alarm. Sooty yellow is not guaranteed, especially near extinction and in the cool-flame regime. Detection has to assume a flame the crew may not see.",
    tags: ["invisible", "blue", "near limit", "visual"],
    topics: ["detection", "cool-flame"],
    confidence: "reported",
    citation: "OCHMO-TB-008 Rev A.",
    url: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-008-fire-protection.pdf",
  },
];

export const spreadRows: SpreadRow[] = [
  {
    id: "I-1",
    flight: "Saffire-I",
    material: "SIBAL, 40.6 cm wide",
    flowCms: 20,
    oxygenPct: 21.7,
    pressureKpa: 102,
    spreadCms: 0.18,
    note: "Large duct. Anchor for the screening ratio.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "II-5",
    flight: "Saffire-II",
    material: "SIBAL, 5 cm wide",
    flowCms: 20,
    oxygenPct: 22.1,
    pressureKpa: 103,
    spreadCms: 0.21,
    note: "Narrow sample, same nominal flow as I-1.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "II-6",
    flight: "Saffire-II",
    material: "SIBAL, 5 cm wide",
    flowCms: 25,
    oxygenPct: 22.1,
    pressureKpa: 103,
    spreadCms: 0.26,
    note: "Flow step on a narrow sample.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "III-1",
    flight: "Saffire-III",
    material: "SIBAL, 40.6 cm wide",
    flowCms: 25,
    oxygenPct: 21.2,
    pressureKpa: 99,
    spreadCms: 0.23,
    note: "Large sample. PSI narrative lists 30 cm/s; this row follows the review table.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "IV-4",
    flight: "Saffire-IV",
    material: "SIBAL, 40.6 × 50 cm holder",
    flowCms: 20,
    oxygenPct: 23.1,
    pressureKpa: 99,
    spreadCms: 0.36,
    note: "Shorter duct than Saffire I–III. Spread about double the large-duct anchor.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "V-cotton",
    flight: "Saffire-V",
    material: "Cotton, 50 cm",
    flowCms: 20,
    oxygenPct: 27.7,
    pressureKpa: 76,
    spreadCms: 0.34,
    note: "Normoxic exploration-like air. Ratio to IV-4 tracks O2% · √P.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "BASS-1",
    flight: "BASS",
    material: "SIBAL, narrow",
    flowCms: 19,
    oxygenPct: 21.5,
    pressureKpa: 101,
    spreadCms: 0.27,
    note: "Small duct. Not a cabin-scale rate.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
  {
    id: "BASS-4",
    flight: "BASS",
    material: "SIBAL, narrow",
    flowCms: 22,
    oxygenPct: 21.6,
    pressureKpa: 101,
    spreadCms: 0.51,
    note: "Small duct, wider of the two cited BASS rows.",
    citation: "Combustion and Flame 2022, Table 1.",
    url: "https://doi.org/10.1016/j.combustflame.2022.112559",
  },
];

export function investigationById(id: string): Investigation {
  const found = investigations.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown investigation ${id}`);
  return found;
}
