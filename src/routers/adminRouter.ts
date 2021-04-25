import { Router } from 'express';
import * as adminController from '../controllers/adminController';

export default function adminRoutes(): Router {
  const adminRouter = Router();

  adminRouter.route('/resetstorage')
    .post(adminController.emptyStorage); // reset the local storage

    adminRouter.route('/createstorage')
    .post(adminController.createStorage); // reset the local storage

  return adminRouter;
}