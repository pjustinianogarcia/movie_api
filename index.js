//import mongoose
const mongoose = require("mongoose");
//import exported models
const Models = require("./models.js");

/**
 * Connect to the MongoDB URI using Mongoose.
 * @param {string} process.env.CONNECTION_URI - The connection string for the MongoDB database.
 */
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Models representing Movies, Users, Genres, and Directors collections.
 */
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

/**
 * Import the Express module.
 * @module express
 */
const express = require("express");
/**
 * Create an instance of the Express application.
 * @const {object} app
 */
const app = express();
/**
 * Import the Morgan logging middleware.
 * @module morgan
 */
const morgan = require("morgan");
/**
 * Import the Body-Parser middleware to parse incoming request bodies.
 * @module body-parser
 */
const bodyParser = require("body-parser");
/**
 * Import the UUID library to generate unique identifiers.
 * @module uuid
 */
const uuid = require("uuid");

/**
 * Import the Express-Validator library for request validation.
 * @module express-validator
 */
const { check, validationResult } = require("express-validator");

/**
 * Import the CORS middleware to enable Cross-Origin Resource Sharing.
 * @module cors
 */
const cors = require("cors");
let allowedOrigins = [
  "http://localhost:1234",
  "http://localhost:4200",
  "https://movie-api-3jxi.onrender.com",
  "https://myflixclientachv3.netlify.app",
  "https://pjustinianogarcia.github.io",
];

/**
 * Configure CORS to allow requests only from specified origins.
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

//parse request with json
app.use(express.json());

/**
 * Import the authentication module and initialize it with the Express app.
 * @module auth
 */
let auth = require("./auth")(app);

//import passport module
const passport = require("passport");
require("./passport");

//log http request using morgan
app.use(morgan("common"));

// static function
app.use(express.static("public"));
/**
 * Test endpoint to check if the server is running.
 * @route GET /test
 * @returns {string} - A message indicating the server status.
 */
app.get("/test", (req, res) => {
  res.send("Server is running");
});

/**
 * Welcome message route.
 * @route GET /
 * @returns {string} - A welcome message.
 */
app.get("/", (req, res) => {
  res.send("Welcome to my movie list!");
});

/**
 * Get a list of all movies.
 * @route GET /movies
 * @returns {object[]} - A list of all movies with their genres and directors populated.
 */
app.get("/movies", async (req, res) => {
  console.log("movies request");
  Movies.find()
    .populate("Genre")
    .populate("Director")
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error("Error retrieving movies:", err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * Get a movie by its title.
 * @route GET /movies/:Title
 * @param {string} Title - The title of the movie.
 * @returns {object} - The movie object matching the title.
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Movies.findOne({ Title: req.params.Title })

      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a genre by its name.
 * @route GET /genres/:Name
 * @param {string} Name - The name of the genre.
 * @returns {object} - The genre object matching the name.
 */
app.get(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Genres.findOne({ Name: req.params.Name })
      .then((genre) => {
        res.json(genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a director by their name.
 * @route GET /directors/:Name
 * @param {string} Name - The name of the director.
 * @returns {object} - The director object matching the name.
 */
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Directors.findOne({ Name: req.params.Name })
      .then((director) => {
        res.json(director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a list of all users.
 * @route GET /users
 * @returns {object[]} - A list of all users.
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get a user by their username.
 * @route GET /users/:Username
 * @param {string} Username - The username of the user.
 * @returns {object} - The user object matching the username.
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Register a new user.
 * @route POST /users
 * @param {string} Username - The username of the new user.
 * @param {string} Password - The password of the new user.
 * @param {string} Email - The email of the new user.
 * @param {string} Birthdate - The birthdate of the new user.
 * @returns {object} - The created user object.
 */
app.post(
  "/users",
  //passport.authenticate('jwt', { session: false }), async (req, res) => {
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Birthdate: req.body.Birthdate,
          Password: hashedPassword,
          Email: req.body.Email,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error creating user: " + error);
          });
      }
    });
  }
);

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//delete a movie from a user's list of favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { Username, MovieID } = req.params;

    try {
      // Find the user by username
      const user = await Users.findOneAndUpdate(
        { Username },
        { $pull: { FavoriteMovies: MovieID } },
        { new: true }
      );

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error removing movie from favorites");
    }
  }
);

//update users information
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }

    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthdate: req.body.Birthdate,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
