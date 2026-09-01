'use client'

import { useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import SummaryCards from '@/components/SummaryCards'
import MonthPicker from '@/components/MonthPicker'
import TransactionList from '@/components/TransactionList'
import TransactionForm from '@/components/TransactionForm'
import { supabase } from '@/lib/supabase/client'
import type { Category, Transaction } from '@/lib/types/database'
import { calculateSummary, getTransactionsForMonth } from '@/lib/utils'

export default function DashboardPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const loadData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [txRes, catRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name'),
    ])

    if (txRes.data) setAllTransactions(txRes.data)
    if (catRes.data) setCategories(catRes.data)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const monthTransactions = getTransactionsForMonth(allTransactions, year, month)
  const { income, expense, balance } = calculateSummary(monthTransactions)

  function handleMonthChange(y: number, m: number) {
    setYear(y)
    setMonth(m)
    setFilter('all')
  }

  function handleEdit(t: Transaction) {
    setEditTransaction(t)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditTransaction(null)
  }

  return (
    <>
      <Navbar />

      <main className="page-content">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 style={{ marginBottom: '0.25rem' }}>Mis Finanzas</h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Resumen mensual
              </p>
            </div>
            <MonthPicker year={year} month={month} onChange={handleMonthChange} />
          </div>

          {/* Tarjetas de resumen */}
          {loading ? (
            <div className="summary-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: '100px' }} />
              ))}
            </div>
          ) : (
            <SummaryCards income={income} expense={expense} balance={balance} />
          )}

          {/* Lista de movimientos */}
          <div style={{ marginTop: '2rem' }}>
            <div className="page-header" style={{ marginBottom: '0.875rem' }}>
              <span className="section-title">Movimientos del mes</span>
              <div className="filter-tabs">
                {(['all', 'income', 'expense'] as const).map((f) => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Todos' : f === 'income' ? 'Ingresos' : 'Gastos'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '64px' }} />
                ))}
              </div>
            ) : (
              <TransactionList
                transactions={monthTransactions}
                categories={categories}
                filter={filter}
                onEdit={handleEdit}
                onDeleted={loadData}
              />
            )}
          </div>
        </div>
      </main>

      {/* FAB — Agregar movimiento */}
      <button
        className="fab"
        onClick={() => { setEditTransaction(null); setShowForm(true) }}
        aria-label="Agregar movimiento"
        title="Agregar movimiento"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Modal de formulario */}
      {showForm && (
        <TransactionForm
          categories={categories}
          editTransaction={editTransaction}
          defaultYear={year}
          defaultMonth={month}
          onClose={handleCloseForm}
          onSaved={loadData}
        />
      )}
    </>
  )
}
