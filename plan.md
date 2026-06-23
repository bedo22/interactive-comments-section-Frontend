# Implementation Plan

## Stack
Vite + React + CSS Modules. pnpm. Vitest + React Testing Library for tests.

## Phase 1: Project Scaffold
- `pnpm create vite@latest . -- --template react`
- Rubik font import (400/500/700) in index.css
- CSS custom properties from style-guide.md colors
- Structure: src/components/, src/hooks/, src/utils/, src/App.jsx, src/main.jsx

## Phase 2: Utilities (src/utils/)
- `transformData.js` — flatten nested data.json into { comments, currentUser } with parentId, prepend @username to reply content, convert relative timestamps to ISO strings using Date.now()
- `buildTree.js` — returns flat [{ comment, depth }] ordered by score (depth 0) then time (depth 1)
- `formatTime.js` — Intl.RelativeTimeFormat + simple thresholds, no library

## Phase 3: Hook (src/hooks/useComments.js)
- State: comments, replyingToId, editingCommentId, deletingCommentId — separate useState
- Callbacks: upvote, downvote, reply, edit, deleteComment, sendReply, sendComment
- localStorage: read on init, write on every comments change via useEffect
- ID gen: Math.max(...map(c => c.id)) + 1

## Phase 4: Components
| Component | Key behavior |
|-----------|-------------|
| CommentCard | Desktop: vertical pill left, actions top-right. Mobile: horizontal pill bottom, actions bottom-right. isEditing switches content to textarea + UPDATE. Own comments: Delete/Edit, no Reply. @username parsed via regex. |
| VoteCounter | + score −, vertical desktop / horizontal mobile. No active state. |
| ReplyForm | Auto-focused textarea, pre-filled @username. Escape closes. |
| EditForm | In-place content replacement, UPDATE right-aligned below. |
| NewCommentForm | Bottom of page, full width, placeholder, SEND button. |
| DeleteModal | Overlay + backdrop, focus trapped, Escape closes, NO CANCEL / YES DELETE. |
| App | Calls useComments, runs buildTree, renders loop inserting reply/edit forms. Passes isOwn as prop. |

## Phase 5: Responsive CSS
- Media query at 768px inside each .module.css
- Desktop: flex row (pill | content), replies indented with left border
- Mobile: flex column, pill + actions at bottom
- Delete modal: centered, same both breakpoints

## Phase 6: Testing
### Setup
- pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
- test script: "test": "vitest"
- vitest.config.js with environment: 'jsdom'

### Hook tests (src/hooks/useComments.test.js)
- renderHook from @testing-library/react
- Test each callback: upvote, downvote, reply, edit, delete
- Test localStorage round-trip
- Test ID generation

### Component integration tests (src/App.test.jsx)
- render(<App />) with React Testing Library
- Select by visible text, scope with within() + closest('article')
- Test flows: add comment, reply, edit, delete with modal
- Test own vs other user visibility
- Test modal accessibility: role="dialog", aria-modal="true", focus management
