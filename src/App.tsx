import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';

// Componentes
import Layout from './components/Layout';
import Login from './components/Login';
import Clientes from './pages/Clientes';
import Tickets from './pages/Tickets';
import Dashboard from './pages/Dashboard';
import DetalleCliente from './pages/DetalleCliente';
import DetalleTicket from './pages/DetalleTicket';
import CrearCliente from './components/CrearCliente';
import CrearTicket from './components/CrearTicket';

// Protección de rutas
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/nuevo" element={<CrearCliente />} />
          <Route path="clientes/:id" element={<DetalleCliente />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/nuevo" element={<CrearTicket />} />
          <Route path="tickets/:id" element={<DetalleTicket />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;