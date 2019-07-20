import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { logRequest } from '@utils/decorators';
import Team from '@models/Team';

class TeamsController {
    @logRequest
    async createTeams(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { user } = req;
            const { game, name, region } = req.body;

            const newTeam = await Team.create({
                game,
                region,
                name,
            });
            await newTeam.addUser(user, {
                through: {
                    role: 'admin',
                    playerStatus: true,
                    teamStatus: true,
                },
            });
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findAll(
        // tslint:disable-next-line: variable-name
        req: IRequest,
        res: Response,
        next: NextFunction
    ) {
        let teams;
        try {
            if (req.query.page) {
                const { page } = req.query || 1;
                const perPage = 15;
                teams = await Team.findAll({
                    limit: perPage,
                    offset: (page - 1) * perPage,
                });
            } else {
                teams = await Team.findAll();
            }
            return res.status(200).json(teams);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findById(req: IRequest, res: Response, next: NextFunction) {
        const { teamID } = req.params;

        try {
            const team = await Team.findByPk(teamID);
            return res.status(200).json(team);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async deleteById(req: IRequest, res: Response, next: NextFunction) {
        const { teamID } = req.params;

        try {
            const team = await Team.findByPk(teamID);
            await team.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(req: IRequest, res: Response, next: NextFunction) {
        const { teamID } = req.params;
        try {
            const team = await Team.findByPk(teamID);
            team.name = req.body.username || team.name;
            team.game = req.body.avatarUrl || team.game;
            team.region = req.body.country || team.region;
            team.avatarTeamUrl = req.body.city || team.avatarTeamUrl;
            team.bannerUrl = req.body.bannerUrl || team.bannerUrl;
            await team.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export default new TeamsController();