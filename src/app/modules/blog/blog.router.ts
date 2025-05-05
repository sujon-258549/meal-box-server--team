import { NextFunction, Request, Response, Router } from 'express';
import { upload } from '../../../app/utils/sendImageToCloudinary';
import auth from '../../middlewares/auth';
import { blogController } from './blog.controller';
const router = Router();
router.post(
  '/create-blog',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  blogController.createBlog,
);

router.get('/', blogController.allBlog);
router.get('/my-blog', auth('admin'), blogController.getMyBlog);
router.get('/:id', blogController.singleBlog);
router.delete('/:id', auth('admin'), blogController.deleteBlog);
router.put(
  '/:id',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  blogController.updateBlog,
);

export const blogRouter = router;
