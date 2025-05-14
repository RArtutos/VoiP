import { create } from 'zustand';
import { Cliente, Ticket, Usuario } from '../types';
import { clientesMock, ticketsMock } from '../data/mockData';

interface AppState {
  // Estado de autenticación
  isLoggedIn: boolean;
  currentUser: string | null;
  
  // Datos
  clientes: Cliente[];
  tickets: Ticket[];
  
  // Acciones
  login: (username: string) => void;
  logout: () => void;
  buscarCliente: (numeroCliente: string) => Cliente | null;
  crearTicket: (clienteId: string, departamento: string, problema: string) => string;
  actualizarTicket: (ticketId: string, estado: string, nota?: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  isLoggedIn: false,
  currentUser: null,
  clientes: clientesMock,
  tickets: ticketsMock,
  
  // Acciones
  login: (username) => set({ isLoggedIn: true, currentUser: username }),
  
  logout: () => set({ isLoggedIn: false, currentUser: null }),
  
  buscarCliente: (numeroCliente) => {
    const clienteEncontrado = get().clientes.find(c => c.numeroCliente === numeroCliente);
    return clienteEncontrado || null;
  },
  
  crearTicket: (clienteId, departamento, problema) => {
    const { currentUser } = get();
    
    const ahora = new Date().toISOString();
    const id = `T${Date.now()}`;
    
    const nuevoTicket: Ticket = {
      id,
      clienteId,
      estado: 'abierto',
      departamento: departamento as any,
      problema,
      notas: [],
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
      asignadoA: currentUser || undefined
    };
    
    set(state => ({
      tickets: [...state.tickets, nuevoTicket]
    }));
    
    return id;
  },
  
  actualizarTicket: (ticketId, estado, nota) => {
    set(state => ({
      tickets: state.tickets.map(t => {
        if (t.id === ticketId) {
          const ticketActualizado = { 
            ...t, 
            estado: estado as any,
            fechaActualizacion: new Date().toISOString()
          };
          
          if (nota) {
            ticketActualizado.notas = [...t.notas, nota];
          }
          
          return ticketActualizado;
        }
        return t;
      })
    }));
  }
}));