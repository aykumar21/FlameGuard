import { missions } from "../data/missions";
import { witnesses } from "../data/materials";
import { rankInvestigations } from "../lib/rank";
import {
  detectionLead,
  gapLead,
  limitLead,
  methodText,
  partialPressureLead,
  pressureLead,
  splitLead,
  spreadLead,
  suppressionLead,
} from "../lib/narrative";
import { assessMission, presetBoard } from "../lib/model";
import { useStore } from "../state";
import { Chart } from "./Chart";
import { Flame } from "./Flame";

export function Mission() {
  const store = useStore();
  const a = store.assessment;
  const board = presetBoard(a.witness, store.scenario);
  const ranked = rankInvestigations(a).slice(0, 3);
  const exploration = board.filter((row) => row.mission.oxygenPct >= 30);
  const worstLimit = exploration.reduce((best, row) =>
    row.assessment.overrunPts > best.assessment.overrunPts ? row : best,
  );
  const worstIndex = board.reduce((best, row) => (row.assessment.index > best.assessment.index ? row : best));
  const split = splitLead(worstLimit.mission.name, worstIndex.mission.name);
  const tone = a.side === "extinguish" ? "ok" : a.side === "transition" ? "mid" : "bad";

  return (
    <div className="mission">
      <aside className="rail">
        <p className="rail-label">Mission preset</p>
        <div className="mission-list">
          {missions.map((mission) => {
            const row = assessMission(mission, a.witness, store.scenario);
            const active = mission.id === store.missionId;
            return (
              <button
                key={mission.id}
                className={active ? "mission-btn active" : "mission-btn"}
                onClick={() => store.selectMission(mission.id)}
                aria-pressed={active}
              >
                <span>
                  <strong>{mission.name}</strong>
                  <em>{mission.place}</em>
                </span>
                <b className={row.side === "burning" ? "bad" : row.side === "extinguish" ? "ok" : "mid"}>
                  {Math.round(row.index)}
                </b>
              </button>
            );
          })}
        </div>

        <p className="rail-label">Witness material</p>
        <div className="seg">
          {witnesses.map((item) => (
            <button
              key={item.id}
              className={item.id === store.witnessId ? "active" : ""}
              onClick={() => store.setWitness(item.id)}
              aria-pressed={item.id === store.witnessId}
            >
              {item.short}
            </button>
          ))}
        </div>

        <p className="rail-label">Flame you are scoring</p>
        <div className="seg">
          <button className={store.scenario === "visible" ? "active" : ""} onClick={() => store.setScenario("visible")}>
            Visible
          </button>
          <button className={store.scenario === "cool" ? "active" : ""} onClick={() => store.setScenario("cool")}>
            Cool flame
          </button>
        </div>

        <Slider label="Oxygen" unit="%" min={15} max={40} step={0.1} value={store.oxygenPct} onChange={store.setOxygen} />
        <Slider
          label="Pressure"
          unit="psia"
          min={4}
          max={16}
          step={0.1}
          value={store.pressurePsia}
          onChange={store.setPressure}
        />
        <Slider label="Forced flow" unit="cm/s" min={0} max={40} step={1} value={store.flowCms} onChange={store.setFlow} />
        <Slider label="Gravity" unit="g" min={0} max={1} step={0.001} value={store.gravityG} onChange={store.setGravity} />
        <div className="snaps">
          {[
            ["0 g", 0],
            ["Moon", 0.166],
            ["Mars", 0.38],
            ["Earth", 1],
          ].map(([label, value]) => (
            <button key={label} onClick={() => store.setGravity(Number(value))}>
              {label}
            </button>
          ))}
        </div>
        <p className="ppo2">{partialPressureLead(a)}</p>
      </aside>

      <div className="stage">
        <section className="hero">
          <div>
            <p className="eyebrow">
              {store.custom ? "Adjusted cabin" : a.mission.place}
              <span className={`pill ${tone}`}>{a.side === "burning" ? "Above the limit" : a.side === "extinguish" ? "Under the limit" : "In the band"}</span>
            </p>
            <h1>{limitLead(a)}</h1>
            <p className="dek">{pressureLead(a)}</p>
            <div className="stats">
              <div>
                <strong className={tone}>{a.side === "transition" ? "Band" : a.gapPoints.toFixed(1)}</strong>
                <span>{a.gapLabel}</span>
              </div>
              <div>
                <strong>{Math.round(a.index)}</strong>
                <span>exposure index · {a.indexWord}</span>
              </div>
              <div>
                <strong>{a.band.uloi.toFixed(1)}</strong>
                <span>ULOI* · {a.band.regimeLabel}</span>
              </div>
            </div>
          </div>
          <Flame gravity={store.gravityG} oxygen={store.oxygenPct} scenario={store.scenario} flow={store.flowCms} />
        </section>

        <section className="panel">
          <header className="panel-h">
            <h2>Goldilocks limits</h2>
            <p>The lowest oxygen that still burned, plotted against gravity. The cabin line is the atmosphere you set.</p>
          </header>
          <Chart witness={a.witness} gravity={store.gravityG} oxygen={store.oxygenPct} onGravity={store.setGravity} />
          <div className="limit-table">
            <table>
              <caption>{a.witness.name} from Table I, measured at {a.witness.testPressurePsia} psia</caption>
              <thead>
                <tr>
                  <th>Gravity</th>
                  <th>ULOI*</th>
                  <th>MOC*</th>
                  <th>Δ vs 1 g</th>
                </tr>
              </thead>
              <tbody>
                {a.witness.points.map((point) => (
                  <tr key={point.regime} className={point.regime === a.band.regime ? "here" : ""}>
                    <td>{point.regime === "micro" ? "0 g forced flow" : point.regime}</td>
                    <td>{point.uloi.toFixed(1)}</td>
                    <td>{point.moc.toFixed(1)}</td>
                    <td>{point.deltaVsEarth > 0 ? "+" : ""}{point.deltaVsEarth.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={a.band.provenance === "measured" ? "ok-note" : "warn-note"}>{a.band.provenanceNote}</p>
          </div>
        </section>

        <section className="panel">
          <header className="panel-h">
            <h2>Exposure index</h2>
            <p>Four equal weights. A high oxygen limit and a hard detection problem can point at different missions.</p>
          </header>
          <div className="meters">
            <Meter label="Limit overrun" value={a.limitScore} note={limitLead(a)} />
            <Meter label="Oxygen fraction" value={a.oxygenScore} note="Mole fraction only. Partial pressure is shown in the rail and is not inside this score." />
            <Meter label="Detection" value={a.detectionScore} note={detectionLead(a)} />
            <Meter label="Suppression" value={a.suppressionScore} note={suppressionLead(a)} />
          </div>
          <p className="spread-line">{spreadLead(a)}</p>
        </section>

        <section className="panel">
          <header className="panel-h">
            <h2>Same witness, six cabins</h2>
            <p>{split ?? "For this witness, the mission with the largest limit overrun also carries the highest exposure index."}</p>
          </header>
          <div className="table-scroll">
            <table className="board pick">
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>O₂</th>
                  <th>g</th>
                  <th>Against the limit</th>
                  <th>Index</th>
                </tr>
              </thead>
              <tbody>
                {board.map((row) => (
                  <tr
                    key={row.mission.id}
                    className={row.mission.id === store.missionId ? "here" : ""}
                    onClick={() => store.selectMission(row.mission.id)}
                  >
                    <td>{row.mission.name}</td>
                    <td>{row.mission.oxygenPct}%</td>
                    <td>{row.mission.gravityG === 0 ? "0" : row.mission.gravityG.toFixed(2)}</td>
                    <td className={row.assessment.side === "burning" ? "bad" : row.assessment.side === "extinguish" ? "ok" : "mid"}>
                      {row.assessment.gapPoints.toFixed(1)} {row.assessment.gapLabel}
                    </td>
                    <td>
                      {Math.round(row.assessment.index)} · {row.assessment.indexWord}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gap-line">{gapLead(a)}</p>
        </section>

        <section className="panel">
          <header className="panel-h">
            <h2>Ranked for this cabin</h2>
            <p>Gravity match, atmosphere distance, and the hazard that is currently loudest.</p>
          </header>
          <ol className="rank-list">
            {ranked.map((row) => (
              <li key={row.investigation.id}>
                <div>
                  <strong>{row.investigation.name}</strong>
                  <em>{row.parts.total}</em>
                </div>
                <p>{row.parts.reasons.join(" · ")}</p>
              </li>
            ))}
          </ol>
          <details className="method">
            <summary>How the numbers are made</summary>
            <ul>
              {methodText().map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </details>
        </section>
      </div>
    </div>
  );
}

function Slider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const digits = step >= 1 ? 0 : step >= 0.1 ? 1 : step >= 0.01 ? 2 : 3;
  const shown = Number(value.toFixed(digits)).toString();
  return (
    <label className="slider">
      <span>
        {label}
        <b>
          {shown} {unit}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${shown} ${unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Meter({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <article className="meter">
      <div>
        <span>{label}</span>
        <strong>{Math.round(value)}</strong>
      </div>
      <div className="track" aria-hidden>
        <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <p>{note}</p>
    </article>
  );
}
