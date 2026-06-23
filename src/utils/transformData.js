const RELATIVE_RE = /^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/

function parseRelativeDate(str, now) {
  const match = str.match(RELATIVE_RE)
  if (!match) return new Date(now).toISOString()

  const amount = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers = {
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
    year: 31536000000,
  }

  return new Date(now - amount * multipliers[unit]).toISOString()
}

export function transformData(data) {
  const now = Date.now()
  const comments = []

  for (const comment of data.comments) {
    comments.push({
      id: comment.id,
      content: comment.content,
      createdAt: parseRelativeDate(comment.createdAt, now),
      score: comment.score,
      user: comment.user,
      parentId: null,
    })

    for (const reply of comment.replies || []) {
      comments.push({
        id: reply.id,
        content: `@${reply.replyingTo} ${reply.content}`,
        createdAt: parseRelativeDate(reply.createdAt, now),
        score: reply.score,
        user: reply.user,
        parentId: comment.id,
      })
    }
  }

  return { comments, currentUser: data.currentUser }
}
