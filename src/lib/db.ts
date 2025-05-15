import fs from 'node:fs';
import path from 'node:path';
import { Cliente, Ticket, Usuario } from '../types';

// Usar ruta relativa para el hosting compartido
const DB_PATH = './data/db.json';

interface DB {
  clientes: Cliente[];
  tickets: Ticket[];
  usuarios: Usuario[];
}

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  const initialDB: DB = {
    clientes: [],
    tickets: [],
    usuarios: [
      {
        id: 'admin1',
        nombreUsuario: 'admin',
        nombre: 'Administrador',
        rol: 'admin',
        departamento: 'general',
        password: 'admin123'
      }
    ]
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
}

// Read DB with error handling
export const readDB = (): DB => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    // Return empty DB if file cannot be read
    return { clientes: [], tickets: [], usuarios: [] };
  }
};

// Write DB with error handling
export const writeDB = (data: DB) => {
  try {
    const dirPath = path.dirname(DB_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('No se pudo guardar los datos');
  }
};

// DB Operations
export const db = {
  clientes: {
    getAll: () => readDB().clientes,
    getById: (id: string) => readDB().clientes.find(c => c.id === id),
    create: (cliente: Cliente) => {
      try {
        const db = readDB();
        db.clientes.push(cliente);
        writeDB(db);
        return cliente;
      } catch (error) {
        console.error('Error creating client:', error);
        throw new Error('No se pudo crear el cliente');
      }
    },
    update: (id: string, updates: Partial<Cliente>) => {
      try {
        const db = readDB();
        const index = db.clientes.findIndex(c => c.id === id);
        if (index >= 0) {
          db.clientes[index] = { ...db.clientes[index], ...updates };
          writeDB(db);
          return db.clientes[index];
        }
        return null;
      } catch (error) {
        console.error('Error updating client:', error);
        throw new Error('No se pudo actualizar el cliente');
      }
    },
    delete: (id: string) => {
      try {
        const db = readDB();
        db.clientes = db.clientes.filter(c => c.id !== id);
        writeDB(db);
      } catch (error) {
        console.error('Error deleting client:', error);
        throw new Error('No se pudo eliminar el cliente');
      }
    }
  },
  tickets: {
    getAll: () => readDB().tickets,
    getById: (id: string) => readDB().tickets.find(t => t.id === id),
    create: (ticket: Ticket) => {
      try {
        const db = readDB();
        db.tickets.push(ticket);
        writeDB(db);
        return ticket;
      } catch (error) {
        console.error('Error creating ticket:', error);
        throw new Error('No se pudo crear el ticket');
      }
    },
    update: (id: string, updates: Partial<Ticket>) => {
      try {
        const db = readDB();
        const index = db.tickets.findIndex(t => t.id === id);
        if (index >= 0) {
          db.tickets[index] = { ...db.tickets[index], ...updates };
          writeDB(db);
          return db.tickets[index];
        }
        return null;
      } catch (error) {
        console.error('Error updating ticket:', error);
        throw new Error('No se pudo actualizar el ticket');
      }
    },
    delete: (id: string) => {
      try {
        const db = readDB();
        db.tickets = db.tickets.filter(t => t.id !== id);
        writeDB(db);
      } catch (error) {
        console.error('Error deleting ticket:', error);
        throw new Error('No se pudo eliminar el ticket');
      }
    }
  },
  usuarios: {
    getAll: () => readDB().usuarios,
    getByUsername: (username: string) => readDB().usuarios.find(u => u.nombreUsuario === username),
    create: (usuario: Usuario) => {
      try {
        const db = readDB();
        db.usuarios.push(usuario);
        writeDB(db);
        return usuario;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('No se pudo crear el usuario');
      }
    },
    update: (id: string, updates: Partial<Usuario>) => {
      try {
        const db = readDB();
        const index = db.usuarios.findIndex(u => u.id === id);
        if (index >= 0) {
          db.usuarios[index] = { ...db.usuarios[index], ...updates };
          writeDB(db);
          return db.usuarios[index];
        }
        return null;
      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('No se pudo actualizar el usuario');
      }
    }
  }
};