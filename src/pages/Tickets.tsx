import React, { useState } from 'react';
import { Search, Plus, Ticket } from 'lucide-react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';

const Tickets: React.FC = () => {
  const { tickets, clientes } = useStore();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  
  // Mapear IDs de clientes a nombres
  const mapaNombres = clientes.reduce((acc, cliente) => {
    acc[cliente.id] = cliente.nombre;
    return acc;
  }, {} as Record<string, string>);
  
  // Filtrar tickets según búsqueda y filtros
  const ticketsFiltrados = tickets.filter(ticket => {
    const coincideBusqueda = 
      ticket.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      (mapaNombres[ticket.clienteId] || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      ticket.problema.toLowerCase().includes(busqueda.toLowerCase());
      
    const coincideEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
    const coincideDepartamento = filtroDepartamento === 'todos' || ticket.departamento === filtroDepartamento;
    
    return coincideBusqueda && coincideEstado && coincideDepartamento;
  });
  
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
        nombre = 'Técnico';
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Tickets</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          <span>Nuevo Ticket</span>
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar tickets por ID, cliente o problema..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado:
            </label>
            <select
              id="filtroEstado"
              className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="abierto">Abierto</option>
              <option value="en-proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filtroDepartamento" className="block text-sm font-medium text-gray-700 mb-1">
              Departamento:
            </label>
            <select
              id="filtroDepartamento"
              className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroDepartamento}
              onChange={(e) => setFiltroDepartamento(e.target.value)}
            >
              <option value="todos">Todos los departamentos</option>
              <option value="tecnico">Soporte Técnico</option>
              <option value="ventas">Ventas</option>
              <option value="informacion">Información</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
        
        {ticketsFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Ticket
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problema
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
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
                {ticketsFiltrados.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mapaNombres[ticket.clienteId] || 'Cliente Desconocido'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{ticket.problema}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {obtenerEtiquetaDepartamento(ticket.departamento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {obtenerEtiquetaEstado(ticket.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatearFecha(ticket.fechaCreacion)}</div>
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
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <Ticket className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron tickets</h3>
            <p className="mt-1 text-sm text-gray-500">
              No hay tickets que coincidan con tus criterios de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;