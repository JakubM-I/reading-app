import { useState } from 'react'
import type { StoredProgress } from '../../progress'

interface ResetScreenProps {
  progress: StoredProgress
  onBack: () => void
  onResetProgress: () => void
}

export function ResetScreen({
  progress,
  onBack,
  onResetProgress,
}: ResetScreenProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const hasProgress = progress.sessions.length > 0 || progress.totalPoints > 0

  return (
    <section className="reset-screen" aria-labelledby="reset-title">
      <header className="reset-header">
        <h2 id="reset-title">Ustawienia</h2>
        <nav className="reset-nav" aria-label="Nawigacja ustawień">
          <button type="button" className="secondary-button" onClick={onBack}>
            Wróć
          </button>
        </nav>
      </header>

      <div className="reset-workspace">
        <h3>Wyczyść postępy</h3>
        <p className="lead-text">
          Reset usuwa punkty, historię sesji, odznaki i listę trudnych słów. Baza
          ćwiczeń zostaje bez zmian.
        </p>

        <div className="reset-summary">
          <span>{progress.totalPoints} pkt</span>
          <span>{progress.sessions.length} sesji</span>
          <span>{progress.badges.length} odznak</span>
        </div>

        {isConfirming && (
          <p className="reset-confirmation">
            Czy na pewno wyczyścić wszystkie zapisane postępy?
          </p>
        )}

        <div className="primary-actions">
          {isConfirming ? (
            <>
              <button
                type="button"
                className="danger-button"
                disabled={!hasProgress}
                onClick={onResetProgress}
              >
                Tak, wyczyść postępy
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsConfirming(false)}
              >
                Anuluj
              </button>
            </>
          ) : (
            <button
              type="button"
              className="danger-button"
              disabled={!hasProgress}
              onClick={() => setIsConfirming(true)}
            >
              Wyczyść wszystkie postępy
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
