import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const inviteRouter = express.Router();

/** GET /api/invite/byUser/:userId */
/** Authenticated route */
inviteRouter.route('/byUser/:userId').get(jwt(config), controller.findAllByUserId);

/** GET /api/invite/byCode/:code */
/** Authenticated route */
inviteRouter.route('/byCode/:code').get(jwt(config), controller.findByInviteCode);

/** GET /api/invite/:inviteId */
/** Authenticated route */
inviteRouter.route('/:inviteId').get(jwt(config), controller.get);
