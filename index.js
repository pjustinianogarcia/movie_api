// import express module to file
const express = require('express');
//import morgan
const morgan = require('morgan');
//import body-parser
const bodyParser = require('body-parser');
//import uuid
const uuid=require('uuid');
// variable to route your HTTP requests and responses
const app = express();

app.use(morgan('common'));

let topMovies = [
    {
        title: 'Means Girls',
        year: 2004,
        director: 'Tina Fey',
        genre: 'comedy',
        description: `Cady Heron is a hit with the Plastics, an A-list girl clique at her new school. But everything changes when she
        makes the mistake of falling for Aaron Samuels, the ex-boyfriend of alpha Plastic Regina George.`,
    },

    {
        title: 'What a Girl Wants',
        year: 2003,
        director: 'Dennie Gordon',
        genre: 'romantic comedy',
        description: `An American teenager learns that her father is a wealthy British politician running for office. Although she is
        eager to find him, she realizes it could cause a scandal and cost him the election.`,
    },

    {
        title: 'Clueless',
        year: 1995,
        director: 'Amy Heckerling',
        genre: 'comedy',
        description: `Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school's pecking scale.
        Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other.`,
    },

    {
        title: 'The 10 Things I Hate About You',
        year: 1999,
        director: 'Gil Junger',
        genre: 'romantic comedy',
        description: `A high-school boy, Cameron, cannot date Bianca until her anti-social older sister, Kat, has a boyfriend. So,
        Cameron pays a mysterious boy, Patrick, to charm Kat.`,
    },

    {
        title: 'Heathers',
        year: 1988,
        director: 'Daniel Waters',
        genre: 'comedy',
        description: `At Westerburg High where cliques rule, jocks dominate and all the popular girls are named Heather, it's going to
        take a Veronica and mysterious new kid to give teen angst a body count.`,
    },

    {
        title: 'Donnie Darko',
        year: 2001,
        director: 'Richard Kelly',
        genre: 'thriller',
        description: `After narrowly escaping a bizarre accident, a troubled teenager is plagued by visions of a man in a large rabbit
        suit who manipulates him to commit a series of crimes.`,
    },

    {
        title: 'Cruel Intentions',
        year: 1999,
        director: 'Roger Kumble',
        genre: 'drama',
        description: `Two vicious step-siblings of an elite Manhattan prep school make a wager: to deflower the new headmaster's
        daughter before the start of term.`,
    },

    {
        title: 'Jennifers Body',
        year: 2009,
        director: 'Karyn Kusama',
        genre: 'horror',
        description: `A newly-possessed high-school cheerleader turns into a succubus who specializes in killing her male classmates.
        Can her best friend put an end to the horror?`,
    },

    {
        title: 'John Tucker Must Die',
        year: 2006,
        director: 'Betty Thomas',
        genre: 'comedy',
        description: `Three ex-girlfriends of a serial cheater set up their former lover to fall for the new girl in town so they can
        watch him get his heart broken.`,
    },

    {
        title: 'Dazed and Confused',
        year: 1993,
        director: 'Richard Linklater',
        genre: 'comedy',
        description: `The adventures of high school and junior high students on the last day of school in May 1976.`,
    },
];

let directors = [
    {
        name: 'Tina Fey',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Dennie Gordon',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Amy Heckerling',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Gil Junger',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Daniel Waters',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Richard Kelly',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Roger Kumble',
        bio: 'Lorem ipsum',
    },
    {
        name: 'Karyn Kusama',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Betty Thomas',
        bio: 'Lorem ipsum',
    },

    {
        name: 'Richard Linklater',
        bio: 'Lorem ipsum',
    },

]

let genres = [

    {
        name: 'comedy',
        description: 'Lorem ipsum'
    },

    {
        name: 'horror',
        description: 'Lorem ipsum'
    },
    {
        name: 'drama',
        description: 'Lorem ipsum'
    },

    {
        name: 'romantic comedy',
        description: 'Lorem ipsum'
    },
    {
        name: 'thriller',
        description: 'Lorem ipsum'
    }

]


let users = [
    {
        id: 1,
        name: "Bella Goth",
        favoriteMovies: [],
    },

    {
        id: 2,
        name: "Don Lothario",
        favoriteMovies: [],
    },
    {
        id: 3,
        name: "Nancy Landgraab",
        favoriteMovies: [],
    },
]

// static function
app.use(express.static('public'));


// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my movie list!');
});

//GET all movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// GET the data about a movie by title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('No such movie');
    }
});


// GET genre data by name
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = genres.find(genre => genre.name === genreName);

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(404).send('No such genre');
    }
});

// GET director data by name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = directors.find(director => director.name === directorName);

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(404).send('No such director');
    }
});


//POST user favoritemovie CHECK
app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;
    const userId = parseInt(id)
    let user = users.find(user =>user.id === userId);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}\'s array`);
    } else {
        res.status(400).send('no such user')
    }
});

//POST user check
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(NewUser);
        res.status(201).json(newUser)
    } else{
        res.status(400).send('users need names')
    }

});

//PUT user check
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }

});

//DELETE USER check
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    let user = users.find(user =>user.id == id);

    if (user) {
        user = users.filter(user => user.id !== id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
});




// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});