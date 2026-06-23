import { formatTime } from '../utils/formatTime'
import VoteCounter from './VoteCounter'
import EditForm from './EditForm'
import styles from './CommentCard.module.css'

const MENTION_RE = /^@(\w+)\s/

export default function CommentCard({
  comment,
  depth,
  isOwn,
  isEditing,
  onUpvote,
  onDownvote,
  onReply,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  currentUser,
}) {
  const isReply = depth > 0
  const mentionMatch = isReply && comment.content.match(MENTION_RE)

  const content = mentionMatch ? (
    <>
      <span className={styles.mention}>{mentionMatch[0]}</span>
      {comment.content.slice(mentionMatch[0].length)}
    </>
  ) : (
    comment.content
  )

  return (
    <article
      className={`${styles.card} ${isReply ? styles.reply : ''}`}
    >
      <div className={styles.voteCol}>
        <VoteCounter
          score={comment.score}
          onUpvote={() => onUpvote(comment.id)}
          onDownvote={() => onDownvote(comment.id)}
        />
      </div>
      <div className={styles.contentCol}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img
              className={styles.avatar}
              src={comment.user.image.png}
              alt={comment.user.username}
            />
            <span className={styles.username}>{comment.user.username}</span>
            {isOwn && <span className={styles.badge}>you</span>}
            <span className={styles.time}>{formatTime(comment.createdAt)}</span>
          </div>
          <div className={styles.actions}>
            {isOwn ? (
              <>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => onDelete(comment.id)}
                  aria-label="Delete"
                >
                   <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                      fill="currentColor"
                    />
                  </svg>
                  Delete
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => isEditing ? onCancelEdit() : onEdit(comment.id)}
                  aria-label="Edit"
                >
                  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                      fill="currentColor"
                    />
                  </svg>
                  Edit
                </button>
              </>
            ) : (
              <button
                className={`${styles.actionBtn} ${styles.replyBtn}`}
                onClick={() => onReply(comment.id)}
                aria-label="Reply"
              >
                <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                    fill="currentColor"
                  />
                </svg>
                Reply
              </button>
            )}
          </div>
        </div>
        <div className={styles.body}>
          {isEditing ? (
            <EditForm
              content={comment.content}
              onSave={(newContent) => onSaveEdit(comment.id, newContent)}
              onCancel={onCancelEdit}
            />
          ) : (
            <p>{content}</p>
          )}
        </div>
      </div>
      <div className={styles.mobileFooter}>
        <VoteCounter
          score={comment.score}
          onUpvote={() => onUpvote(comment.id)}
          onDownvote={() => onDownvote(comment.id)}
        />
        <div className={styles.actions}>
          {isOwn ? (
            <>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => onDelete(comment.id)}
                aria-label="Delete"
              >
                <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                Delete
              </button>
              <button
                className={`${styles.actionBtn} ${styles.editBtn}`}
                onClick={() => isEditing ? onCancelEdit() : onEdit(comment.id)}
                aria-label="Edit"
              >
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                    fill="currentColor"
                  />
                </svg>
                Edit
              </button>
            </>
          ) : (
            <button
              className={`${styles.actionBtn} ${styles.replyBtn}`}
              onClick={() => onReply(comment.id)}
              aria-label="Reply"
            >
              <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                  fill="currentColor"
                />
              </svg>
              Reply
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
