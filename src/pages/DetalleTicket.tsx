import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  User,
  Clock,
  CheckCircle,
  Send,
  Calendar,
  Printer
} from 'lucide-react';

const DetalleTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tickets, clientes, actualizarTicket } = useStore();
  
  const [nuevaNota, setNuevaNota] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    if (!nuevoEstado || !ticket) {
      setError('Por favor seleccione un estado');
      return;
    }
    
    try {
      actualizarTicket(ticket.id, nuevoEstado);
      setSuccess('Estado actualizado correctamente');
      setError('');
      setNuevoEstado('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
      setSuccess('');
    }
  };
  
  // Manejar el envío de notas
  const manejarEnvioNota = () => {
    if (!nuevaNota || !ticket) {
      setError('Por favor ingrese una nota');
      return;
    }
    
    try {
      actualizarTicket(ticket.id, ticket.estado, nuevaNota);
      setSuccess('Nota agregada correctamente');
      setError('');
      setNuevaNota('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar la nota');
      setSuccess('');
    }
  };

  // Manejar agendar seguimiento
  const manejarAgendarSeguimiento = () => {
    setSuccess('Seguimiento agendado correctamente');
  };

  // Manejar imprimir ticket
  const manejarImprimirTicket = () => {
    window.print();
  };
  
  // Obtener etiqueta de estado con color
  const obtenerEtiquetaEstado = (estado: string) => {
    let color = '';
    switch (estado) {
      case 'abierto':
        color = 'bg-red-900 text-red-200';
        break;
      case 'en-proceso':
        color = 'bg-yellow-900 text-yellow-200';
        break;
      case 'resuelto':
        color = 'bg-green-900 text-green-200';
        break;
      case 'cerrado':
        color = 'bg-gray-700 text-gray-200';
        break;
      default:
        color = 'bg-blue-900 text-blue-200';
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
        color = 'bg-blue-900 text-blue-200';
        nombre = 'Soporte Técnico';
        break;
      case 'ventas':
        color = 'bg-green-900 text-green-200';
        nombre = 'Ventas';
        break;
      case 'informacion':
        color = 'bg-purple-900 text-purple-200';
        nombre = 'Información';
        break;
      case 'general':
        color = 'bg-gray-700 text-gray-200';
        nombre = 'General';
        break;
      default:
        color = 'bg-blue-900 text-blue-200';
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
        <h2 className="text-2xl font-bold mb-4 text-white">Ticket no encontrado</h2>
        <p className="mb-6 text-gray-300">El ticket que buscas no existe o ha sido eliminado.</p>
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
          className="mr-4 text-blue-400 hover:text-blue-300 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Volver</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">Detalle del Ticket</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-700 pb-4 mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {obtenerEtiquetaEstado(ticket.estado)}
                {obtenerEtiquetaDepartamento(ticket.departamento)}
              </div>
              <h2 className="text-xl font-semibold mb-1 text-white">Ticket #{ticket.id}</h2>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>Creado el {formatearFecha(ticket.fechaCreacion)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-white">Problema</h3>
              <p className="text-gray-300 bg-gray-700 p-3 rounded">{ticket.problema}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-white">Historial de Notas</h3>
              
              {ticket.notas.length > 0 ? (
                <ul className="space-y-4">
                  {ticket.notas.map((nota, index) => (
                    <li key={index} className="bg-gray-700 p-4 rounded">
                      <p className="text-gray-300">{nota}</p>
                      <div className="flex items-center mt-2 text-gray-400 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Nota {index + 1}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-center py-4">
                  No hay notas registradas para este ticket.
                </p>
              )}
              
              <div className="mt-6">
                <div className="flex">
                  <input
                    type="text"
                    value={nuevaNota}
                    onChange={(e) => setNuevaNota(e.target.value)}
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Agregar una nota..."
                  />
                  <button
                    onClick={manejarEnvioNota}
                    disabled={!nuevaNota}
                    className="px-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
                {success && <p className="mt-2 text-green-400 text-sm">{success}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium mb-4 text-white">Información del Cliente</h3>
            
            {cliente ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-gray-700 mr-3">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{cliente.nombre}</p>
                    <p className="text-sm text-gray-400">{cliente.numeroCliente}</p>
                  </div>
                </div>
                
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <span className="text-gray-400">Teléfono:</span> {cliente.telefono}
                  </li>
                  <li>
                    <span className="text-gray-400">Email:</span> {cliente.email}
                  </li>
                  <li>
                    <span className="text-gray-400">Plan:</span> {cliente.planActual}
                  </li>
                </ul>
                
                <div className="mt-4">
                  <Link to={`/clientes/${cliente.id}`} className="text-blue-400 hover:text-blue-300">
                    Ver perfil completo
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No se encontró información del cliente.
              </p>
            )}
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 text-white">Acciones</h3>
            
            <div className="mb-4">
              <label htmlFor="cambioEstado" className="block mb-2 text-gray-300">
                Cambiar Estado
              </label>
              <div className="flex">
                <select
                  id="cambioEstado"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-3 bg-green-600 text-white rounded-r hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={manejarAgendarSeguimiento}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Seguimiento
              </button>
              
              <button 
                onClick={manejarImprimirTicket}
                className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700 flex items-center justify-center"
              >
                <Printer className="w-4 h-4 mr-2" />
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