import { NextFunction, Request, Response } from 'express';

import { Invite } from '../../models/invite.model';

export const findAllByUserId = (req: Request, res: Response, next: NextFunction) => {
	const whereClause =
		req.params && req.params.userId
			? {
				where: { userId: req.params.userId, active: true  },
			}
			: undefined;

	try {
		Invite.findAll(whereClause)
			.then((invite: Invite[] | null) => {
				res.json(invite);
			}).catch(next);

	} catch (err) {
		console.error(err);
	}
};

export const findByInviteCode = (req: Request, res: Response, next: NextFunction) => {
	const whereClause =
		req.params && req.params.code
			? {
				where: { inviteCode: req.params.code, active: true },
			}
			: undefined;

	if (whereClause != undefined) {
		try {
			Invite.findOne(whereClause)
				.then((invite: Invite | null) => {
					console.log(invite);
					res.json(invite);
				}).catch(next);

		} catch (err) {
			console.log(err);
		}
	} else {
		return res
		.status(400)
		.send({ error: 'You need to pass the invite code in url params.' });
	}
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	// AccessToken payload is in req.Invite.payload, especially its `id` field
	// InviteId is the param in /invites/:InviteId
	return Invite.findByPk(req.params.inviteId)
		.then((invite: Invite | null) => res.json(invite))
		.catch(next);
};
