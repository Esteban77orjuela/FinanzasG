'use client'

import { useEffect, useRef, useState } from 'react'
import type { Category, Transaction } from '@/lib/types/database'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  filter: 'all' | 'income' | 'expense'
  onEdit: (t: Transaction) => void
  onDeleted: () => void
  onTogglePaid: (id: string, isPaid: boolean) => void
}

function TruncatedDescription({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setTruncated(el.scrollWidth > el.clientWidth)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text])

  return (
    <>
      <span ref={ref} className="transaction-item__description-text">
        {text}
      </span>
      {truncated && (
        <span className="transaction-item__description-affordance" aria-hidden="true">
          ⌄
        </span>
      )}
    </>
  )
}

export default function TransactionList({
  transactions,
  categories,
  filter,
  onEdit,
  onDeleted,
  onTogglePaid,
}: TransactionListProps) {
  const [modalTx, setModalTx] = useState<Transaction | null>(null)

  const filtered = transactions.filter((t) =>
    filter === 'all' ? true : t.type === filter
  )

  async function handleDelete(id: string, isFixed: boolean) {
    const msg = isFixed
      ? '¿Eliminar este gasto fijo? Desaparecerá de todos los meses futuros.'
      : '¿Eliminar este movimiento?'
    if (!confirm(msg)) return

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) onDeleted()
    else alert('Error al eliminar: ' + error.message)
  }

  async function handleTogglePaid(t: Transaction) {
    const next = !t.is_paid
    onTogglePaid(t.id, next)
    // @ts-ignore — Supabase types mismatch with update payloads
    const { error } = await supabase
      .from('transactions')
      // @ts-ignore
      .update({ is_paid: next })
      .eq('id', t.id)
    if (error) {
      onTogglePaid(t.id, !next)
      alert('Error al actualizar el pago: ' + error.message)
    }
  }

  function getCategoryForTransaction(t: Transaction) {
    return categories.find((c) => c.id === t.category_id)
  }

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">
          {filter === 'income' ? '💰' : filter === 'expense' ? '💸' : '📋'}
        </div>
        <p className="empty-state__title">Sin movimientos</p>
        <p className="empty-state__text">
          {filter === 'all'
            ? 'No hay movimientos registrados en este mes. Toca + para agregar uno.'
            : `No hay ${filter === 'income' ? 'ingresos' : 'gastos'} en este mes.`}
        </p>
      </div>
    )
  }

  return (
    <>
    <div className="transaction-list animate-fade-in">
      {filtered.map((t) => {
        const cat = getCategoryForTransaction(t)
        const isIncome = t.type === 'income'
        return (
          <div
            key={t.id}
            className={`transaction-item ${
              !isIncome && !t.is_paid ? 'transaction-item--pending' : ''
            }`}
            onClick={() => setModalTx(t)}
          >
            {/* Ícono */}
            <div
              className="transaction-item__icon"
              style={{
                background: isIncome
                  ? 'rgba(16,185,129,0.12)'
                  : 'rgba(244,63,94,0.12)',
              }}
            >
              {cat?.icon || (isIncome ? '💰' : '💸')}
            </div>

            {/* Info */}
            <div className="transaction-item__info">
              <button
                type="button"
                className="transaction-item__description"
                onClick={(e) => {
                  e.stopPropagation()
                  setModalTx(t)
                }}
                title="Ver descripción completa"
              >
                <TruncatedDescription text={t.description} />
              </button>
              <div className="transaction-item__meta">
                {cat && (
                  <span className="transaction-item__category">
                    <span
                      className="category-dot"
                      style={{ background: cat.color, display: 'inline-block' }}
                    />
                    {' '}{cat.name}
                  </span>
                )}
                {t.is_fixed && (
                  <span className="transaction-item__fixed-badge" title={t.end_date ? `Hasta ${t.end_date}` : 'Indefinido'}>
                    🔁 Fijo{t.end_date ? ' · fin' : ''}
                  </span>
                )}
                {!isIncome && !t.is_paid && (
                  <span className="transaction-item__pending-badge">⏳ Pendiente</span>
                )}
              </div>
            </div>

            {/* Columna derecha: monto + controles */}
            <div className="transaction-item__right">
              {/* Monto */}
              <div
                className={`transaction-item__amount transaction-item__amount--${t.type}`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
              </div>

              {/* Controles */}
              <div className="transaction-item__actions">
                {!isIncome && (
                  <button
                    type="button"
                    className={`transaction-item__paid-toggle ${
                      t.is_paid ? 'transaction-item__paid-toggle--paid' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTogglePaid(t)
                    }}
                    title={t.is_paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                    aria-label={t.is_paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                    aria-pressed={t.is_paid}
                  >
                    {t.is_paid ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    )}
                  </button>
                )}
                <button
                  className="btn btn--ghost btn--icon btn--sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(t)
                  }}
                  title="Editar"
                  aria-label="Editar movimiento"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  className="btn btn--danger btn--icon btn--sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(t.id, t.is_fixed)
                  }}
                  title="Eliminar"
                  aria-label="Eliminar movimiento"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>

    {modalTx && (
      <div className="transaction-modal-overlay" onClick={() => setModalTx(null)}>
        <div
          className="transaction-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="transaction-modal__close"
            onClick={() => setModalTx(null)}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <p className="transaction-modal__label">Descripción completa</p>
          <h3 className="transaction-modal__title">{modalTx.description}</h3>
          <div className="transaction-modal__meta">
            <span className={`transaction-modal__amount transaction-modal__amount--${modalTx.type}`}>
              {modalTx.type === 'income' ? '+' : '-'}{formatCurrency(modalTx.amount)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm transaction-modal__ok"
            onClick={() => setModalTx(null)}
          >
            Entendido
          </button>
        </div>
      </div>
    )}
    </>
  )
}
