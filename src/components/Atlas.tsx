import { useMemo, useState } from "react";
import { findings } from "../data/corpus";
import { rankInvestigations } from "../lib/rank";
import { useStore } from "../state";

export function Atlas() {
  const store = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("saffire-6");
  const ranked = useMemo(() => rankInvestigations(store.assessment), [store.assessment]);
  const needle = q.trim().toLowerCase();
  const rows = ranked.filter((row) => {
    if (!needle) return true;
    const related = findings.filter((item) => item.investigationId === row.investigation.id);
    const blob = `${row.investigation.name} ${row.investigation.summary} ${row.investigation.why} ${row.investigation.topics.join(" ")} ${row.investigation.platform} ${related.map((item) => item.claim).join(" ")}`.toLowerCase();
    return blob.includes(needle);
  });

  return (
    <div className="view">
      <header className="view-h">
        <p className="eyebrow">Corpus · {ranked.length} investigations</p>
        <h1>The record, ordered for {store.assessment.mission.name}.</h1>
        <p className="dek">
          Ember does not sort by year. Each score is gravity match, plus distance to the nearest test atmosphere, plus
          overlap with the hazard this cabin is currently raising. Change the mission and the order changes with it.
        </p>
      </header>
      <label className="search">
        <span>Filter the atlas</span>
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="lunar, Saffire, smoke, Nomex…" />
      </label>
      <ol className="atlas">
        {rows.map((row, index) => {
          const expanded = open === row.investigation.id;
          const related = findings.filter((item) => item.investigationId === row.investigation.id);
          return (
            <li key={row.investigation.id} className={expanded ? "open" : ""}>
              <button onClick={() => setOpen(expanded ? null : row.investigation.id)} aria-expanded={expanded}>
                <span className="rank-no">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{row.investigation.name}</strong>
                  <em>
                    {row.investigation.years} · {row.investigation.platform}
                  </em>
                </span>
                <b>{row.parts.total}</b>
              </button>
              {expanded && (
                <div className="atlas-body">
                  <p>{row.investigation.summary}</p>
                  <p>{row.investigation.why}</p>
                  <p className="why">{row.parts.reasons.join(" · ")}</p>
                  <p className="parts">
                    gravity {row.parts.gravity} · atmosphere {row.parts.atmosphere} · topic {row.parts.topic}
                  </p>
                  <a href={row.investigation.url} target="_blank" rel="noreferrer">
                    {row.investigation.citation}
                  </a>
                  {related.length > 0 && (
                    <ul className="finding-list">
                      {related.map((item) => (
                        <li key={item.id}>
                          <span className={`tag ${item.confidence}`}>{item.confidence}</span>
                          <p>{item.claim}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {rows.length === 0 && <p className="empty">Nothing in the atlas matches that filter.</p>}
    </div>
  );
}
