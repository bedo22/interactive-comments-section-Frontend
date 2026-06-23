export function buildTree(comments) {
  const topLevel = comments
    .filter((c) => c.parentId === null)
    .sort((a, b) => b.score - a.score)

  const replies = comments
    .filter((c) => c.parentId !== null)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const repliesByParent = {}
  for (const reply of replies) {
    if (!repliesByParent[reply.parentId]) {
      repliesByParent[reply.parentId] = []
    }
    repliesByParent[reply.parentId].push(reply)
  }

  const result = []
  for (const comment of topLevel) {
    result.push({ comment, depth: 0 })
    for (const reply of repliesByParent[comment.id] || []) {
      result.push({ comment: reply, depth: 1 })
    }
  }

  return result
}
