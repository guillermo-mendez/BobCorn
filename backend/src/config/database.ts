import {Pool, PoolClient} from 'pg';
import {configEnv} from "./env";


// Configuración de la conexión a la base de datos
export const pool = new Pool({
  user: configEnv.dbUser,
  host: configEnv.dbHost,
  database: configEnv.database,
  password: configEnv.dbPassword,
  port: configEnv.dbPort,
});

// Función para obtener una conexión de prueba desde el pool
export const getConnectionTest = async (): Promise<PoolClient | null> => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    return client;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    return null;
  }
};

// Función para obtener una conexión de prueba desde el pool
export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
};
