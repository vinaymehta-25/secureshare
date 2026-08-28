import { useEffect, useState } from 'react'
import apiClient from '../api/client'

export default function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    setLoading(true)
    try {
      const res = await apiClient.get('/notes/')
      setNotes(res.data)
    } catch (err) {
      setError('Could not load notes.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSaving(true)
    try {
      const res = await apiClient.post('/notes/', { title, content })
      setNotes([res.data, ...notes])
      setTitle('')
      setContent('')
    } catch (err) {
      setError('Could not save note.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    // Optimistic removal, roll back if the request fails.
    const prev = notes
    setNotes(notes.filter((n) => n.id !== id))
    try {
      await apiClient.delete(`/notes/${id}`)
    } catch (err) {
      setNotes(prev)
      setError('Could not delete note.')
    }
  }

  return (
    <div className="main">
      <div className="section-header">
        <h1>Your notes</h1>
        <span className="count">{notes.length} total</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form className="new-note-card" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={10000}
        />
        <div className="new-note-actions">
          <button className="btn-accent-sm" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Add note'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="empty-state">loading...</div>
      ) : notes.length === 0 ? (
        <div className="empty-state">No notes yet. Add your first one above.</div>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-card-head">
                <h3>{note.title}</h3>
                <button className="note-delete" onClick={() => handleDelete(note.id)}>
                  delete
                </button>
              </div>
              <p>{note.content}</p>
              <div className="note-meta">
                {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
