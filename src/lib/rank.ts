import { findings, investigations } from "../data/corpus";
import type { Finding, Investigation, Topic } from "../data/types";
import type { Assessment } from "./model";

export type ScoreParts = {
  gravity: number;
  atmosphere: number;
  topic: number;
  total: number;
  reasons: string[];
};

export type RankedInvestigation = {
  investigation: Investigation;
  parts: ScoreParts;
};

export type RankedFinding = {
  finding: Finding;
  score: number;
  why: string;
};

function gravityPart(inv: Investigation, g: number): { points: number; reason: string } {
  const has = (regime: Investigation["regimes"][number]) => inv.regimes.includes(regime);
  if (g <= 0.02) {
    if (has("micro")) return { points: 34, reason: "Flown or measured in forced-flow microgravity" };
    if (has("lunar") || has("mars")) return { points: 14, reason: "Partial-gravity record, used as the neighboring regime" };
    return { points: 8, reason: "1 g method, the screen programs inherit" };
  }
  if (g < 0.26) {
    if (has("lunar")) return { points: 36, reason: "Contains a lunar-gravity measurement" };
    if (has("mars")) return { points: 22, reason: "Partial-gravity neighbor of the lunar case" };
    if (has("micro")) return { points: 16, reason: "Microgravity record, the other end of the gap" };
    return { points: 10, reason: "1 g baseline the lunar limit is compared against" };
  }
  if (g < 0.7) {
    if (has("mars")) return { points: 36, reason: "Contains a Martian-gravity measurement" };
    if (has("lunar")) return { points: 24, reason: "Other partial-gravity point in the same table" };
    if (has("micro")) return { points: 14, reason: "Microgravity record beside a partial-g question" };
    return { points: 10, reason: "1 g baseline" };
  }
  if (has("earth")) return { points: 30, reason: "1 g method, matched to this bench" };
  if (has("micro")) return { points: 12, reason: "Flight record that Test 1 is being asked to represent" };
  return { points: 16, reason: "Partial-gravity comparison with the bench" };
}

function atmospherePart(inv: Investigation, oxygenPct: number, pressureKpa: number): { points: number; reason: string } {
  if (inv.atmospheres.length === 0) {
    return { points: 8, reason: "Operational brief, not a single test atmosphere" };
  }
  let best = Infinity;
  let bestAir = inv.atmospheres[0];
  for (const air of inv.atmospheres) {
    const distance = Math.abs(air.oxygenPct - oxygenPct) / 8 + Math.abs(air.pressureKpa - pressureKpa) / 35;
    if (distance < best) {
      best = distance;
      bestAir = air;
    }
  }
  const points = Math.max(4, Math.round(30 - best * 12));
  return {
    points,
    reason: `Nearest test air in this record is ${bestAir.oxygenPct}% O2 at ${Math.round(bestAir.pressureKpa)} kPa`,
  };
}

function dominantTopics(a: Assessment): Topic[] {
  const pairs: [Topic, number][] = [
    ["limits", a.limitScore],
    ["detection", a.detectionScore],
    ["suppression", a.suppressionScore],
    ["atmosphere", a.oxygenScore],
  ];
  pairs.sort((x, y) => y[1] - x[1]);
  const topics: Topic[] = [pairs[0][0]];
  if (a.gravityG > 0.02 && a.gravityG < 0.26) topics.push("lunar", "gap");
  else if (a.gravityG >= 0.26 && a.gravityG < 0.7) topics.push("mars", "gap");
  if (a.oxygenPct >= 28) topics.push("atmosphere", "large-scale");
  if (a.scenario === "cool") topics.push("cool-flame", "detection");
  return topics;
}

export function scoreInvestigation(inv: Investigation, a: Assessment): ScoreParts {
  const g = gravityPart(inv, a.gravityG);
  let air = atmospherePart(inv, a.oxygenPct, a.pressureKpa);
  if (inv.topics.includes("limits") && g.points >= 30 && air.points < 24) {
    air = {
      points: 24,
      reason: "Limit table at this gravity. Cabin oxygen is judged against that boundary.",
    };
  }
  const wanted = dominantTopics(a);
  const hits = wanted.filter((topic) => inv.topics.includes(topic));
  const topic = Math.min(24, hits.length * 8);
  const reasons = [g.reason, air.reason];
  if (hits.length) reasons.push(`Speaks to ${hits.slice(0, 3).join(", ")}`);
  let total = g.points + air.points + topic;
  if (inv.id === "fm2") {
    reasons.push("Still a planned lunar payload, so it ranks the open question rather than a finished table");
    total -= 10;
  }
  return {
    gravity: g.points,
    atmosphere: air.points,
    topic,
    total,
    reasons,
  };
}

export function rankInvestigations(a: Assessment): RankedInvestigation[] {
  return investigations
    .map((investigation) => ({ investigation, parts: scoreInvestigation(investigation, a) }))
    .sort((x, y) => y.parts.total - x.parts.total || x.investigation.name.localeCompare(y.investigation.name));
}

const SYNONYMS: Record<string, string[]> = {
  moon: ["lunar", "artemis", "0.16"],
  lunar: ["moon", "artemis"],
  mars: ["martian", "0.38"],
  martian: ["mars"],
  microgravity: ["micro", "freefall", "free", "iss", "zero"],
  oxygen: ["o2", "atmosphere", "air"],
  test: ["6001", "pass", "certif", "screening"],
  smoke: ["detector", "alarm", "sensor", "ventilation"],
  detector: ["smoke", "alarm"],
  cool: ["invisible", "extinguish", "formaldehyde", "ntc"],
  suppress: ["extinguish", "co2", "mist", "foam", "dilut"],
  saffire: ["cygnus", "large"],
  spread: ["rate", "fast", "cm/s"],
  nomex: ["fabric", "textile"],
  mylar: ["pet", "melt"],
  ultem: ["pei", "char"],
  gap: ["unknown", "missing", "fm2"],
};

const STOP = new Set([
  "the", "and", "for", "with", "that", "this", "from", "are", "was", "what", "when", "how", "why",
  "can", "after", "into", "about", "does", "will", "keep", "your", "have", "has", "not", "but",
  "its", "you", "already", "there", "been", "which", "flight",
]);

function tokens(query: string): string[] {
  const raw = query
    .toLowerCase()
    .replace(/[^a-z0-9.% ]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word));
  const expanded = new Set(raw);
  for (const word of raw) {
    for (const [key, values] of Object.entries(SYNONYMS)) {
      if (word.includes(key) || key.includes(word)) {
        expanded.add(key);
        values.forEach((value) => expanded.add(value));
      }
    }
  }
  return [...expanded];
}

export type Intent = "limits" | "spread" | "detect" | "cool" | "suppress" | "gap" | "scale" | "which" | "general";

export function classify(query: string): Intent {
  const q = query.toLowerCase();
  const rules: [Intent, RegExp][] = [
    ["cool", /cool flame|invisible|after .*exting|formaldehyde|still burning|can't see|cannot see/],
    ["detect", /smoke|detector|alarm|sensor|ventilat|where does smoke|ceiling/],
    ["suppress", /suppress|extinguish|co2|carbon dioxide|water mist|foam|dilut|put it out|put out/],
    ["spread", /how fast|spread rate|cm\/s|saffire-i\b|how quickly|burn time/],
    ["scale", /small sample|duct|bass|scale|full scale|vehicle/],
    ["gap", /do not know|don't know|unknown|gap|fm2|what is missing|untested/],
    ["which", /closest|which (saffire|flight|experiment|test)|exploration atmosphere/],
    ["limits", /test 1|6001|pass|safe|limit|uloi|flammab|moon|lunar|mars|nomex|mylar|ultem|material/],
  ];
  for (const [intent, pattern] of rules) {
    if (pattern.test(q)) return intent;
  }
  return "general";
}

export function rankFindings(query: string, a: Assessment): RankedFinding[] {
  const words = tokens(query);
  const intent = classify(query);
  return findings
    .map((finding) => {
      const hay = `${finding.claim} ${finding.detail} ${finding.tags.join(" ")}`.toLowerCase();
      let lexical = 0;
      for (const word of words) {
        if (hay.includes(word)) lexical += 3;
      }
      if (lexical === 0) {
        return { finding, score: 0, why: "No overlap with the question." };
      }
      let score = lexical;
      if (intent === "limits" && finding.topics.includes("limits")) score += 6;
      if (intent === "spread" && finding.topics.includes("spread")) score += 6;
      if (intent === "detect" && finding.topics.includes("detection")) score += 6;
      if (intent === "cool" && finding.topics.includes("cool-flame")) score += 8;
      if (intent === "suppress" && finding.topics.includes("suppression")) score += 6;
      if (intent === "gap" && finding.topics.includes("gap")) score += 6;
      if (intent === "scale" && finding.topics.includes("scale")) score += 6;
      if (a.gravityG > 0.05 && a.gravityG < 0.3 && finding.tags.includes("lunar")) score += 3;
      if (a.gravityG > 0.3 && a.gravityG < 0.7 && finding.tags.includes("mars")) score += 3;
      if (a.oxygenPct >= 28 && finding.tags.includes("exploration")) score += 3;
      if (finding.tags.includes(a.witness.id)) score += 4;
      const why =
        score > 0
          ? "Retrieved because the wording and the mission overlap this row."
          : "Low overlap with the question.";
      return { finding, score, why };
    })
    .filter((row) => row.score > 0)
    .sort((x, y) => y.score - x.score || x.finding.id.localeCompare(y.finding.id));
}
