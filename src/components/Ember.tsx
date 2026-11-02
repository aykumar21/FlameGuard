import { interpret } from "../lib/interpret";
import { prompts } from "../lib/narrative";
import { useStore } from "../state";

export function Ember() {
  const store = useStore();
  const answer = store.asked ? interpret(store.asked, store.assessment) : null;

  return (
    <div className="view ember">
      <header className="view-h">
        <p className="eyebrow">Ember · grounded interpreter</p>
        <h1>It ranks the record against this cabin, then writes only from those rows.</h1>
        <p className="dek">
          No model call, no invented measurement. {store.assessment.witness.short} at {store.assessment.mission.name} is
          the case on the desk. Change the mission and a question you already asked is rewritten.
        </p>
      </header>
      <form
        className="ask"
        onSubmit={(event) => {
          event.preventDefault();
          store.ask();
        }}
      >
        <label htmlFor="ember-q">Ask the record</label>
        <div>
          <input
            id="ember-q"
            value={store.query}
            onChange={(event) => store.setQuery(event.target.value)}
            placeholder="Will a Test 1 pass hold on the Moon?"
          />
          <button type="submit">Interpret</button>
        </div>
      </form>
      <div className="prompts">
        {prompts.map((prompt) => (
          <button key={prompt} onClick={() => store.ask(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      {answer && (
        <article className="answer" aria-live="polite">
          <p className={`conf ${answer.confidence}`}>{answer.confidence} confidence · {answer.confidenceWhy}</p>
          <h2>{answer.verdict}</h2>
          <div className="answer-points">
            {answer.points.map((point) => (
              <section key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </section>
            ))}
          </div>
          {answer.evidence.length > 0 && (
            <div className="evidence">
              <h3>Rows used</h3>
              <ul>
                {answer.evidence.map((item) => (
                  <li key={item.id}>
                    <span className={`tag ${item.confidence}`}>{item.confidence}</span>
                    <p>{item.claim}</p>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.citation}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {answer.gaps.length > 0 && (
            <div className="gaps">
              <h3>What this does not settle</h3>
              <ul>
                {answer.gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
