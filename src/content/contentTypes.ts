export type LevelId = string
export type SyllableId = string
export type WordId = string
export type SentenceId = string

export type SyllableKind = 'syllable' | 'digraph' | 'trigraph'

export interface ContentLevel {
  id: LevelId
  order: number
  name: string
  parentDescription: string
  focus: string[]
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
  tags: string[]
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
}
