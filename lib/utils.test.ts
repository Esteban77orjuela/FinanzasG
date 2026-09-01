import { describe, expect, it } from 'vitest'
import type { Transaction } from '@/lib/types/database'
import {
  calculateSummary,
  formatCurrency,
  getMonthKey,
  getMonthName,
  getTransactionsForMonth,
  nextMonth,
  parseMonthKey,
  previousMonth,
} from '@/lib/utils'

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: `tx-${Math.random().toString(36).slice(2, 8)}`,
    user_id: 'user-1',
    category_id: null,
    description: 'Movimiento de prueba',
    amount: 100000,
    type: 'expense',
    is_fixed: false,
    start_date: '2026-01-15',
    end_date: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('getTransactionsForMonth — transacciones fijas', () => {
  it('incluye un gasto fijo en el mes en que comienza', () => {
    const tx = makeTransaction({ is_fixed: true, start_date: '2026-07-05' })
    const result = getTransactionsForMonth([tx], 2026, 7)
    expect(result).toHaveLength(1)
  })

  it('incluye un gasto fijo en meses posteriores a su inicio', () => {
    const tx = makeTransaction({ is_fixed: true, start_date: '2026-03-01' })
    const result = getTransactionsForMonth([tx], 2026, 12)
    expect(result).toHaveLength(1)
  })

  it('excluye un gasto fijo en meses anteriores a su inicio', () => {
    const tx = makeTransaction({ is_fixed: true, start_date: '2026-08-01' })
    const result = getTransactionsForMonth([tx], 2026, 6)
    expect(result).toHaveLength(0)
  })

  it('excluye un gasto fijo cruzando años hacia el pasado', () => {
    const tx = makeTransaction({ is_fixed: true, start_date: '2026-02-01' })
    const result = getTransactionsForMonth([tx], 2025, 12)
    expect(result).toHaveLength(0)
  })

  it('excluye un gasto fijo cuando end_date es anterior al mes consultado', () => {
    const tx = makeTransaction({
      is_fixed: true,
      start_date: '2026-01-01',
      end_date: '2026-06-30',
    })
    const result = getTransactionsForMonth([tx], 2026, 9)
    expect(result).toHaveLength(0)
  })

  it('incluye un gasto fijo cuando end_date cae en el mismo mes consultado', () => {
    const tx = makeTransaction({
      is_fixed: true,
      start_date: '2026-01-01',
      end_date: '2026-09-30',
    })
    const result = getTransactionsForMonth([tx], 2026, 9)
    expect(result).toHaveLength(1)
  })

  it('no incluye un gasto fijo anterior a su inicio en el mismo anio', () => {
    const tx = makeTransaction({ is_fixed: true, start_date: '2026-05-15' })
    const result = getTransactionsForMonth([tx], 2026, 4)
    expect(result).toHaveLength(0)
  })
})

describe('getTransactionsForMonth — transacciones esporádicas', () => {
  it('incluye un gasto esporádico solo en su mes de inicio', () => {
    const tx = makeTransaction({ start_date: '2026-04-10' })
    const marzos = getTransactionsForMonth([tx], 2026, 3)
    const abriles = getTransactionsForMonth([tx], 2026, 4)
    const mayos = getTransactionsForMonth([tx], 2026, 5)
    expect(marzos).toHaveLength(0)
    expect(abriles).toHaveLength(1)
    expect(mayos).toHaveLength(0)
  })

  it('excluye un gasto esporádico en el mismo anio siguiente', () => {
    const tx = makeTransaction({ start_date: '2026-04-10' })
    const result = getTransactionsForMonth([tx], 2027, 4)
    expect(result).toHaveLength(0)
  })
})

describe('getTransactionsForMonth — casos combinados', () => {
  it('mezcla fijos y esporadicos cuando ambos aplican', () => {
    const fijo = makeTransaction({ is_fixed: true, start_date: '2026-01-01' })
    const esporadico = makeTransaction({ start_date: '2026-05-20' })
    const noAplica = makeTransaction({ start_date: '2026-08-10' })

    const result = getTransactionsForMonth([fijo, esporadico, noAplica], 2026, 5)
    expect(result).toHaveLength(2)
    expect(result.map((t) => t.id)).toContain(fijo.id)
    expect(result.map((t) => t.id)).toContain(esporadico.id)
  })

  it('devuelve lista vacía cuando el mes consultado no tiene transacciones', () => {
    const esporadico = makeTransaction({ start_date: '2026-02-10' })
    const result = getTransactionsForMonth([esporadico], 2026, 11)
    expect(result).toHaveLength(0)
  })
})

describe('calculateSummary — resumen financiero', () => {
  it('calcula ingresos, gastos y balance con valores mixtos', () => {
    const transactions = [
      makeTransaction({ type: 'income', amount: 2000000 }),
      makeTransaction({ type: 'expense', amount: 500000 }),
      makeTransaction({ type: 'expense', amount: 250000 }),
    ]
    const summary = calculateSummary(transactions)
    expect(summary.income).toBe(2000000)
    expect(summary.expense).toBe(750000)
    expect(summary.balance).toBe(1250000)
  })

  it('supone balance positivo de solo ingresos', () => {
    const transactions = [makeTransaction({ type: 'income', amount: 1000000 })]
    const summary = calculateSummary(transactions)
    expect(summary.balance).toBe(1000000)
  })

  it('con listado vacío devuelve todo en cero', () => {
    const summary = calculateSummary([])
    expect(summary).toEqual({ income: 0, expense: 0, balance: 0 })
  })

  it('es consistente: balance siempre es ingresos menos gastos', () => {
    const summary = calculateSummary([
      makeTransaction({ type: 'income', amount: 325000 }),
      makeTransaction({ type: 'expense', amount: 99999 }),
    ])
    expect(summary.balance).toBe(summary.income - summary.expense)
  })
})

describe('formatCurrency — formato de moneda COP', () => {
  it('formatea miles con separador de miles y símbolo', () => {
    const formatted = formatCurrency(1500000)
    expect(formatted).toContain('$')
    expect(formatted).toContain('1.500.000')
  })

  it('sin decimales (mínimo 0 máximo 0)', () => {
    expect(formatCurrency(1500000)).not.toContain(',00')
  })
})

describe('Utilidades de mes', () => {
  it('getMonthName devuelve el nombre en español', () => {
    expect(getMonthName(1)).toBe('Enero')
    expect(getMonthName(12)).toBe('Diciembre')
  })

  it('getMonthKey genera clave YYYY-MM con cero a la izquierda', () => {
    expect(getMonthKey(2026, 9)).toBe('2026-09')
    expect(getMonthKey(2026, 12)).toBe('2026-12')
  })

  it('parseMonthKey interpreta una clave YYYY-MM', () => {
    expect(parseMonthKey('2026-09')).toEqual({ year: 2026, month: 9 })
  })

  it('previousMonth cruza correctamente el límite de año', () => {
    expect(previousMonth(2026, 1)).toEqual({ year: 2025, month: 12 })
    expect(previousMonth(2026, 5)).toEqual({ year: 2026, month: 4 })
  })

  it('nextMonth cruza correctamente el límite de año', () => {
    expect(nextMonth(2026, 12)).toEqual({ year: 2027, month: 1 })
    expect(nextMonth(2026, 5)).toEqual({ year: 2026, month: 6 })
  })
})