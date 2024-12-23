
# Movie_API

A server-side component of "movies" web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favourite movies.

## Postman

To test the API using Postman, you need to create a user first.

1. **Open Postman** and set the URL to:  
   `https://movie-api-3jxi.onrender.com/users`

2. **Make a POST request**:
   - Go to the "Body" tab.
   - Select "raw" and set the format to "JSON".

3. **Use the following format** for the JSON body:  
   ```json
   {
     "Username": "your_username",
     "Password": "your_password",
     "Email": "your_email@email.com"
   }
## Example Response

After creating a user or logging in, you will receive a response similar to the following:

```json
{
    "user": {
        "_id": "6769a665bfe591cc1cd950f8",
        "Username": "patricia",
        "Password": "$2b$10$6D6acYXjPiOctxJBfVtZwups78fZkhREfDUCG8bIT602srs/6YKfG",
        "Email": "patricia@email.com",
        "FavoriteMovies": [],
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzY5YTY2NWJmZTU5MWNjMWNkOTUwZjgiLCJVc2VybmFtZSI6InBhdHJpY2lhIiwiUGFzc3dvcmQiOiIkMmIkMTAkNkQ2YWNZWGpQaU9jdHhKQmZWdFp3dXBzNzhmWmtoUkVmRFVDRzhiSVQ2MDJzcnMvNllLZkciLCJFbWFpbCI6InBhdHJpY2lhQGVtYWlsLmNvbSIsIkZhdm9yaXRlTW92aWVzIjpbXSwiX192IjowLCJpYXQiOjE3MzQ5NzgyMjMsImV4cCI6MTczNTU4MzAyMywic3ViIjoicGF0cmljaWEifQ.u0l3cnnK9Or9Ns_zxSsmUqcm1eWs3WZStgquJJOmvd8"
}

## Step 1: Copy the Token
- From the response of the login or user creation, locate the `token` field and copy its value.

---

## Step 2: Fetch Movies
1. **Make a GET Request**:  
   - Use the following URL:  
     `https://movie-api-3jxi.onrender.com/movies`
2. **Set Authorization**:  
   - In the **Authorization** tab, select **Bearer Token**.  
   - Paste the copied token into the provided field.
3. **Send the Request**:  
   - Execute the request to retrieve the list of movies.

---

By following these steps, you can use your token to authenticate and access the movie data.


  ## Key Features

- **Movies API**: Access movie details including description, genre, director information.
- **User Management**: Manage users and their favorite movies.
- **Authentication**: JWT-based security.
- **Swagger Documentation**: Interactive API docs.
- **Data Validation**: Ensures data integrity.

## Technologies
This application is built using the following technologies:

- **Express.js**: Node.js web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB ODM.
- **Passport.js**: Authentication middleware.
- **Swagger**: API documentation tool.
- **Cors**: Cross-Origin Resource Sharing middleware.
- **Bcrypt**: Password hashing.


## API Endpoints
Movies
- Get all movies: GET /movies
- Get a movie by title: GET /movies/:title
- Get movies by genre: GET /movies/Genre/:GenreName
- Get a director by name: GET /Director/:DirectorName

Users
- Create a user: POST /users
- Update user info: PUT /users/:Username
- Add movie to favorites: POST /users/:Username/movies/:MovieID
- Remove movie from favorites: DELETE /users/:Username/movies/:MovieID
- Delete a user: DELETE /users/:Username
