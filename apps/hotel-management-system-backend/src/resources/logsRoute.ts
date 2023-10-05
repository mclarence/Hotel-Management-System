import express from 'express';
import { getAllLogs, getLogsForRoom, addLog, deleteLog } from "../database/logs"; // Adjust for function

const router = express.Router();

router.get('/', (req, res) => {
    // return the list of all logs
    getAllLogs.then(logs => {
        res.send(logs);
    }).catch(() => {
        res.sendStatus(500);
    });
});

router.get('/room/:roomId', (req, res) => {
    // return logs specific to a room by roomId
    const roomId = parseInt(req.params.roomId);
    getLogsForRoom(roomId).then(logs => {
        res.send(logs);
    }).catch(() => {
        res.sendStatus(404);
    });
});

router.post('/', (req, res) => {
    // create a new log
    const log = req.body;
    addLog(log).then(newLog => {
        res.send(newLog);
    }).catch(() => {
        res.sendStatus(500);
    });
});

router.delete('/:logId', (req, res) => {
    // delete a log by logId
    const logId = parseInt(req.params.logId);
    deleteLog(logId).then(() => {
        res.sendStatus(200);
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;
