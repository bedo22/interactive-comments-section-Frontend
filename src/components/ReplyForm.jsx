import { useState, useRef, useEffect } from 'react'
import styles from './ReplyForm.module.css'

export default function ReplyForm({ username, currentUser, onSubmit, onCancel }) {
  const [content, setContent] = useState(`@${username} `)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const len = textareaRef.current?.value.length || 0
    textareaRef.current?.setSelectionRange(len, len)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <img
        className={styles.avatar}
        src={currentUser.image.png}
        alt={currentUser.username}
      />
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel()
        }}
        rows={3}
      />
      <button className={styles.btn} type="submit">
        REPLY
      </button>
    </form>
  )
}
