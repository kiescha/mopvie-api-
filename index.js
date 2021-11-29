 
const express = require('express');  
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// API
let topMovies =[
    {
        title: 'Warcraft: The Beginning',
        author: {
            name: 'Charles Leavitt and Duncan Jones',
            birth: '1234',
            death: 'not yet'
        },
        genre: 'Sci-Fi'
    },
    {
        title: 'The Shawshank Redemption',
        author: {
            name: 'Stephen King',
            birth: '1947',
            death: 'not yet'
        },           
        genre: 'Drama'
    },
    {
        title: 'The Magic of Belle Isle',
        author: {
            name: 'Guy Thomas, Rob Reiner, Andrew Scheinman',     
            birth: '1999',
            death: 'not yet'
        },
        genre: ['Comedy', 'Drama']
    },
    {
        title: 'Dota: Dragon\'s Blood',
        author: {
            name: 'Ashley Edward Miller',        
            birth: '2000',
            death: 'not yet'
        },
        genre: ['Action', 'Sci-Fi', 'Fantasy']
    },
    {
        title: 'The Witcher',
        author: {
            name: 'Andrzej Sapkowski',
            birth: '2222',
            death: 'not yet'
        },
        genre: ['Drama', 'Fantasy', 'Adventure']
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
   res.json(topMovies) 
});

// Gets the data about a specific movie.
app.get('/movies/:title', (req, res) => {
   res.json(topMovies.find((movie) => {
       return movie.title ===req.params.title
   }));
});


// Return data about a genre by name/title.
app.get('/genres/:Name', (req, res) => {
    res.json(topMovies.find((genres) => {
        return genres.genre === req.params.genre
    }))
    })



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


