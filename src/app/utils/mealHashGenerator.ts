import crypto from 'crypto';
import { TMenu } from '../modules/Menu/menu.interface';

export const generateMealsHash = (meals: TMenu['meals']) => {
  const mealsString = JSON.stringify(meals);
  return crypto.createHash('sha256').update(mealsString).digest('hex');
};
