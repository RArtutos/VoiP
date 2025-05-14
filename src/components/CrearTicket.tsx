import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const CrearTicket: React.FC<{ clienteId?: string }> = ({ clienteId }) => {
  const navigate = useNavigate();
  const { crearTicket, clientes } = useStore();
  
  const [formData, setFormData] = useState({
    clienteId: clienteId || '',
    departamento: 'tecnico',
    problema: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = crearTicket(formData.clienteId, formData.departamento, formData.problema);
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Crear Nuevo Ticket</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!clienteId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              required
              value={formData.clienteId}
              onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.numeroCliente}
                </option>
              ))}
            </select>
          </div>
        )}

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problema
          </label>
          <textarea
            required
            value={formData.problema}
            onChange={(e) => setFormData({...formData, problema: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Crear Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearTicket;