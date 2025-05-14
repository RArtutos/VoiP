import { Cliente, Ticket } from '../types';
import db from '../data/db.json';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

// Helper to save DB
const saveDB = (data: typeof db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// API Routes
export const handleApiRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const endpoint = url.pathname.replace('/api/', '');

  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json',
  };

  try {
    switch (endpoint) {
      // Clientes
      case 'clientes':
        if (req.method === 'GET') {
          return new Response(JSON.stringify(db.clientes), { headers });
        }
        if (req.method === 'POST') {
          const cliente: Cliente = await req.json();
          db.clientes.push(cliente);
          saveDB(db);
          return new Response(JSON.stringify(cliente), { headers });
        }
        break;

      // Cliente específico
      case url.pathname.match(/^\/api\/clientes\/(.+)/)?.input:
        const clienteId = url.pathname.split('/').pop();
        if (req.method === 'GET') {
          const cliente = db.clientes.find(c => c.id === clienteId);
          return new Response(JSON.stringify(cliente), { headers });
        }
        if (req.method === 'PUT') {
          const updates = await req.json();
          const index = db.clientes.findIndex(c => c.id === clienteId);
          if (index >= 0) {
            db.clientes[index] = { ...db.clientes[index], ...updates };
            saveDB(db);
            return new Response(JSON.stringify(db.clientes[index]), { headers });
          }
        }
        if (req.method === 'DELETE') {
          db.clientes = db.clientes.filter(c => c.id !== clienteId);
          saveDB(db);
          return new Response(null, { headers });
        }
        break;

      // Tickets
      case 'tickets':
        if (req.method === 'GET') {
          return new Response(JSON.stringify(db.tickets), { headers });
        }
        if (req.method === 'POST') {
          const ticket: Ticket = await req.json();
          db.tickets.push(ticket);
          saveDB(db);
          return new Response(JSON.stringify(ticket), { headers });
        }
        break;

      // Ticket específico
      case url.pathname.match(/^\/api\/tickets\/(.+)/)?.input:
        const ticketId = url.pathname.split('/').pop();
        if (req.method === 'GET') {
          const ticket = db.tickets.find(t => t.id === ticketId);
          return new Response(JSON.stringify(ticket), { headers });
        }
        if (req.method === 'PUT') {
          const updates = await req.json();
          const index = db.tickets.findIndex(t => t.id === ticketId);
          if (index >= 0) {
            db.tickets[index] = { ...db.tickets[index], ...updates };
            saveDB(db);
            return new Response(JSON.stringify(db.tickets[index]), { headers });
          }
        }
        if (req.method === 'DELETE') {
          db.tickets = db.tickets.filter(t => t.id !== ticketId);
          saveDB(db);
          return new Response(null, { headers });
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404,
      headers 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers 
    });
  }
};