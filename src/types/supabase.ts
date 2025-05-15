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
      usuarios: {
        Row: {
          id: string
          nombreUsuario: string
          nombre: string
          rol: 'admin' | 'agente'
          departamento: 'tecnico' | 'ventas' | 'informacion' | 'general'
          password: string
          created_at: string | null
        }
        Insert: {
          id: string
          nombreUsuario: string
          nombre: string
          rol: 'admin' | 'agente'
          departamento: 'tecnico' | 'ventas' | 'informacion' | 'general'
          password: string
          created_at?: string | null
        }
        Update: {
          id?: string
          nombreUsuario?: string
          nombre?: string
          rol?: 'admin' | 'agente'
          departamento?: 'tecnico' | 'ventas' | 'informacion' | 'general'
          password?: string
          created_at?: string | null
        }
      }
      clientes: {
        Row: {
          id: string
          nombre: string
          telefono: string
          email: string
          direccion: string
          numeroCliente: string
          fechaRegistro: string
          planActual: string
          estado: 'activo' | 'inactivo' | 'suspendido'
        }
        Insert: {
          id: string
          nombre: string
          telefono: string
          email: string
          direccion: string
          numeroCliente: string
          fechaRegistro: string
          planActual: string
          estado: 'activo' | 'inactivo' | 'suspendido'
        }
        Update: {
          id?: string
          nombre?: string
          telefono?: string
          email?: string
          direccion?: string
          numeroCliente?: string
          fechaRegistro?: string
          planActual?: string
          estado?: 'activo' | 'inactivo' | 'suspendido'
        }
      }
      tickets: {
        Row: {
          id: string
          clienteId: string
          estado: 'abierto' | 'en-proceso' | 'resuelto' | 'cerrado'
          departamento: 'tecnico' | 'ventas' | 'informacion' | 'general'
          problema: string
          notas: string[]
          fechaCreacion: string
          fechaActualizacion: string
          asignadoA: string | null
        }
        Insert: {
          id: string
          clienteId: string
          estado: 'abierto' | 'en-proceso' | 'resuelto' | 'cerrado'
          departamento: 'tecnico' | 'ventas' | 'informacion' | 'general'
          problema: string
          notas: string[]
          fechaCreacion: string
          fechaActualizacion: string
          asignadoA?: string | null
        }
        Update: {
          id?: string
          clienteId?: string
          estado?: 'abierto' | 'en-proceso' | 'resuelto' | 'cerrado'
          departamento?: 'tecnico' | 'ventas' | 'informacion' | 'general'
          problema?: string
          notas?: string[]
          fechaCreacion?: string
          fechaActualizacion?: string
          asignadoA?: string | null
        }
      }
    }
  }
}