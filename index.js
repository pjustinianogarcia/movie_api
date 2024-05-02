const mongoose = require('mongoose');
const Models = require('./models.js');

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// import express module to file
const express = require('express');
//import morgan
const morgan = require('morgan');
//import body-parser
const bodyParser = require('body-parser');
//import uuid
const uuid = require('uuid');
// variable to route your HTTP requests and responses
const app = express();
app.use(express.json());

//const router = express.Router();
//app.use(router);

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');





app.use(morgan('common'));

// static function
app.use(express.static('public'));




// GET requests

app.get('/', (req, res) => {
    res.send('Welcome to my movie list!');
});

// get movies
app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//get movie title
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//get movie by genres
app.get("/genres/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Genres.findOne({Name: req.params.Name})
      .then((genre) => {
        res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });

    //get director name
app.get("/directors/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
    Directors.findOne({Name: req.params.Name})
    .then((director) => {
    res.json(director);
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
    });
    });


//add user
app.post("/users", passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users.create({
                        Username: req.body.Username,
                        Birthdate: req.body.Birthdate,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        
                    })
                    .then((user) => { 
                        res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error creating user: ' + error);
                    })
            }
        })
});


// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) 
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Username, MovieID } = req.params;

    try {
        // Find the user by username
        const user = await Users.findOneAndUpdate(
            { Username },
            { $pull: { FavoriteMovies: MovieID } },
            { new: true }
        );

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing movie from favorites');
    }
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    // CONDITION ENDS
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate
        }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        })
});


// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
})


//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
}); 