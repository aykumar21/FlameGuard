export type View = "mission" | "atlas" | "materials" | "ember" | "brief" | "contributors";

export type Scenario = "visible" | "cool";

export type GravityRegime = "micro" | "lunar" | "mars" | "earth";

export type Topic =
  | "limits"
  | "lunar"
  | "mars"
  | "spread"
  | "scale"
  | "detection"
  | "smoke"
  | "suppression"
  | "cool-flame"
  | "atmosphere"
  | "materials"
  | "large-scale"
  | "droplets"
  | "solids"
  | "gap";

export type Confidence = "measured" | "reported" | "interpretation";

export type Mission = {
  id: string;
  name: string;
  place: string;
  gravityG: number;
  oxygenPct: number;
  pressurePsia: number;
  flowCms: number;
  resupply: boolean;
  summary: string;
};

export type LimitPoint = {
  regime: GravityRegime;
  gravityG: number;
  uloi: number;
  moc: number;
  /** Published mean-limit shift versus the 1 g mean, in oxygen percentage points. */
  deltaVsEarth: number;
};

export type Witness = {
  id: string;
  name: string;
  short: string;
  role: string;
  behavior: string;
  testPressurePsia: number;
  points: LimitPoint[];
  source: string;
  sourceUrl: string;
};

export type CatalogMaterial = {
  id: string;
  name: string;
  role: string;
  known: string;
  source: string;
};

export type Investigation = {
  id: string;
  name: string;
  years: string;
  platform: string;
  regimes: GravityRegime[];
  topics: Topic[];
  /** Representative atmospheres used for proximity ranking. */
  atmospheres: { oxygenPct: number; pressureKpa: number }[];
  summary: string;
  why: string;
  citation: string;
  url: string;
};

export type Finding = {
  id: string;
  investigationId: string;
  claim: string;
  detail: string;
  tags: string[];
  topics: Topic[];
  confidence: Confidence;
  citation: string;
  url: string;
};

export type SpreadRow = {
  id: string;
  flight: string;
  material: string;
  flowCms: number;
  oxygenPct: number;
  pressureKpa: number;
  spreadCms: number;
  note: string;
  citation: string;
  url: string;
};
