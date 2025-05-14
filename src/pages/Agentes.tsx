import React, { useState } from 'react';
import { useStore } from '../store';
import { UserPlus, Users } from 'lucide-react';

const Agentes: React.FC = () => {
  const { currentUser, crearUsuario } = useStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    nombre: '',
    password: '',
    rol: 'agente',
    departamento: 'tecnico'
  });

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

  if (currentUser?.rol !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Agentes</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-full bg-blue-100 mr-3">
            <UserPlus className="w-6 h-6 text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold">Crear Nuevo Agente</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              required
              value={formData.nombreUsuario}
              onChange={(e) => setFormData({...formData, nombreUsuario: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="usuario123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={formData.departamento}
              onChange={(e) => setFormData({...formData, departamento: e.target.value})}
              className="w-full p-2 border rounded"
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
  );
};

export default Agentes;