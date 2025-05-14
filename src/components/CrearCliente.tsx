import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const CrearCliente: React.FC = () => {
  const navigate = useNavigate();
  const crearCliente = useStore(state => state.crearCliente);
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    numeroCliente: `C${Date.now()}`,
    planActual: 'Fibra 100MB',
    estado: 'activo' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoCliente = crearCliente(formData);
    navigate(`/clientes/${nuevoCliente.id}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Crear Nuevo Cliente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            required
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            required
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plan
          </label>
          <select
            value={formData.planActual}
            onChange={(e) => setFormData({...formData, planActual: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="Fibra 100MB">Fibra 100MB</option>
            <option value="Fibra 300MB">Fibra 300MB</option>
            <option value="Fibra 500MB">Fibra 500MB</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Crear Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearCliente;