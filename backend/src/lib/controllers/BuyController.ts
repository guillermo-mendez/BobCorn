import { Request, Response } from 'express';
import buyRepository from '../repositories/buyRepository';
import validation from '../../validators/BuyCornValidator';

class BuyController {
  /**
   * Comprar maíz.
   * @param req Request
   * @param res Response
   */
  async buyCorn(req: Request, res: Response) {
    try {
      validation.buyCornValidation(req.body);
      const {clientCode} = req.body;
      const client = await buyRepository.getClientByCode(clientCode);

      if(typeof client === 'undefined') {
        console.log('Cliente no encontrado');
        res.status(404).json({ message: 'Cliente no encontrado' });
        return; // detener la ejecución
      }

      await buyRepository.buyCorn(client.clientId);
      res.status(200).json({ message: 'Maíz comprado con éxito' });
    } catch (error) {
      console.error('Error al comprar maíz:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new BuyController();
