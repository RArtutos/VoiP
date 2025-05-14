import React, { useState } from 'react';
import { PhoneCall, Phone, UserPlus, User, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useStore } from '../store';
import { OpcionFlujo } from '../types';

const LlamadaActual: React.FC = () => {
  const { 
    llamadaActiva, 
    pasoActual, 
    clienteActual,
    iniciarLlamada, 
    finalizarLlamada, 
    avanzarPaso, 
    buscarCliente, 
    seleccionarCliente,
    agregarNota,
    crearTicket
  } = useStore();
  
  const [numeroCliente, setNumeroCliente] = useState('');
  const [nota, setNota] = useState('');
  const [detalleTicket, setDetalleTicket] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Manejar la verificación del cliente
  const verificarCliente = () => {
    if (!numeroCliente) {
      setMensajeError('Por favor ingrese un número de cliente');
      return;
    }
    
    const cliente = buscarCliente(numeroCliente);
    
    if (cliente) {
      seleccionarCliente(cliente);
      setMensajeExito(`Cliente verificado: ${cliente.nombre}`);
      setMensajeError('');
      avanzarPaso('menu');
    } else {
      setMensajeError('Número de cliente no encontrado');
      setMensajeExito('');
    }
  };

  // Manejar el envío de notas
  const manejarEnvioNota = () => {
    if (!nota) return;
    
    agregarNota(nota);
    setNota('');
  };

  // Manejar la creación de tickets
  const manejarCreacionTicket = (departamento: OpcionFlujo) => {
    if (!detalleTicket) {
      setMensajeError('Por favor ingrese el detalle del problema');
      return;
    }
    
    const ticketId = crearTicket(departamento, detalleTicket);
    
    if (ticketId) {
      setMensajeExito(`Ticket creado con ID: ${ticketId}`);
      setMensajeError('');
      setDetalleTicket('');
    } else {
      setMensajeError('Error al crear el ticket');
      setMensajeExito('');
    }
  };

  // Renderizar botón de inicio de llamada si no hay llamada activa
  if (!llamadaActiva) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-6">Central Telefónica</h1>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-blue-100 rounded-full">
              <PhoneCall size={48} className="text-blue-700" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4">No hay llamada activa</h2>
          <p className="text-gray-600 mb-6">Inicie una nueva llamada para atender a un cliente</p>
          <button 
            onClick={iniciarLlamada}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>Iniciar Nueva Llamada</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Contenido basado en el paso actual
  let contenidoPaso;
  
  switch (pasoActual) {
    case 'inicio':
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Inicio de Llamada</h2>
          <p className="mb-6">Seleccione una opción para continuar:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => avanzarPaso('verificacion')}
              className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg flex flex-col items-center justify-center transition-colors"
            >
              <span className="text-3xl mb-2">1</span>
              <span className="font-medium">Cliente Existente</span>
            </button>
            
            <button
              onClick={() => avanzarPaso('crear-cuenta')}
              className="p-4 bg-green-100 hover:bg-green-200 rounded-lg flex flex-col items-center justify-center transition-colors"
            >
              <span className="text-3xl mb-2">2</span>
              <span className="font-medium">Nuevo Cliente</span>
            </button>
          </div>
        </div>
      );
      break;
      
    case 'verificacion':
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Verificación de Cliente</h2>
          
          {mensajeError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {mensajeError}
            </div>
          )}
          
          {mensajeExito && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {mensajeExito}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="numeroCliente" className="block mb-2 text-gray-700">
              Ingrese el número de cliente:
            </label>
            <div className="flex">
              <input
                type="text"
                id="numeroCliente"
                value={numeroCliente}
                onChange={(e) => setNumeroCliente(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. C1001"
              />
              <button
                onClick={verificarCliente}
                className="px-4 bg-blue-600 text-white rounded-r hover:bg-blue-700"
              >
                Verificar
              </button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => {
                avanzarPaso('recuperar-numero');
                setMensajeError('');
              }}
              className="px-4 py-2 text-blue-700 hover:underline"
            >
              Olvidé mi número de cliente (6)
            </button>
            
            <button
              onClick={() => {
                avanzarPaso('reintentar-numero');
                setMensajeError('');
                setNumeroCliente('');
              }}
              className="px-4 py-2 text-gray-700 hover:underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
      break;
      
    case 'crear-cuenta':
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Creación de Cuenta Nueva</h2>
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 mb-6">
            <p className="text-yellow-700">
              El cliente será transferido a un agente para crear una cuenta nueva.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Instrucciones para el agente:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Solicite información personal del cliente (nombre, teléfono, dirección)</li>
              <li>Verifique disponibilidad de servicio en su zona</li>
              <li>Explique planes y promociones disponibles</li>
              <li>Registre al cliente en el sistema</li>
              <li>Proporcione el número de cliente</li>
            </ol>
          </div>
          
          <button
            onClick={() => avanzarPaso('inicio')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al Inicio
          </button>
        </div>
      );
      break;
      
    case 'recuperar-numero':
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recuperación de Número de Cliente</h2>
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 mb-6">
            <p className="text-yellow-700">
              El cliente será transferido a un agente para recuperar su número de cliente.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Instrucciones para el agente:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Solicite información para verificar identidad (nombre completo, correo, dirección)</li>
              <li>Busque al cliente en el sistema</li>
              <li>Verifique que la información coincida</li>
              <li>Proporcione el número de cliente</li>
              <li>Registre en el sistema que se recuperó el número</li>
            </ol>
          </div>
          
          <button
            onClick={() => avanzarPaso('inicio')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al Inicio
          </button>
        </div>
      );
      break;
      
    case 'reintentar-numero':
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reintentar Verificación</h2>
          <p className="mb-4">El cliente desea reintentar la verificación. Volver a solicitar el número.</p>
          
          <button
            onClick={() => avanzarPaso('verificacion')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver a Verificación
          </button>
        </div>
      );
      break;
      
    case 'menu':
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Menú Principal</h2>
          
          {clienteActual && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Cliente Actual:</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium ml-2">{clienteActual.nombre}</span>
                </div>
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium ml-2">{clienteActual.numeroCliente}</span>
                </div>
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium ml-2">{clienteActual.planActual}</span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ml-2 ${
                    clienteActual.estado === 'activo' ? 'text-green-600' : 
                    clienteActual.estado === 'suspendido' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {clienteActual.estado}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <p className="mb-6">Seleccione una opción para continuar:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => avanzarPaso('soporte-tecnico')}
              className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg flex flex-col items-center transition-colors"
            >
              <span className="text-3xl mb-2">1</span>
              <span className="font-medium">Soporte Técnico</span>
            </button>
            
            <button
              onClick={() => avanzarPaso('ventas')}
              className="p-4 bg-green-100 hover:bg-green-200 rounded-lg flex flex-col items-center transition-colors"
            >
              <span className="text-3xl mb-2">2</span>
              <span className="font-medium">Ventas</span>
            </button>
            
            <button
              onClick={() => avanzarPaso('informacion-productos')}
              className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg flex flex-col items-center transition-colors"
            >
              <span className="text-3xl mb-2">3</span>
              <span className="font-medium">Información de Productos</span>
            </button>
            
            <button
              onClick={() => avanzarPaso('operador')}
              className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg flex flex-col items-center transition-colors"
            >
              <span className="text-3xl mb-2">9</span>
              <span className="font-medium">Hablar con Operador</span>
            </button>
          </div>
        </div>
      );
      break;
      
    case 'soporte-tecnico':
    case 'ventas':
    case 'informacion-productos':
    case 'operador':
      const departamento = {
        'soporte-tecnico': 'Soporte Técnico',
        'ventas': 'Ventas',
        'informacion-productos': 'Información de Productos',
        'operador': 'Operador'
      }[pasoActual];
      
      const colorFondo = {
        'soporte-tecnico': 'bg-blue-50',
        'ventas': 'bg-green-50',
        'informacion-productos': 'bg-purple-50',
        'operador': 'bg-yellow-50'
      }[pasoActual];
      
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className={`${colorFondo} p-3 rounded-lg mb-6`}>
            <h2 className="text-xl font-semibold">Departamento: {departamento}</h2>
          </div>
          
          {mensajeError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {mensajeError}
            </div>
          )}
          
          {mensajeExito && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {mensajeExito}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="detalleTicket" className="block mb-2 text-gray-700 font-medium">
              Detalle del problema:
            </label>
            <textarea
              id="detalleTicket"
              value={detalleTicket}
              onChange={(e) => setDetalleTicket(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describa el problema o consulta del cliente..."
            ></textarea>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => avanzarPaso('menu')}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Volver al Menú
            </button>
            
            <button
              onClick={() => manejarCreacionTicket(pasoActual)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Crear Ticket
            </button>
          </div>
        </div>
      );
      break;
      
    default:
      contenidoPaso = (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Paso Desconocido</h2>
          <p>Ha ocurrido un error en el flujo de la llamada.</p>
          <button
            onClick={() => avanzarPaso('inicio')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al Inicio
          </button>
        </div>
      );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Llamada en Curso</h1>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full animate-pulse"></span>
            Activa
          </span>
          <button
            onClick={finalizarLlamada}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Finalizar Llamada
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {contenidoPaso}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Notas de la Llamada</h2>
          
          <div className="border rounded-lg h-64 overflow-y-auto mb-4 bg-gray-50 p-3">
            {llamadaActiva.notas.length > 0 ? (
              <ul className="space-y-2">
                {llamadaActiva.notas.map((nota, index) => (
                  <li key={index} className="p-2 bg-white rounded border border-gray-200">
                    {nota}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic text-center mt-20">
                No hay notas todavía
              </p>
            )}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Agregar una nota..."
            />
            <button
              onClick={manejarEnvioNota}
              className="px-3 bg-blue-600 text-white rounded-r hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LlamadaActual;