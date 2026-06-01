import './App.css'
import { contentSummary } from './content'

const readinessItems = [
  {
    label: 'Poziomy',
    value: `${contentSummary.levels}`,
  },
  {
    label: 'Wyrazy',
    value: `${contentSummary.words}`,
  },
  {
    label: 'Zdania',
    value: `${contentSummary.sentences}`,
  },
]

function App() {
  return (
    <main className="app-shell" aria-labelledby="app-title">
      <section className="intro-section">
        <p className="stage-label">Etap 1</p>
        <h1 id="app-title">Czytanie krok po kroku</h1>
        <p className="intro-copy">
          Baza ćwiczeń jest przygotowana jako statyczne pliki. Sesja i wybór
          poziomu pojawią się w kolejnym etapie.
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
            Dane obejmują sylaby, wyrazy, krótkie zdania oraz opisy poziomów
            dla rodzica. Na tym etapie aplikacja ich jeszcze nie ćwiczy.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
