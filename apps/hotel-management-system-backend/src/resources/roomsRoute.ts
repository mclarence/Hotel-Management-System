import { getRooms, getRoomById, createRoom, deleteRoom } from "../database/rooms";
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    // return the list of rooms
    getRooms.then(rooms => {
        res.send(rooms);
    }).catch(err => {
        res.sendStatus(500);
    })
});

router.get('/:roomId', (req, res) => {
    // return a single room by roomId
    const roomId = parseInt(req.params.roomId);
    getRoomById(roomId).then(room => {
        res.send(room);
    }).catch(err => {
        res.sendStatus(404);
    })
});

router.post('/', (req, res) => {
    // create a new room
    const room = req.body;
    createRoom(room).then(newRoom => {
        res.send(newRoom);
    }).catch(err => {
        res.sendStatus(500);
    })
})


router.delete('/:roomId', (req, res) => {
    // delete a room by roomId
    const roomId = parseInt(req.params.roomId);
    deleteRoom(roomId).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(404);
    })
})

export default router;