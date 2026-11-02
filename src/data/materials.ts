import type { CatalogMaterial, Witness } from "./types";

/**
 * Limit table transcribed from Olson & Ferkul, "Evaluating Material Flammability
 * in Microgravity and Martian Gravity Compared to the NASA Standard Normal
 * Gravity Test," AIAA 2012-3492 / ICES, Table I.
 *
 * ULOI is the upward limiting oxygen index. MOC is the maximum oxygen
 * concentration that still self-extinguished. Starred low-g values use a
 * ~5 s drop-tower criterion, which is shorter than the 15 cm Test 1 burn.
 * Delta is their published mean-limit shift versus the 1 g mean.
 */
export const witnesses: Witness[] = [
  {
    id: "nomex",
    name: "Nomex HT90-40",
    short: "Nomex",
    role: "Aromatic nylon fabric used in spacecraft soft goods. Chars, does not melt.",
    behavior: "charring",
    testPressurePsia: 14.7,
    source: "Olson & Ferkul, AIAA 2012-3492, Table I. Nomex column is at 14.7 psia.",
    sourceUrl: "https://doi.org/10.2514/6.2012-3492",
    points: [
      { regime: "micro", gravityG: 0, uloi: 23.0, moc: 22.0, deltaVsEarth: -0.3 },
      { regime: "lunar", gravityG: 0.166, uloi: 21.0, moc: 19.9, deltaVsEarth: -2.35 },
      { regime: "mars", gravityG: 0.38, uloi: 19.9, moc: 19.0, deltaVsEarth: -3.35 },
      { regime: "earth", gravityG: 1, uloi: 23.5, moc: 22.1, deltaVsEarth: 0 },
    ],
  },
  {
    id: "ultem",
    name: "Ultem 1000",
    short: "Ultem",
    role: "10 mil fire-retarded polyetherimide film. Chars, low smoke, used as an aerospace film.",
    behavior: "charring",
    testPressurePsia: 10.2,
    source: "Olson & Ferkul, AIAA 2012-3492, Table I. Ultem column is at 10.2 psia.",
    sourceUrl: "https://doi.org/10.2514/6.2012-3492",
    points: [
      { regime: "micro", gravityG: 0, uloi: 24.0, moc: 23.0, deltaVsEarth: 0.25 },
      { regime: "lunar", gravityG: 0.166, uloi: 21.0, moc: 19.9, deltaVsEarth: -2.8 },
      { regime: "mars", gravityG: 0.38, uloi: 22.0, moc: 21.1, deltaVsEarth: -1.7 },
      { regime: "earth", gravityG: 1, uloi: 23.5, moc: 23.0, deltaVsEarth: 0 },
    ],
  },
  {
    id: "mylar",
    name: "Mylar G",
    short: "Mylar",
    role: "5 mil PET film. Melts, does not char. A laboratory witness, not a cabin lining.",
    behavior: "melting",
    testPressurePsia: 10.2,
    source: "Olson & Ferkul, AIAA 2012-3492, Table I. Mylar column is at 10.2 psia.",
    sourceUrl: "https://doi.org/10.2514/6.2012-3492",
    points: [
      { regime: "micro", gravityG: 0, uloi: 17.0, moc: 16.0, deltaVsEarth: -4.1 },
      { regime: "lunar", gravityG: 0.166, uloi: 15.6, moc: 14.1, deltaVsEarth: -5.75 },
      { regime: "mars", gravityG: 0.38, uloi: 18.0, moc: 17.0, deltaVsEarth: -3.1 },
      { regime: "earth", gravityG: 1, uloi: 21.2, moc: 20.0, deltaVsEarth: 0 },
    ],
  },
];

export const defaultWitnessId = "nomex";

export const catalog: CatalogMaterial[] = [
  {
    id: "sibal",
    name: "SIBAL fabric",
    role: "75% cotton / 25% fiberglass reference fuel. It holds its shape after the cotton is gone.",
    known:
      "Saffire-I large-duct concurrent spread was 0.18 cm/s at 21.7% O2, 102 kPa, 20 cm/s. In lunar gravity, downward spread in air has been observed where the same downward burn extinguishes immediately in 1 g.",
    source: "Combustion and Flame 2022, Table 1; NTRS 20240015307 (FM2).",
  },
  {
    id: "cotton",
    name: "Cotton jersey",
    role: "Thin cellulose comparison fuel in Saffire V.",
    known:
      "Saffire V-2 burned at 26.2% O2 and 70.7 kPa. A cotton row in the 2022 review table spread at 0.34 cm/s at 27.7% O2 and 76 kPa.",
    source: "ICES 2024 Saffire VI paper, Table 1; Combustion and Flame DOI 10.1016/j.combustflame.2022.112559.",
  },
  {
    id: "pmma",
    name: "PMMA",
    role: "Cast acrylic. A thick fuel used to stand in for rigid plastics.",
    known:
      "On Saffire VI the two-sided 1 cm sample and the one-sided 0.5 cm sample kept growing until the flow was cut. Both drove cabin CO2 and CO through published exposure limits. Peak heat release was about 1.5 to 3.1 kW.",
    source: "Preliminary Results from the Saffire VI Experiment, NTRS 20240002981, Table 2.",
  },
  {
    id: "silicone",
    name: "Silicone",
    role: "Saffire-II thickness series (0.27, 0.61, and 1.03 mm).",
    known:
      "Flown to see how thickness changes low-g spread. Ember does not assign a pass or fail; the public table used here does not include a limiting oxygen for these sheets.",
    source: "NASA TM summary of Saffire I–III sample cards.",
  },
  {
    id: "beta",
    name: "Beta cloth and other flight textiles",
    role: "Glass fabrics and coated cloths that actually fly.",
    known:
      "No limiting-oxygen row in the Olson & Ferkul table. Absence from that table is not a pass. FM2 and the lunar flammability program exist because partial-g limits for flight materials are still thin.",
    source: "OCHMO-TB-008; NTRS 20240015307.",
  },
];
