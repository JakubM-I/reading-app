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
}

export function LevelScreen({
  levels,
  onBack,
  onChooseLevel,
}: LevelScreenProps) {
  return (
    <section className="screen-section" aria-labelledby="level-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Wybór poziomu</p>
          <h2 id="level-title">Rodzic wybiera poziom</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Wróć
        </button>
      </div>

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
    </section>
  )
}
