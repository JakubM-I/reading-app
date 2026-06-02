export interface StartScreenSummary {
  levels: number
  words: number
  sentences: number
}

interface StartScreenProps {
  summary: StartScreenSummary
  onStart: () => void
  onProgress: () => void
  onReset: () => void
}

export function StartScreen({
  summary,
  onStart,
  onProgress,
  onReset,
}: StartScreenProps) {
  return (
    <section className="screen-grid" aria-labelledby="start-title">
      <div className="screen-main">
        <p className="eyebrow">Start</p>
        <h2 id="start-title">Spokojna sesja czytania</h2>
        <p className="lead-text">
          Wybierz poziom, zobacz opis dla rodzica i przejdź do pustego ekranu
          sesji.
        </p>

        <div className="primary-actions">
          <button type="button" className="primary-button" onClick={onStart}>
            Rozpocznij sesję
          </button>
          <button type="button" className="secondary-button" onClick={onProgress}>
            Panel postępów
          </button>
        </div>
      </div>

      <aside className="parent-panel" aria-label="Panel rodzica">
        <h2>Panel rodzica</h2>
        <dl className="summary-grid">
          <div>
            <dt>Punkty łączne</dt>
            <dd>0</dd>
          </div>
          <div>
            <dt>Poziomy</dt>
            <dd>{summary.levels}</dd>
          </div>
          <div>
            <dt>Wyrazy</dt>
            <dd>{summary.words}</dd>
          </div>
          <div>
            <dt>Zdania</dt>
            <dd>{summary.sentences}</dd>
          </div>
        </dl>
        <p className="panel-note">
          Wynik sesji jest liczony tylko do odświeżenia strony.
        </p>

        <div className="quiet-actions">
          <button type="button" className="secondary-button" disabled>
            Eksport postępów
          </button>
          <button type="button" className="secondary-button" disabled>
            Import postępów
          </button>
          <button type="button" className="text-button" onClick={onReset}>
            Reset danych
          </button>
        </div>
      </aside>
    </section>
  )
}
