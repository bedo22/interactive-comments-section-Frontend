import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  localStorage.clear()
})

function findCommentCard(matcher) {
  return screen.getByText(matcher).closest('article')
}

function clickFirstButton(card, text) {
  return within(card).getAllByText(text)[0]
}

function getScore(card, score) {
  return within(card).getAllByText(String(score))[0]
}

function getReplyTextarea() {
  return screen.getAllByRole('textbox').find((el) => el.value.startsWith('@'))
}

describe('App integration', () => {
  it('renders all comments from data.json', () => {
    render(<App />)
    expect(screen.getByText(/Impressive!/)).toBeInTheDocument()
    expect(screen.getByText(/Woah, your project looks awesome!/)).toBeInTheDocument()
  })

  it('shows "you" badge on own comments', () => {
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    expect(within(card).getByText('you')).toBeInTheDocument()
  })

  it('shows Delete and Edit on own comments, no Reply', () => {
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    expect(within(card).getAllByText('Delete').length).toBeGreaterThan(0)
    expect(within(card).getAllByText('Edit').length).toBeGreaterThan(0)
    expect(within(card).queryAllByText('Reply')).toHaveLength(0)
  })

  it('shows Reply on other users comments, no Delete/Edit', () => {
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    expect(within(card).getAllByText('Reply').length).toBeGreaterThan(0)
    expect(within(card).queryByText('Delete')).not.toBeInTheDocument()
    expect(within(card).queryByText('Edit')).not.toBeInTheDocument()
  })

  it('upvote increments score', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    const scoreBefore = Number(getScore(card, 12).textContent)
    const upBtns = within(card).getAllByLabelText('Upvote')
    await user.click(upBtns[0])
    expect(getScore(card, scoreBefore + 1)).toBeInTheDocument()
  })

  it('downvote decrements score', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    const scoreBefore = Number(getScore(card, 12).textContent)
    const downBtns = within(card).getAllByLabelText('Downvote')
    await user.click(downBtns[0])
    expect(getScore(card, scoreBefore - 1)).toBeInTheDocument()
  })

  it('clicking Reply opens reply form', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    await user.click(clickFirstButton(card, 'Reply'))
    expect(screen.getByText('REPLY')).toBeInTheDocument()
  })

  it('reply form textarea is pre-filled with @username', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    await user.click(clickFirstButton(card, 'Reply'))
    expect(getReplyTextarea().value).toMatch(/^@amyrobson /)
  })

  it('submitting a reply adds it to the thread', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    await user.click(clickFirstButton(card, 'Reply'))
    const textarea = getReplyTextarea()
    await user.clear(textarea)
    await user.type(textarea, '@amyrobson test reply')
    await user.click(screen.getByText('REPLY'))
    expect(screen.getByText(/test reply/)).toBeInTheDocument()
  })

  it('clicking Edit replaces content with textarea', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Edit'))
    expect(within(card).getByText('UPDATE')).toBeInTheDocument()
    expect(within(card).getByRole('textbox')).toBeInTheDocument()
  })

  it('clicking Update saves edited content', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Edit'))
    const textarea = within(card).getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'Updated comment text')
    await user.click(within(card).getByText('UPDATE'))
    expect(screen.getByText('Updated comment text')).toBeInTheDocument()
  })

  it('clicking Delete opens confirmation modal', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Delete'))
    expect(screen.getByText('Delete comment')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
  })

  it('confirming delete removes the comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Delete'))
    await user.click(screen.getByText('YES, DELETE'))
    expect(screen.queryByText((c) => c.includes("I couldn't agree"))).not.toBeInTheDocument()
  })

  it('canceling delete keeps the comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Delete'))
    await user.click(screen.getByText('NO, CANCEL'))
    expect(screen.getByText((c) => c.includes("I couldn't agree"))).toBeInTheDocument()
  })

  it('new comment form submits a top-level comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    const form = screen.getByPlaceholderText('Add a comment...')
    await user.type(form, 'Brand new comment')
    await user.click(screen.getByText('SEND'))
    expect(screen.getByText('Brand new comment')).toBeInTheDocument()
  })

  it('delete modal has correct accessibility attributes', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Delete'))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('pressing Escape closes delete modal', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(card, 'Delete'))
    expect(screen.getByText('Delete comment')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByText('Delete comment')).not.toBeInTheDocument()
  })

  it('pressing Escape closes reply form', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard(/Impressive!/)
    await user.click(clickFirstButton(card, 'Reply'))
    const textarea = getReplyTextarea()
    textarea.focus()
    await user.keyboard('{Escape}')
    expect(screen.queryByText('REPLY')).not.toBeInTheDocument()
  })

  it('reply to a reply still goes under the top-level parent', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = findCommentCard((c) => c.includes("If you're still new"))
    await user.click(clickFirstButton(card, 'Reply'))
    const textarea = getReplyTextarea()
    await user.clear(textarea)
    await user.type(textarea, '@ramsesmiron reply to reply')
    await user.click(screen.getByText('REPLY'))
    expect(screen.getByText(/reply to reply/)).toBeInTheDocument()
  })

  it('clicking Edit while replying closes reply form and opens edit', async () => {
    const user = userEvent.setup()
    render(<App />)
    const amyCard = findCommentCard(/Impressive!/)
    await user.click(clickFirstButton(amyCard, 'Reply'))
    const juliusomoCard = findCommentCard((c) => c.includes("I couldn't agree"))
    await user.click(clickFirstButton(juliusomoCard, 'Edit'))
    expect(within(juliusomoCard).getByText('UPDATE')).toBeInTheDocument()
    expect(screen.queryByText('REPLY')).not.toBeInTheDocument()
  })
})
