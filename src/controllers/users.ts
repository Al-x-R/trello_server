import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import { UserDocument } from '../types/user.interface';

const normalizeUser = (user: UserDocument) => {
  const secret = process.env.TOKEN_SECRET as string;
  const token = jwt.sign({ id: user.id, email: user.email }, secret);

  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token: `Bearer ${ token }`,
  };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const savedUser = await newUser.save();

    res.send(normalizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);

      return res.status(422).json(messages);
    }
    next(err);
  }
};