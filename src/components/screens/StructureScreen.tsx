import type { ContentStructure } from '../../content/contentTypes'

export interface StructureOption {
  structure: ContentStructure
  wordCount: number
  pseudowordCount: number
}

interface StructureScreenProps {
  structures: StructureOption[]
  onBack: () => void
  onChooseStructure: (structure: ContentStructure) => void
  onProgress: () => void
}

export function StructureScreen({
  structures,
  onBack,
  onChooseStructure,
  onProgress,
}: StructureScreenProps) {
  return (
    <section className="levels-screen" aria-labelledby="structures-title">
      <header className="levels-header">
        <h2 id="structures-title">Wybierz strukturę sylabową</h2>
        <nav className="levels-nav" aria-label="Nawigacja struktur">
          <button type="button" className="secondary-button" onClick={onProgress}>
            Postępy
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            Wróć
          </button>
        </nav>
      </header>

      <div className="levels-workspace">
        <p className="mode-context">
          Każda sesja ćwiczy tylko jeden schemat. Trudność rośnie spokojnie,
          od prostych liter do dwuznaków.
        </p>
        <div className="level-list">
          {structures.map(({ structure, wordCount, pseudowordCount }) => (
            <article className="level-card structure-card" key={structure.id}>
              <div>
                <p className="level-order">Struktura {structure.order}</p>
                <h3>{structure.name}</h3>
                <p>{structure.description}</p>
              </div>
              <div className="structure-pattern" aria-label={`Schemat ${structure.pattern}`}>
                <strong>{structure.pattern}</strong>
                <span>{structure.example}</span>
              </div>
              <div className="level-meta" aria-label="Zawartość struktury">
                <span>{wordCount} słów</span>
                <span>{pseudowordCount} wymyślonych</span>
              </div>
              <button
                type="button"
                className="primary-button compact"
                onClick={() => onChooseStructure(structure)}
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
