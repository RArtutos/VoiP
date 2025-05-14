import { Cliente, Ticket, Usuario, SesionLlamada } from '../types';

export const clientesMock: Cliente[] = [
  {
    id: '1001',
    nombre: 'Juan Pérez',
    telefono: '555-123-4567',
    email: 'juan.perez@ejemplo.com',
    direccion: 'Calle Principal 123, CDMX, 04000',
    numeroCliente: 'C1001',
    fechaRegistro: '2024-01-15',
    planActual: 'Fibra 100MB',
    estado: 'activo'
  },
  {
    id: '1002',
    nombre: 'María González',
    telefono: '555-987-6543',
    email: 'maria.gonzalez@ejemplo.com',
    direccion: 'Av. Reforma 456, CDMX, 04100',
    numeroCliente: 'C1002',
    fechaRegistro: '2024-02-20',
    planActual: 'Fibra 300MB',
    estado: 'activo'
  },
  {
    id: '1003',
    nombre: 'Roberto Sánchez',
    telefono: '555-567-8901',
    email: 'roberto.sanchez@ejemplo.com',
    direccion: 'Calle Norte 789, Guadalajara, 44100',
    numeroCliente: 'C1003',
    fechaRegistro: '2024-03-10',
    planActual: 'Fibra 500MB',
    estado: 'suspendido'
  }
];

export const ticketsMock: Ticket[] = [
  {
    id: 'T1001',
    clienteId: '1001',
    estado: 'abierto',
    departamento: 'tecnico',
    problema: 'Conexión a internet intermitente',
    notas: ['Cliente reporta que la conexión se cae cada 30 minutos', 'Se sugirió reiniciar el router'],
    fechaCreacion: '2025-06-10T14:30:00Z',
    fechaActualizacion: '2025-06-10T14:45:00Z',
    asignadoA: 'agente1'
  },
  {
    id: 'T1002',
    clienteId: '1002',
    estado: 'en-proceso',
    departamento: 'ventas',
    problema: 'Interesado en actualizar plan de internet',
    notas: ['Cliente busca mayor velocidad para oficina en casa', 'Se discutieron opciones de fibra premium'],
    fechaCreacion: '2025-06-09T10:15:00Z',
    fechaActualizacion: '2025-06-10T11:20:00Z',
    asignadoA: 'agente2'
  },
  {
    id: 'T1003',
    clienteId: '1003',
    estado: 'resuelto',
    departamento: 'informacion',
    problema: 'Consulta sobre cargos recientes',
    notas: ['Se explicó que terminó su promoción', 'Se ofreció nuevo descuento de retención de clientes'],
    fechaCreacion: '2025-06-08T09:00:00Z',
    fechaActualizacion: '2025-06-08T09:30:00Z',
    asignadoA: 'agente1'
  }
];

export const usuariosMock: Usuario[] = [
  {
    id: 'agente1',
    nombreUsuario: 'soporte_tec1',
    nombre: 'Alejandro Jiménez',
    rol: 'agente',
    departamento: 'tecnico'
  },
  {
    id: 'agente2',
    nombreUsuario: 'ventas1',
    nombre: 'Sofía Martínez',
    rol: 'agente',
    departamento: 'ventas'
  },
  {
    id: 'admin1',
    nombreUsuario: 'admin_sys',
    nombre: 'Daniel López',
    rol: 'admin',
    departamento: 'general'
  }
];

export const sesionesLlamadaMock: SesionLlamada[] = [
  {
    id: 'SL1001',
    clienteId: '1001',
    estado: 'activa',
    horaInicio: '2025-06-10T15:30:00Z',
    notas: ['Cliente llamó por problemas de conexión', 'Se creó ticket T1001'],
    ticketId: 'T1001',
    agente: 'agente1',
    flujo: ['inicio', 'verificacion', 'menu', 'soporte-tecnico']
  },
  {
    id: 'SL1002',
    clienteId: '1002',
    estado: 'finalizada',
    horaInicio: '2025-06-09T10:00:00Z',
    horaFin: '2025-06-09T10:25:00Z',
    notas: ['Cliente interesado en mejorar su plan', 'Se programó seguimiento para mañana'],
    ticketId: 'T1002',
    agente: 'agente2',
    flujo: ['inicio', 'verificacion', 'menu', 'ventas']
  }
];