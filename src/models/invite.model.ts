import { Model } from 'sequelize';
import { User } from './user.model';

export class Invite extends Model {
	public id!: number;
	public inviteCode!: number;
	public createdDate!: string;
    public active!: string;
	public userId?: number;
	public userName?: string;
}
