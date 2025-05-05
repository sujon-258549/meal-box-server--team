import { Router } from 'express';
import auth from '../../middlewares/auth';
import { contactController } from './contactUs.controller';

const router = Router();
router.post(
  '/create-contact',

  contactController.createContact,
);

router.get('/', auth('mealProvider'), contactController.contactForMe);
router.get('/:id', auth('mealProvider'), contactController.singleContact);

export const contactRouter = router;
