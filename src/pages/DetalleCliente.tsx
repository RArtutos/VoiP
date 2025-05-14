import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  Clock, 
  Ticket,
  Plus
} from 'lucide-react';

const DetalleCliente: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clientes, tickets } = useStore();
  
  const cliente = clientes.find(c => c.id === id);
  const ticketsCliente = tickets.filter(t => t.clienteId === id);
  
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
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
  
  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Cliente no encontrado</h2>
        <p className="mb-6">El cliente que buscas no existe o ha sido eliminado.</p>
        <Link 
          to="/clientes" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Clientes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link 
          to="/clientes" 
          className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Volver</span>
        </Link>
        <h1 className="text-2xl font-bold">Detalle del Cliente</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">{cliente.nombre}</h2>
              <p className="text-gray-500">Cliente desde {formatearFecha(cliente.fechaRegistro)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Información de Contacto</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Correo Electrónico</span>
                      <span className="block text-gray-900">{cliente.email}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Teléfono</span>
                      <span className="block text-gray-900">{cliente.telefono}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Dirección</span>
                      <span className="block text-gray-900">{cliente.direccion}</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Información de Cuenta</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 text-gray-500 mr-2 mt-0.5">#</span>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Número de Cliente</span>
                      <span className="block text-gray-900">{cliente.numeroCliente}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Fecha de Registro</span>
                      <span className="block text-gray-900">{formatearFecha(cliente.fechaRegistro)}</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Package className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Plan Actual</span>
                      <span className="block text-gray-900">{cliente.planActual}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-lg font-medium mb-4">Estado de la Cuenta</h3>
          
          <div className={`p-4 rounded-lg mb-6 ${
            cliente.estado === 'activo' ? 'bg-green-50' : 
            cliente.estado === 'suspendido' ? 'bg-red-50' : 'bg-yellow-50'
          }`}>
            <p className={`font-medium ${
              cliente.estado === 'activo' ? 'text-green-800' : 
              cliente.estado === 'suspendido' ? 'text-red-800' : 'text-yellow-800'
            }`}>
              Estado: {cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1)}
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/tickets/nuevo', { state: { clienteId: cliente.id } })}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Crear Ticket</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tickets Recientes</h2>
            <Link to="/tickets" className="text-blue-600 hover:text-blue-800">
              Ver Todos
            </Link>
          </div>
          
          {ticketsCliente.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Ticket
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Problema
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ticketsCliente.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{ticket.problema}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {obtenerEtiquetaEstado(ticket.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(ticket.fechaCreacion).toLocaleDateString('es-MX')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                          Ver Detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Este cliente no tiene tickets registrados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleCliente;