import { missions } from "../data/missions";
import type { GravityRegime, Mission, Scenario, Witness } from "../data/types";

export const LUNAR_G = 0.166;
export const MARS_G = 0.38;

const ANCHOR = {
  oxygenPct: 21.7,
  pressureKpa: 102,
  flowCms: 20,
  spreadCms: 0.18,
};

export type Side = "extinguish" | "transition" | "burning";
export type Provenance = "measured" | "interpolated" | "held";

export type BandReading = {
  uloi: number;
  moc: number;
  regime: GravityRegime | "between";
  regimeLabel: string;
  provenance: Provenance;
  provenanceNote: string;
  deltaVsEarth: number | null;
};

export type AssessmentInput = {
  mission: Mission;
  witness: Witness;
  oxygenPct: number;
  pressurePsia: number;
  flowCms: number;
  gravityG: number;
  scenario: Scenario;
};

export type Assessment = AssessmentInput & {
  pressureKpa: number;
  oxygenPartialPsia: number;
  band: BandReading;
  side: Side;
  /** Signed: positive means cabin oxygen is above ULOI (burning side). */
  overrunPts: number;
  gapLabel: string;
  gapPoints: number;
  limitScore: number;
  oxygenScore: number;
  detectionScore: number;
  suppressionScore: number;
  index: number;
  indexWord: "Guarded" | "Watch" | "Elevated" | "Severe";
  pressureMatch: "matched" | "offset";
  spread: null | {
    ratio: number;
    absoluteCms: number;
    extrapolated: boolean;
  };
};

export function clamp(value: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, value));
}

export function psiaToKpa(psia: number): number {
  return psia * 6.894757;
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function oxygenScore(oxygenPct: number): number {
  return clamp((oxygenPct - 17) * 3.6, 0, 100);
}

export function limitScore(side: Side, oxygenPct: number, uloi: number, moc: number): number {
  if (side === "extinguish") return clamp(42 - (moc - oxygenPct) * 4, 8, 52);
  if (side === "transition") return 60;
  return clamp(62 + (oxygenPct - uloi) * 3.2, 62, 100);
}

export function detectionScore(gravityG: number, flowCms: number, scenario: Scenario): number {
  let score = gravityG <= 0.02 ? 58 : gravityG < 0.75 ? 44 : 16;
  if (flowCms < 8) score += 16;
  if (scenario === "cool") score += 18;
  return clamp(score, 0, 100);
}

export function suppressionScore(oxygenPct: number, gravityG: number, resupply: boolean): number {
  let score = 22 + Math.max(0, oxygenPct - 21) * 2.6;
  if (gravityG <= 0.02) score += 8;
  if (!resupply) score += 10;
  return clamp(score, 0, 100);
}

export function indexWord(index: number): Assessment["indexWord"] {
  if (index < 40) return "Guarded";
  if (index < 55) return "Watch";
  if (index < 66) return "Elevated";
  return "Severe";
}

function point(witness: Witness, regime: GravityRegime) {
  const found = witness.points.find((item) => item.regime === regime);
  if (!found) throw new Error(`Missing ${regime} for ${witness.id}`);
  return found;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Exact table values at the four published gravities. Between them, linear and labeled. */
export function readBand(witness: Witness, gravityG: number): BandReading {
  const micro = point(witness, "micro");
  const lunar = point(witness, "lunar");
  const mars = point(witness, "mars");
  const earth = point(witness, "earth");

  if (gravityG <= 0.02) {
    return {
      uloi: micro.uloi,
      moc: micro.moc,
      regime: "micro",
      regimeLabel: "forced-flow microgravity",
      provenance: "measured",
      provenanceNote:
        "Microgravity row from the table, taken with about 30 cm/s of forced flow. It is not the left end of the partial-gravity curve.",
      deltaVsEarth: micro.deltaVsEarth,
    };
  }

  if (Math.abs(gravityG - LUNAR_G) < 0.015) {
    return {
      uloi: lunar.uloi,
      moc: lunar.moc,
      regime: "lunar",
      regimeLabel: "lunar gravity",
      provenance: "measured",
      provenanceNote: "Lunar centrifuge row. Drop time about 5 seconds.",
      deltaVsEarth: lunar.deltaVsEarth,
    };
  }

  if (Math.abs(gravityG - MARS_G) < 0.02) {
    return {
      uloi: mars.uloi,
      moc: mars.moc,
      regime: "mars",
      regimeLabel: "Martian gravity",
      provenance: "measured",
      provenanceNote: "Martian centrifuge row. Drop time about 5 seconds.",
      deltaVsEarth: mars.deltaVsEarth,
    };
  }

  if (gravityG >= 0.97) {
    return {
      uloi: earth.uloi,
      moc: earth.moc,
      regime: "earth",
      regimeLabel: "Earth gravity",
      provenance: "measured",
      provenanceNote: "1 g ULOI and MOC. This is the Test 1 family of limits.",
      deltaVsEarth: 0,
    };
  }

  if (gravityG < LUNAR_G) {
    return {
      uloi: lunar.uloi,
      moc: lunar.moc,
      regime: "lunar",
      regimeLabel: "sub-lunar gravity",
      provenance: "held",
      provenanceNote:
        "No published point between free fall and lunar g. Ember holds the lunar limit and does not draw a line down to zero.",
      deltaVsEarth: null,
    };
  }

  const [left, right, leftG, rightG, label] =
    gravityG < MARS_G
      ? [lunar, mars, LUNAR_G, MARS_G, "between lunar and Martian gravity"]
      : [mars, earth, MARS_G, 1, "between Martian and Earth gravity"];

  const t = (gravityG - leftG) / (rightG - leftG);
  return {
    uloi: lerp(left.uloi, right.uloi, t),
    moc: lerp(left.moc, right.moc, t),
    regime: "between",
    regimeLabel: label,
    provenance: "interpolated",
    provenanceNote:
      "Straight line between two measured gravities, for comparison only. The true limit is not known to be linear.",
    deltaVsEarth: null,
  };
}

export function sideOf(oxygenPct: number, uloi: number, moc: number): Side {
  if (oxygenPct <= moc) return "extinguish";
  if (oxygenPct >= uloi) return "burning";
  return "transition";
}

/**
 * Ratio to Saffire-I large-duct SIBAL.
 * Vf / Vf_ref = (O2 / 21.7) * sqrt(P / 102 kPa) * (U / 20 cm/s).
 * Valid as a microgravity screening ratio near the tested range.
 */
export function spreadRatio(oxygenPct: number, pressureKpa: number, flowCms: number) {
  const ratio =
    (oxygenPct / ANCHOR.oxygenPct) *
    Math.sqrt(pressureKpa / ANCHOR.pressureKpa) *
    (flowCms / ANCHOR.flowCms);
  const extrapolated =
    oxygenPct < 16 ||
    oxygenPct > 32 ||
    flowCms < 10 ||
    flowCms > 35 ||
    pressureKpa < 60 ||
    pressureKpa > 120;
  return {
    ratio,
    absoluteCms: ANCHOR.spreadCms * ratio,
    extrapolated,
  };
}

export function assess(input: AssessmentInput): Assessment {
  const pressureKpa = psiaToKpa(input.pressurePsia);
  const band = readBand(input.witness, input.gravityG);
  const side = sideOf(input.oxygenPct, band.uloi, band.moc);
  const overrunPts = input.oxygenPct - band.uloi;

  let gapPoints = 0;
  let gapLabel = "";
  if (side === "burning") {
    gapPoints = input.oxygenPct - band.uloi;
    gapLabel = "above ULOI*";
  } else if (side === "extinguish") {
    gapPoints = band.moc - input.oxygenPct;
    gapLabel = "under MOC*";
  } else {
    gapPoints = Math.min(input.oxygenPct - band.moc, band.uloi - input.oxygenPct);
    gapLabel = "inside the transition band";
  }

  const limit = limitScore(side, input.oxygenPct, band.uloi, band.moc);
  const oxygen = oxygenScore(input.oxygenPct);
  const detection = detectionScore(input.gravityG, input.flowCms, input.scenario);
  const suppression = suppressionScore(input.oxygenPct, input.gravityG, input.mission.resupply);
  const index = (limit + oxygen + detection + suppression) / 4;

  const pressureDelta = Math.abs(input.pressurePsia - input.witness.testPressurePsia) / input.witness.testPressurePsia;

  return {
    ...input,
    pressureKpa,
    oxygenPartialPsia: input.pressurePsia * (input.oxygenPct / 100),
    band,
    side,
    overrunPts,
    gapLabel,
    gapPoints,
    limitScore: limit,
    oxygenScore: oxygen,
    detectionScore: detection,
    suppressionScore: suppression,
    index,
    indexWord: indexWord(index),
    pressureMatch: pressureDelta <= 0.12 ? "matched" : "offset",
    spread: input.gravityG <= 0.02 ? spreadRatio(input.oxygenPct, pressureKpa, input.flowCms) : null,
  };
}

export function assessMission(mission: Mission, witness: Witness, scenario: Scenario): Assessment {
  return assess({
    mission,
    witness,
    oxygenPct: mission.oxygenPct,
    pressurePsia: mission.pressurePsia,
    flowCms: mission.flowCms,
    gravityG: mission.gravityG,
    scenario,
  });
}

export function presetBoard(witness: Witness, scenario: Scenario) {
  return missions.map((mission) => ({
    mission,
    assessment: assessMission(mission, witness, scenario),
  }));
}

export function worstLimitMission(witness: Witness, scenario: Scenario) {
  const board = presetBoard(witness, scenario).filter((row) => row.mission.oxygenPct >= 30);
  return board.reduce((worst, row) => (row.assessment.overrunPts > worst.assessment.overrunPts ? row : worst));
}

export function highestIndexMission(witness: Witness, scenario: Scenario) {
  const board = presetBoard(witness, scenario);
  return board.reduce((worst, row) => (row.assessment.index > worst.assessment.index ? row : worst));
}
