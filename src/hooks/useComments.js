import { useState, useEffect, useCallback } from 'react'
import data from '../../data.json'
import { transformData } from '../utils/transformData'

const STORAGE_KEY = 'comments-data'

function loadInitialData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id !== undefined) {
        return { comments: parsed, currentUser: data.currentUser }
      }
    }
  } catch {}
  return transformData(data)
}

export function useComments() {
  const [state, setState] = useState(() => loadInitialData())
  const [replyingToId, setReplyingToId] = useState(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [deletingCommentId, setDeletingCommentId] = useState(null)

  const { comments, currentUser } = state

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
  }, [comments])

  const getNextId = useCallback(() => {
    return Math.max(0, ...comments.map((c) => c.id)) + 1
  }, [comments])

  const upvote = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === id ? { ...c, score: c.score + 1 } : c
      ),
    }))
  }, [])

  const downvote = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === id ? { ...c, score: c.score - 1 } : c
      ),
    }))
  }, [])

  const sendComment = useCallback(
    (content) => {
      const newComment = {
        id: getNextId(),
        content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: currentUser,
        parentId: null,
      }
      setState((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }))
    },
    [getNextId, currentUser]
  )

  const sendReply = useCallback(
    (parentId, content) => {
      const target = comments.find((c) => c.id === parentId)
      const rootParentId = target?.parentId ?? parentId
      const newReply = {
        id: getNextId(),
        content,
        createdAt: new Date().toISOString(),
        score: 0,
        user: currentUser,
        parentId: rootParentId,
      }
      setState((prev) => ({
        ...prev,
        comments: [...prev.comments, newReply],
      }))
      setReplyingToId(null)
    },
    [getNextId, currentUser, comments]
  )

  const edit = useCallback((id, newContent) => {
    setState((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === id ? { ...c, content: newContent } : c
      ),
    }))
    setEditingCommentId(null)
  }, [])

  const deleteComment = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      comments: prev.comments.filter(
        (c) => c.id !== id && c.parentId !== id
      ),
    }))
    setDeletingCommentId(null)
  }, [])

  const openReply = useCallback(
    (id) => {
      setEditingCommentId(null)
      setReplyingToId(id)
    },
    []
  )

  const openEdit = useCallback((id) => {
    setReplyingToId(null)
    setEditingCommentId(id)
  }, [])

  const cancelReply = useCallback(() => setReplyingToId(null), [])
  const cancelEdit = useCallback(() => setEditingCommentId(null), [])
  const cancelDelete = useCallback(() => setDeletingCommentId(null), [])

  return {
    comments,
    currentUser,
    replyingToId,
    editingCommentId,
    deletingCommentId,
    setDeletingCommentId,
    upvote,
    downvote,
    sendComment,
    sendReply,
    edit,
    deleteComment,
    openReply,
    openEdit,
    cancelReply,
    cancelEdit,
    cancelDelete,
  }
}
