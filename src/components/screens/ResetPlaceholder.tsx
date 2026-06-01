interface ResetPlaceholderProps {
  onBack: () => void
}

export function ResetPlaceholder({ onBack }: ResetPlaceholderProps) {
  return (
    <section className="screen-section narrow" aria-labelledby="reset-title">
      <p className="eyebrow">Reset</p>
      <h2 id="reset-title">Miejsce na reset danych</h2>
      <p className="lead-text">
        Pełne czyszczenie postępów będzie dostępne dopiero po dodaniu lokalnego
        zapisu.
      </p>
      <div className="primary-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          Wróć do startu
        </button>
        <button type="button" className="danger-button" disabled>
          Wyczyść wszystkie postępy
        </button>
      </div>
    </section>
  )
}
