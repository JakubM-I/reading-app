import levelsData from './levels.json'
import sentencesData from './sentences.json'
import syllablesData from './syllables.json'
import wordsData from './words.json'
import type {
  ContentLevel,
  ContentSentence,
  ContentSyllable,
  ContentWord,
  ExerciseContent,
} from './contentTypes'

export const exerciseContent: ExerciseContent = {
  levels: levelsData as readonly ContentLevel[],
  syllables: syllablesData as readonly ContentSyllable[],
  words: wordsData as readonly ContentWord[],
  sentences: sentencesData as readonly ContentSentence[],
}

export const contentSummary = {
  levels: exerciseContent.levels.length,
  syllables: exerciseContent.syllables.length,
  words: exerciseContent.words.length,
  sentences: exerciseContent.sentences.length,
}
