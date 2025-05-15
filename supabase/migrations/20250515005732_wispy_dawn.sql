/*
  # Initial Schema Setup

  1. New Tables
    - `clientes`
      - Basic client information
      - Status tracking
      - Service plan details
    - `tickets`
      - Support ticket tracking
      - Department assignment
      - Status and notes
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  telefono text NOT NULL,
  email text NOT NULL,
  direccion text NOT NULL,
  numeroCliente text UNIQUE NOT NULL,
  fechaRegistro timestamptz NOT NULL DEFAULT now(),
  planActual text NOT NULL,
  estado text NOT NULL CHECK (estado IN ('activo', 'inactivo', 'suspendido'))
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id text PRIMARY KEY,
  clienteId text REFERENCES clientes(id),
  estado text NOT NULL CHECK (estado IN ('abierto', 'en-proceso', 'resuelto', 'cerrado')),
  departamento text NOT NULL CHECK (departamento IN ('tecnico', 'ventas', 'informacion', 'general')),
  problema text NOT NULL,
  notas text[] DEFAULT ARRAY[]::text[],
  fechaCreacion timestamptz NOT NULL DEFAULT now(),
  fechaActualizacion timestamptz NOT NULL DEFAULT now(),
  asignadoA text REFERENCES usuarios(id)
);

-- Enable RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policies for clientes
CREATE POLICY "Allow read access to authenticated users"
  ON clientes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON clientes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON clientes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for tickets
CREATE POLICY "Allow read access to department tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    (SELECT rol FROM usuarios WHERE id = auth.uid()) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()) = departamento
    OR
    asignadoA = auth.uid()
  );

CREATE POLICY "Allow insert for department tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT rol FROM usuarios WHERE id = auth.uid()) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()) = departamento
  );

CREATE POLICY "Allow update for department tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT rol FROM usuarios WHERE id = auth.uid()) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()) = departamento
    OR
    asignadoA = auth.uid()
  )
  WITH CHECK (
    (SELECT rol FROM usuarios WHERE id = auth.uid()) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()) = departamento
    OR
    asignadoA = auth.uid()
  );