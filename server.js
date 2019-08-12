const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');
const http = require('http');
const app = express();
const api = require('./routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// Spotify setup page
app.use(express.static(path.join(__dirname, '/public')));

// API location
app.use('/api', api);

// Spotify setup page
app.get('/setup', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/html/setup.html'));
});

// Redirect all requests to setup page
app.get('*', (req, res) => {
  res.redirect('/setup');
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on port ${port}`));