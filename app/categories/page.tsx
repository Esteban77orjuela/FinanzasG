'use client'

import { useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase/client'
import type { Category } from '@/lib/types/database'

const EMOJI_OPTIONS = [
  '🛒', '🍔', '🏠', '💊', '🚗', '✈️', '👗', '📱', '💻', '🎮',
  '🎬', '🎵', '📚', '🏋️', '☕', '🍕', '🎁', '💰', '💼', '🔧',
  '📝', '🌿', '🐾', '🏥', '⚡', '💧', '📦', '🏦', '🎓', '💳',
]

const COLOR_OPTIONS = [
  '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#3b82f6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#a78bfa',
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [color, setColor] = useState(COLOR_OPTIONS[0])
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadCategories = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('type')
      .order('name')

    if (data) setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  function openNew() {
    setEditCat(null)
    setName('')
    setType('expense')
    setColor(COLOR_OPTIONS[0])
    setIcon(EMOJI_OPTIONS[0])
    setError('')
    setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditCat(cat)
    setName(cat.name)
    setType(cat.type)
    setColor(cat.color)
    setIcon(cat.icon)
    setError('')
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('El nombre es requerido'); return }
    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesión expirada'); setSaving(false); return }

    let err
    if (editCat) {
      // @ts-ignore
      const res = await supabase.from('categories').update({ name: name.trim(), type, color, icon }).eq('id', editCat.id)
      err = res.error
    } else {
      // @ts-ignore
      const res = await supabase.from('categories').insert({ user_id: user.id, name: name.trim(), type, color, icon })
      err = res.error
    }

    setSaving(false)
    if (err) { setError(err.message) }
    else { setShowForm(false); loadCategories() }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría? Los movimientos asociados quedarán sin categoría.')) return
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Categorías</h1>
            <button className="btn btn--primary btn--sm" onClick={openNew}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nueva
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: '56px' }} />)}
            </div>
          ) : (
            <>
              {/* Ingresos */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p className="section-title">Ingresos</p>
                {incomeCategories.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.875rem', padding: '0.75rem 0' }}>
                    Sin categorías de ingresos aún
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {incomeCategories.map((cat) => <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />)}
                  </div>
                )}
              </div>

              {/* Gastos */}
              <div>
                <p className="section-title">Gastos</p>
                {expenseCategories.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '0.875rem', padding: '0.75rem 0' }}>
                    Sin categorías de gastos aún
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {expenseCategories.map((cat) => <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal formulario */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal__handle" />
            <div className="modal__header">
              <h3 className="modal__title">{editCat ? 'Editar categoría' : 'Nueva categoría'}</h3>
              <button className="btn btn--ghost btn--icon" onClick={() => setShowForm(false)} aria-label="Cerrar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {/* Tipo */}
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <div className="type-selector">
                    <button type="button" className={`type-selector__btn type-selector__btn--income ${type === 'income' ? 'active' : ''}`} onClick={() => setType('income')}>
                      ↑ Ingreso
                    </button>
                    <button type="button" className={`type-selector__btn type-selector__btn--expense ${type === 'expense' ? 'active' : ''}`} onClick={() => setType('expense')}>
                      ↓ Gasto
                    </button>
                  </div>
                </div>

                {/* Nombre */}
                <div className="form-group">
                  <label className="form-label" htmlFor="catName">Nombre</label>
                  <input id="catName" type="text" className="form-input" placeholder="Ej: Alimentación, Salario…" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                {/* Emoji */}
                <div className="form-group">
                  <label className="form-label">Ícono</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        style={{
                          width: '40px', height: '40px', fontSize: '1.25rem',
                          border: `2px solid ${icon === e ? 'var(--color-primary-500)' : 'var(--border-normal)'}`,
                          borderRadius: 'var(--radius-sm)', background: icon === e ? 'var(--color-income-light)' : 'transparent',
                          cursor: 'pointer', transition: 'all var(--transition-fast)',
                        }}
                        onClick={() => setIcon(e)}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: c, border: color === c ? '3px solid white' : '3px solid transparent',
                          cursor: 'pointer', outline: color === c ? `2px solid ${c}` : 'none',
                          outlineOffset: '2px', transition: 'all var(--transition-fast)',
                        }}
                        onClick={() => setColor(c)}
                        aria-label={`Color ${c}`}
                      />
                    ))}
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowForm(false)} disabled={saving}>Cancelar</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Guardando…' : editCat ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function CategoryRow({ cat, onEdit, onDelete }: { cat: Category; onEdit: (c: Category) => void; onDelete: (id: string) => void }) {
  return (
    <div className="transaction-item">
      <div className="transaction-item__icon" style={{ background: cat.color + '22', fontSize: '1.25rem' }}>
        {cat.icon}
      </div>
      <div className="transaction-item__info">
        <div className="transaction-item__description">{cat.name}</div>
        <div className="transaction-item__meta">
          <span className="transaction-item__category">
            <span className="category-dot" style={{ background: cat.color, display: 'inline-block' }} />
            {' '}{cat.type === 'income' ? 'Ingreso' : 'Gasto'}
          </span>
        </div>
      </div>
      <div className="transaction-item__actions" style={{ opacity: 1 }}>
        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => onEdit(cat)} aria-label="Editar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="btn btn--danger btn--icon btn--sm" onClick={() => onDelete(cat.id)} aria-label="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
