require('dotenv').config();

import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';

import authMiddleware from './middlewares/auth';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const connectionString = process.env.ATLAS_URI || '';
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('toJSON', {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
  },
});

app.post('/api/users/register', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

app.get('/api/boards', authMiddleware, boardsController.getBoards);

app.get('/', (req, res) => {
  res.send('API is UP');
});

io.on('connection', () => {
  console.log('socket connect');
});

mongoose.connect(connectionString).then(() => {
  console.log('connected to mongodb');
  httpServer.listen(port, () => {
    console.log(`API is listening on port ${ port }`);
  });
});


console.log('server');