import type { ProgressBadge } from './progressTypes'

interface BadgeThreshold {
  id: string
  label: string
  pointsRequired: number
}

export const badgeThresholds: BadgeThreshold[] = [
  { id: 'first-ride', label: 'Pierwszy przejazd', pointsRequired: 110 },
  { id: 'training-driver', label: 'Kierowca treningowy', pointsRequired: 320 },
  { id: 'track-master', label: 'Mistrz toru', pointsRequired: 640 },
  { id: 'super-mechanic', label: 'Super mechanik', pointsRequired: 1020 },
  { id: 'garage-legend', label: 'Legenda garażu', pointsRequired: 1450 },
]

export const getEarnedBadges = (
  totalPoints: number,
  existingBadges: readonly ProgressBadge[],
  earnedAt: string,
) => {
  const existingBadgeIds = new Set(existingBadges.map((badge) => badge.id))
  const newBadges = badgeThresholds
    .filter((badge) => totalPoints >= badge.pointsRequired)
    .filter((badge) => !existingBadgeIds.has(badge.id))
    .map((badge): ProgressBadge => ({ ...badge, earnedAt }))

  return [...existingBadges, ...newBadges]
}
