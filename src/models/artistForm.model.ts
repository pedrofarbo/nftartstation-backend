import { Model } from 'sequelize';

export class ArtistForm extends Model {
	public id!: number;
	public username!: string; 
	public userId!: number;
	public invitedBy?: string;
	public inviteCode!: string;
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
	public portifolio!: JSON;
	public createdDate!: Date;
	public reviewerDate?: Date;
	public reviewerUser?: string;
	public status!: string; //approved, declined, new
}
