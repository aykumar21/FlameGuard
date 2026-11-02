import type { Assessment } from "./model";
import { round1 } from "./model";

export function points(value: number): string {
  return round1(value).toFixed(1);
}

export function limitLead(a: Assessment): string {
  const name = a.witness.short;
  const where = a.band.regimeLabel;
  const uloi = points(a.band.uloi);
  const moc = points(a.band.moc);
  const o2 = points(a.oxygenPct);

  if (a.side === "burning") {
    return `${name} at ${o2}% oxygen is ${points(a.gapPoints)} percentage points above its ${where} ULOI* of ${uloi}%.`;
  }
  if (a.side === "extinguish") {
    return `${name} at ${o2}% oxygen is ${points(a.gapPoints)} percentage points under its ${where} MOC* of ${moc}%.`;
  }
  return `${name} at ${o2}% oxygen sits inside the published transition band, MOC* ${moc}% to ULOI* ${uloi}%, at ${where}.`;
}

export function pressureLead(a: Assessment): string {
  const test = points(a.witness.testPressurePsia);
  const cabin = points(a.pressurePsia);
  if (a.pressureMatch === "matched") {
    return `The limit was measured at ${test} psia, close to this cabin at ${cabin} psia.`;
  }
  return `The limit was measured at ${test} psia. This cabin is ${cabin} psia. Ember compares mole fraction directly and does not invent a pressure correction.`;
}

export function partialPressureLead(a: Assessment): string {
  return `${points(a.oxygenPct)}% at ${points(a.pressurePsia)} psia is ${points(a.oxygenPartialPsia)} psia of oxygen. Sea-level air is about 3.1 psia of oxygen. The flame sees the mole fraction.`;
}

export function detectionLead(a: Assessment): string {
  if (a.scenario === "cool") {
    return "The cool-flame case is included: FLEX showed a droplet flame that continues after the visible hot flame is gone, with little soot for a camera or a particulate detector.";
  }
  if (a.gravityG <= 0.02 && a.flowCms < 8) {
    return "Flow is under 8 cm/s in microgravity. Smoke has no buoyant path and almost no forced path, so a return-duct detector can be blind to a rack fire.";
  }
  if (a.gravityG <= 0.02) {
    return "Smoke will follow the ventilation, not a ceiling. On Saffire-VI a 1 mg/m³ threshold arrived at 981 s, after most of the CO and CO2 were already in the cabin.";
  }
  if (a.gravityG < 0.75) {
    return "Partial gravity gives smoke a weak rise and still leaves the fan in charge. A ceiling detector copied from Earth is pointed at the wrong place.";
  }
  return "At 1 g, smoke rises and a ceiling detector is pointed the right way. That geometry is the bench, not the Moon.";
}

export function suppressionLead(a: Assessment): string {
  const extra = a.oxygenPct - 21;
  const agent =
    a.gravityG <= 0.02
      ? "In microgravity, carbon dioxide and water mist have no preferred direction. CO2 stays in the air the crew breathes."
      : a.gravityG < 0.75
        ? "At partial gravity, suppressant falls slowly. A pour aimed the way it is on Earth will not land the same way, and CO2 still remains in the cabin."
        : "At 1 g, liquid and heavy gas drop. That is the bench, and it is the easy case for aiming an extinguisher.";
  if (extra <= 0) {
    return `${agent} This cabin is at or below 21% oxygen, so dilution has less distance to cover than an exploration atmosphere.`;
  }
  const resupply = a.mission.resupply
    ? "This preset still has a resupply path."
    : "This preset has no resupply, so every gram of diluent is mass you carried.";
  return `${agent} Reaching a 21% mole fraction from ${points(a.oxygenPct)}% means removing ${points(extra)} oxygen points from the whole volume. ${resupply}`;
}

export function spreadLead(a: Assessment): string {
  if (!a.spread) {
    return "The Saffire forced-flow ratio is withheld at this gravity. Buoyant flow can exceed the fan, and an upward flame can accelerate. That is a different regime from the Cygnus duct.";
  }
  const range = a.spread.extrapolated
    ? "The cabin is outside the narrow range of the Saffire I–V anchor, so the ratio is an extrapolation."
    : "The cabin is near the pressure, oxygen, and flow of the flights used to build the ratio.";
  return `Relative to Saffire-I large-duct SIBAL (0.18 cm/s at 21.7% O2, 102 kPa, 20 cm/s), this microgravity case scales by ×${a.spread.ratio.toFixed(2)} if Vf ∝ O2% · √P · U. ${range} Duct size changed Saffire rates by as much as the atmosphere. The number is a ratio, not a predicted burn time.`;
}

export function gapLead(a: Assessment): string {
  const partial = a.gravityG > 0.02 && a.gravityG < 0.9;
  const exploration = a.oxygenPct >= 28 && a.pressurePsia <= 10;
  if (partial && exploration) {
    return "Saffire-VI has burned near this oxygen in microgravity. Olson and Ferkul have burned partial gravity near air and at 10–15 psia. A large fire at exploration oxygen and lunar or Martian gravity is the empty cell. FM2 is aimed at that cell and has not yet delivered it.";
  }
  if (exploration) {
    return "Saffire-VI is the large-scale neighbor of this atmosphere, at about 31% oxygen and 54 kPa, in microgravity only. The partial-gravity limit table stops at three thin materials and a five-second drop.";
  }
  if (partial) {
    return "Partial-gravity limits exist for Mylar, Ultem, and Nomex. They do not exist here for the rest of a vehicle, and they were not measured at 8.2 psia.";
  }
  return "Microgravity vehicle fires and 1 g Test 1 are the well-populated cells. Partial gravity is the thin one.";
}

export function splitLead(limitName: string, indexName: string): string | null {
  if (limitName === indexName) return null;
  return `The lowest published overrun and the highest exposure index are different missions (${limitName} versus ${indexName}). A lower oxygen limit and a harder detection problem are not the same score.`;
}

export const prompts = [
  "Will a Test 1 pass keep a material safe on the Moon?",
  "Which flight is closest to an exploration atmosphere?",
  "Why can the alarm arrive after the air is already toxic?",
  "What happens after the visible flame goes out?",
  "Is carbon dioxide the right extinguisher for this cabin?",
  "What has never been burned at this gravity and this oxygen?",
];

export function briefSections(input: {
  assessment: Assessment;
  ranked: { name: string; why: string; score: number }[];
  verdict: string;
}): { heading: string; paragraphs: string[] }[] {
  const a = input.assessment;
  return [
    {
      heading: "Situation",
      paragraphs: [
        `${a.mission.name} · ${a.mission.place}. Witness material ${a.witness.name}.`,
        `${points(a.oxygenPct)}% oxygen at ${points(a.pressurePsia)} psia (${points(a.pressureKpa)} kPa), forced flow ${points(a.flowCms)} cm/s, gravity ${a.gravityG.toFixed(3)} g. ${partialPressureLead(a)}`,
        a.mission.summary,
      ],
    },
    {
      heading: "Limit against the published table",
      paragraphs: [limitLead(a), pressureLead(a), a.band.provenanceNote],
    },
    {
      heading: "Exposure index",
      paragraphs: [
        `${Math.round(a.index)} · ${a.indexWord}. Equal weight on limit (${Math.round(a.limitScore)}), oxygen fraction (${Math.round(a.oxygenScore)}), detection (${Math.round(a.detectionScore)}), and suppression (${Math.round(a.suppressionScore)}).`,
        "The index compares missions. It is not a probability of ignition and it does not replace NASA-STD-6001.",
      ],
    },
    {
      heading: "Detection",
      paragraphs: [detectionLead(a)],
    },
    {
      heading: "Suppression",
      paragraphs: [suppressionLead(a)],
    },
    {
      heading: "Spread",
      paragraphs: [spreadLead(a)],
    },
    {
      heading: "What Ember says about the question on the desk",
      paragraphs: [input.verdict],
    },
    {
      heading: "Record ranked for this cabin",
      paragraphs: input.ranked.slice(0, 5).map((row) => `${row.name} (${row.score}). ${row.why}`),
    },
    {
      heading: "Open cell",
      paragraphs: [gapLead(a)],
    },
  ];
}

export function methodText(): string[] {
  return [
    "Exposure index is the average of four scores from 0 to 100. It compares missions. It is not a probability of fire and it does not certify a material.",
    "Limit score. On the self-extinguishment side of MOC*, 42 − 4 × (MOC* − cabin O2), clamped 8–52. Inside the band, 60. On the burning side of ULOI*, 62 + 3.2 × (cabin O2 − ULOI*), clamped at 100.",
    "Oxygen score. (O2% − 17) × 3.6. Mole fraction, because that is what moved the limits. Partial pressure is shown beside it and is not inside the score.",
    "Detection score. 58 in microgravity, 44 from just above free fall up to Martian gravity, 16 at Earth. Add 16 if forced flow is under 8 cm/s. Add 18 in the cool-flame scenario.",
    "Suppression score. 22 + 2.6 × max(0, O2% − 21), plus 8 in microgravity, plus 10 when the mission preset has no resupply.",
    "Gravity lookup. Exact table values at 0 g, 0.166 g, 0.38 g, and 1 g. Between lunar and Earth the line is linear and labeled interpolated. Below lunar g the lunar value is held, not extrapolated to zero. The 0 g row stays off that curve because it is a forced-flow test.",
    "Spread ratio, microgravity only. (O2 / 21.7) × √(P / 102 kPa) × (U / 20). Anchor is Saffire-I large SIBAL at 0.18 cm/s. Withheld when gravity can drive its own flow.",
  ];
}
