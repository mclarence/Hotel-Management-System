/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to hotel-management-system-backend!' });
});

app.get('/api/rooms', (req, res) => {
  res.send({
    rooms: [
      {
        id: 1,
        name: 'Room 1',
        description: 'Room 1 description',
      },
      {
        id: 1,
        name: 'Room 1',
        description: 'Room 1 description',
      }
    ]
  })
})

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

