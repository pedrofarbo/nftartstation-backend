import { Model } from 'sequelize';

export class ArtistForm extends Model {
	public id!: number;
	public userId!: number;
	public invitedBy?: string;
	public inviteId!: number;
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
	public approvalDate?: Date;
	public userApproval?: string;
}
