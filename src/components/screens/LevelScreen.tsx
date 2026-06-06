import type { ContentLevel } from '../../content/contentTypes'

export interface LevelOption {
  level: ContentLevel
  wordCount: number
  sentenceCount: number
}

interface LevelScreenProps {
  levels: LevelOption[]
  onBack: () => void
  onChooseLevel: (level: ContentLevel) => void
  onProgress: () => void
}

export function LevelScreen({
  levels,
  onBack,
  onChooseLevel,
  onProgress,
}: LevelScreenProps) {
  return (
    <section className="levels-screen" aria-labelledby="levels-title">
      <header className="levels-header">
        <h2 id="levels-title">Wybierz poziom</h2>
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
          {levels.map(({ level, wordCount, sentenceCount }) => (
            <article className="level-card" key={level.id}>
              <div>
                <p className="level-order">Poziom {level.order}</p>
                <h3>{level.name}</h3>
                <p>{level.parentDescription}</p>
              </div>

              <div className="level-meta" aria-label="Zawartość poziomu">
                <span>{wordCount} wyrazów</span>
                <span>{sentenceCount} zdań</span>
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
