import type { ContentLevel } from '../../content/contentTypes'
import type { SyllabificationSupportMode } from '../../session'

interface SyllabificationModeScreenProps {
  level: ContentLevel
  selectedMode?: SyllabificationSupportMode
  onBack: () => void
  onChooseMode: (mode: SyllabificationSupportMode) => void
}

const supportModeOptions: Array<{
  mode: SyllabificationSupportMode
  title: string
  description: string
  meta: string[]
}> = [
  {
    mode: 'full-help',
    title: 'Z pomocą',
    description: 'Dziecko widzi cały podział słowa na sylaby.',
    meta: ['Pełny podział', 'Spokojny start'],
  },
  {
    mode: 'partial-help',
    title: 'Z podpowiedzią',
    description: 'Dziecko dostaje krótką pomoc, na przykład liczbę sylab.',
    meta: ['Częściowa pomoc', 'Więcej samodzielności'],
  },
  {
    mode: 'independent',
    title: 'Samodzielnie',
    description: 'Dziecko samo wskazuje miejsca podziału w słowie.',
    meta: ['Bez stałej pomocy', 'Podpowiedź na życzenie'],
  },
]

export function SyllabificationModeScreen({
  level,
  selectedMode,
  onBack,
  onChooseMode,
}: SyllabificationModeScreenProps) {
  return (
    <section className="levels-screen" aria-labelledby="syllabification-mode-title">
      <header className="levels-header">
        <h2 id="syllabification-mode-title">Wybierz tryb pomocy</h2>
        <nav className="levels-nav" aria-label="Nawigacja trybu pomocy">
          <button type="button" className="secondary-button" onClick={onBack}>
            Wróć
          </button>
        </nav>
      </header>

      <div className="levels-workspace">
        <p className="mode-context">
          Poziom {level.order}: {level.name}
        </p>

        <div className="level-list">
          {supportModeOptions.map((option) => (
            <article className="level-card" key={option.mode}>
              <div>
                <p className="level-order">Tryb</p>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>

              <div className="level-meta" aria-label="Cechy trybu">
                {option.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <button
                type="button"
                className="primary-button compact"
                onClick={() => onChooseMode(option.mode)}
              >
                {selectedMode === option.mode ? 'Wybrano' : 'Wybierz'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
