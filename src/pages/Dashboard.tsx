import React from 'react';
import { useStore } from '../store';
import { 
  PhoneCall, 
  Ticket, 
  CheckCircle, 
  Clock, 
  Users,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { tickets = [], clientes = [], sesionesLlamada = [] } = useStore();
  
  // Estadísticas de tickets
  const ticketsAbiertos = tickets.filter(t => t.estado === 'abierto').length;
  const ticketsEnProceso = tickets.filter(t => t.estado === 'en-proceso').length;
  const ticketsResueltos = tickets.filter(t => t.estado === 'resuelto').length;
  const ticketsCerrados = tickets.filter(t => t.estado === 'cerrado').length;
  
  // Estadísticas por departamento
  const ticketsTecnicos = tickets.filter(t => t.departamento === 'tecnico').length;
  const ticketsVentas = tickets.filter(t => t.departamento === 'ventas').length;
  const ticketsInfo = tickets.filter(t => t.departamento === 'informacion').length;
  
  // Llamadas activas
  const llamadasActivas = sesionesLlamada.filter(s => s.estado === 'activa').length;
  
  // Tickets recientes
  const ticketsRecientes = [...tickets]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5);
  
  // Mapear IDs de clientes a nombres
  const mapaNombres = clientes.reduce((acc, cliente) => {
    acc[cliente.id] = cliente.nombre;
    return acc;
  }, {} as Record<string, string>);
  
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
  
  // Formatear fecha
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Ticket className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total de Tickets</p>
              <p className="text-2xl font-bold">{tickets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tickets Resueltos</p>
              <p className="text-2xl font-bold">{ticketsResueltos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tickets Pendientes</p>
              <p className="text-2xl font-bold">{ticketsAbiertos + ticketsEnProceso}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Clientes</p>
              <p className="text-2xl font-bold">{clientes.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Distribución de Tickets por Estado</h2>
          
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Abiertos</span>
              <span className="text-sm font-medium">{ticketsAbiertos}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ width: `${(ticketsAbiertos / tickets.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">En Proceso</span>
              <span className="text-sm font-medium">{ticketsEnProceso}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full" 
                style={{ width: `${(ticketsEnProceso / tickets.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Resueltos</span>
              <span className="text-sm font-medium">{ticketsResueltos}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${(ticketsResueltos / tickets.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">Cerrados</span>
              <span className="text-sm font-medium">{ticketsCerrados}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gray-500 h-2.5 rounded-full" 
                style={{ width: `${(ticketsCerrados / tickets.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Distribución por Departamento</h2>
          
          <div className="flex justify-center space-x-4 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-700 font-bold">{ticketsTecnicos}</span>
              </div>
              <p className="text-sm">Técnico</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-green-700 font-bold">{ticketsVentas}</span>
              </div>
              <p className="text-sm">Ventas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-700 font-bold">{ticketsInfo}</span>
              </div>
              <p className="text-sm">Info</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Llamadas Activas</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="font-bold">{llamadasActivas}</span>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <PhoneCall className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Llamadas de hoy</p>
                  <p className="text-xl font-bold text-blue-900">
                    {sesionesLlamada.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tickets Recientes</h2>
          
          {ticketsRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ticketsRecientes.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mapaNombres[ticket.clienteId] || 'Desconocido'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {obtenerEtiquetaEstado(ticket.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(ticket.fechaCreacion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay tickets recientes.</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Estadísticas Destacadas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-blue-700 mr-2" />
                <h3 className="font-medium">Tasa de Resolución</h3>
              </div>
              <p className="text-2xl font-bold text-blue-800">
                {tickets.length > 0 
                  ? Math.round((ticketsResueltos / tickets.length) * 100) 
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">
                {ticketsResueltos} de {tickets.length} tickets
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-700 mr-2" />
                <h3 className="font-medium">Nuevos Hoy</h3>
              </div>
              <p className="text-2xl font-bold text-green-800">+3</p>
              <p className="text-sm text-gray-600">
                Tickets creados hoy
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-700 mr-2" />
                <h3 className="font-medium">Pendientes</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-800">
                {ticketsAbiertos + ticketsEnProceso}
              </p>
              <p className="text-sm text-gray-600">
                Requieren atención
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <PhoneCall className="w-5 h-5 text-purple-700 mr-2" />
                <h3 className="font-medium">Duración Media</h3>
              </div>
              <p className="text-2xl font-bold text-purple-800">12 min</p>
              <p className="text-sm text-gray-600">
                Tiempo de llamada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;