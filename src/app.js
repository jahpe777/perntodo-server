require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todosRouter = require('../todos/todos-router');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(cors());

app.use('/api/todos', todosRouter);

module.exports = app;
