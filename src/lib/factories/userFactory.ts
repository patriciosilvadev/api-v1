import User from '@models/User';
import { checkIfEmail, checkIfMinAndMax } from '@utils/validators';
import IUserFactory from '@typings/user/IUserFactory';
import IUser from '@typings/user/IUser';

class UserFactory implements IUserFactory {
    async create(data: IUser) {
        try {
            if (
                !checkIfEmail(data.email) ||
                !checkIfMinAndMax(data.password, { min: 5, max: 20 })
            ) {
                return Promise.reject({
                    statusCode: 422,
                    message: "Validation doesn't pass",
                });
            }
            const user = await User.findOne({
                where: { email: data.email },
            });
            if (user) {
                return Promise.reject({
                    statusCode: 409,
                    message: 'User already exist',
                });
            }
            const newUser = await User.create({
                email: data.email,
                username: data.username,
                password: data.password,
                superAdmin: data.superAdmin,
            });
            return newUser;
        } catch (err) {
            throw new Error(err);
        }
    }
}

export default new UserFactory();
