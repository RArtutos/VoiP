import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase/PostgreSQL
// En producción, estas variables deberían venir de variables de entorno
const supabaseUrl = 'https://supabase.example.com';
const supabaseKey = 'your-supabase-key';

// Esta es la URL de conexión directa a PostgreSQL proporcionada
export const postgresUrl = 'postgresql://teldrive_owner:2brOqFGx0VRM@ep-delicate-union-a58t2isw-pooler.us-east-2.aws.neon.tech/voip?sslmode=require';

// Creamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Nota: En una implementación real, configurarías correctamente
// la conexión a la base de datos y establecerías las tablas necesarias