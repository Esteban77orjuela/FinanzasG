'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

const MIN_GOAL = 20
const MAX_GOAL = 30

interface SavingsGoalProps {
  income: number
  balance: number
}

function getStatus(rate: number) {
  if (rate >= MAX_GOAL) {
    return {
      label: '¡Fabuloso! 🎉',
      tone: 'excellent',
      color: 'var(--color-income)',
    }
  }
  if (rate >= MIN_GOAL) {
    return {
      label: 'Meta mínima ✓',
      tone: 'good',
      color: 'var(--color-primary-400)',
    }
  }
  if (rate > 0) {
    return {
      label: 'Por debajo de la meta',
      tone: 'low',
      color: 'var(--color-expense)',
    }
  }
  return {
    label: 'Sin ahorro este mes',
    tone: 'none',
    color: 'var(--text-muted)',
  }
}

export default function SavingsGoal({ income, balance }: SavingsGoalProps) {
  const rate = income > 0 ? (balance / income) * 100 : 0
  const displayRate = Math.max(0, Math.round(rate))
  const progress = Math.max(0, Math.min(rate / MAX_GOAL, 1))
  const status = getStatus(rate)

  const minAmount = income * (MIN_GOAL / 100)
  const maxAmount = income * (MAX_GOAL / 100)

  let hint: string | null = null
  if (income <= 0) {
    hint = 'Registra ingresos este mes para calcular tu meta.'
  } else if (balance >= maxAmount) {
    hint = '¡Alcanzaste la meta fabulosa! Guardaste el 30% o más de tus ingresos.'
  } else if (balance >= minAmount) {
    hint = `¡Meta mínima lograda! Te faltan ${formatCurrency(maxAmount - balance)} para ser fabuloso.`
  } else if (balance > 0) {
    hint = `Te faltan ${formatCurrency(minAmount - balance)} para tu meta mínima.`
  } else {
    hint = 'Aún no guardas dinero este mes.'
  }

  const size = 84
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [offset, setOffset] = useState(c)

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setOffset(c - progress * c)
    )
    return () => cancelAnimationFrame(raf)
  }, [progress, c])

  const minMarkAngle = (MIN_GOAL / MAX_GOAL) * 360
  const markerRad = ((minMarkAngle - 90) * Math.PI) / 180
  const markX = size / 2 + r * Math.cos(markerRad)
  const markY = size / 2 + r * Math.sin(markerRad)

  return (
    <div className="savings-goal animate-fade-in">
      <div className="savings-goal__ring">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="savings-goal__track"
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
          />
          <circle
            className="savings-goal__fill"
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ stroke: status.color, transition: 'stroke-dashoffset 800ms cubic-bezier(0.32, 0.72, 0, 1)' }}
          />
          <line
            className="savings-goal__mark"
            x1={markX - 4}
            y1={markY - 4}
            x2={markX + 4}
            y2={markY + 4}
            strokeWidth={1.5}
          />
        </svg>
        <span className="savings-goal__percentage">
          {displayRate}%
        </span>
      </div>

      <div className="savings-goal__info">
        <span className={`savings-goal__status savings-goal__status--${status.tone}`}>
          {status.label}
        </span>

        {income > 0 && (
          <p className="savings-goal__goal-name">
            Destina el {MIN_GOAL}–{MAX_GOAL}% de tus ingresos a tu ahorro mensual.
          </p>
        )}

        {income > 0 && (
          <div className="savings-goal__goals">
            <div className={`savings-goal__goal ${balance >= minAmount ? 'savings-goal__goal--done' : ''}`}>
              <span className="savings-goal__dot savings-goal__dot--min" />
              <span>Meta mínima</span>
              <span className="savings-goal__goal-pct">{MIN_GOAL}%</span>
              <strong>{formatCurrency(minAmount)}</strong>
            </div>
            <div className={`savings-goal__goal ${balance >= maxAmount ? 'savings-goal__goal--done' : ''}`}>
              <span className="savings-goal__dot savings-goal__dot--max" />
              <span>Fabuloso</span>
              <span className="savings-goal__goal-pct">{MAX_GOAL}%</span>
              <strong>{formatCurrency(maxAmount)}</strong>
            </div>
          </div>
        )}

        {hint && (
          <p className={`savings-goal__hint savings-goal__hint--${status.tone}`}>
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}