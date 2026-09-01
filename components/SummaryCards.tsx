'use client'

import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
}

export default function SummaryCards({ income, expense, balance }: SummaryCardsProps) {
  const isPositive = balance >= 0

  return (
    <div className="summary-grid">
      {/* Ingresos */}
      <div className="summary-card summary-card--income">
        <div className="summary-card__icon summary-card__icon--income">💰</div>
        <span className="summary-card__label">Ingresos</span>
        <span className="summary-card__amount summary-card__amount--income">
          {formatCurrency(income)}
        </span>
      </div>

      {/* Gastos */}
      <div className="summary-card summary-card--expense">
        <div className="summary-card__icon summary-card__icon--expense">💸</div>
        <span className="summary-card__label">Gastos</span>
        <span className="summary-card__amount summary-card__amount--expense">
          {formatCurrency(expense)}
        </span>
      </div>

      {/* Balance */}
      <div className="summary-card summary-card--balance">
        <div className="summary-card__icon summary-card__icon--balance">
          {isPositive ? '📈' : '📉'}
        </div>
        <span className="summary-card__label">Balance</span>
        <span
          className={`summary-card__amount summary-card__amount--${isPositive ? 'positive' : 'negative'}`}
        >
          {isPositive ? '+' : ''}{formatCurrency(balance)}
        </span>
      </div>
    </div>
  )
}
