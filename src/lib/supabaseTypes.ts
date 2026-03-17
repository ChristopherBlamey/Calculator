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
      ingredientes: {
        Row: {
          id: string
          name: string
          unit: string
          cost_per_unit: number
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          unit: string
          cost_per_unit?: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          unit?: string
          cost_per_unit?: number
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      productos: {
        Row: {
          id: string
          name: string
          type: string
          variant: string
          price: number
          ingredients: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string
          variant?: string
          price?: number
          ingredients?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          variant?: string
          price?: number
          ingredients?: Json
          created_at?: string
          updated_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          name: string
          event_date: string
          location: string
          sold_items: Json
          fuel_cost: number
          total_income: number
          total_cost: number
          net_profit: number
          payment_status?: "pending" | "paid"
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          event_date: string
          location?: string
          sold_items?: Json
          fuel_cost?: number
          total_income?: number
          total_cost?: number
          net_profit?: number
          payment_status?: "pending" | "paid"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          event_date?: string
          location?: string
          sold_items?: Json
          fuel_cost?: number
          total_income?: number
          total_cost?: number
          net_profit?: number
          payment_status?: "pending" | "paid"
          created_at?: string
        }
      }
    }
  }
}
