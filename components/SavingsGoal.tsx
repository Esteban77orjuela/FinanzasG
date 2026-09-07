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
        <p className="savings-goal__context">
          Guardado <strong>{formatCurrency(balance)}</strong>
          {' · '}Ingresos {formatCurrency(income)}
        </p>
        <p className="savings-goal__legend">
          Meta mínima {MIN_GOAL}% · Fabuloso {MAX_GOAL}%
        </p>
      </div>
    </div>
  )
}