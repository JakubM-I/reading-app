import type { ContentLevel } from '../../content/contentTypes'
import type { SessionModule } from '../../session'

export interface LevelOption {
  level: ContentLevel
  wordCount: number
  sentenceCount: number
  syllabificationWordCount: number
}

interface LevelScreenProps {
  levels: LevelOption[]
  module: SessionModule
  onBack: () => void
  onChooseLevel: (level: ContentLevel) => void
  onProgress: () => void
}

export function LevelScreen({
  levels,
  module,
  onBack,
  onChooseLevel,
  onProgress,
}: LevelScreenProps) {
  const isSyllabification = module === 'syllabification'
  const title = isSyllabification ? 'Wybierz poziom sylabizowania' : 'Wybierz poziom'

  return (
    <section className="levels-screen" aria-labelledby="levels-title">
      <header className="levels-header">
        <h2 id="levels-title">{title}</h2>
        <nav className="levels-nav" aria-label="Nawigacja poziomów">
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
          {levels.map(({ level, wordCount, sentenceCount, syllabificationWordCount }) => (
            <article className="level-card" key={level.id}>
              <div>
                <p className="level-order">Poziom {level.order}</p>
                <h3>
                  {isSyllabification
                    ? (level.syllabificationName ?? level.name)
                    : level.name}
                </h3>
                <p>
                  {isSyllabification
                    ? (level.syllabificationDescription ?? level.parentDescription)
                    : level.parentDescription}
                </p>
              </div>

              <div
                className="level-meta"
                aria-label={
                  isSyllabification
                    ? 'Zawartość poziomu sylabizowania'
                    : 'Zawartość poziomu'
                }
              >
                {isSyllabification ? (
                  <>
                    <span>{syllabificationWordCount} wyrazów</span>
                    {(level.syllabificationFocus ?? level.focus).slice(0, 2).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </>
                ) : (
                  <>
                    <span>{wordCount} wyrazów</span>
                    <span>{sentenceCount} zdań</span>
                  </>
                )}
              </div>

              <button
                type="button"
                className="primary-button compact"
                onClick={() => onChooseLevel(level)}
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
