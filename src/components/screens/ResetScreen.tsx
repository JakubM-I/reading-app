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
    <section className="screen-section narrow" aria-labelledby="reset-title">
      <p className="eyebrow">Reset</p>
      <h2 id="reset-title">Wyczyść postępy</h2>
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
        <button type="button" className="secondary-button" onClick={onBack}>
          Wróć do startu
        </button>
        {isConfirming ? (
          <button
            type="button"
            className="danger-button"
            disabled={!hasProgress}
            onClick={onResetProgress}
          >
            Tak, wyczyść postępy
          </button>
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
    </section>
  )
}
