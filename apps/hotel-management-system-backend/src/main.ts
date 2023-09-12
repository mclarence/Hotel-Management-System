/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';


const app = express();

const usersRouter = require('./resources/UsersRoute');
const roomsRouter = require('./resources/RoomsRoute');

app.use(express.json())
app.use("/api/users", usersRouter);
app.use("/api/rooms", roomsRouter);
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to hotel-management-system-backend!' });
});


app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, 'assets')});
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

