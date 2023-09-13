import express from 'express';
import { getUsers, getUserById, createUser, deleteUser } from '../database/Users';
const router = express.Router();

router.get('/', (req, res) => {
    // return the list of users
    getUsers.then(users => {
        res.send(users);
    }).catch(err => {
        res.sendStatus(500);
    })
});

router.get('/:userId', (req, res) => {
    // return a single user by userId
    const userId = parseInt(req.params.userId);
    getUserById(userId).then(user => {
        res.send(user);
    }).catch(err => {
        res.sendStatus(404);
    })
});

router.post('/', (req, res) => {
    // create a new user
    const user = req.body;
    createUser(user).then(newUser => {
        res.send(newUser);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.delete('/:userId', (req, res) => {
    // delete a user by userId
    const userId = parseInt(req.params.userId);
    deleteUser(userId).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(404);
    })
})

module.exports = router;