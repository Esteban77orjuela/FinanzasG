'use client'

import { useCallback, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import TransactionList from '@/components/TransactionList'
import TransactionForm from '@/components/TransactionForm'
import MonthPicker from '@/components/MonthPicker'
import { supabase } from '@/lib/supabase/client'
import type { Category, Transaction } from '@/lib/types/database'
import { getTransactionsForMonth } from '@/lib/utils'

export default function TransactionsPage() {
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
          <div className="page-header">
            <h1>Movimientos</h1>
            <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
          </div>

          {/* Filtros */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="filter-tabs">
              {(['all', 'income', 'expense'] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'Todos' : f === 'income' ? '↑ Ingresos' : '↓ Gastos'}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
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
      </main>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => { setEditTransaction(null); setShowForm(true) }}
        aria-label="Agregar movimiento"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

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
