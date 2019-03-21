const express = require('express');

const db = require('../data/helpers/postDb.js');

const router = express.Router();

// Get
router.get('/', (req, res) => {
    db
        .get()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ error: 'The posts information could not be retrieved.' });
        })
})

//Get (post)
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
        .getById(id)
        .then(post => {
            if(!post) {
                return res.status(404).json({ message: 'The post with the specified ID does not exist.' })
            }
            res.status(202).json(post)
        })
        .catch(err => {
            res.status(500).json({ error: 'The post information could not be retrieved.' })
        });
});

//Post
router.post('/', (req, res) => {
    const { user_id, text } = req.body;
    if(!user_id || !text) {
        return res.status(400).json({ errorMessage: 'Please provide user ID and text for the post.' })
    }
    db
        .insert({
            user_id,
            text
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({ error: 'There was an error while saving the post to the database.' })
        });
});

//Delete
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db
        .remove(id)
        .then(post => {
            if(post === 0) {
                return res.status(404).json({ errorMessage: 'The post with specified ID does not exist.' })
            }
            res.status(202).json({ success: `Post ${id} successfully removed.` })
        })
        .catch(err => {
            res.status(500).json({ error: 'The post could not be removed.' })
        });
});

//Update
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { user_id, text } = req.body;
    if(!user_id || !text) {
        return res.status(400).json({ message: 'Please provide a user ID and text.' })
    }
    db
        .update(id, req.body)
        .then(post => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'The post could not be modified.' })
        });
});

module.exports = router;