import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const userRouter = express.Router();

/** GET /api/users */
userRouter.route('/').get(controller.find);

/** GET /api/users/username */
userRouter.route('/username').get(controller.findByUsername);

/** GET /api/users/public-address */
userRouter.route('/public-address').get(controller.findByPublicAddress);

/** GET /api/users/:userId */
/** Authenticated route */
userRouter.route('/:userId').get(jwt(config), controller.get);

/** POST /api/users */
userRouter.route('/').post(controller.create);

/** POST SEARCH /api/users/search/names */
userRouter.route('/search/names').post(controller.searchNames);

/** PATCH /api/users/:userId */
/** Authenticated route */
userRouter.route('/:userId').patch(jwt(config), controller.patch);
