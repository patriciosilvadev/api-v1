import { Response, NextFunction } from 'express';
import * as jwt from 'jwt-simple';
import * as keys from '@config/keys';
import requestType from '@typings/general/IRequest';
import userFactory from '@factories/userFactory';

const tokenForUser = (user: any) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
};

export const register = async (
  req: requestType,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userFactory.create(req.body);
    return res.status(201).json({ token: tokenForUser(user) });
  } catch (err) {
    return next(err);
  }
};

export const getUserInfo = async (req: requestType, res: Response) => {
  return res.status(200).json({ name: req.user.username });
};
