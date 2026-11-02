import type { Finding } from "../data/types";
import { classify, rankFindings, rankInvestigations, type Intent } from "./rank";
import type { Assessment } from "./model";
import {
  detectionLead,
  gapLead,
  limitLead,
  partialPressureLead,
  points,
  pressureLead,
  spreadLead,
  suppressionLead,
} from "./narrative";

export type Answer = {
  intent: Intent;
  verdict: string;
  points: { title: string; body: string }[];
  evidence: Finding[];
  gaps: string[];
  confidence: "high" | "bounded" | "thin";
  confidenceWhy: string;
};

function evidenceFor(query: string, a: Assessment, ids: string[]): Finding[] {
  const ranked = rankFindings(query, a);
  const picked: Finding[] = [];
  for (const id of ids) {
    const row = ranked.find((item) => item.finding.id === id);
    if (row) picked.push(row.finding);
  }
  for (const row of ranked) {
    if (picked.length >= 4) break;
    if (!picked.some((item) => item.id === row.finding.id)) picked.push(row.finding);
  }
  return picked.slice(0, 4);
}

export function interpret(query: string, a: Assessment): Answer {
  const trimmed = query.trim();
  const intent = classify(trimmed);
  const ranked = rankFindings(trimmed, a);

  if (!trimmed || ranked.length === 0 || ranked[0].score < 4) {
    return {
      intent,
      verdict: "Ember stays inside the combustion record. Ask about a limit, a Saffire flight, smoke, a cool flame, or an extinguisher.",
      points: [],
      evidence: [],
      gaps: [gapLead(a)],
      confidence: "thin",
      confidenceWhy: "The question did not overlap the encoded findings.",
    };
  }

  const gaps = [gapLead(a), a.band.provenanceNote];
  if (a.pressureMatch === "offset") gaps.push(pressureLead(a));

  if (intent === "limits") {
    const worst = a.witness.points.reduce((low, point) => (point.uloi < low.uloi ? point : low));
    return {
      intent,
      verdict: `${limitLead(a)} ${pressureLead(a)} A Test 1 pass is a 15 cm upward burn at 1 g in the worst atmosphere the program declares. It does not move the lunar or Martian row of the Olson and Ferkul table.`,
      points: [
        {
          title: "Where this material is worst",
          body: `Across the four published gravities, ${a.witness.short} has its lowest ULOI* at ${worst.regime} gravity: ${points(worst.uloi)}% (MOC* ${points(worst.moc)}%), delta ${worst.deltaVsEarth.toFixed(2)} versus its 1 g mean. For Mylar that place is lunar. For Nomex it is Martian. For Ultem the microgravity row is slightly less flammable than 1 g, and lunar is the penalty.`,
        },
        {
          title: "What the cabin is doing",
          body: partialPressureLead(a),
        },
        {
          title: "How to read the star",
          body: "Low-g ULOI* and MOC* come from a drop of about five seconds. The sign of the partial-gravity shift is the result to keep. The tenth of a percent is not a flight allowable.",
        },
      ],
      evidence: evidenceFor(trimmed, a, ["mylar-lunar", "nomex-mars", "ultem-lunar", "test1-rule", "drop-caveat"]),
      gaps,
      confidence: a.band.provenance === "measured" ? "high" : "bounded",
      confidenceWhy:
        a.band.provenance === "measured"
          ? "The gravity matches a published column and the witness is one of the three tabulated materials."
          : "The gravity is between published columns, so the limit is interpolated and labeled.",
    };
  }

  if (intent === "spread" || intent === "scale") {
    return {
      intent,
      verdict: spreadLead(a),
      points: [
        {
          title: "What stayed still",
          body: "Saffire-I's large SIBAL flame stayed bounded at about 1.2 kW. An upward 1 g flame on a sheet that size grows. Microgravity removed the runaway and left the fan in charge.",
        },
        {
          title: "What scale did",
          body: "Narrow BASS SIBAL rows spread at 0.27 and 0.51 cm/s. One Saffire-IV row in a shorter duct spread at 0.36 cm/s, about twice the large-duct anchor of 0.18 cm/s. Width and duct moved with the rate. Ember will not turn the ratio into a cabin burn time.",
        },
      ],
      evidence: evidenceFor(trimmed, a, ["saffire-anchor", "saffire-flow", "scale-warning", "spread-scaling"]),
      gaps,
      confidence: "bounded",
      confidenceWhy: "The rates are measured. Applying them to a different duct or to partial gravity is not.",
    };
  }

  if (intent === "detect" || intent === "cool") {
    return {
      intent,
      verdict: `${detectionLead(a)} ${intent === "cool" ? "NASA's account of FLEX: cool flames yield carbon monoxide and formaldehyde, not the soot and CO2 signature of a hot flame." : ""}`.trim(),
      points: [
        {
          title: "The late alarm",
          body: "Saffire-VI, about 1.5–3.2 kW in 17–19 m³, barely warmed the far end of the vehicle. PMMA still pushed CO2 past the 1-hour limit and CO past the 24-hour limit. The 1 mg/m³ smoke threshold came at 981 seconds, after most of that gas was already released.",
        },
        {
          title: "The flame you cannot see",
          body: "FLEX cool flames continued after radiative extinction of the visible flame. Near-limit hot flames are often pale blue. Detection has to include a gas channel, not only a particle channel and a camera.",
        },
      ],
      evidence: evidenceFor(trimmed, a, ["saffire6-alarm", "saffire6-toxic", "smoke-path", "cool-flame", "cool-products", "pale-flames"]),
      gaps,
      confidence: intent === "cool" ? "bounded" : "high",
      confidenceWhy:
        "The Saffire-VI timing and the FLEX observation are published. The step from cool-flame chemistry to a named spacecraft alarm is marked as interpretation.",
    };
  }

  if (intent === "suppress") {
    return {
      intent,
      verdict: suppressionLead(a),
      points: [
        {
          title: "What is on ISS",
          body: "US segment: gaseous CO2 and fine water mist. Russian segment: water-based foam. Both were built for a vehicle that can resupply and talk to the ground in the same minute.",
        },
        {
          title: "What changes at 34%",
          body: partialPressureLead(a) + " Dilution has to cross a limiting oxygen that, for these three materials, is already in the low 20s or below. Ember does not size a bottle.",
        },
      ],
      evidence: evidenceFor(trimmed, a, ["extinguishers", "dilution", "ochmo-gaps"]),
      gaps,
      confidence: "bounded",
      confidenceWhy: "Hardware and the oxygen gap are cited. No suppressant concentration is calculated, because this corpus does not contain one for this cabin.",
    };
  }

  if (intent === "which") {
    const rankedInv = rankInvestigations(a).slice(0, 3);
    return {
      intent,
      verdict: `For this cabin, Ember ranks ${rankedInv[0].investigation.name} first. ${rankedInv[0].parts.reasons.join(". ")}.`,
      points: rankedInv.map((row) => ({
        title: `${row.investigation.name} · ${row.parts.total}`,
        body: `${row.investigation.why} Score parts: gravity ${row.parts.gravity}, atmosphere ${row.parts.atmosphere}, topic ${row.parts.topic}.`,
      })),
      evidence: evidenceFor(trimmed, a, ["saffire6-air", "saffire6-gap", "mylar-lunar", "nomex-mars"]),
      gaps,
      confidence: "bounded",
      confidenceWhy: "The order is a transparent sum of gravity match, atmosphere distance, and topic overlap. It is not a citation count.",
    };
  }

  if (intent === "gap") {
    const top = rankInvestigations(a)[0];
    return {
      intent,
      verdict: gapLead(a),
      points: [
        {
          title: "The empty cell",
          body: "Large exploration-atmosphere fire: Saffire-VI, microgravity. Partial-gravity limits: three materials, five seconds, 10.2 or 14.7 psia. The product of those two conditions is what FM2 is for, and it is not in the table yet.",
        },
        {
          title: "What Ember ranks first for this mission",
          body: `${top.investigation.name}. ${top.parts.reasons[0]}.`,
        },
      ],
      evidence: evidenceFor(trimmed, a, ["saffire6-gap", "fm2-downward", "ochmo-gaps", "drop-caveat"]),
      gaps,
      confidence: "high",
      confidenceWhy: "The gap is stated by the Saffire-VI paper and by the FM2 abstract. Ember is not guessing that the cell is empty.",
    };
  }

  const topFindings = ranked.slice(0, 3).map((row) => row.finding);
  return {
    intent,
    verdict: `${limitLead(a)} The closest rows in the record are below, ranked for this cabin rather than listed in flight order.`,
    points: [
      { title: "Limit", body: `${limitLead(a)} ${pressureLead(a)}` },
      { title: "Detection", body: detectionLead(a) },
      { title: "Still open", body: gapLead(a) },
    ],
    evidence: topFindings,
    gaps,
    confidence: "bounded",
    confidenceWhy: "The verdict uses the live limit lookup. Supporting rows are the best textual matches, not a new experiment.",
  };
}
