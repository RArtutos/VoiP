import { create } from 'zustand';
import { Cliente, Ticket, Usuario, LoginCredentials } from '../types';
import db from '../data/db.json';

interface AppState {
  isLoggedIn: boolean;
  currentUser: Usuario | null;
  clientes: Cliente[];
  tickets: Ticket[];
  usuarios: Usuario[];
  
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  buscarCliente: (numeroCliente: string) => Cliente | null;
  crearTicket: (clienteId: string, departamento: string, problema: string) => string;
  actualizarTicket: (ticketId: string, estado: string, nota?: string) => void;
  crearCliente: (cliente: Omit<Cliente, 'id' | 'fechaRegistro'>) => Cliente;
  actualizarCliente: (id: string, cliente: Partial<Cliente>) => void;
  crearUsuario: (usuario: Omit<Usuario, 'id' | 'password'> & { password: string }) => Usuario;
  getTicketsFiltrados: () => Ticket[];
  canCreateTicketForDepartment: (departamento: string) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  clientes: db.clientes,
  tickets: db.tickets,
  usuarios: db.usuarios,
  
  login: (credentials) => {
    const usuario = db.usuarios.find(u => 
      u.nombreUsuario === credentials.username && 
      u.password === credentials.password
    );
    
    if (usuario) {
      const { password, ...userWithoutPassword } = usuario;
      set({ isLoggedIn: true, currentUser: userWithoutPassword });
      return true;
    }
    return false;
  },
  
  logout: () => set({ isLoggedIn: false, currentUser: null }),
  
  buscarCliente: (numeroCliente) => {
    const clienteEncontrado = get().clientes.find(c => c.numeroCliente === numeroCliente);
    return clienteEncontrado || null;
  },
  
  crearTicket: (clienteId, departamento, problema) => {
    const { currentUser, canCreateTicketForDepartment } = get();
    
    if (!currentUser || !canCreateTicketForDepartment(departamento)) {
      throw new Error('No tienes permisos para crear tickets en este departamento');
    }
    
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
      asignadoA: currentUser?.id
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
  },

  crearCliente: (clienteData) => {
    const id = `C${Date.now()}`;
    const nuevoCliente: Cliente = {
      ...clienteData,
      id,
      fechaRegistro: new Date().toISOString(),
    };

    set(state => ({
      clientes: [...state.clientes, nuevoCliente]
    }));

    return nuevoCliente;
  },

  actualizarCliente: (id, datosActualizados) => {
    set(state => ({
      clientes: state.clientes.map(cliente => 
        cliente.id === id ? { ...cliente, ...datosActualizados } : cliente
      )
    }));
  },

  crearUsuario: (usuarioData) => {
    const { currentUser } = get();
    
    if (!currentUser || currentUser.rol !== 'admin') {
      throw new Error('Solo los administradores pueden crear nuevos usuarios');
    }

    const id = `U${Date.now()}`;
    const nuevoUsuario: Usuario = {
      ...usuarioData,
      id
    };

    set(state => ({
      usuarios: [...state.usuarios, nuevoUsuario]
    }));

    return nuevoUsuario;
  },

  getTicketsFiltrados: () => {
    const { tickets, currentUser } = get();
    
    if (!currentUser) return [];
    
    if (currentUser.rol === 'admin') {
      return tickets;
    }
    
    return tickets.filter(ticket => 
      ticket.departamento === currentUser.departamento ||
      ticket.asignadoA === currentUser.id
    );
  },

  canCreateTicketForDepartment: (departamento) => {
    const { currentUser } = get();
    if (!currentUser) return false;
    return currentUser.rol === 'admin' || currentUser.departamento === departamento;
  }
}));