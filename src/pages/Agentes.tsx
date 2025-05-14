import React, { useState } from 'react';
import { useStore } from '../store';
import { UserPlus, Users, Search, Edit2, Save, X } from 'lucide-react';

const Agentes: React.FC = () => {
  const { currentUser, usuarios, crearUsuario, actualizarUsuario } = useStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    password: '',
    rol: 'agente',
    departamento: 'tecnico'
  });

  const [editForm, setEditForm] = useState({
    nombre: '',
    departamento: ''
  });

  // Filtrar usuarios que son agentes (no mostrar admins)
  const agentes = usuarios
    .filter(u => u.rol === 'agente')
    .filter(agente => 
      agente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      agente.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      agente.departamento.toLowerCase().includes(busqueda.toLowerCase())
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      crearUsuario(formData);
      setSuccess('Agente creado exitosamente');
      setFormData({
        nombreUsuario: '',
        nombre: '',
        password: '',
        rol: 'agente',
        departamento: 'tecnico'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el agente');
    }
  };

  const iniciarEdicion = (agente: any) => {
    setEditandoId(agente.id);
    setEditForm({
      nombre: agente.nombre,
      departamento: agente.departamento
    });
  };

  const guardarEdicion = (id: string) => {
    try {
      actualizarUsuario(id, editForm);
      setEditandoId(null);
      setSuccess('Agente actualizado exitosamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el agente');
    }
  };

  if (currentUser?.rol !== 'admin') {
    return (
      <div className="text-center py-12 text-gray-300">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Agentes</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-gray-700 mr-3">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Agentes Activos</h2>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Buscar agentes..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {agentes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {agentes.map((agente) => (
                      <tr key={agente.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editandoId === agente.id ? (
                            <input
                              type="text"
                              value={editForm.nombre}
                              onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                              className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
                            />
                          ) : (
                            <div className="text-sm font-medium text-white">{agente.nombre}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{agente.nombreUsuario}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editandoId === agente.id ? (
                            <select
                              value={editForm.departamento}
                              onChange={(e) => setEditForm({...editForm, departamento: e.target.value})}
                              className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
                            >
                              <option value="tecnico">Soporte Técnico</option>
                              <option value="ventas">Ventas</option>
                              <option value="informacion">Información</option>
                              <option value="general">General</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              agente.departamento === 'tecnico' ? 'bg-blue-900 text-blue-200' :
                              agente.departamento === 'ventas' ? 'bg-green-900 text-green-200' :
                              agente.departamento === 'informacion' ? 'bg-purple-900 text-purple-200' :
                              'bg-gray-700 text-gray-200'
                            }`}>
                              {agente.departamento === 'tecnico' ? 'Soporte Técnico' :
                               agente.departamento === 'ventas' ? 'Ventas' :
                               agente.departamento === 'informacion' ? 'Información' : 'General'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editandoId === agente.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => guardarEdicion(agente.id)}
                                className="text-green-400 hover:text-green-300"
                              >
                                <Save className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setEditandoId(null)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => iniciarEdicion(agente)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <Users className="h-12 w-12 text-gray-500 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-white">No se encontraron agentes</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {busqueda ? 'No hay agentes que coincidan con tu búsqueda.' : 'Aún no hay agentes registrados.'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md h-fit">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-gray-700 mr-3">
              <UserPlus className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Crear Nuevo Agente</h2>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900 text-green-100 rounded-lg">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                required
                value={formData.nombreUsuario}
                onChange={(e) => setFormData({...formData, nombreUsuario: e.target.value})}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="usuario123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Departamento
              </label>
              <select
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="tecnico">Soporte Técnico</option>
                <option value="ventas">Ventas</option>
                <option value="informacion">Información</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Crear Agente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Agentes;