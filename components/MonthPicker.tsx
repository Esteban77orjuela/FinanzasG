'use client'

import { getMonthName, previousMonth, nextMonth } from '@/lib/utils'

interface MonthPickerProps {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}

export default function MonthPicker({ year, month, onChange }: MonthPickerProps) {
  function handlePrev() {
    const { year: y, month: m } = previousMonth(year, month)
    onChange(y, m)
  }

  function handleNext() {
    const now = new Date()
    // No navegar más allá del mes actual
    if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)) {
      return
    }
    const { year: y, month: m } = nextMonth(year, month)
    onChange(y, m)
  }

  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <div className="month-selector">
      <button
        className="month-selector__btn"
        onClick={handlePrev}
        aria-label="Mes anterior"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <span className="month-selector__label">
        {getMonthName(month)} {year}
      </span>

      <button
        className="month-selector__btn"
        onClick={handleNext}
        disabled={isCurrentMonth}
        aria-label="Mes siguiente"
        style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  )
}
