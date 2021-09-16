import express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';
import { artistRouter } from './artist';
import { inviteRouter } from './invite';

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/users', userRouter);
services.use('/artist', artistRouter);
services.use('/invite', inviteRouter);
