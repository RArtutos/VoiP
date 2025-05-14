import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, Ticket, LogOut, BarChart, UserPlus } from 'lucide-react';
import { useStore } from '../store';

const Layout: React.FC = () => {
  const { isLoggedIn, currentUser, logout } = useStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Outlet />;
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">TelDrive</h1>
          <p className="text-sm text-blue-200">Sistema de Soporte</p>
        </div>
        <div className="p-2">
          <p className="px-4 py-2 text-sm text-blue-300">
            Agente: {currentUser.nombre}
          </p>
        </div>
        <nav className="mt-6">
          <Link
            to="/clientes"
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition-colors ${isActive('/clientes')}`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span>Clientes</span>
          </Link>
          <Link
            to="/tickets"
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition-colors ${isActive('/tickets')}`}
          >
            <Ticket className="w-5 h-5 mr-3" />
            <span>Tickets</span>
          </Link>
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition-colors ${isActive('/')}`}
          >
            <BarChart className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          {currentUser.rol === 'admin' && (
            <Link
              to="/agentes"
              className={`flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 transition-colors ${isActive('/agentes')}`}
            >
              <UserPlus className="w-5 h-5 mr-3" />
              <span>Gestionar Agentes</span>
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-blue-100 hover:bg-blue-700 w-full rounded transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;