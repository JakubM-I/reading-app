interface ProgressPlaceholderProps {
  onBack: () => void
}

export function ProgressPlaceholder({ onBack }: ProgressPlaceholderProps) {
  return (
    <section className="screen-section" aria-labelledby="progress-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Postępy</p>
          <h2 id="progress-title">Panel postępów</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Wróć
        </button>
      </div>

      <div className="placeholder-grid">
        <div>
          <h3>Dzisiaj</h3>
          <p>0 punktów</p>
        </div>
        <div>
          <h3>Tydzień</h3>
          <p>0 sesji</p>
        </div>
        <div>
          <h3>Miesiąc</h3>
          <p>0 odznak</p>
        </div>
      </div>

      <p className="calm-note">
        Etap 3 liczy wynik tylko w bieżącej sesji. Stały zapis pojawi się później.
      </p>
    </section>
  )
}
