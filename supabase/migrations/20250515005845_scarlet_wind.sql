/*
  # Create database schema for customer support system

  1. New Tables
    - `clientes` (customers)
      - Basic customer information
      - Unique customer number
      - Service plan and status tracking
    - `tickets` (support tickets)
      - Linked to customers and agents
      - Status and department tracking
      - Problem description and notes

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access
    - Department-based access control for tickets
*/

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clienteId uuid REFERENCES clientes(id),
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
    (SELECT rol FROM usuarios WHERE id = auth.uid()::text) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()::text) = departamento
    OR
    asignadoA = auth.uid()::text
  );

CREATE POLICY "Allow insert for department tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT rol FROM usuarios WHERE id = auth.uid()::text) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()::text) = departamento
  );

CREATE POLICY "Allow update for department tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT rol FROM usuarios WHERE id = auth.uid()::text) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()::text) = departamento
    OR
    asignadoA = auth.uid()::text
  )
  WITH CHECK (
    (SELECT rol FROM usuarios WHERE id = auth.uid()::text) = 'admin'
    OR
    (SELECT departamento FROM usuarios WHERE id = auth.uid()::text) = departamento
    OR
    asignadoA = auth.uid()::text
  );