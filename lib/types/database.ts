export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense'
          color: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          type: 'income' | 'expense'
          color?: string
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense'
          color?: string
          icon?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          description: string
          amount: number
          type: 'income' | 'expense'
          is_fixed: boolean
          start_date: string
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          category_id?: string | null
          description: string
          amount: number
          type: 'income' | 'expense'
          is_fixed?: boolean
          start_date: string
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          description?: string
          amount?: number
          type?: 'income' | 'expense'
          is_fixed?: boolean
          start_date?: string
          end_date?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [key: string]: any
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      [key: string]: any
    }
  }
}

// Helper types
export type Category = Database['public']['Tables']['categories']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']
