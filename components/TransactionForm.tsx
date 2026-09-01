'use client'

import { useState } from 'react'
import type { Category, Transaction } from '@/lib/types/database'
import { supabase } from '@/lib/supabase/client'

interface TransactionFormProps {
  categories: Category[]
  editTransaction?: Transaction | null
  defaultYear: number
  defaultMonth: number
  onClose: () => void
  onSaved: () => void
}

const DEFAULT_COLORS = [
  '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b',
  '#3b82f6', '#06b6d4', '#ec4899', '#84cc16',
]

export default function TransactionForm({
  categories,
  editTransaction,
  defaultYear,
  defaultMonth,
  onClose,
  onSaved,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>(
    editTransaction?.type || 'expense'
  )
  const [description, setDescription] = useState(editTransaction?.description || '')
  const [amount, setAmount] = useState(
    editTransaction ? String(editTransaction.amount) : ''
  )
  const [categoryId, setCategoryId] = useState(editTransaction?.category_id || '')
  const [isFixed, setIsFixed] = useState(editTransaction?.is_fixed || false)
  const [startDate, setStartDate] = useState(() => {
    if (editTransaction?.start_date) return editTransaction.start_date
    const d = new Date(defaultYear, defaultMonth - 1, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredCategories = categories.filter((c) => c.type === type)
  const isEditing = !!editTransaction

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const amountNum = parseFloat(amount.replace(/,/g, '.'))
    if (!description.trim()) { setError('La descripción es requerida'); return }
    if (isNaN(amountNum) || amountNum <= 0) { setError('El monto debe ser un número válido mayor a 0'); return }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesión expirada. Por favor ingresa de nuevo.'); setLoading(false); return }

    if (isEditing && editTransaction) {
      const updatePayload = {
        description: description.trim(),
        amount: amountNum,
        type,
        category_id: categoryId || null,
        is_fixed: isFixed,
        start_date: startDate,
        end_date: null as string | null,
      }
      // @ts-ignore — Supabase types mismatch with update payloads
      const { error } = await supabase
        .from('transactions')
        // @ts-ignore
        .update(updatePayload)
        .eq('id', editTransaction.id)
      if (error) setError(error.message)
      else { onSaved(); onClose() }
    } else {
      const insertPayload = {
        user_id: user.id,
        description: description.trim(),
        amount: amountNum,
        type,
        category_id: categoryId || null,
        is_fixed: isFixed,
        start_date: startDate,
        end_date: null as string | null,
      }
      // @ts-ignore — Supabase types mismatch with insert payloads
      const { error } = await supabase
        .from('transactions')
        // @ts-ignore
        .insert(insertPayload)
      if (error) setError(error.message)
      else { onSaved(); onClose() }
    }

    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-slide-up">
        <div className="modal__handle" />
        <div className="modal__header">
          <h3 className="modal__title">
            {isEditing ? 'Editar movimiento' : 'Nuevo movimiento'}
          </h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            {/* Tipo: Ingreso / Gasto */}
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-selector__btn type-selector__btn--income ${type === 'income' ? 'active' : ''}`}
                  onClick={() => { setType('income'); setCategoryId('') }}
                >
                  <span>↑</span> Ingreso
                </button>
                <button
                  type="button"
                  className={`type-selector__btn type-selector__btn--expense ${type === 'expense' ? 'active' : ''}`}
                  onClick={() => { setType('expense'); setCategoryId('') }}
                >
                  <span>↓</span> Gasto
                </button>
              </div>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">Descripción</label>
              <input
                id="description"
                type="text"
                className="form-input"
                placeholder="Ej: Supermercado, Salario, Netflix…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            {/* Monto */}
            <div className="form-group">
              <label className="form-label" htmlFor="amount">Monto (COP)</label>
              <input
                id="amount"
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">Categoría</label>
              <select
                id="category"
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Sin categoría</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de inicio */}
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">
                {isFixed ? 'Aplica desde' : 'Fecha'}
              </label>
              <input
                id="startDate"
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* Toggle gasto fijo */}
            <div className="toggle-group">
              <div className="toggle-label">
                <span className="toggle-label__title">🔁 Recurrente (fijo mensual)</span>
                <span className="toggle-label__sub">
                  {isFixed
                    ? 'Aparecerá automáticamente cada mes'
                    : 'Solo aparecerá en el mes seleccionado'}
                </span>
              </div>
              <label className="toggle" htmlFor="isFixed">
                <input
                  type="checkbox"
                  id="isFixed"
                  checked={isFixed}
                  onChange={(e) => setIsFixed(e.target.checked)}
                />
                <span className="toggle__slider" />
              </label>
            </div>

            {error && <div className="auth-error">{error}</div>}
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
