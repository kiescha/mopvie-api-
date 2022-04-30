 
const express = require('express');  
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const {check, validationResult} = require('express-validator');

const myFlixDB = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.PRISIJUNGIMAS, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors 
const cors = require('cors');
app.use(cors());


// Authentication and authorization
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');



//Get Request
app.get('/', (req, res) => {
    res.send('Welcome!')
}),
app.get('/documentation', (req, res) => {
    res.sendfile('/public/documentation.html', {root: __dirname})
}),

// Return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  myFlixDB.find()
  .then((movies)=>{
      res.status(201).json(movies);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
});

// Gets the data about a specific movie.
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    myFlixDB.findOne({Title: req.params.title})
    .then((movie)=>{
        res.json(movie);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
   });


// Get data about a genre by name/title.
app.get('/genres/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    myFlixDB.findOne({'Genre.Name': req.params.genre})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

// Return data about director.
app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    myFlixDB.findOne({'Director.Name': req.params.directorName})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
})

//Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error' + error);
        });
});

// Find specific user by his Username 
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ userName: req.params.Username})
    .then((user) => {
        res.json(user);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + error);
    });
})

// Add new user
app.post('/users', [
    check('userName', 'userName is required').isLength({min: 3}),
    check('userName', 'userName contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid.').isEmail()
], (req, res) => {
    //Validation errors
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + ' Already exists');
      } else {
        Users.create({
            userName: req.body.userName,
            password: hashedPassword,
            email: req.body.email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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

// Allow users to update their user information
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.password);
   Users.findOneAndUpdate({ userName: req.params.Username}, {$set:
    {
        userName: req.body.userName,
        password: hashedPassword,
        email: req.body.email,
        Birthday: req.body.Birthday
    }
},
{ new: true},
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error' + err);
    } else {
        res.json(updatedUser);
    }
    });
});

// Delete the user
app.delete('/users/:deleteUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ userName: req.params.deleteUser})
    .then((user) =>{
        if (!user) {
            res.status(400).send(req.params.userName + ' was not found');
        } else {
            res.status(200).send(req.params.userName + ' was deleted');
        }
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

//Add new movie to list of favorite
app.post('/users/:userName/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({userName: req.params.userName}, {
        $push: {FavoriteMovies: req.params.title}
    },
    { new: true},
   (err, updatedUser) => {
       if (err) {
           console.error(err);
           res.status(500).send('Error' + err);
       } else {
           res.json(updatedUser);
       }
   });
});

// Delete movie from list of favorite 
app.delete('/users/:userName/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({userName: req.params.userName}, {
        $pull: {FavoriteMovies: req.params.title}
    },
    { new: true},
   (err, updatedUser) => {
       if (err) {
           console.error(err);
           res.status(500).send('Error' + err);
       } else {
           res.json(updatedUser);
       }
   });
});


//Morgan Logger
app.use(morgan('common'));
app.get('/secreturl', (req, res) =>{
    res.send('This is top SECRET content!')
});

// Error handler
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send('UPS! you did it Again!');
})

// App listener
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Kas per?!' + port)
});


