import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const artistRouter = express.Router();

/** GET /api/invite/byUser/:userId */
/** Authenticated route */
artistRouter.route('/form/submit').post(jwt(config), controller.submit);

/** GET /api/artist/form/:formId/approve */
/** Authenticated route */
artistRouter.route('/form/:formId/approve').get(controller.approve);

/** GET /api/artist/form/:formId/approve */
/** Authenticated route */
artistRouter.route('/form/:formId/decline').get(controller.decline);
