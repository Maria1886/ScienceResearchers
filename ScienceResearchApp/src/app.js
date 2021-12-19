const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// config local environment if in development mode
if (process.env.NODE_ENV === "development") {
    require('dotenv').config();
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// initialize db
const User = require('./models/User');
const Author = require('./models/Author');
const UserFavAuthor = require('./models/UserFavoriteAuthor');
const sequelize = require('./config/database');
sequelize.sync();

// define routes
const documentsRouter = require('./routes/documents');
const authorsRouter = require('./routes/authors');
const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const { ensureAuthenticated, ensureNotAuthenticated } = require('./middlewares/authorizations')

app.use('/api/documents', ensureAuthenticated, documentsRouter);
app.use('/api/authors', ensureAuthenticated, authorsRouter);
app.use('/api/articles', ensureAuthenticated, articlesRouter);
app.use('/auth', ensureNotAuthenticated, authRouter);

// return 404 for every other request
app.get('/*', (req, res) => {
    res.sendStatus(404);
})

module.exports = app;
