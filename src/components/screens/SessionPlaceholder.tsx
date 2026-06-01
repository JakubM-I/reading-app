import type { ContentLevel } from '../../content/contentTypes'

const sessionSteps = [
  'Rozgrzewka',
  'Czytanie prowadzone',
  'Budowanie słów',
  'Zdanie i pytanie',
  'Podsumowanie',
]

interface SessionPlaceholderProps {
  level: ContentLevel
  onBack: () => void
  onReset: () => void
}

export function SessionPlaceholder({
  level,
  onBack,
  onReset,
}: SessionPlaceholderProps) {
  return (
    <section className="session-layout" aria-labelledby="session-title">
      <div className="session-area">
        <p className="eyebrow">Sesja</p>
        <h2 id="session-title">{level.name}</h2>
        <div className="progress-line" aria-label="Postęp sesji">
          <span>0 / 10</span>
          <span>przygotowane miejsce na zadania</span>
        </div>
        <div className="exercise-placeholder">
          <span className="track-mark" aria-hidden="true" />
          <p>Ekran sesji jest gotowy na kolejny etap.</p>
        </div>
      </div>

      <aside className="parent-panel session-panel" aria-label="Panel rodzica">
        <h2>Plan sesji</h2>
        <ol className="step-list">
          {sessionSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="quiet-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Zmień poziom
          </button>
          <button type="button" className="text-button" onClick={onReset}>
            Resetuj bieżącą sesję
          </button>
        </div>
      </aside>
    </section>
  )
}
