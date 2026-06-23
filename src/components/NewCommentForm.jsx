import { useState, useRef, useEffect } from 'react'
import styles from './NewCommentForm.module.css'

export default function NewCommentForm({ currentUser, onSubmit }) {
  const [content, setContent] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setContent('')
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
        placeholder="Add a comment..."
        rows={3}
      />
      <button className={styles.btn} type="submit">
        SEND
      </button>
    </form>
  )
}
