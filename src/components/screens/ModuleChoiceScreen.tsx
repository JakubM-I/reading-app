import type { SessionModule } from '../../session'

interface ModuleChoiceScreenProps {
  onBack: () => void
  onChooseModule: (module: SessionModule) => void
  onProgress: () => void
}

const moduleOptions: Array<{
  module: SessionModule
  title: string
  description: string
  meta: string[]
}> = [
  {
    module: 'syllabification',
    title: 'Sylabizowanie',
    description: 'Ćwiczenie dzielenia słów na sylaby przed czytaniem.',
    meta: ['Osobna sesja', 'Bez zgadywania'],
  },
  {
    module: 'reading',
    title: 'Czytanie',
    description: 'Dotychczasowa sesja z rozgrzewką, czytaniem i budowaniem słów.',
    meta: ['Obecny moduł', 'Bez zmian'],
  },
]

export function ModuleChoiceScreen({
  onBack,
  onChooseModule,
  onProgress,
}: ModuleChoiceScreenProps) {
  return (
    <section className="levels-screen" aria-labelledby="module-choice-title">
      <header className="levels-header">
        <h2 id="module-choice-title">Co dziś ćwiczymy?</h2>
        <nav className="levels-nav" aria-label="Nawigacja wyboru modułu">
          <button type="button" className="secondary-button" onClick={onProgress}>
            Postępy
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            Wróć
          </button>
        </nav>
      </header>

      <div className="levels-workspace">
        <div className="level-list">
          {moduleOptions.map((option) => (
            <article className="level-card" key={option.module}>
              <div>
                <p className="level-order">Moduł</p>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>

              <div className="level-meta" aria-label="Cechy modułu">
                {option.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <button
                type="button"
                className="primary-button compact"
                onClick={() => onChooseModule(option.module)}
              >
                Wybierz
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
