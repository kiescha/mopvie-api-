 
const express = require('express'),    
    morgan = require('morgan');
const app = express();

// API
let topMovies =[
    {
        title: 'Warcraft: The Beginning',
        author: 'Charles Leavitt and Duncan Jones'
    },
    {
        title: 'The Shawshank Redemption',
        author: 'Stephen King'
    },
    {
        title: 'The Magic of Belle Isle',
        author: 'Guy Thomas, Rob Reiner, Andrew Scheinman'
    },
    {
        title: 'Dota: Dragon\'s Blood',
        author: 'Ashley Edward Miller'
    },
    {
        title: 'The Witcher',
        author: 'Andrzej Sapkowski'
    },
];
//Get Request
app.get('/', (req, res) => {
    res.send('Welcome!')
}),
app.get('/documentation', (req, res) => {
    res.sendfile('public/documentation.html', {root: __dirname})
}),
app.get('/movies', (req, res) => {
    res.json(topMovies);
}),

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


