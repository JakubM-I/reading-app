import levelsData from './levels.json'
import sentencesData from './sentences.json'
import syllablesData from './syllables.json'
import wordsData from './words.json'
import blendsData from './blends.json'
import decodingWordsData from './decodingWords.json'
import pseudowordsData from './pseudowords.json'
import structuresData from './structures.json'
import type {
  ContentBlend,
  ContentDecodingItem,
  ContentLevel,
  ContentSentence,
  ContentStructure,
  ContentSyllable,
  ContentWord,
  ExerciseContent,
} from './contentTypes'

export const exerciseContent: ExerciseContent = {
  levels: levelsData as readonly ContentLevel[],
  syllables: syllablesData as readonly ContentSyllable[],
  words: wordsData as readonly ContentWord[],
  sentences: sentencesData as readonly ContentSentence[],
  structures: structuresData as readonly ContentStructure[],
  blends: blendsData as unknown as readonly ContentBlend[],
  decodingWords: decodingWordsData as unknown as readonly ContentDecodingItem[],
  pseudowords: pseudowordsData as unknown as readonly ContentDecodingItem[],
}

export const contentSummary = {
  levels: exerciseContent.levels.length,
  syllables: exerciseContent.syllables.length,
  words: exerciseContent.words.length,
  sentences: exerciseContent.sentences.length,
  structures: exerciseContent.structures.length,
  decodingWords: exerciseContent.decodingWords.length,
  pseudowords: exerciseContent.pseudowords.length,
}
