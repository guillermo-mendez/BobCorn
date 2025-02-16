import { Router } from 'express';
import buyController from '../controllers/BuyController';

const router = Router();

router.post('/', buyController.buyCorn);

export default router;
