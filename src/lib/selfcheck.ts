import { missions } from "../data/missions";
import { witnesses } from "../data/materials";
import { assessMission, spreadRatio } from "./model";
import { interpret } from "./interpret";

const nomex = witnesses.find((item) => item.id === "nomex");
const mylar = witnesses.find((item) => item.id === "mylar");
if (!nomex || !mylar) throw new Error("missing witness");

function mission(id: string) {
  const found = missions.find((item) => item.id === id);
  if (!found) throw new Error(id);
  return found;
}

const iss = assessMission(mission("iss"), nomex, "visible");
const lunar = assessMission(mission("lunar"), nomex, "visible");
const transit = assessMission(mission("transit"), nomex, "visible");
const mars = assessMission(mission("mars"), nomex, "visible");
const mylarLunar = assessMission(mission("lunar"), mylar, "visible");
const mylarMicro = assessMission(mission("transit"), mylar, "visible");

function assert(cond: boolean, message: string) {
  if (!cond) throw new Error(message);
}

assert(iss.side === "extinguish", `ISS Nomex should be under MOC, got ${iss.side} gap ${iss.gapPoints}`);
assert(iss.gapPoints > 0.5 && iss.gapPoints < 1.5, `ISS margin ${iss.gapPoints}`);
assert(iss.index < 48, `ISS index ${iss.index}`);
assert(lunar.side === "burning", "lunar Nomex should be burning-side");
assert(lunar.gapPoints > 12 && lunar.gapPoints < 14, `lunar overrun ${lunar.gapPoints}`);
assert(mars.gapPoints > lunar.gapPoints, "Nomex Mars overrun should exceed lunar");
assert(mylarLunar.gapPoints > mylarMicro.gapPoints, "Mylar lunar overrun should exceed micro-g exploration");
assert(Math.abs(mylarLunar.band.uloi - 15.6) < 0.01, "Mylar lunar ULOI");
assert(lunar.band.provenance === "measured", "lunar preset must hit the table");
assert(transit.band.provenance === "measured", "transit preset must hit the 0 g column");

const anchor = spreadRatio(21.7, 102, 20);
assert(Math.abs(anchor.ratio - 1) < 0.001, `anchor ratio ${anchor.ratio}`);
const explore = spreadRatio(34, 8.2 * 6.894757, 20);
assert(explore.ratio > 1.1 && explore.ratio < 1.25, `explore ratio ${explore.ratio}`);
assert(lunar.spread === null, "no Saffire ratio on the Moon");
assert(transit.spread !== null, "Saffire ratio in micro-g");

const moon = interpret("Will a Test 1 pass keep a material safe on the Moon?", lunar);
assert(moon.intent === "limits", moon.intent);
assert(moon.evidence.length >= 2, "moon evidence");
assert(moon.verdict.includes("ULOI"), moon.verdict);

const alarm = interpret("Why can the alarm arrive after the air is already toxic?", transit);
assert(alarm.intent === "detect", alarm.intent);
assert(alarm.evidence.some((item) => item.id === "saffire6-alarm"), "alarm evidence");

const which = interpret("Which flight is closest to an exploration atmosphere?", transit);
assert(which.intent === "which", which.intent);
assert(/Saffire-VI/i.test(which.verdict), which.verdict);

const pizza = interpret("best pizza in Taipei", iss);
assert(pizza.confidence === "thin", pizza.confidence);

console.log("selfcheck ok");
console.log(
  ["iss", "preeva", "transit", "lunar", "mars", "bench"]
    .map((id) => {
      const row = assessMission(mission(id), nomex, "visible");
      return `${id.padEnd(8)} idx ${row.index.toFixed(1).padStart(5)} ${row.indexWord.padEnd(9)} ${row.side.padEnd(11)} ${row.gapPoints.toFixed(1)} ${row.gapLabel}`;
    })
    .join("\n"),
);
