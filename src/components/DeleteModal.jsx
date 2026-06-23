import { useEffect, useRef } from 'react'
import styles from './DeleteModal.module.css'

export default function DeleteModal({ onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    cancelRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button'
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>Delete comment</h2>
        <p className={styles.body}>
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className={styles.actions}>
          <button ref={cancelRef} className={styles.cancelBtn} onClick={onCancel}>
            NO, CANCEL
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  )
}
