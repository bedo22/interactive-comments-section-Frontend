import { useState, useRef, useEffect } from 'react'
import styles from './EditForm.module.css'

export default function EditForm({ content, onSave, onCancel }) {
  const [value, setValue] = useState(content)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel()
        }}
        rows={3}
      />
      <button className={styles.btn} type="submit">
        UPDATE
      </button>
    </form>
  )
}
