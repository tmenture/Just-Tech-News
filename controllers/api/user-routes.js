const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// Get route api/users
router.get('/', (req, res) => {
    // Access our user model and run .findAll() method
    User.findAll({
        attributes: { 
            exclude: ['password'] 
        }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get route /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
            },  
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Post route /api/users
router.post('/', (req, res) => {
    // Expects {username: , email: , password:  }
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Post route for login authentification
router.post('/login', (req, res) => {
    // Expects {email: , password: }
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then (dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address' });
            return;
        }

        // Verifys password
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password' });
            return;
        }
        res.json({ user: dbUserData, message: 'You are now logged in' });
    });
});

// Put route /api/users/1
router.put('/:id', (req, res) => {
    // Expects {username: , email: , password:  }
    // If req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404),json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete route /api/user/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;