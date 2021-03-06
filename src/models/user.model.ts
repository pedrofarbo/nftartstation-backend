import { Model } from 'sequelize';
import { Invite } from './invite.model';

export class User extends Model {
	public id!: number;
	public inviteCode?: string;
	public nonce!: number;
	public publicAddress!: string;
	public name?: string;
	public avatar?: string;
	public email?: string;
	public location?: string;
	public bio?: string;
	public website?: string;
	public instagramUrl?: string;
	public facebookUrl?: string;
	public youtubeUrl?: string;
	public discordUrl?: string;
	public twitterUrl?: string;
	public username?: string;
	public artist!: boolean;
	public followers!: number;
	public following!: number;
	public totalCollection!: number;
	public totalCreations!: number;
	public favorites?: string;
	public totalFavorites?: number;
}
