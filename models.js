//import mongoose, bcrypt modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Genre schema that defines the structure of a genre document in the database.
 * 
 * @typedef {Object} Genre
 * @property {String} Name - The name of the genre.
 * @property {String} Description - A description of the genre.
 */
let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: String
});

/**
 * Director schema that defines the structure of a director document in the database.
 * 
 * @typedef {Object} Director
 * @property {String} Name - The name of the director.
 * @property {String} Bio - A biography of the director.
 * @property {Date} Birth - The birth date of the director.
 */
let directorSchema = mongoose.Schema({
  Name: { type: String, required: true },
      Bio: String,
      Birth: Date
});

/**
 * Movie schema that defines the structure of a movie document in the database.
 * 
 * @typedef {Object} Movie
 * @property {String} Title - The title of the movie.
 * @property {String} Description - A description of the movie.
 * @property {ObjectId} Genre - A reference to the genre of the movie.
 * @property {ObjectId} Director - A reference to the director of the movie.
 * @property {String} ImagePath - The path to the movie's image.
 * @property {Boolean} Featured - Indicates if the movie is featured.
 */
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    Director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
    ImagePath: String,
    Featured: Boolean
  });
  
  /**
 * User schema that defines the structure of a user document in the database.
 * 
 * @typedef {Object} User
 * @property {String} Username - The username of the user.
 * @property {Date} Birthdate - The birth date of the user.
 * @property {String} Password - The hashed password of the user.
 * @property {String} Email - The email address of the user.
 * @property {Array<ObjectId>} FavoriteMovies - An array of references to the user's favorite movies.
 */
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Birthdate: Date,
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

/**
 * Hashes a password using bcrypt.
 * 
 * @function hashPassword
 * @param {String} password - The plain text password to hash.
 * @returns {String} The hashed password.
 */
  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  /**
 * Validates a password by comparing it with the hashed password stored in the database.
 * 
 * @function validatePassword
 * @param {String} password - The plain text password to validate.
 * @returns {Boolean} True if the password matches, otherwise false.
 */
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
   

  //export models
  let Director = mongoose.model('Director', directorSchema);
  let Genre = mongoose.model('Genre', genreSchema);
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);

  module.exports.Director = Director;
  module.exports.Genre = Genre;
  module.exports.Movie = Movie;
  module.exports.User = User;