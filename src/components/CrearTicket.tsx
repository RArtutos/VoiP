import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const CrearTicket: React.FC<{ clienteId?: string }> = ({ clienteId }) => {
  const navigate = useNavigate();
  const { crearTicket, clientes, currentUser } = useStore();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    clienteId: clienteId || '',
    departamento: currentUser?.departamento || '',
    problema: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const ticketId = crearTicket(formData.clienteId, formData.departamento, formData.problema);
      navigate(`/tickets/${ticketId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el ticket');
    }
  };

  // Si el usuario no es admin, solo puede crear tickets para su departamento
  const departamentos = currentUser?.rol === 'admin' 
    ? ['tecnico', 'ventas', 'informacion', 'general']
    : [currentUser?.departamento || ''];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Crear Nuevo Ticket</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
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
            disabled={currentUser?.rol !== 'admin'}
          >
            {departamentos.map(dep => (
              <option key={dep} value={dep}>
                {dep === 'tecnico' ? 'Soporte Técnico' :
                 dep === 'ventas' ? 'Ventas' :
                 dep === 'informacion' ? 'Información' : 'General'}
              </option>
            ))}
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