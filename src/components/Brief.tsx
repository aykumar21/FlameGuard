import { useState } from "react";
import { interpret } from "../lib/interpret";
import { briefSections, methodText } from "../lib/narrative";
import { rankInvestigations } from "../lib/rank";
import { useStore } from "../state";

export function Brief() {
  const store = useStore();
  const a = store.assessment;
  const ranked = rankInvestigations(a);
  const verdict = store.asked
    ? interpret(store.asked, a).verdict
    : "No question has been asked yet. The limit, detection, and gap sections are the default reading of this cabin.";
  const sections = briefSections({
    assessment: a,
    ranked: ranked.map((row) => ({
      name: row.investigation.name,
      why: row.investigation.why,
      score: row.parts.total,
    })),
    verdict,
  });
  const [copied, setCopied] = useState(false);

  const plain = [
    `FLAMEGUARD FLIGHT FIRE BRIEF`,
    `${a.mission.name}`,
    store.asked ? `Question: ${store.asked}` : "",
    "",
    ...sections.flatMap((section) => [section.heading.toUpperCase(), ...section.paragraphs, ""]),
    "METHOD",
    ...methodText(),
    "",
    "FlameGuard is an independent Space Apps interpretation of public NASA combustion results. It is not a flight certification.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return (
    <div className="view brief-view">
      <div className="brief-actions">
        <button onClick={() => window.print()}>Print brief</button>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(plain);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : "Copy text"}
        </button>
      </div>
      <article className="sheet" id="brief">
        <p className="sheet-kicker">FlameGuard · flight fire brief</p>
        <h1>{a.mission.name}</h1>
        <p className="sheet-sub">
          Witness {a.witness.name}. {store.asked ? `Question: ${store.asked}` : "Default reading, no question pending."}
        </p>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <section>
          <h2>Method</h2>
          <ol>
            {methodText().map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>
        <p className="sheet-end">
          Independent Space Apps project by National Chung Cheng University. Public NASA results, cited in the atlas. Not a
          flight certification and not a NASA product.
        </p>
      </article>
    </div>
  );
}
