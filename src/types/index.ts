export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  numeroCliente: string;
  fechaRegistro: string;
  planActual: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
}

export interface Ticket {
  id: string;
  clienteId: string;
  estado: 'abierto' | 'en-proceso' | 'resuelto' | 'cerrado';
  departamento: 'tecnico' | 'ventas' | 'informacion' | 'general';
  problema: string;
  notas: string[];
  fechaCreacion: string;
  fechaActualizacion: string;
  asignadoA?: string;
}

export interface Usuario {
  id: string;
  nombreUsuario: string;
  nombre: string;
  rol: 'admin' | 'agente';
  departamento: 'tecnico' | 'ventas' | 'informacion' | 'general';
}