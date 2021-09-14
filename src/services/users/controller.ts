import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
	// If a query string ?publicAddress=... is given, then filter results
	const whereClause =
		req.query && req.query.publicAddress
			? {
				where: { publicAddress: req.query.publicAddress },
			}
			: undefined;

	return User.findAll(whereClause)
		.then((users: User[]) => res.json(users))
		.catch(next);
};

export const findByUsername = (req: Request, res: Response, next: NextFunction) => {
	const whereClause =
		req.query && req.query.username
			? {
				where: { username: req.query.username },
			}
			: undefined;

	let response: any = {};

	try {
		User.findOne(whereClause)
			.then((user: any | null) => {

				if (user) {
					const data = user.dataValues;

					response.publicAddress = data.publicAddress;
					response.username = data.username;
					response.totalCollection = data.totalCollection;
					response.totalCreations = data.totalCreations;
					response.followers = data.followers;
					response.following = data.following;
					response.bio = data.bio;
					response.avatar = data.avatar;
					response.artist = data.artist;
					response.website = data.website;
					response.instagramUrl = data.instagramUrl;
					response.facebookUrl = data.facebookUrl;
					response.discordUrl = data.discordUrl;
					response.twitterUrl = data.twitterUrl;
					response.youtubeUrl = data.youtubeUrl;
					response.name = data.name;
					response.location = data.location;

					res.json(response);
				} else {
					res.json(null);
				}
			}).catch(next);

	} catch (err) {
		console.log(err);
	}

	return response;
};

export const findByPublicAddress = (req: Request, res: Response, next: NextFunction) => {
	const whereClause =
		req.query && req.query.publicAddress
			? {
				where: { publicAddress: req.query.publicAddress },
			}
			: undefined;

	let response: any = {};

	try {
		User.findOne(whereClause)
			.then((user: any | null) => {

				if (user) {
					const data = user.dataValues;

					response.publicAddress = data.publicAddress;
					response.username = data.username;
					response.totalCollection = data.totalCollection;
					response.totalCreations = data.totalCreations;
					response.followers = data.followers;
					response.following = data.following;
					response.bio = data.bio;
					response.avatar = data.avatar;
					response.artist = data.artist;
					response.website = data.website;
					response.instagramUrl = data.instagramUrl;
					response.facebookUrl = data.facebookUrl;
					response.discordUrl = data.discordUrl;
					response.twitterUrl = data.twitterUrl;
					response.youtubeUrl = data.youtubeUrl;
					response.name = data.name;
					response.location = data.location;

					res.json(response);
				} else {
					res.json(null);
				}
			}).catch(next);

	} catch (err) {
		console.log(err);
	}

	return response;
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	// AccessToken payload is in req.user.payload, especially its `id` field
	// UserId is the param in /users/:userId
	// We only allow user accessing herself, i.e. require payload.id==userId
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User.findByPk(req.params.userId)
		.then((user: User | null) => res.json(user))
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
	User.create(req.body)
		.then((user: User) => res.json(user))
		.catch(next);

export const searchNames = (req: Request, res: Response, next: NextFunction) => {
	let response: any = [];

	req.body.array.forEach((element: any) => {
		try {
			const whereClause = {
				where: { publicAddress: element },
			};

			User.findOne(whereClause)
				.then((user: any | null) => {

					if (user) {
						const data = user.dataValues;

						response.publicAddress = data.publicAddress;
						response.username = data.username;
						response.avatar = data.avatar;
						
						res.json(response);
					} else {
						res.json(null);
					}
				}).catch(next);

		} catch (err) {
			console.log(err);
		}
	});

	return response;
}

export const patch = (req: Request, res: Response, next: NextFunction) => {

	try {
		// Only allow to fetch current user
		if ((req as any).user.payload.id !== +req.params.userId) {
			return res
				.status(401)
				.send({ error: 'You can can only access yourself' });
		}
		return User.findByPk(req.params.userId)
			.then((user: User | null) => {
				if (!user) {
					return user;
				}

				const data = JSON.stringify(req.body, function (key, value) {
					if (value === '' || value === "") {
						return null;
					}

					// otherwise, leave the value unchanged
					return value;
				});

				const dataJson = JSON.parse(data);

				Object.assign(user, dataJson);
				return user.save();
			})
			.then((user: User | null) => {
				return user
					? res.json(user)
					: res.status(401).send({
						error: `User with publicAddress ${req.params.userId} is not found in database`,
					});
			})
			.catch(next);
	} catch (err) {
		console.log(err);
	}

};
