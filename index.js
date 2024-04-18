// import express module to file
const express = require('express');
//import morgan
const morgan = require('morgan');
// variable to route your HTTP requests and responses
const app = express();

app.use(morgan('common'));

let topMovies = [
    { title: 'Means Girls', year: 2004 },
    { title: 'What a Girl Wants', year: 2003 },
    { title: 'Clueless', year: 1995 },
    { title: 'The 10 Things I Hate About You', year: 1999 },
    { title: 'Heathers', year: 1988 },
    { title: 'Donnie Darko', year: 2001 },
    { title: 'Cruel Intentions ', year: 1999 },
    { title: 'Jennifers Body', year: 2009 },
    { title: 'John Tucker Must Die', year: 2006 },
    { title: 'Dazed and Confused', year: 1993 }
];

// static function
app.use(express.static('public'));


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie list!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//error handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});