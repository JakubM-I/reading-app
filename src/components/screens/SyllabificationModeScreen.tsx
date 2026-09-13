import type { ContentStructure } from '../../content/contentTypes'
import type { SyllabificationSupportMode } from '../../session'

interface SyllabificationModeScreenProps {
  structure: ContentStructure
  selectedMode?: SyllabificationSupportMode
  includePseudowords: boolean
  onBack: () => void
  onChooseMode: (mode: SyllabificationSupportMode) => void
  onIncludePseudowordsChange: (include: boolean) => void
  onStart: () => void
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
    description: 'Budowa słowa i kolory są widoczne od początku.',
    meta: ['Pełna budowa', 'Spokojny start'],
  },
  {
    mode: 'partial-help',
    title: 'Z podpowiedzią',
    description: 'Budowę można odsłonić przyciskiem „Pokaż budowę”.',
    meta: ['Pomoc na życzenie', 'Więcej samodzielności'],
  },
  {
    mode: 'independent',
    title: 'Samodzielnie',
    description: 'Odpowiedź można odsłonić po samodzielnej próbie.',
    meta: ['Najpierw próba', 'Odpowiedź na życzenie'],
  },
]

export function SyllabificationModeScreen({
  structure,
  selectedMode,
  includePseudowords,
  onBack,
  onChooseMode,
  onIncludePseudowordsChange,
  onStart,
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
          Struktura {structure.order}: {structure.pattern} · {structure.name}
        </p>

        <div className="level-list">
          {supportModeOptions.map((option) => (
            <article
              className={
                selectedMode === option.mode ? 'level-card selected-card' : 'level-card'
              }
              key={option.mode}
            >
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
                aria-pressed={selectedMode === option.mode}
                onClick={() => onChooseMode(option.mode)}
              >
                {selectedMode === option.mode ? 'Wybrano' : 'Wybierz'}
              </button>
            </article>
          ))}
        </div>

        <section className="session-options" aria-labelledby="pseudowords-title">
          <div>
            <h3 id="pseudowords-title">Wymyślone słowa</h3>
            <p>
              Dwa zadania sprawdzają składanie bez zgadywania znaczenia. Każde
              będzie wyraźnie oznaczone.
            </p>
          </div>
          <label className="toggle-option">
            <input
              type="checkbox"
              checked={includePseudowords}
              onChange={(event) =>
                onIncludePseudowordsChange(event.currentTarget.checked)
              }
            />
            <span>Dodaj do sesji</span>
          </label>
        </section>

        <div className="start-session-action">
          <button
            type="button"
            className="primary-button"
            disabled={!selectedMode}
            onClick={onStart}
          >
            Rozpocznij sesję
          </button>
        </div>
      </div>
    </section>
  )
}
