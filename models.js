const mongoose = require('mongoose');

let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: String
});


let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    Director: {
      Name: String,
      Bio: String,
      Birth: Date
    },
    ImagePath: String,
    Featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });
  
  let Genre = mongoose.model('Genre', genreSchema);
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Genre = Genre;
  module.exports.Movie = Movie;
  module.exports.User = User;