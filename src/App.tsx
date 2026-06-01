import './App.css'

const readinessItems = [
  {
    label: 'Start',
    value: 'miejsce jest przygotowane',
  },
  {
    label: 'Zakres',
    value: 'bez ćwiczeń na tym etapie',
  },
  {
    label: 'Dalej',
    value: 'pierwsza baza ćwiczeń',
  },
]

function App() {
  return (
    <main className="app-shell" aria-labelledby="app-title">
      <section className="intro-section">
        <p className="stage-label">Etap 0</p>
        <h1 id="app-title">Czytanie krok po kroku</h1>
        <p className="intro-copy">
          Spokojne miejsce do krótkich ćwiczeń czytania po polsku. Teraz
          przygotowany jest tylko techniczny start aplikacji.
        </p>

        <dl className="readiness-list" aria-label="Stan przygotowania">
          {readinessItems.map((item) => (
            <div className="readiness-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="road-section" aria-labelledby="road-title">
        <div className="road-visual" aria-hidden="true">
          <span className="lane-line" />
          <span className="car-shape">
            <span className="car-window" />
            <span className="car-wheel car-wheel-left" />
            <span className="car-wheel car-wheel-right" />
          </span>
        </div>

        <div className="next-step">
          <p className="stage-label">Następny krok</p>
          <h2 id="road-title">Baza ćwiczeń</h2>
          <p>
            W kolejnym etapie dodamy poziomy, sylaby, wyrazy i krótkie zdania
            do spokojnej pracy z czytaniem.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
