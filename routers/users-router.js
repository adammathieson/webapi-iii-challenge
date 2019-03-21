express = require('express');

const db = require('../data/helpers/userDb.js');

const router = express.Router();

//Get
router.get('/', (req, res) => {
    db
        .get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ error: 'The users information could not be retrieved.' })
        });
});

//Get(user)
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
        .getById(id)
        .then(user => {
            if(!user) {
                return res.status(404).json({ message: 'The user with the specified ID does not exist.' })
            }
            res.status(202).json(user)
        })
        .catch(err => {
            res.status(500).json({ error: 'The user could not be retrieved.'})
        });
});

//Get(user-posts)
router.get('/posts/:userId', (req, res) => {
    const userId = req.params.userId;
    db  
        .getUserPosts(userId)
        .then(posts => {
            if(posts === 0) {
                return res.status(404).json({ message: 'The user with specified ID does not have any posts.' })
            }
            res.status(202).json(posts)
        })
        .catch(err => {
            res.status(500).json({ error: 'The post could not be retrieved.' })
        });
});

//Post
router.post('/', (req, res) => {
    const { name } = req.body;
    if(!name) {
        return res.status(400).json({ errorMessage: 'Please provide an id and name for new user.' })
    }
    db
        .insert({ name })
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({ error: 'The was an error while saving the user to the database.' })
        });
});


//Delete
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db
        .remove(id)
        .then(user => {
            if(user === 0) {
                return res.status(404).json({ errorMessage: 'The user with specified ID does not exist.' })
            }
            res.status(202).json({ success: `User ${id} successfully removed from database.` })
        })
        .catch(err => {
            res.status(500).json({ error: 'The user could not be removed from database.' })
        });
});

//Update{
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    db
        .update(id, { name })
        .then(user => {
            if(user === 0) {
                return res.status(404).json({ errorMessage: 'There is no user by that ID.' })
            }
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({ error: 'The user could not be modified.' })
        });
});


module.exports = router;