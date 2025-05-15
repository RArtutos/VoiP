import { create } from 'zustand';
import { Cliente, Ticket, Usuario, LoginCredentials } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  isLoggedIn: boolean;
  currentUser: Usuario | null;
  clientes: Cliente[];
  tickets: Ticket[];
  usuarios: Usuario[];
  
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  buscarCliente: (numeroCliente: string) => Promise<Cliente | null>;
  crearTicket: (clienteId: string, departamento: string, problema: string) => Promise<string>;
  actualizarTicket: (ticketId: string, estado: string, nota?: string) => Promise<void>;
  crearCliente: (cliente: Omit<Cliente, 'id' | 'fechaRegistro'>) => Promise<Cliente>;
  actualizarCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  crearUsuario: (usuario: Omit<Usuario, 'id'> & { password: string }) => Promise<void>;
  actualizarUsuario: (id: string, usuario: Partial<Usuario>) => Promise<void>;
  getTicketsFiltrados: () => Promise<Ticket[]>;
  canCreateTicketForDepartment: (departamento: string) => boolean;
  initializeStore: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  clientes: [],
  tickets: [],
  usuarios: [],
  
  initializeStore: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (userData) {
        const { password, ...userWithoutPassword } = userData;
        set({ isLoggedIn: true, currentUser: userWithoutPassword });
      }
    }
    
    // Load initial data
    const [clientesRes, ticketsRes, usuariosRes] = await Promise.all([
      supabase.from('clientes').select('*'),
      supabase.from('tickets').select('*'),
      supabase.from('usuarios').select('*')
    ]);
    
    set({
      clientes: clientesRes.data || [],
      tickets: ticketsRes.data || [],
      usuarios: usuariosRes.data || []
    });
  },
  
  login: async (credentials) => {
    const { data: userData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombreUsuario', credentials.username)
      .eq('password', credentials.password)
      .single();
      
    if (userData) {
      const { password, ...userWithoutPassword } = userData;
      set({ isLoggedIn: true, currentUser: userWithoutPassword });
      return true;
    }
    return false;
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ isLoggedIn: false, currentUser: null });
  },
  
  buscarCliente: async (numeroCliente) => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('numeroCliente', numeroCliente)
      .single();
      
    return data;
  },
  
  crearTicket: async (clienteId, departamento, problema) => {
    const { currentUser, canCreateTicketForDepartment } = get();
    
    if (!currentUser || !canCreateTicketForDepartment(departamento)) {
      throw new Error('No tienes permisos para crear tickets en este departamento');
    }
    
    const ahora = new Date().toISOString();
    const id = `T${Date.now()}`;
    
    const nuevoTicket = {
      id,
      clienteId,
      estado: 'abierto',
      departamento,
      problema,
      notas: [],
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
      asignadoA: currentUser.id
    };
    
    const { error } = await supabase
      .from('tickets')
      .insert(nuevoTicket);
      
    if (error) throw error;
    
    set(state => ({
      tickets: [...state.tickets, nuevoTicket]
    }));
    
    return id;
  },
  
  actualizarTicket: async (ticketId, estado, nota) => {
    const ticket = get().tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket no encontrado');
    
    const actualizacion: any = {
      estado,
      fechaActualizacion: new Date().toISOString()
    };
    
    if (nota) {
      actualizacion.notas = [...ticket.notas, nota];
    }
    
    const { error } = await supabase
      .from('tickets')
      .update(actualizacion)
      .eq('id', ticketId);
      
    if (error) throw error;
    
    set(state => ({
      tickets: state.tickets.map(t => 
        t.id === ticketId ? { ...t, ...actualizacion } : t
      )
    }));
  },

  crearCliente: async (clienteData) => {
    const id = `C${Date.now()}`;
    const nuevoCliente = {
      ...clienteData,
      id,
      fechaRegistro: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('clientes')
      .insert(nuevoCliente);
      
    if (error) throw error;

    set(state => ({
      clientes: [...state.clientes, nuevoCliente]
    }));

    return nuevoCliente;
  },

  actualizarCliente: async (id, datosActualizados) => {
    const { error } = await supabase
      .from('clientes')
      .update(datosActualizados)
      .eq('id', id);
      
    if (error) throw error;

    set(state => ({
      clientes: state.clientes.map(cliente => 
        cliente.id === id ? { ...cliente, ...datosActualizados } : cliente
      )
    }));
  },

  crearUsuario: async (usuarioData) => {
    const { currentUser } = get();
    
    if (!currentUser || currentUser.rol !== 'admin') {
      throw new Error('Solo los administradores pueden crear nuevos usuarios');
    }

    const id = `U${Date.now()}`;
    const nuevoUsuario = {
      ...usuarioData,
      id
    };

    const { error } = await supabase
      .from('usuarios')
      .insert(nuevoUsuario);
      
    if (error) throw error;

    set(state => ({
      usuarios: [...state.usuarios, nuevoUsuario]
    }));
  },

  actualizarUsuario: async (id, datosActualizados) => {
    const { currentUser } = get();
    
    if (!currentUser || currentUser.rol !== 'admin') {
      throw new Error('Solo los administradores pueden actualizar usuarios');
    }

    const { error } = await supabase
      .from('usuarios')
      .update(datosActualizados)
      .eq('id', id);
      
    if (error) throw error;

    set(state => ({
      usuarios: state.usuarios.map(usuario => 
        usuario.id === id ? { ...usuario, ...datosActualizados } : usuario
      )
    }));
  },

  getTicketsFiltrados: async () => {
    const { currentUser } = get();
    
    if (!currentUser) return [];
    
    let query = supabase.from('tickets').select('*');
    
    if (currentUser.rol !== 'admin') {
      query = query.or(`departamento.eq.${currentUser.departamento},asignadoA.eq.${currentUser.id}`);
    }
    
    const { data } = await query;
    return data || [];
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