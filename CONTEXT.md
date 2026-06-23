# Glossary

## Comment

A user-authored item in the discussion thread. Every comment has content, a score, a creation timestamp, and an author. A comment may be top-level or a reply to another comment.

## Reply

A comment that is a response to another comment. In the domain, a reply belongs to exactly one parent comment. A reply is still a comment — the distinction is relational, not structural. Replies within a thread are displayed in chronological order (oldest first).

## Thread

A top-level comment and all of its descendant replies, rendered as a group. The thread is the visual boundary for indentation and reply grouping. Top-level comments are ordered by score (highest first).

## Score

The sum of upvotes and downvotes on a comment. Displayed as a single integer. The score has no lower bound and may be negative.

## Current User

The user operating the app. Identified by username. The current user can edit or delete only their own comments. The current user cannot reply to their own comments.

## Delete Confirmation Modal

A dialog that interrupts the user before a comment is permanently removed, requiring explicit confirmation or cancellation.

---

# Shared Understanding

## Goal

Build the Frontend Mentor "Interactive Comments Section" challenge to match the design exactly, using React and integration testing as the primary practice focus.

## Scope — What the user can do

1. **View comments** — Page loads, thread is populated from initial data.
2. **Upvote / Downvote** — Click `+` or `-` on any comment to change its score.
3. **Reply to a comment** — Click "Reply", a reply form appears below the target comment. Submitting adds a new reply.
4. **Add a top-level comment** — Use the form at the bottom of the page.
5. **Edit own comment** — Click "Edit", the comment transforms into an editable textarea with an "UPDATE" button.
6. **Delete own comment** — Click "Delete", a confirmation modal appears. Confirm to remove.

## Key Design & Behavior Constraints

- **Own comments** show "Delete" + "Edit" only. The "Reply" button is absent on own comments. Own comments display a "you" badge next to the username.
- **Other users' comments** show only "Reply".
- **Cannot reply to own comments** — the "Reply" button is absent on own comments.
- **Top-level comments** ordered by score (highest first).
- **Replies within a thread** ordered by time added (oldest first).
- **Reply form** appears directly below the target comment.
- **Edit form** replaces the comment content in-place.
- **Delete modal** is a centered overlay with a backdrop.
- **Score** can go negative (no lower bound).

## Responsive Layout Rules

- **Desktop (≥~768px):** Vote counter is a vertical pill on the **left** of the card. Action buttons are **top-right**. Indented replies use a left vertical border.
- **Mobile (<~768px):** Vote counter is a **horizontal pill at the bottom** of the card. Action buttons are **bottom-right**. The top row is avatar + username + timestamp only.

## Detailed Layout (Desktop 1440px)

### Comment Card Structure (Desktop)
A horizontal layout inside a rounded card on a light gray background (`hsl(228, 33%, 97%)`):

- **Left column (vertical):** Vote counter pill — up arrow (`+`), score number in bold, down arrow (`-`). All vertically stacked. No border on the pill; background is slightly lighter than the card.
- **Right column (flexible):**
  - **Top row:** Avatar (small circle) + username in bold + "you" badge (if own comment) + timestamp in muted gray. Action buttons (Reply / Delete / Edit) are **right-aligned** in the same top row.
  - **Middle row:** Comment content. If a reply, the content begins with `@username` in bold blue/purple.
  - **Bottom row:** No vote counter here (it's on the left).
- **Indentation for replies:** Replies are shifted right by a left vertical border (a thin line in a muted color) on the outer wrapper. Each reply card sits to the right of this border.

### Comment Card Structure (Mobile 375px)
A vertical layout inside the same rounded card:

- **Top row:** Avatar (small circle) + username + "you" badge + timestamp. No action buttons in this row.
- **Middle row:** Comment content (same as desktop, with `@username` prefix for replies).
- **Bottom row:** Left side: horizontal vote counter pill (`+` score `-`). Right side: action buttons (Reply / Delete / Edit).

### Reply Form (Desktop & Mobile)
- Appears directly below the target comment, at the same indentation level as the reply would be (one level deeper).
- Contains: current user's avatar on the left, a textarea in the middle, and a "REPLY" button on the right.
- The textarea is pre-filled with `@username ` (with a trailing space) referencing the comment being replied to.

### Edit Form (Desktop & Mobile)
- Replaces the content area of the existing comment card in-place.
- The card shell (avatar, username, timestamp, badge, action buttons) remains visible.
- The content area becomes a textarea with the current comment text. An "UPDATE" button appears below the textarea, right-aligned.

### New Comment Form (Bottom of Page)
- Always at the bottom, full width, no indentation.
- Contains: current user's avatar on the left, a textarea with placeholder "Add a comment...", and a "SEND" button on the right.

### Delete Confirmation Modal
- A centered overlay with a semi-transparent dark backdrop covering the entire page.
- The modal card is centered, white background, rounded corners.
- Title: "Delete comment" in bold.
- Body: "Are you sure you want to delete this comment? This will remove the comment and can't be undone."
- Two buttons side by side: "NO, CANCEL" (gray/dark background) and "YES, DELETE" (red/coral background).

## Data Model (flattened)

All comments stored in a single flat array. Each comment has:
- `id`: unique integer
- `content`: string
- `createdAt`: real timestamp (ISO string or Date object)
- `score`: integer
- `user`: { `image` (png/webp), `username` }
- `parentId`: `null` for top-level, or `commentId` for replies

## Current User (fixed for this challenge)

- `username`: "juliusomo"
- `image`: `./images/avatars/image-juliusomo.png`

## Bonus Features (optional but encouraged)

- **localStorage persistence:** Save the entire thread state so refreshing the page doesn't lose changes.
- **Dynamic timestamps:** Use real timestamps and compute relative time strings (e.g., "2 days ago") instead of static strings.

## Architectural Decisions Already Made

- **State shape:** Flattened array of comments with `parentId` (not nested tree).
- **Rendering strategy:** Flat render (no recursive React components). One pass builds the tree; components render a flat DOM list with CSS indentation classes.
- **State ownership:** Reply form and edit form state are centralized at the App level (not per-component). Only one reply form and one edit form can be open at a time.
- **buildTree + rendering loop:** `buildTree` is a pure data function that returns a flat list of `{ comment, depth }` nodes. The rendering loop in `App` handles inserting reply forms and edit forms into the DOM by checking `replyingToId` and `editingCommentId` against the current node. `CommentCard` accepts `isEditing` as a prop and switches its content area internally — the card shell remains visible.
- **Edit mode behavior:** When a comment is being edited, the card shell (avatar, username, timestamp, badge, action buttons) stays visible. Only the content area is replaced by a textarea with an "UPDATE" button. The action buttons are still present and functional (user can still click Delete while editing, or click Edit again to cancel).
- **State management:** A custom `useComments` hook encapsulates all comment data and UI state (`comments`, `replyingToId`, `editingCommentId`, `deletingCommentId`). All callbacks (`upvote`, `downvote`, `reply`, `edit`, `delete`, `update`, `sendReply`, `sendComment`) are defined inside the hook. `App` calls the hook and passes the returned values as props to child components. This keeps the `App` component thin and makes the business logic testable outside React DOM.
- **UI-state storage:** `replyingToId`, `editingCommentId`, and `deletingCommentId` are stored as separate `useState` variables. They are not combined into a single object. This maximizes readability and avoids the `...prev` spread-risk. React 18+ automatic batching handles multiple setState calls in one event handler.
- **Integration testing strategy:** Tests are written at two levels: (1) hook-level tests using `renderHook` to test `useComments` logic in isolation, and (2) component-level integration tests using `render(<App />)` with React Testing Library to test user interactions end-to-end within the component. End-to-end tests (Playwright/Cypress) are out of scope for this challenge. Elements are selected by their visible text content (e.g., `screen.getByText('Alice top-level comment')`), then scoped to their parent comment card using `within()` and `closest('article')`. Test data is injected as props or mocks, not the production `data.json`. Accessibility attributes (`role`, `aria-label`) are used for buttons and forms, but not as primary selection handles for comment cards.
- **Data transformation + localStorage:** On app load, check `localStorage` for a persisted comments array. If present and valid, use it. Otherwise, transform the nested `data.json` into the flat runtime format. The transformation includes converting `replyingTo: username` to `parentId: commentId`, and computing real `Date` objects from the relative `createdAt` strings using `Date.now()` as the reference date on first load. On every state change, the entire `comments` array is written to `localStorage` via `JSON.stringify`. The `createdAt` field is stored as an ISO string. If `localStorage` is cleared or corrupted, the app falls back to the initial `data.json` on next load, re-computing dates from the current `Date.now()`. The `depth` field is NOT stored in the data model — it is computed by `buildTree` on every render based on the `parentId` chain.
- **Component structure:** `CommentCard` remains a single component — it is the atomic unit of the UI. `VoteCounter` may be extracted as a separate small component if it warrants isolated testing. `ReplyForm` and `EditForm` are separate components despite visual similarity. `NewCommentForm` and `DeleteModal` are separate components. Utility functions (`buildTree`, `transformData`, `formatTime`) live in a `utils/` folder alongside the components. File structure: `components/` for React components, `hooks/` for `useComments`, `utils/` for pure functions, `App.jsx` and `main.jsx` at the root.
- **CSS architecture:** Component-scoped CSS Modules are used for all component styles. Each component has its own `.module.css` file. Global styles (CSS custom properties for colors, font imports, base resets) live in a single `globals.css` or `index.css` file. The responsive layout (vote counter and action buttons rearranging between desktop and mobile) is handled via media queries inside the component's CSS Module. No Tailwind CSS, no CSS-in-JS library. This demonstrates platform-level CSS knowledge and component-scoped styling discipline.
- **Reply `@username` prefix:** The `@username` prefix on replies is stored IN the `content` field. When a reply is created, the textarea is pre-filled with `@username ` and the user's typed text is appended. The entire string including the prefix is stored as `content`. On initial load from `data.json`, the reply content is transformed to prepend `@username` where `replyingTo` was specified. The `replyingTo` field is dropped from the flattened data model — only `parentId` is needed for the tree structure. `buildTree` no longer needs to derive a display prefix; the content already contains it. When editing a reply, the `@username` prefix is visible and editable in the textarea.
- **Reply content display parsing:** When rendering a reply comment, the `CommentCard` uses a regex `^@(\w+)\s` to check if the content starts with a mention. If the comment is a reply (has `parentId` or `depth > 0`) AND the regex matches, the matched `@username` portion is wrapped in a bold blue/purple `<span>`, and the remainder of the content is rendered as plain text. If the regex does not match (e.g., the user deleted the @username prefix), the entire content is rendered as plain text. This display parsing keeps the edit form simple while matching the design.
- **Nesting depth:** The visual hierarchy is strictly two levels: top-level comments and replies. A reply to a reply still has `parentId` pointing to the **top-level comment** (the thread root), not to the reply being responded to. The `@username` prefix in the content indicates conversationally who is being addressed. All replies within a thread are siblings at the same visual depth. This matches the design, which shows all replies indented equally under their top-level comment. The `buildTree` function only needs to handle depth 0 (top-level) and depth 1 (replies).
- **Edit/reply form interaction behavior:** Clicking "Edit" on a comment that is already being edited does nothing (no toggle, no close) — this prevents accidental double-clicks from closing the form. Clicking "Edit" on a different comment while already editing switches the edit form to the new comment — the old edit form closes, changes are discarded. Clicking "Reply" while an edit form is open closes the edit form and opens the reply form. Clicking "Edit" while a reply form is open closes the reply form and opens the edit form. No confirmation dialogs are shown when switching or discarding unsaved changes. The UX is fast and lightweight — users can always re-open and re-edit.
- **Delete behavior:** Deleting a comment cascades — the comment and all of its descendant replies are removed together. This is handled by the `deleteComment` function in `useComments`, which filters out the target comment and any comments whose `parentId` chain eventually leads to the deleted comment. No orphaned comments, no "[deleted]" stubs, no promotion to top-level.
- **ID generation for new comments:** New comments are assigned the next integer ID by computing `Math.max(...existingComments.map(c => c.id)) + 1`. This is done on every create operation, ensuring uniqueness without maintaining a separate counter. After deleting comments, the next created comment receives the new maximum + 1, which is safe because IDs are never reused. This approach is robust with localStorage because the max ID is computed from the loaded data on every create, not from a persisted counter.
- **Vote behavior:** Upvotes and downvotes are unlimited. There is no per-user vote tracking, no "already voted" state, and no vote cancellation. Each click on `+` increments the score by 1; each click on `-` decrements by 1. The vote counter buttons do not have an active or selected visual state. The score may go negative. This matches the design, which shows no "voted" indicator on the buttons.
- **Current user flow:** `currentUser` is passed as a prop to `App` (e.g., from `data.json` or as a configurable parameter). `App` computes `isOwn` for each comment as `currentUser.username === comment.user.username`, and passes `isOwn` as a prop to `CommentCard`. `CommentCard` does not compute `isOwn` internally — it receives it as a boolean prop. This makes the prop interface explicit and makes integration tests easy to write with different users by simply passing a different `currentUser` to `App`.
- **Accessibility — delete modal:** When the delete modal opens, focus moves to the "NO, CANCEL" button (the safer option for a destructive action). Tab/Shift+Tab are trapped inside the modal — pressing Tab at the last element wraps to the first, and Shift+Tab at the first wraps to the last. Escape closes the modal. When the modal closes, focus returns to the "Delete" button that triggered it. The modal uses `role="dialog"` and `aria-modal="true"`.
- **Accessibility — reply/edit forms:** When a reply form opens, the textarea automatically receives focus. Pressing Escape closes the reply form and discards any typed content. The edit form also auto-focuses the textarea on open. Escape closes the edit form without saving changes.
- **Send reply parentId resolution:** When a user creates a new reply via `sendReply`, the new comment's `parentId` is determined from the comment being replied to. If the user clicked Reply on a top-level comment (`parentId === null`), the new reply's `parentId` = that comment's `id`. If the user clicked Reply on an existing reply (`parentId !== null`), the new reply's `parentId` = the same `parentId` (the thread root). This ensures all replies within a thread remain siblings at depth 1 regardless of which specific comment was clicked for Reply.

---

*Every grilling question from this point forward ties back to this shared understanding. If a decision conflicts with something above, we flag it and resolve it here.*
