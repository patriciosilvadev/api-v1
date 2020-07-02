import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { hash } from 'bcryptjs';
import { encode } from 'jwt-simple';
import { createHashtag } from '@utils';
import { jwtSecret } from '@config';
import {
    Team,
    TeamUser,
    Task,
    TaskUser,
    Role,
    RoleUser,
    EventUser,
} from '@models';

export interface IUserProps {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    avatarUrl: string;
    superAdmin: boolean;
    hashtag?: string;
    country?: string;
    city?: string;
    phoneNumber?: string;
}
export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public firstName: string;
    public lastName: string;
    public username!: string;
    public email!: string; // for nullable fields
    public avatarUrl: string;
    public country: string;
    public city: string;
    public phoneNumber: string;
    public password: string;
    public superAdmin: boolean;
    public hashtag: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public getTeams!: BelongsToManyGetAssociationsMixin<Team>;
    public getTasks!: BelongsToManyGetAssociationsMixin<Task>;
    public getRoles!: BelongsToManyGetAssociationsMixin<Role>;

    public TeamUser: TeamUser;
    public TaskUser: TaskUser;
    public RoleUser: RoleUser;
    public EventUser: EventUser;

    getAccessToken() {
        const timestamp = new Date().getTime();
        return encode({ sub: this.id, iat: timestamp }, jwtSecret);
    }
}

export const initUser = (db: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            username: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatarUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
            superAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            hashtag: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'Users',
            sequelize: db,
        }
    );

    User.beforeCreate(async user => {
        const hashed = await hash(user.password, 10);
        user.password = hashed;
        return Promise.resolve();
    });

    User.afterCreate(async user => {
        user.hashtag = createHashtag(user.id);
        await user.save();
        return Promise.resolve();
    });
};
