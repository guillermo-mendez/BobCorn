import { Request, Response, NextFunction } from 'express';
import buyRepository from "../lib/repositories/buyRepository";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const {clientCode} = req.body;

  if (!clientCode) {
    return res.status(400).json({ message: 'Código cliente es requerido' });
  }

  try {
    const client = await buyRepository.getClientByCode(clientCode);
    if (typeof client === 'undefined') {
      console.log('Cliente no encontrado rateLimiter', client);
      return res.status(400).json({ message: 'Cliente no encontrado' });
    }

    // Verificar el último registro del cliente en la tabla rate_limits
    const result = await buyRepository.getRateLimitsByClientId(client.clientId);

    const now = new Date();

    if (result.rowCount && result.rowCount > 0) {
      const lastRequest = new Date(result.rows[0].last_request);
      const differenceInSeconds = (now.getTime() - lastRequest.getTime()) / 1000;

      // Verificar si la última solicitud fue hace menos de 60 segundos
      if (differenceInSeconds < 60) {
        return res.status(429).json({ message: 'Demasiadas solicitudes. Espere un minuto.' });
      }

      // Actualizar last_request y updated_at
      await buyRepository.updateLastRequest(client.clientId);
      return next();
    } else {

      // Insertar nuevo registro si no existe
      await buyRepository.insertLastRequest(client.clientId);
      return next();
    }

  } catch (error) {
    console.error('Error del limitador de velocidad:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
