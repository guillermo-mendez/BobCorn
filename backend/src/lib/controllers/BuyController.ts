import { Request, Response } from 'express';
import buyRepository from '../repositories/buyRepository';

class BuyController {
  async buyCorn(req: Request, res: Response) {
    try {
      const clientId = req.headers['x-client-id'] as string;
      await buyRepository.buyCorn(clientId);
      res.status(200).json({ message: 'Maíz comprado con éxito' });
    } catch (error) {
      console.error('Error al comprar maíz:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new BuyController();
