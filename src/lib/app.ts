import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

import { handlePermissions } from '@middlewares';

import {
    // Routes
    basicRoutes,
    userRoutes,
    jobRoutes,
    teamsRoutes,
    eventRoutes,
    taskRoutes,
    roleRoutes,
    actionRoutes,
    permissionRoutes,
    // Resolvers
    userResolver,
    teamResolver,
    eventResolver,
    taskResolver,
    roleResolver,
    actionResolver,
    permissionResolver,
} from '@routes';
import { IError, IRequest } from '@typings';
import { registerActions } from '@utils';

// Express app creation
const app = express();

// CORS configuring + parser for requests
app.use(cors());
app.use(json());

// Middleware Register
app.use(handlePermissions);

// Redirect every url beginning by auth to authRoutes
app.param('userId', userResolver)
    .param('teamId', teamResolver)
    .param('eventId', eventResolver)
    .param('taskId', taskResolver)
    .param('roleId', roleResolver)
    .param('actionId', actionResolver)
    .param('permissionId', permissionResolver);

/**
 * Routes
 */
app.use(basicRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamsRoutes);
app.use('/jobs', jobRoutes);
app.use('/teams/:teamId/events', eventRoutes);
app.use('/teams/:teamId/tasks', taskRoutes);
/**
 * Permissions
 */
app.use('/teams/:teamId/roles', roleRoutes);
app.use('/teams/:teamId/actions', actionRoutes);
app.use('/teams/:teamId/permissions', permissionRoutes);

registerActions(app);

// Healthcheck route
app.get('/', (_req, res) => {
    return res
        .status(200)
        .json({ success: 'Esport-Hatcher {API v1.0} is online' });
});

// Error handler
app.use(
    (
        error: IError,
        req: IRequest,
        res: express.Response,
        next: express.NextFunction
    ) => {
        req;
        next;
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message, data });
    }
);

export { app };
