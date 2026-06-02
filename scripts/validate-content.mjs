import { readFile } from 'node:fs/promises'

const contentDir = new URL('../src/content/', import.meta.url)
const allowedSyllableKinds = new Set(['syllable', 'digraph', 'trigraph'])
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

assert(Array.isArray(levels), 'levels.json must contain an array')
assert(Array.isArray(syllables), 'syllables.json must contain an array')
assert(Array.isArray(words), 'words.json must contain an array')
assert(Array.isArray(sentences), 'sentences.json must contain an array')

const allIds = new Set()
ensureUniqueIds(levels, 'levels.json', allIds)
ensureUniqueIds(syllables, 'syllables.json', allIds)
ensureUniqueIds(words, 'words.json', allIds)
ensureUniqueIds(sentences, 'sentences.json', allIds)

const levelById = new Map(levels.map((level) => [level.id, level]))
const wordById = new Map(words.map((word) => [word.id, word]))
const levelOrderById = new Map(levels.map((level) => [level.id, level.order]))

for (const level of levels) {
  assert(Number.isInteger(level.order), `${level.id}: level order must be an integer`)
  assert(isNonEmptyString(level.name), `${level.id}: level name is required`)
  assert(
    isNonEmptyString(level.parentDescription),
    `${level.id}: parentDescription is required`,
  )
  assert(isStringArray(level.focus), `${level.id}: focus must be a non-empty string array`)
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
    sentences.some((sentence) => sentence.levelId === level.id),
    `${level.id}: expected at least one sentence`,
  )
}

scanProtectedTerms({ levels, syllables, words, sentences })

if (errors.length > 0) {
  console.error('Content validation failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(
  `Content OK: ${levels.length} levels, ${syllables.length} syllables/signs, ${words.length} words, ${sentences.length} sentences.`,
)
