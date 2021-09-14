import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING, BOOLEAN, TEXT } from 'sequelize';

import { User } from './models';

const sequelize = new Sequelize('nftartstation', 'root', 'root', {
	dialect: 'postgres',
	storage: path.join(os.tmpdir(), 'db.postgres'),
	logging: false,
});

// Init all models
User.init(
	{
		nonce: {
			allowNull: false,
			type: INTEGER,
			defaultValue: (): number => Math.floor(Math.random() * 10000),
		},
		publicAddress: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		name: {
			allowNull: true,
			type: STRING,
			unique: false
		},
		avatar: {
			allowNull: true,
			type: TEXT,
			unique: false
		},
		location: {
			allowNull: true,
			type: STRING,
			unique: false
		},
		bio: {
			allowNull: true,
			type: TEXT,
			unique: false
		},
		website: {
			allowNull: true,
			type: STRING,
			unique: true
		},
		instagramUrl: {
			allowNull: true,
			type: STRING,
			unique: true
		},
		facebookUrl: {
			allowNull: true,
			type: STRING,
			unique: true
		},
		youtubeUrl: {
			allowNull: true,
			type: STRING,
			unique: true
		},
		discordUrl: {
			allowNull: true,
			type: STRING,
			unique: true
		},
		twitterUrl: {
			allowNull: true,
			type: STRING,
			unique: true
		},
		email: {
			allowNull: true,
			type: STRING,
			unique: true,
		},
		username: {
			allowNull: true,
			type: STRING,
			unique: true,
		},
		artist: {
			allowNull: false,
			type: BOOLEAN,
			defaultValue: (): boolean => true,
		},
		followers: {
			allowNull: false,
			type: INTEGER,
			defaultValue: (): number => 0,
		},
		following: {
			allowNull: false,
			type: INTEGER,
			defaultValue: (): number => 0,
		},
		totalCollection: {
			allowNull: false,
			type: INTEGER,
			defaultValue: (): number => 0,
		},
		totalCreations: {
			allowNull: false,
			type: INTEGER,
			defaultValue: (): number => 0,
		},
		favorites: {
			allowNull: true,
			type: STRING,
			defaultValue: (): string => "[]",
		},
		totalFavorites: {
			allowNull: true,
			type: INTEGER,
			defaultValue: (): number => 0,
		},
	},
	{
		modelName: 'user',
		sequelize, // This bit is important
		timestamps: false,
	}
);

// Create new tables
sequelize.sync();

export { sequelize };
