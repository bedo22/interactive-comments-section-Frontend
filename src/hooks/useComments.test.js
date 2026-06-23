import { renderHook, act } from '@testing-library/react'
import { useComments } from './useComments'

beforeEach(() => {
  localStorage.clear()
})

describe('useComments', () => {
  it('loads initial data from data.json', () => {
    const { result } = renderHook(() => useComments())
    expect(result.current.comments.length).toBeGreaterThan(0)
    expect(result.current.currentUser.username).toBe('juliusomo')
  })

  it('upvote increments score', () => {
    const { result } = renderHook(() => useComments())
    const id = result.current.comments[0].id
    const before = result.current.comments.find((c) => c.id === id).score
    act(() => result.current.upvote(id))
    expect(result.current.comments.find((c) => c.id === id).score).toBe(before + 1)
  })

  it('downvote decrements score', () => {
    const { result } = renderHook(() => useComments())
    const id = result.current.comments[0].id
    const before = result.current.comments.find((c) => c.id === id).score
    act(() => result.current.downvote(id))
    expect(result.current.comments.find((c) => c.id === id).score).toBe(before - 1)
  })

  it('sendComment adds a new top-level comment', () => {
    const { result } = renderHook(() => useComments())
    const before = result.current.comments.length
    act(() => result.current.sendComment('Hello world'))
    expect(result.current.comments.length).toBe(before + 1)
    const added = result.current.comments[result.current.comments.length - 1]
    expect(added.content).toBe('Hello world')
    expect(added.parentId).toBeNull()
    expect(added.user.username).toBe('juliusomo')
  })

  it('sendReply adds a reply under the correct parent', () => {
    const { result } = renderHook(() => useComments())
    const topLevel = result.current.comments.find((c) => c.parentId === null)
    act(() => result.current.sendReply(topLevel.id, '@someone reply'))
    const replies = result.current.comments.filter((c) => c.parentId === topLevel.id)
    expect(replies.length).toBeGreaterThan(0)
    expect(replies[replies.length - 1].content).toBe('@someone reply')
  })

  it('sendReply to a reply uses the thread root parentId', () => {
    const { result } = renderHook(() => useComments())
    const reply = result.current.comments.find((c) => c.parentId !== null)
    const rootId = reply.parentId
    act(() => result.current.sendReply(reply.id, 'nested reply'))
    const added = result.current.comments[result.current.comments.length - 1]
    expect(added.parentId).toBe(rootId)
  })

  it('edit updates comment content', () => {
    const { result } = renderHook(() => useComments())
    const id = result.current.comments[0].id
    act(() => result.current.edit(id, 'Updated content'))
    expect(result.current.comments.find((c) => c.id === id).content).toBe('Updated content')
  })

  it('edit clears editingCommentId', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.openEdit(result.current.comments[0].id))
    expect(result.current.editingCommentId).toBe(result.current.comments[0].id)
    act(() => result.current.edit(result.current.comments[0].id, 'new'))
    expect(result.current.editingCommentId).toBeNull()
  })

  it('deleteComment removes comment and its replies', () => {
    const { result } = renderHook(() => useComments())
    const topLevel = result.current.comments.find((c) => c.parentId === null)
    const replyCount = result.current.comments.filter((c) => c.parentId === topLevel.id).length
    const before = result.current.comments.length
    act(() => result.current.deleteComment(topLevel.id))
    expect(result.current.comments.length).toBe(before - 1 - replyCount)
    expect(result.current.comments.find((c) => c.id === topLevel.id)).toBeUndefined()
  })

  it('deleteComment clears deletingCommentId', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.setDeletingCommentId(result.current.comments[0].id))
    expect(result.current.deletingCommentId).toBe(result.current.comments[0].id)
    act(() => result.current.deleteComment(result.current.comments[0].id))
    expect(result.current.deletingCommentId).toBeNull()
  })

  it('openReply sets replyingToId and clears editingCommentId', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.openEdit(result.current.comments[0].id))
    expect(result.current.editingCommentId).not.toBeNull()
    act(() => result.current.openReply(result.current.comments[0].id))
    expect(result.current.replyingToId).toBe(result.current.comments[0].id)
    expect(result.current.editingCommentId).toBeNull()
  })

  it('openEdit sets editingCommentId and clears replyingToId', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.openReply(result.current.comments[0].id))
    expect(result.current.replyingToId).not.toBeNull()
    act(() => result.current.openEdit(result.current.comments[0].id))
    expect(result.current.editingCommentId).toBe(result.current.comments[0].id)
    expect(result.current.replyingToId).toBeNull()
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.sendComment('persisted'))
    const stored = JSON.parse(localStorage.getItem('comments-data'))
    expect(stored).toBeDefined()
    expect(stored.some((c) => c.content === 'persisted')).toBe(true)
  })

  it('loads from localStorage if available', () => {
    const fakeComments = [
      { id: 99, content: 'stored', createdAt: new Date().toISOString(), score: 0, user: { image: { png: '', webp: '' }, username: 'test' }, parentId: null },
    ]
    localStorage.setItem('comments-data', JSON.stringify(fakeComments))
    const { result } = renderHook(() => useComments())
    expect(result.current.comments[0].content).toBe('stored')
  })

  it('ID generation produces unique incrementing IDs', () => {
    const { result } = renderHook(() => useComments())
    const maxId = Math.max(...result.current.comments.map((c) => c.id))
    act(() => result.current.sendComment('first'))
    const first = result.current.comments[result.current.comments.length - 1]
    expect(first.id).toBe(maxId + 1)
    act(() => result.current.sendComment('second'))
    const second = result.current.comments[result.current.comments.length - 1]
    expect(second.id).toBe(maxId + 2)
  })

  it('openReply on same comment does not toggle off (no-op)', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.openReply(1))
    expect(result.current.replyingToId).toBe(1)
    act(() => result.current.openReply(1))
    expect(result.current.replyingToId).toBe(1)
  })

  it('openEdit on same comment does not toggle off (no-op)', () => {
    const { result } = renderHook(() => useComments())
    act(() => result.current.openEdit(1))
    expect(result.current.editingCommentId).toBe(1)
    act(() => result.current.openEdit(1))
    expect(result.current.editingCommentId).toBe(1)
  })
})
