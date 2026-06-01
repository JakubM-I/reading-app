import type { RatingOption, SessionRating } from './sessionTypes'

export const ratingOptions: RatingOption[] = [
  { value: 'independent', label: 'Samodzielnie', points: 2 },
  { value: 'with-help', label: 'Z pomocą', points: 1 },
  { value: 'hard', label: 'Trudne', points: 1 },
  { value: 'skip', label: 'Pomiń', points: 0 },
]

export const ratingLabels: Record<SessionRating, string> = {
  independent: 'Samodzielnie',
  'with-help': 'Z pomocą',
  hard: 'Trudne',
  skip: 'Pomiń',
}

export const getRatingPoints = (rating: SessionRating) =>
  ratingOptions.find((option) => option.value === rating)?.points ?? 0
