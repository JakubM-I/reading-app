export type LevelId = string
export type SyllableId = string
export type WordId = string
export type SentenceId = string
export type StructureId =
  | 'structure-1'
  | 'structure-2'
  | 'structure-3'
  | 'structure-4'
  | 'structure-5'
  | 'structure-6'

export type DifficultyStage = 'basic' | 'extended' | 'digraph'
export type GraphemeRole = 'vowel' | 'consonant'
export type MaterialKind = 'blend' | 'word' | 'pseudoword'
export type BlendKind = 'cv' | 'cvc'

export type GraphemeTuple = readonly [
  text: string,
  role: GraphemeRole,
  syllableIndex: number,
]

export type SyllableKind = 'syllable' | 'digraph' | 'trigraph'

export interface ContentLevel {
  id: LevelId
  order: number
  name: string
  parentDescription: string
  focus: string[]
  syllabificationName?: string
  syllabificationDescription?: string
  syllabificationFocus?: string[]
}

export interface ContentSyllable {
  id: SyllableId
  levelId: LevelId
  text: string
  kind: SyllableKind
  tags: string[]
}

export interface ContentWord {
  id: WordId
  levelId: LevelId
  text: string
  syllables: string[]
  syllableCount: number
  suitableForSyllabification: boolean
  syllabificationTags?: string[]
  tags: string[]
}

export interface ContentStructure {
  id: StructureId
  order: number
  pattern: string
  name: string
  description: string
  example: string
}

export interface ContentBlend {
  id: string
  materialKind: 'blend'
  blendKind: BlendKind
  left: string
  right: string
  result: string
  difficultyStage: DifficultyStage
  structureIds: StructureId[]
  graphemes: GraphemeTuple[]
}

export interface ContentDecodingItem {
  id: string
  materialKind: 'word' | 'pseudoword'
  text: string
  syllables: string[]
  structureId: StructureId
  difficultyStage: DifficultyStage
  graphemes: GraphemeTuple[]
  sourceWordId?: WordId
}

export interface ContentSentence {
  id: SentenceId
  levelId: LevelId
  text: string
  question: string
  relatedWordIds: WordId[]
  tags: string[]
}

export interface ExerciseContent {
  levels: readonly ContentLevel[]
  syllables: readonly ContentSyllable[]
  words: readonly ContentWord[]
  sentences: readonly ContentSentence[]
  structures: readonly ContentStructure[]
  blends: readonly ContentBlend[]
  decodingWords: readonly ContentDecodingItem[]
  pseudowords: readonly ContentDecodingItem[]
}
