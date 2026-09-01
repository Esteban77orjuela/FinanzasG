import type { Transaction } from '@/lib/types/database'

/**
 * Formatea un número como moneda COP
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Obtiene el nombre del mes en español
 */
export function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[month - 1] || ''
}

/**
 * Genera la clave de un mes como string YYYY-MM
 */
export function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

/**
 * Parsea un YYYY-MM string a { year, month }
 */
export function parseMonthKey(key: string): { year: number; month: number } {
  const [year, month] = key.split('-').map(Number)
  return { year, month }
}

/**
 * Obtiene las transacciones activas para un mes específico.
 * Incluye gastos fijos cuyo start_date <= mes actual y end_date es null o >= mes actual.
 * Incluye gastos esporádicos solo si su start_date coincide con el mes.
 */
export function getTransactionsForMonth(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  const monthDate = new Date(year, month - 1, 1)

  return transactions.filter((t) => {
    const startDate = new Date(t.start_date + 'T00:00:00')
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1

    if (t.is_fixed) {
      // El gasto fijo aplica si start <= mes actual
      const startsBeforeOrOnMonth =
        startYear < year || (startYear === year && startMonth <= month)

      if (!startsBeforeOrOnMonth) return false

      // Verifica end_date si existe
      if (t.end_date) {
        const endDate = new Date(t.end_date + 'T00:00:00')
        const endYear = endDate.getFullYear()
        const endMonth = endDate.getMonth() + 1
        const endsAfterOrOnMonth =
          endYear > year || (endYear === year && endMonth >= month)
        return endsAfterOrOnMonth
      }

      return true
    } else {
      // Gasto esporádico: solo aplica en su mes de start_date
      return startYear === year && startMonth === month
    }
  })
}

/**
 * Calcula el resumen financiero de un mes
 */
export function calculateSummary(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    income,
    expense,
    balance: income - expense,
  }
}

/**
 * Navegar al mes anterior
 */
export function previousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) return { year: year - 1, month: 12 }
  return { year, month: month - 1 }
}

/**
 * Navegar al mes siguiente
 */
export function nextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) return { year: year + 1, month: 1 }
  return { year, month: month + 1 }
}
