const express = require('express');
const router = express.Router();

const mendeley = require('../modules/mendeleyClient');
const Author = require('../models/Author');

router.get('/authored_by', async (req, res) => {
    // get author email from query
    const email = req.query.author_email;
    if (!email) return res.sendStatus(400);

    try {
        // search author in mendeley
        const authors = await mendeley.SearchAuthorByEmail(email);
        if (authors.length == 0) return res.sendStatus(404);

        // search for articles that belong to this author's profile id
        const articles = await mendeley.GetArticlesAuthoredById(authors[0].id);

        res.json(articles);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/favorite_author', async (req, res) => {
    // get author id (our db) from from query
    const author_id = req.query.author_id;
    if (!author_id) return res.sendStatus(400)

    try {
        // get author from db
        const author = await Author.findOne({
            where: {
                id: author_id
            }
        })
        if (!author) return res.sendStatus(404)

        // search for articles that belong to this author's profile id
        const articles = await mendeley.GetArticlesAuthoredById(author.dataValues.profile_id);

        return res.json(articles);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = router;
