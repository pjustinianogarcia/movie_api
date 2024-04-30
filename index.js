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

app.use(morgan('common'));

// static function
app.use(express.static('public'));


// GET requests

app.get('/', (req, res) => {
    res.send('Welcome to my movie list!');
});

// get movies
app.get("/movies", (req, res) => {
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
app.get("/movies/:Title", (req, res) => {
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
app.get("/genres/:Name", async (req, res) => {
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
app.get("/directors/:Name", (req, res) => {
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
app.post("/users", async (req, res) => {
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
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


// Get all users
app.get('/users', async (req, res) => {
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
app.get('/users/:Username', async (req, res) => {
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
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
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