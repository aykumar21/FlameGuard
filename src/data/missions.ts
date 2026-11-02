import type { Mission } from "./types";

/**
 * Atmospheres are published design cases, not a claim that a named vehicle
 * has already certified that cabin recipe.
 * ISS air and the 30% / 10.2 psia pre-EVA case: Olson & Ferkul, ICES 2012.
 * 8.2 psia / 34% O2: Exploration Atmospheres Working Group case, cited there
 * and in NASA fire-safety gap statements as the exploration worst case.
 */
export const missions: Mission[] = [
  {
    id: "iss",
    name: "ISS cabin",
    place: "Low Earth orbit",
    gravityG: 0,
    oxygenPct: 21,
    pressurePsia: 14.7,
    flowCms: 15,
    resupply: true,
    summary:
      "Sea-level air. Flames follow the ventilation, and smoke does not rise to a ceiling.",
  },
  {
    id: "preeva",
    name: "ISS pre-EVA",
    place: "Low Earth orbit, short window",
    gravityG: 0,
    oxygenPct: 30,
    pressurePsia: 10.2,
    flowCms: 15,
    resupply: true,
    summary:
      "The historical worst-case atmosphere for Shuttle and ISS materials screening. A few hours, not a habitat.",
  },
  {
    id: "transit",
    name: "Deep-space transit",
    place: "Microgravity, exploration air",
    gravityG: 0,
    oxygenPct: 34,
    pressurePsia: 8.2,
    flowCms: 20,
    resupply: false,
    summary:
      "8.2 psia and 34% oxygen, the exploration-atmosphere case. Months from a resupply and no buoyant direction for smoke or suppressant.",
  },
  {
    id: "lunar",
    name: "Lunar surface",
    place: "0.166 g, exploration air",
    gravityG: 0.166,
    oxygenPct: 34,
    pressurePsia: 8.2,
    flowCms: 20,
    resupply: false,
    summary:
      "The Artemis design problem. Partial gravity can lower the oxygen limit, and this atmosphere is already far above the published limits.",
  },
  {
    id: "mars",
    name: "Mars surface",
    place: "0.38 g, exploration air",
    gravityG: 0.38,
    oxygenPct: 34,
    pressurePsia: 8.2,
    flowCms: 20,
    resupply: false,
    summary:
      "More buoyancy than the Moon. For Nomex, the published oxygen limit was lower here than at lunar gravity.",
  },
  {
    id: "bench",
    name: "Test 1 bench",
    place: "Earth, exploration air",
    gravityG: 1,
    oxygenPct: 34,
    pressurePsia: 8.2,
    flowCms: 20,
    resupply: true,
    summary:
      "Same exploration air as the lunar case, run at 1 g the way NASA-STD-6001 Test 1 is run. The gravity is the thing that changes.",
  },
];

export const defaultMissionId = "lunar";
