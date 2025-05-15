import { create } from 'zustand';
import { Cliente, Ticket, Usuario, LoginCredentials } from '../types';
import { db } from '../lib/db';

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
  crearUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  actualizarUsuario: (id: string, usuario: Partial<Usuario>) => void;
  getTicketsFiltrados: () => Ticket[];
  canCreateTicketForDepartment: (departamento: string) => boolean;
  initializeStore: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  clientes: [],
  tickets: [],
  usuarios: [],
  
  initializeStore: () => {
    set({
      clientes: db.clientes.getAll(),
      tickets: db.tickets.getAll(),
      usuarios: db.usuarios.getAll()
    });
  },
  
  login: (credentials) => {
    const user = db.usuarios.getByUsername(credentials.username);
    if (user) {
      set({ isLoggedIn: true, currentUser: user });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ isLoggedIn: false, currentUser: null });
  },
  
  buscarCliente: (numeroCliente) => {
    return db.clientes.getAll().find(c => c.numeroCliente === numeroCliente) || null;
  },
  
  crearTicket: (clienteId, departamento, problema) => {
    const { currentUser } = get();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }
    
    const id = `T${Date.now()}`;
    const nuevoTicket: Ticket = {
      id,
      clienteId,
      estado: 'abierto',
      departamento: departamento as any,
      problema,
      notas: [],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      asignadoA: currentUser.id
    };
    
    db.tickets.create(nuevoTicket);
    set(state => ({ tickets: [...state.tickets, nuevoTicket] }));
    
    return id;
  },
  
  actualizarTicket: (ticketId, estado, nota) => {
    const ticket = db.tickets.getById(ticketId);
    if (!ticket) throw new Error('Ticket no encontrado');
    
    const actualizacion: Partial<Ticket> = {
      estado: estado as any,
      fechaActualizacion: new Date().toISOString()
    };
    
    if (nota) {
      actualizacion.notas = [...ticket.notas, nota];
    }
    
    db.tickets.update(ticketId, actualizacion);
    set(state => ({
      tickets: state.tickets.map(t => 
        t.id === ticketId ? { ...t, ...actualizacion } : t
      )
    }));
  },

  crearCliente: (clienteData) => {
    const id = `C${Date.now()}`;
    const nuevoCliente: Cliente = {
      ...clienteData,
      id,
      fechaRegistro: new Date().toISOString()
    };

    db.clientes.create(nuevoCliente);
    set(state => ({
      clientes: [...state.clientes, nuevoCliente]
    }));

    return nuevoCliente;
  },

  actualizarCliente: (id, datosActualizados) => {
    db.clientes.update(id, datosActualizados);
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

    db.usuarios.create(nuevoUsuario);
    set(state => ({
      usuarios: [...state.usuarios, nuevoUsuario]
    }));
  },

  actualizarUsuario: (id, datosActualizados) => {
    const { currentUser } = get();
    
    if (!currentUser || currentUser.rol !== 'admin') {
      throw new Error('Solo los administradores pueden actualizar usuarios');
    }

    db.usuarios.update(id, datosActualizados);
    set(state => ({
      usuarios: state.usuarios.map(usuario => 
        usuario.id === id ? { ...usuario, ...datosActualizados } : usuario
      )
    }));
  },

  getTicketsFiltrados: () => {
    const { currentUser } = get();
    const tickets = db.tickets.getAll();
    
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
    if (currentUser.rol === 'admin') return true;
    return currentUser.departamento === departamento;
  }
}));

// Initialize store on app load
useStore.getState().initializeStore();