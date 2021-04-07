require('dotenv').config();
const express = require('express');
const server = express();
const morgan = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const { PORT = 5000 } = process.env;
const client = require('./backend/db/client');

client.connect();

server.use(cors());
// logging middleware

server.use(morgan('dev'));
// parsing middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// Serve Docs
const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));

// server.use((req, res, next) => {
// 	res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Router: /api
server.use('/api', require('./backend/api'));

//These commented out lines on 26 - 28 are causing a redirect which will be very annoying. You all can delete these
server.get('/', (req, res) => {
  res.redirect('/docs');
});

// 404 handler
server.use('*', (req, res, next) => {
  res.status(404);
  res.send({ error: 'Route not found' });
});


// old stuff:
// server.get('*', (req, res) => {
//   res.status(404).send({
//     error: '404 - Not Found',
//     message: 'No route found for the requested URL',
//   });
// });

// error handling middleware
server.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if (res.statusCode < 400) res.status(500);
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
    table: error.table,
  });
});
server.listen(PORT, () => {
  console.log(
    chalk.blueBright('Server is listening on PORT:'),
    chalk.yellow(PORT),
    chalk.blueBright('Get your routine on!')
  );
});
