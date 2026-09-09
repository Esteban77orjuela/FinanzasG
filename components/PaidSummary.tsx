import { formatCurrency, summarizeExpenses } from '@/lib/utils'
import type { Transaction } from '@/lib/types/database'

interface PaidSummaryProps {
  transactions: Transaction[]
}

export default function PaidSummary({ transactions }: PaidSummaryProps) {
  const { paid, pending, count, pendingCount } = summarizeExpenses(transactions)

  if (count === 0) return null

  const allPaid = pending === 0

  return (
    <div className="paid-summary">
      <div className="paid-summary__stats">
        <span className="paid-summary__stat paid-summary__stat--paid">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Pagados {formatCurrency(paid)}
        </span>
        <span className="paid-summary__stat paid-summary__stat--pending">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Pendientes {formatCurrency(pending)}
        </span>
      </div>
      <p className={`paid-summary__message paid-summary__message--${allPaid ? 'ok' : 'warn'}`}>
        {allPaid
          ? '¡Todos los gastos están pagados! ✅'
          : `Te faltan ${formatCurrency(pending)} para cubrir todos los gastos · ${pendingCount} ${
              pendingCount === 1 ? 'gasto' : 'gastos'
            } pendiente${pendingCount === 1 ? '' : 's'}`}
      </p>
    </div>
  )
}