import { getTaskRatingPoints } from './sessionScoring'
import type {
  ReadingSession,
  SessionRating,
  SessionSummary,
  SessionTask,
} from './sessionTypes'

export const getCurrentTask = (session: ReadingSession): SessionTask | undefined =>
  session.tasks[session.currentTaskIndex]

export const rateCurrentTask = (
  session: ReadingSession,
  rating: SessionRating,
): ReadingSession => {
  const currentTask = getCurrentTask(session)

  if (!currentTask || session.status === 'completed') {
    return session
  }

  const answers = [
    ...session.answers,
    {
      taskId: currentTask.id,
      rating,
      points: getTaskRatingPoints(currentTask, session.levelId, rating),
    },
  ]
  const isCompleted = answers.length >= session.tasks.length

  return {
    ...session,
    answers,
    currentTaskIndex: isCompleted
      ? session.currentTaskIndex
      : session.currentTaskIndex + 1,
    status: isCompleted ? 'completed' : 'active',
  }
}

export const getSessionSummary = (session: ReadingSession): SessionSummary => {
  const taskById = new Map(session.tasks.map((task) => [task.id, task]))
  const counts: SessionSummary['counts'] = {
    independent: 0,
    'with-help': 0,
    hard: 0,
    skip: 0,
  }
  const difficultTasks: string[] = []
  const skippedTasks: string[] = []
  const pointsByRating: SessionSummary['pointsByRating'] = {
    independent: 0,
    'with-help': 0,
    hard: 0,
    skip: 0,
  }

  for (const answer of session.answers) {
    counts[answer.rating] += 1
    pointsByRating[answer.rating] += answer.points

    const task = taskById.get(answer.taskId)
    const reviewText = task?.reviewText ?? task?.displayText

    if (answer.rating === 'hard' && reviewText) {
      difficultTasks.push(reviewText)
    }

    if (answer.rating === 'skip' && reviewText) {
      skippedTasks.push(reviewText)
    }
  }

  return {
    totalTasks: session.tasks.length,
    totalPoints: session.answers.reduce((sum, answer) => sum + answer.points, 0),
    counts,
    pointsByRating,
    difficultTasks,
    skippedTasks,
  }
}
