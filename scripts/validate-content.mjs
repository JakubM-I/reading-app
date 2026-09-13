import { readFile } from 'node:fs/promises'

const contentDir = new URL('../src/content/', import.meta.url)
const allowedSyllableKinds = new Set(['syllable', 'digraph', 'trigraph'])
const allowedStructureIds = new Set([
  'structure-1',
  'structure-2',
  'structure-3',
  'structure-4',
  'structure-5',
  'structure-6',
])
const allowedDifficultyStages = new Set(['basic', 'extended', 'digraph'])
const allowedGraphemeRoles = new Set(['vowel', 'consonant'])
const protectedTerms = [
  'pokemon',
  'hot wheels',
  'minecraft',
  'sonic',
  'lego',
  'garfield',
]

const errors = []

const readJson = async (fileName) => {
  const fileUrl = new URL(fileName, contentDir)
  return JSON.parse(await readFile(fileUrl, 'utf8'))
}

const assert = (condition, message) => {
  if (!condition) {
    errors.push(message)
  }
}

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const isStringArray = (value) =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const normalize = (value) => value.toLocaleLowerCase('pl-PL').replace(/\s+/g, '')

const ensureUniqueIds = (items, label, allIds) => {
  const seen = new Set()

  for (const item of items) {
    assert(isNonEmptyString(item.id), `${label}: missing id`)
    assert(idPattern.test(item.id), `${label}: invalid id "${item.id}"`)
    assert(!seen.has(item.id), `${label}: duplicate id "${item.id}"`)
    assert(!allIds.has(item.id), `${label}: id is not globally unique "${item.id}"`)
    seen.add(item.id)
    allIds.add(item.id)
  }
}

const scanProtectedTerms = (collections) => {
  const haystack = JSON.stringify(collections).toLocaleLowerCase('pl-PL')

  for (const term of protectedTerms) {
    assert(!haystack.includes(term), `protected term found in content: "${term}"`)
  }
}

const levels = await readJson('levels.json')
const syllables = await readJson('syllables.json')
const words = await readJson('words.json')
const sentences = await readJson('sentences.json')
const structures = await readJson('structures.json')
const blends = await readJson('blends.json')
const decodingWords = await readJson('decodingWords.json')
const pseudowords = await readJson('pseudowords.json')

assert(Array.isArray(levels), 'levels.json must contain an array')
assert(Array.isArray(syllables), 'syllables.json must contain an array')
assert(Array.isArray(words), 'words.json must contain an array')
assert(Array.isArray(sentences), 'sentences.json must contain an array')
assert(Array.isArray(structures), 'structures.json must contain an array')
assert(Array.isArray(blends), 'blends.json must contain an array')
assert(Array.isArray(decodingWords), 'decodingWords.json must contain an array')
assert(Array.isArray(pseudowords), 'pseudowords.json must contain an array')

const allIds = new Set()
ensureUniqueIds(levels, 'levels.json', allIds)
ensureUniqueIds(syllables, 'syllables.json', allIds)
ensureUniqueIds(words, 'words.json', allIds)
ensureUniqueIds(sentences, 'sentences.json', allIds)
ensureUniqueIds(structures, 'structures.json', allIds)
ensureUniqueIds(blends, 'blends.json', allIds)
ensureUniqueIds(decodingWords, 'decodingWords.json', allIds)
ensureUniqueIds(pseudowords, 'pseudowords.json', allIds)

const levelById = new Map(levels.map((level) => [level.id, level]))
const wordById = new Map(words.map((word) => [word.id, word]))
const levelOrderById = new Map(levels.map((level) => [level.id, level.order]))
const structureById = new Map(structures.map((structure) => [structure.id, structure]))

for (const level of levels) {
  assert(Number.isInteger(level.order), `${level.id}: level order must be an integer`)
  assert(isNonEmptyString(level.name), `${level.id}: level name is required`)
  assert(
    isNonEmptyString(level.parentDescription),
    `${level.id}: parentDescription is required`,
  )
  assert(isStringArray(level.focus), `${level.id}: focus must be a non-empty string array`)
  assert(
    isNonEmptyString(level.syllabificationName),
    `${level.id}: syllabificationName is required`,
  )
  assert(
    isNonEmptyString(level.syllabificationDescription),
    `${level.id}: syllabificationDescription is required`,
  )
  assert(
    isStringArray(level.syllabificationFocus),
    `${level.id}: syllabificationFocus must be a non-empty string array`,
  )
}

const sortedOrders = levels.map((level) => level.order).sort((a, b) => a - b)
sortedOrders.forEach((order, index) => {
  assert(order === index + 1, `levels.json: expected level order ${index + 1}, got ${order}`)
})

for (const syllable of syllables) {
  assert(levelById.has(syllable.levelId), `${syllable.id}: unknown levelId "${syllable.levelId}"`)
  assert(isNonEmptyString(syllable.text), `${syllable.id}: text is required`)
  assert(
    allowedSyllableKinds.has(syllable.kind),
    `${syllable.id}: invalid kind "${syllable.kind}"`,
  )
  assert(isStringArray(syllable.tags), `${syllable.id}: tags must be a non-empty string array`)
}

for (const word of words) {
  assert(levelById.has(word.levelId), `${word.id}: unknown levelId "${word.levelId}"`)
  assert(isNonEmptyString(word.text), `${word.id}: text is required`)
  assert(isStringArray(word.syllables), `${word.id}: syllables must be a non-empty string array`)
  assert(
    Number.isInteger(word.syllableCount),
    `${word.id}: syllableCount must be an integer`,
  )
  assert(
    word.syllableCount === word.syllables.length,
    `${word.id}: syllableCount must match syllables length`,
  )
  assert(
    typeof word.suitableForSyllabification === 'boolean',
    `${word.id}: suitableForSyllabification must be a boolean`,
  )
  assert(
    !word.suitableForSyllabification || word.syllables.length >= 2,
    `${word.id}: words suitable for syllabification must have at least two syllables`,
  )
  if (word.syllabificationTags !== undefined) {
    assert(
      isStringArray(word.syllabificationTags),
      `${word.id}: syllabificationTags must be a non-empty string array when present`,
    )
  }
  assert(isStringArray(word.tags), `${word.id}: tags must be a non-empty string array`)
  assert(
    normalize(word.syllables.join('')) === normalize(word.text),
    `${word.id}: syllables "${word.syllables.join('-')}" do not rebuild "${word.text}"`,
  )
}

for (const sentence of sentences) {
  assert(levelById.has(sentence.levelId), `${sentence.id}: unknown levelId "${sentence.levelId}"`)
  assert(isNonEmptyString(sentence.text), `${sentence.id}: text is required`)
  assert(isNonEmptyString(sentence.question), `${sentence.id}: question is required`)
  assert(sentence.text.endsWith('.'), `${sentence.id}: sentence should end with a dot`)
  assert(sentence.question.endsWith('?'), `${sentence.id}: question should end with a question mark`)
  assert(
    isStringArray(sentence.relatedWordIds),
    `${sentence.id}: relatedWordIds must be a non-empty string array`,
  )
  assert(isStringArray(sentence.tags), `${sentence.id}: tags must be a non-empty string array`)

  const sentenceLevelOrder = levelOrderById.get(sentence.levelId)

  for (const wordId of sentence.relatedWordIds) {
    const word = wordById.get(wordId)
    assert(word, `${sentence.id}: unknown related word "${wordId}"`)

    if (word) {
      const wordLevelOrder = levelOrderById.get(word.levelId)
      assert(
        wordLevelOrder <= sentenceLevelOrder,
        `${sentence.id}: related word "${wordId}" comes from a later level`,
      )
    }
  }
}

const expectedPatterns = {
  'structure-1': [['consonant', 'vowel'], ['consonant', 'vowel']],
  'structure-3': [['consonant', 'vowel', 'consonant']],
  'structure-4': [
    ['consonant', 'vowel'],
    ['consonant', 'vowel', 'consonant'],
  ],
  'structure-5': [
    ['consonant', 'vowel', 'consonant'],
    ['consonant', 'vowel'],
  ],
  'structure-6': [
    ['consonant', 'vowel', 'consonant'],
    ['consonant', 'vowel', 'consonant'],
  ],
}

const validateGraphemes = (item, label) => {
  assert(Array.isArray(item.graphemes) && item.graphemes.length > 0, `${label}: graphemes are required`)

  if (!Array.isArray(item.graphemes)) {
    return
  }

  for (const grapheme of item.graphemes) {
    assert(
      Array.isArray(grapheme) && grapheme.length === 3,
      `${label}: every grapheme must be [text, role, syllableIndex]`,
    )

    if (!Array.isArray(grapheme) || grapheme.length !== 3) {
      continue
    }

    assert(isNonEmptyString(grapheme[0]), `${label}: grapheme text is required`)
    assert(
      allowedGraphemeRoles.has(grapheme[1]),
      `${label}: invalid grapheme role "${grapheme[1]}"`,
    )
    assert(
      Number.isInteger(grapheme[2]) && grapheme[2] >= 0,
      `${label}: invalid syllable index "${grapheme[2]}"`,
    )
  }
}

const getRolePattern = (item) => {
  const syllables = Array.from({ length: item.syllables.length }, () => [])

  for (const [, role, syllableIndex] of item.graphemes) {
    if (syllables[syllableIndex]) {
      syllables[syllableIndex].push(role)
    }
  }

  return syllables
}

const validateDecodingItem = (item, label, expectedKind) => {
  assert(item.materialKind === expectedKind, `${label}: materialKind must be "${expectedKind}"`)
  assert(isNonEmptyString(item.text), `${label}: text is required`)
  assert(isStringArray(item.syllables), `${label}: syllables must be a non-empty string array`)
  assert(allowedStructureIds.has(item.structureId), `${label}: invalid structureId "${item.structureId}"`)
  assert(
    allowedDifficultyStages.has(item.difficultyStage),
    `${label}: invalid difficultyStage "${item.difficultyStage}"`,
  )
  validateGraphemes(item, label)

  if (!Array.isArray(item.syllables) || !Array.isArray(item.graphemes)) {
    return
  }

  assert(
    normalize(item.graphemes.map(([text]) => text).join('')) === normalize(item.text),
    `${label}: graphemes do not rebuild "${item.text}"`,
  )

  item.syllables.forEach((syllable, syllableIndex) => {
    const rebuiltSyllable = item.graphemes
      .filter((grapheme) => grapheme[2] === syllableIndex)
      .map(([text]) => text)
      .join('')
    assert(
      normalize(rebuiltSyllable) === normalize(syllable),
      `${label}: graphemes do not rebuild syllable "${syllable}"`,
    )
  })

  const actualPattern = getRolePattern(item)
  const expectedPattern = item.structureId === 'structure-2'
    ? Array.from({ length: item.syllables.length }, () => ['consonant', 'vowel'])
    : expectedPatterns[item.structureId]

  if (item.structureId === 'structure-2') {
    assert(item.syllables.length >= 3, `${label}: structure-2 needs at least three syllables`)
  }

  assert(
    JSON.stringify(actualPattern) === JSON.stringify(expectedPattern),
    `${label}: grapheme roles do not match ${item.structureId}`,
  )
}

assert(structures.length === 6, 'structures.json must contain exactly six structures')
for (const structure of structures) {
  assert(allowedStructureIds.has(structure.id), `${structure.id}: invalid structure id`)
  assert(Number.isInteger(structure.order), `${structure.id}: order must be an integer`)
  assert(isNonEmptyString(structure.pattern), `${structure.id}: pattern is required`)
  assert(isNonEmptyString(structure.name), `${structure.id}: name is required`)
  assert(isNonEmptyString(structure.description), `${structure.id}: description is required`)
  assert(isNonEmptyString(structure.example), `${structure.id}: example is required`)
}

for (const blend of blends) {
  assert(blend.materialKind === 'blend', `${blend.id}: materialKind must be "blend"`)
  assert(blend.blendKind === 'cv' || blend.blendKind === 'cvc', `${blend.id}: invalid blendKind`)
  assert(isNonEmptyString(blend.left), `${blend.id}: left is required`)
  assert(isNonEmptyString(blend.right), `${blend.id}: right is required`)
  assert(isNonEmptyString(blend.result), `${blend.id}: result is required`)
  assert(
    normalize(`${blend.left}${blend.right}`) === normalize(blend.result),
    `${blend.id}: left and right do not rebuild result`,
  )
  assert(
    allowedDifficultyStages.has(blend.difficultyStage),
    `${blend.id}: invalid difficultyStage`,
  )
  assert(
    Array.isArray(blend.structureIds) && blend.structureIds.length > 0,
    `${blend.id}: structureIds are required`,
  )
  for (const structureId of blend.structureIds ?? []) {
    assert(structureById.has(structureId), `${blend.id}: unknown structureId "${structureId}"`)
  }
  validateGraphemes(blend, blend.id)
  assert(
    normalize(blend.graphemes.map(([text]) => text).join('')) === normalize(blend.result),
    `${blend.id}: graphemes do not rebuild result`,
  )
}

for (const item of decodingWords) {
  validateDecodingItem(item, item.id, 'word')
  if (item.sourceWordId !== undefined) {
    const sourceWord = wordById.get(item.sourceWordId)
    assert(sourceWord, `${item.id}: unknown sourceWordId "${item.sourceWordId}"`)
    assert(
      !sourceWord || normalize(sourceWord.text) === normalize(item.text),
      `${item.id}: source word text does not match`,
    )
  }
}

for (const item of pseudowords) {
  validateDecodingItem(item, item.id, 'pseudoword')
}

const realWordTexts = new Set([
  ...words.map((word) => normalize(word.text)),
  ...decodingWords.map((word) => normalize(word.text)),
])
for (const item of pseudowords) {
  assert(
    !realWordTexts.has(normalize(item.text)),
    `${item.id}: pseudoword collides with a real word`,
  )
}

for (const structure of structures) {
  const structureWords = decodingWords.filter((item) => item.structureId === structure.id)
  const structurePseudowords = pseudowords.filter((item) => item.structureId === structure.id)
  assert(structureWords.length >= 9, `${structure.id}: expected at least 9 decoding words`)
  assert(structurePseudowords.length >= 6, `${structure.id}: expected at least 6 pseudowords`)

  for (const stage of allowedDifficultyStages) {
    assert(
      structureWords.filter((item) => item.difficultyStage === stage).length >= 3,
      `${structure.id}: expected at least 3 words at ${stage}`,
    )
    assert(
      structurePseudowords.filter((item) => item.difficultyStage === stage).length >= 2,
      `${structure.id}: expected at least 2 pseudowords at ${stage}`,
    )
  }
}

for (const stage of allowedDifficultyStages) {
  assert(
    blends.filter((blend) => blend.blendKind === 'cv' && blend.difficultyStage === stage).length >= 6,
    `blends.json: expected at least 6 CV blends at ${stage}`,
  )
}

for (const level of levels) {
  assert(
    syllables.some((syllable) => syllable.levelId === level.id),
    `${level.id}: expected at least one syllable or sign`,
  )
  assert(
    words.some((word) => word.levelId === level.id),
    `${level.id}: expected at least one word`,
  )
  assert(
    words.some(
      (word) => word.levelId === level.id && word.suitableForSyllabification,
    ),
    `${level.id}: expected at least one word suitable for syllabification`,
  )
  assert(
    sentences.some((sentence) => sentence.levelId === level.id),
    `${level.id}: expected at least one sentence`,
  )
}

scanProtectedTerms({
  levels,
  syllables,
  words,
  sentences,
  structures,
  blends,
  decodingWords,
  pseudowords,
})

if (errors.length > 0) {
  console.error('Content validation failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(
  `Content OK: ${levels.length} levels, ${structures.length} structures, ${syllables.length} syllables/signs, ${words.length} reading words, ${decodingWords.length} decoding words, ${pseudowords.length} pseudowords, ${sentences.length} sentences.`,
)
