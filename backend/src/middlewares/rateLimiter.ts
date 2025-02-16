import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';

export const rateLimiter = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const clientId = req.headers['x-client-id'] as string;

  if (!clientId) {
    return res.status(400).json({ message: 'Client ID es requerido' });
  }

  try {
    // Verificar el último registro del cliente en la tabla rate_limits
    const query = `
      SELECT last_request
      FROM rate_limits 
      WHERE client_id = $1 AND deleted_at IS NULL;
    `;
    const result = await pool.query(query, [clientId]);

    const now = new Date();

    if (result.rowCount && result.rowCount > 0) {
      const lastRequest = new Date(result.rows[0].last_request);
      const differenceInSeconds = (now.getTime() - lastRequest.getTime()) / 1000;

      // Verificar si la última solicitud fue hace menos de 60 segundos
      if (differenceInSeconds < 60) {
        return res.status(429).json({ message: 'Demasiadas solicitudes. Espere un minuto.' });
      }

      // Actualizar last_request y updated_at
      const updateQuery = `
        UPDATE rate_limits 
        SET last_request = NOW(), updated_at = NOW() 
        WHERE client_id = $1;
      `;
      await pool.query(updateQuery, [clientId]);
    } else {
      // Insertar nuevo registro si no existe
      const insertQuery = `
        INSERT INTO rate_limits (client_id, last_request, created_at, updated_at) 
        VALUES ($1, NOW(), NOW(), NOW());
      `;
      await pool.query(insertQuery, [clientId]);
    }

    next();
  } catch (error) {
    console.error('Error del limitador de velocidad:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
