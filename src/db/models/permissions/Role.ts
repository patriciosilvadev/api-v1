import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { User, RoleUser } from '@models';

export interface IRoleProps {
    name: string;
    primary: boolean;
}

export class Role extends Model {
    public id!: number;
    public name!: string;
    public primary!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addUser!: BelongsToManyAddAssociationMixin<User, RoleUser>;
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
}

export const initRole = (db: Sequelize) => {
    Role.init(
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
            primary: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'Roles',
            sequelize: db,
        }
    );
};