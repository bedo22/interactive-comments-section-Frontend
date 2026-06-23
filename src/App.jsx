import { useComments } from './hooks/useComments'
import { buildTree } from './utils/buildTree'
import CommentCard from './components/CommentCard'
import ReplyForm from './components/ReplyForm'
import NewCommentForm from './components/NewCommentForm'
import DeleteModal from './components/DeleteModal'
import styles from './App.module.css'

export default function App() {
  const {
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
  } = useComments()

  const tree = buildTree(comments)

  return (
    <div className={styles.container}>
      <div className={styles.commentsList}>
        {tree.map(({ comment, depth }) => (
          <div key={comment.id} className={styles.commentWrapper}>
            <CommentCard
              comment={comment}
              depth={depth}
              isOwn={currentUser.username === comment.user.username}
              isEditing={editingCommentId === comment.id}
              onUpvote={upvote}
              onDownvote={downvote}
              onReply={openReply}
              onEdit={openEdit}
              onDelete={(id) => setDeletingCommentId(id)}
              onSaveEdit={edit}
              onCancelEdit={cancelEdit}
              currentUser={currentUser}
            />
            {replyingToId === comment.id && (
              <div className={styles.replyFormWrapper}>
                <ReplyForm
                  username={comment.user.username}
                  currentUser={currentUser}
                  onSubmit={(content) => sendReply(comment.id, content)}
                  onCancel={cancelReply}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <NewCommentForm currentUser={currentUser} onSubmit={sendComment} />
      {deletingCommentId !== null && (
        <DeleteModal
          onConfirm={() => deleteComment(deletingCommentId)}
          onCancel={cancelDelete}
        />
      )}
    </div>
  )
}
