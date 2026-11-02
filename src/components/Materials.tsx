import { catalog } from "../data/materials";
import { spreadRows } from "../data/corpus";
import { assess } from "../lib/model";
import { witnesses } from "../data/materials";
import { limitLead } from "../lib/narrative";
import { useStore } from "../state";

export function Materials() {
  const store = useStore();
  const a = store.assessment;

  return (
    <div className="view">
      <header className="view-h">
        <p className="eyebrow">Materials at this cabin</p>
        <h1>Three materials have a gravity table. The rest of the vehicle does not.</h1>
        <p className="dek">
          Selecting a witness here changes the mission page, Ember, and the brief. {a.witness.name} is the one in the
          index right now.
        </p>
      </header>
      <div className="witness-grid">
        {witnesses.map((witness) => {
          const row = assess({
            mission: a.mission,
            witness,
            oxygenPct: store.oxygenPct,
            pressurePsia: store.pressurePsia,
            flowCms: store.flowCms,
            gravityG: store.gravityG,
            scenario: store.scenario,
          });
          const active = witness.id === store.witnessId;
          const tone = row.side === "burning" ? "bad" : row.side === "extinguish" ? "ok" : "mid";
          return (
            <article key={witness.id} className={active ? "witness active" : "witness"}>
              <p className="eyebrow">{witness.behavior}</p>
              <h2>{witness.name}</h2>
              <p>{witness.role}</p>
              <p className={`lead ${tone}`}>{limitLead(row)}</p>
              <table>
                <thead>
                  <tr>
                    <th>Gravity</th>
                    <th>ULOI*</th>
                    <th>MOC*</th>
                    <th>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {witness.points.map((point) => (
                    <tr key={point.regime}>
                      <td>{point.regime}</td>
                      <td>{point.uloi.toFixed(1)}</td>
                      <td>{point.moc.toFixed(1)}</td>
                      <td>{point.deltaVsEarth.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="src">Measured at {witness.testPressurePsia} psia. {witness.source}</p>
              <button onClick={() => store.setWitness(witness.id)} aria-pressed={active}>
                {active ? "Witness in use" : "Use as witness"}
              </button>
            </article>
          );
        })}
      </div>

      <section className="panel flat">
        <header className="panel-h">
          <h2>In the flights, not in the limit table</h2>
          <p>Ember will not invent an oxygen limit for these. A missing row is not a pass.</p>
        </header>
        <div className="catalog">
          {catalog.map((item) => (
            <article key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.role}</p>
              <p>{item.known}</p>
              <p className="src">{item.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel flat">
        <header className="panel-h">
          <h2>Published concurrent spread rows</h2>
          <p>Thin fuels in microgravity. Use them as rates, not as cabin predictions. The screening ratio is anchored on I-1.</p>
        </header>
        <div className="table-scroll">
          <table className="board">
            <thead>
              <tr>
                <th>Row</th>
                <th>Material</th>
                <th>O₂</th>
                <th>kPa</th>
                <th>Flow</th>
                <th>cm/s</th>
              </tr>
            </thead>
            <tbody>
              {spreadRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.flight} {row.id}
                  </td>
                  <td>{row.material}</td>
                  <td>{row.oxygenPct}</td>
                  <td>{row.pressureKpa}</td>
                  <td>{row.flowCms}</td>
                  <td>{row.spreadCms.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
