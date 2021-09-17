import { Model } from 'sequelize';

export class Invite extends Model {
	public id!: number;
	public inviteCode!: string;
	public createdDate!: string;
    public active!: string;
	public userId?: number;
	public username?: string;
}
