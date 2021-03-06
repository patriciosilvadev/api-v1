import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireTeamOwnerOrAdmin = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    try {
        const { owner, team } = req;
        const teamUsers = await team.getUsers();
        const userRequest = teamUsers.find(
            userRequest => userRequest.id === owner.id
        );
        /**
         * Check if the userRequest has the permission to invite someone
         */
        if (
            !userRequest ||
            (userRequest.TeamUser.role !== 'Owner' &&
                userRequest.TeamUser.role !== 'Admin') ||
            !userRequest.TeamUser.playerStatus ||
            !userRequest.TeamUser.teamStatus
        ) {
            return next(unauthorizedError());
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
