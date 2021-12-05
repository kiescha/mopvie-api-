 
const express = require('express');  
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// API
let topMovies =[
    {
        title: 'Warcraft: The Beginning',
        director: {
            name: 'Charles Leavitt',
            birth: '1234',
            death: 'not yet'
        },
        genre: 'Sci-Fi'
    },
    {
        title: 'The Shawshank Redemption',
        director: {
            name: 'Stephen King',
            birth: '1947',
            death: 'not yet'
        },           
        genre: 'Drama'
    },
    {
        title: 'The Magic of Belle Isle',
        director: {
            name: 'Guy Thomas',     
            birth: '1999',
            death: 'not yet'
        },
        genre: 'Comedy'
    },
    {
        title: 'Dota: Dragon\'s Blood',
        director: {
            name: 'Ashley Edward Miller',        
            birth: '2000',
            death: 'not yet'
        },
        genre: 'Action'
    },
    {
        title: 'The Witcher',
        director: {
            name: 'Andrzej Sapkowski',
            birth: '2222',
            death: 'not yet'
        },
        genre:'Fantasy'
    },
];
//Get Request
app.get('/', (req, res) => {
    res.send('Welcome!')
}),
app.get('/documentation', (req, res) => {
    res.sendfile('/public/documentation.html', {root: __dirname})
}),

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
   res.status(200).json(topMovies) 
});

// Gets the data about a specific movie.
app.get('/movies/:title', (req, res) => {
   res.status(200).json(topMovies.find((movie) => {
       return movie.title === req.params.title
   }));
});


// Return data about a genre by name/title.
app.get('/genres/:genre', (req, res) => {
    res.status(200).json(topMovies.find((genre) => {
        return genre.genre === req.params.genre
    }));
});

// Return data about director.
app.get('/directors/:directorName', (req, res) => {
    res.status(200).json(topMovies.find((director) => {
        return director.director.name === req.params.directorName
    })) 
})

//Get all users
app.get('/users', (req, res) => {
    res.send('list of all users')
});

// Add new user
app.post('/users/:newUser', (req, res) => {
    res.send('Seccessful registration')
});

// Allow users to update their user information
app.put('/users/:Username', (req, res) => {
    res.send('Seccessful update')
});

// Delete the user
app.delete('/users/:deleteUser', (req, res) => {
    res.send('User seccessfully deleted!')
})

//Add new movie to list of favorite
app.post('/favorite/:movieName', (req, res) => {
    res.send('Seccessfully added new movie to list of favorite')
})  

// Delete movie from list of favorite 
app.delete('/favorite/:deleteMovie', (req, res) => {
    res.send('Seccessfully deleted movie')
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
app.listen(8080, () => {
    console.log('Kas per?!')
});


