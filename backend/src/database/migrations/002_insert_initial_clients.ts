import { pool } from "../../config/database";

const insertClientsMigration = async () => {
  const query = `
    INSERT INTO clients (code, name, email)
    VALUES 
      ('C001', 'Juan Pérez', 'juan.perez@example.com'),
      ('C002', 'María Gómez', 'maria.gomez@example.com'),
      ('C003', 'Carlos Ramírez', 'carlos.ramirez@example.com')
    ON CONFLICT (code) DO NOTHING;
  `;

  try {
    console.log("Insertando clientes...");
    await pool.query(query);
    console.log("Clientes insertados con éxito.");
  } catch (error) {
    console.error("Error al insertar clientes:", error);
  } finally {
    await pool.end();
  }
};

insertClientsMigration();
