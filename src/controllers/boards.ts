import { Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

import BoardModel from '../models/board';

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find({ userId: req.user.id });
    res.send(boards);
  } catch (err) {
    next(err);
  }
};

