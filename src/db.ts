import os from 'os';
import path from 'path';
import { INTEGER, Sequelize, STRING, BOOLEAN, TEXT, JSONB, DATE } from 'sequelize';

import { User } from './models';
import { Invite } from './models/invite.model';
import { ArtistForm } from './models/artistForm.model';

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
		inviteCode: {
			allowNull: true,
			type: STRING,
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
			defaultValue: (): boolean => false,
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
			type: JSONB,
			defaultValue: (): JSON => JSON.parse('[]'),
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

ArtistForm.init(
	{
		username: {
			allowNull: false,
			type: STRING,
			unique: true,
		},
		userId: {
			allowNull: false,
			type: INTEGER,
			unique: true
		},
		invitedBy: {
			allowNull: false,
			type: STRING,
		},
		inviteCode: {
			allowNull: false,
			type: STRING,
		},
		name: {
			allowNull: false,
			type: STRING,
			unique: false
		},
		avatar: {
			allowNull: true,
			type: TEXT,
			unique: false
		},
		location: {
			allowNull: false,
			type: STRING,
			unique: false
		},
		bio: {
			allowNull: false,
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
			allowNull: false,
			type: STRING,
			unique: true,
		},
		portifolio: {
			allowNull: false,
			type: JSONB,
			defaultValue: (): JSON => JSON.parse('[]'),
		},
		createdDate: {
			allowNull: false,
			type: DATE
		},
		reviewerDate: {
			allowNull: true,
			type: DATE
		},
		reviewerUser: {
			allowNull: true,
			type: STRING
		},
		status: {
			allowNull: false,
			type: STRING,
			defaultValue: (): string => 'new',
		},
	},
	{
		modelName: 'artistForm',
		sequelize, // This bit is important
		timestamps: false,
	}
);

Invite.init({
	inviteCode: {
		unique: true,
		allowNull: false,
		type: STRING,
	},
	createdDate: {
		allowNull: false,
		type: DATE,
	},
	active: {
		allowNull: false,
		type: BOOLEAN,
		defaultValue: (): Boolean => true
	},
	userId: {
		allowNull: true,
		type: INTEGER,
	},
	username: {
		allowNull: true,
		type: STRING,
	},
},
	{
		modelName: 'invite',
		sequelize, // This bit is important
		timestamps: false,
	})

// Create new tables
sequelize.sync();

export { sequelize };
