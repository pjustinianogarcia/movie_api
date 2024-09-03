// This module handles user authentication using JWT (JSON Web Token).
const jwtSecret = "your_jwt_secret";
//import modules
const jwt = require("jsonwebtoken"),
  passport = require("passport");
require("./passport");

/**
 * Generates a JWT token for a user.
 *
 * @function generateJWTToken
 * @param {Object} user - The user object for which the token is generated.
 * @returns {string} The generated JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

/**
 * POST login route. Authenticates a user and generates a JWT token upon successful login.
 *
 * @param {Object} router - The Express router object.
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
