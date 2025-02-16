import { exec } from 'child_process';
import path from 'path';
import {pool} from "../config/database";

const migrations = [
  { name: '001_initial_migration', path: path.join(__dirname, './migrations/001_initial_migration.ts') },
  { name: '002_insert_initial_clients', path: path.join(__dirname, './migrations/002_insert_initial_clients.ts') }
];


const createMigrationsTableIfNotExists = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `;
  try {
    await pool.query(query);
    console.log('Tabla de migraciones verificada/creada.');
  } catch (error) {
    console.error('Error al crear la tabla de migraciones:', error);
    throw error;
  }
};

const getAppliedMigrations = async (): Promise<string[]> => {
  const result = await pool.query('SELECT name FROM migrations');
  return result.rows.map(row => row.name);
};

const runMigration = async (name: string, scriptPath: string) => {
  console.log(`Ejecutando migración: ${name}`);
  await new Promise((resolve, reject) => {
    exec(`ts-node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar la migración ${name}:`, error);
        reject(error);
      } else {
        console.log(stdout);
        resolve(true);
      }
    });
  });

  // Registrar la migración en la tabla migrations
  await pool.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
  console.log(`Migración ${name} registrada exitosamente.`);
};

const runMigrations = async () => {
  try {
    // Crear la tabla de migraciones si no existe
    await createMigrationsTableIfNotExists();

    // Obtener las migraciones ya aplicadas
    const appliedMigrations = await getAppliedMigrations();
    const pendingMigrations = migrations.filter(migration => !appliedMigrations.includes(migration.name));

    if (pendingMigrations.length === 0) {
      console.log('No hay migraciones pendientes.');
      return;
    }

    // Ejecutar las migraciones pendientes
    for (const migration of pendingMigrations) {
      await runMigration(migration.name, migration.path);
    }

    console.log('Todas las migraciones se ejecutaron con éxito.');
  } catch (error) {
    console.error('Error al ejecutar migraciones:', error);
  } finally {
    await pool.end();
  }
};

runMigrations();