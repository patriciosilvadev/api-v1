import {
    Model,
    DataTypes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    Sequelize,
} from 'sequelize';
import User from '@models/User';
import TeamUser from '@models/TeamUser';

export default class Team extends Model {
    public id!: number;
    public name!: string;
    public game!: string;
    public region!: string;
    public avatarTeamUrl: string;
    public bannerUrl: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addUser!: BelongsToManyAddAssociationMixin<User, TeamUser>;
    public getUser!: BelongsToManyGetAssociationsMixin<User>;
}

export const initTeam = (db: Sequelize) => {
    Team.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            game: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatarTeamUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
            bannerUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
        },
        {
            tableName: 'Teams',
            sequelize: db,
        }
    );
};
