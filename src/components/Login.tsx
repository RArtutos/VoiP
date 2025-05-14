import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!username || !password) {
      setError('Por favor ingrese su nombre de usuario y contraseña');
      return;
    }
    
    // En producción, aquí iría la autenticación real
    // Por ahora simplemente aceptamos cualquier usuario/contraseña
    login(username);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="p-3 rounded-full bg-blue-100">
            <Phone size={40} className="text-blue-800" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sistema de Central Telefónica
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su nombre de usuario"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su contraseña"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>¿Olvidó su contraseña? Contacte al administrador del sistema.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;