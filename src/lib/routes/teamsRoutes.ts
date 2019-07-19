import { Router } from 'express';
import { body } from 'express-validator/check';
import { requireAuth } from '@middlewares';
import teamsController from '@controllers/teamsController';
import { requireValidation } from '../middlewares/requireValidation';

const teamsRoutes = Router();

teamsRoutes.post(
    '/',
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 40 })
            .withMessage('Please enter a name between 5 and 40 characters'),
        body('game')
            .trim()
            .isLength({ min: 1 }),
        body('region')
            .trim()
            .isLength({ min: 2, max: 2 }),
    ],
    requireValidation,
    requireAuth,
    teamsController.createTeams
);

export default teamsRoutes;
