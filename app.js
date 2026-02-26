const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use('/', require('./routes/authRoutes'));

module.exports = app;