/*
  # Create usuarios table

  1. New Tables
    - `usuarios`
      - `id` (text, primary key)
      - `nombreUsuario` (text, unique)
      - `nombre` (text)
      - `rol` (text)
      - `departamento` (text)
      - `password` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `usuarios` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS usuarios (
  id text PRIMARY KEY,
  nombreUsuario text UNIQUE NOT NULL,
  nombre text NOT NULL,
  rol text NOT NULL CHECK (rol IN ('admin', 'agente')),
  departamento text NOT NULL CHECK (departamento IN ('tecnico', 'ventas', 'informacion', 'general')),
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Insert initial admin user
INSERT INTO usuarios (id, nombreUsuario, nombre, rol, departamento, password)
VALUES ('admin1', 'admin', 'Administrador', 'admin', 'general', 'admin123')
ON CONFLICT (id) DO NOTHING;