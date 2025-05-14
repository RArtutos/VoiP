import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  User,
  Clock,
  CheckCircle,
  Send
} from 'lucide-react';

const DetalleTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tickets, clientes, actualizarTicket } = useStore();
  
  const [nuevaNota, setNuevaNota] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  
  // Encontrar el ticket por ID
  const ticket = tickets.find(t => t.id === id);
  
  // Encontrar el cliente asociado
  const cliente = ticket 
    ? clientes.find(c => c.id === ticket.clienteId) 
    : null;
  
  // Formatear fecha
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Manejar el cambio de estado
  const manejarCambioEstado = () => {
    if (!nuevoEstado || !ticket) return;
    
    actualizarTicket(ticket.id, nuevoEstado);
    setNuevoEstado('');
  };
  
  // Manejar el envío de notas
  const manejarEnvioNota = () => {
    if (!nuevaNota || !ticket) return;
    
    actualizarTicket(ticket.id, ticket.estado, nuevaNota);
    setNuevaNota('');
  };
  
  // Obtener etiqueta de estado con color
  const obtenerEtiquetaEstado = (estado: string) => {
    let color = '';
    switch (estado) {
      case 'abierto':
        color = 'bg-red-100 text-red-800';
        break;
      case 'en-proceso':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'resuelto':
        color = 'bg-green-100 text-green-800';
        break;
      case 'cerrado':
        color = 'bg-gray-100 text-gray-800';
        break;
      default:
        color = 'bg-blue-100 text-blue-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {estado}
      </span>
    );
  };
  
  // Obtener etiqueta de departamento con color
  const obtenerEtiquetaDepartamento = (departamento: string) => {
    let color = '';
    let nombre = '';
    
    switch (departamento) {
      case 'tecnico':
        color = 'bg-blue-100 text-blue-800';
        nombre = 'Soporte Técnico';
        break;
      case 'ventas':
        color = 'bg-green-100 text-green-800';
        nombre = 'Ventas';
        break;
      case 'informacion':
        color = 'bg-purple-100 text-purple-800';
        nombre = 'Información';
        break;
      case 'general':
        color = 'bg-gray-100 text-gray-800';
        nombre = 'General';
        break;
      default:
        color = 'bg-blue-100 text-blue-800';
        nombre = departamento;
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {nombre}
      </span>
    );
  };
  
  // Si no se encuentra el ticket
  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ticket no encontrado</h2>
        <p className="mb-6">El ticket que buscas no existe o ha sido eliminado.</p>
        <Link 
          to="/tickets" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link 
          to="/tickets" 
          className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Volver</span>
        </Link>
        <h1 className="text-2xl font-bold">Detalle del Ticket</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="border-b pb-4 mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {obtenerEtiquetaEstado(ticket.estado)}
                {obtenerEtiquetaDepartamento(ticket.departamento)}
              </div>
              <h2 className="text-xl font-semibold mb-1">Ticket #{ticket.id}</h2>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>Creado el {formatearFecha(ticket.fechaCreacion)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Problema</h3>
              <p className="text-gray-800 bg-gray-50 p-3 rounded">{ticket.problema}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Historial de Notas</h3>
              
              {ticket.notas.length > 0 ? (
                <ul className="space-y-4">
                  {ticket.notas.map((nota, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-800">{nota}</p>
                      <div className="flex items-center mt-2 text-gray-500 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Nota {index + 1}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  No hay notas registradas para este ticket.
                </p>
              )}
              
              <div className="mt-6">
                <div className="flex">
                  <input
                    type="text"
                    value={nuevaNota}
                    onChange={(e) => setNuevaNota(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Agregar una nota..."
                  />
                  <button
                    onClick={manejarEnvioNota}
                    disabled={!nuevaNota}
                    className="px-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-4">Información del Cliente</h3>
            
            {cliente ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <User className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">{cliente.nombre}</p>
                    <p className="text-sm text-gray-500">{cliente.numeroCliente}</p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <span className="text-gray-500">Teléfono:</span> {cliente.telefono}
                  </li>
                  <li>
                    <span className="text-gray-500">Email:</span> {cliente.email}
                  </li>
                  <li>
                    <span className="text-gray-500">Plan:</span> {cliente.planActual}
                  </li>
                </ul>
                
                <div className="mt-4">
                  <Link to={`/clientes/${cliente.id}`} className="text-blue-600 hover:text-blue-800">
                    Ver perfil completo
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No se encontró información del cliente.
              </p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4">Acciones</h3>
            
            <div className="mb-4">
              <label htmlFor="cambioEstado" className="block mb-2 text-gray-700">
                Cambiar Estado
              </label>
              <div className="flex">
                <select
                  id="cambioEstado"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar estado...</option>
                  <option value="abierto">Abierto</option>
                  <option value="en-proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
                <button
                  onClick={manejarCambioEstado}
                  disabled={!nuevoEstado}
                  className="px-3 bg-green-600 text-white rounded-r hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                Agendar Seguimiento
              </button>
              
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 flex items-center justify-center">
                Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleTicket;