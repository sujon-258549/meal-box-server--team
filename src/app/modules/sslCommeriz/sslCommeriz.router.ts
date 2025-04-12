import { Router } from 'express';
import { sslController } from './sslCommeriz.controller';

const router = Router();
router.post('/validate', sslController.validatePayment);

export const SSLRoutes = router;
