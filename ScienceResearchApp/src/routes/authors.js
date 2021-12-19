const express = require('express');
const router = express.Router();

const mendeley = require('../modules/mendeleyClient');

const Author = require('../models/Author')
const User  = require('../models/User')

router.get('/search', async (req, res) => {
    // get author email or profile id from query
    const email = req.query.author_email;
    const id = req.query.author_profile_id;

    if (!id && !email) return res.sendStatus(400);

    try {
        // search author in mendeley based on the type of input
        let mendeleyResult;
        if (email) {
            mendeleyResult = await mendeley.SearchAuthorByEmail(email);
            mendeleyResult = mendeleyResult.length > 0 ? mendeleyResult[0] : null;
        } else {
            mendeleyResult = await mendeley.SearchAuthorById(id);
        }

        // insert author in our db if any
        if (mendeleyResult){
            var existing = await Author.findOne({
                where: {
                    profile_id: mendeleyResult.id
                }
            })
            // insert only if author doesn't exist in db
            if (!existing){
                await Author.create({
                    profile_id: mendeleyResult.id,
                    first_name: mendeleyResult.first_name,
                    last_name: mendeleyResult.last_name
                })
            }
        }

        res.json(mendeleyResult);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post('/favorite', async (req, res) => {
    // get author profile id from query
    const author_id = req.query.author_id;
    if (!author_id) return res.sendStatus(400);

    try {
        // search author in db
        const author = await Author.findOne({
            where: {
                id: author_id
            }
        })
        if (!author) return res.sendStatus(404);

        // get current user from db
        const user = await User.findOne({
            where: {
                id: req.userId
            }
        })
        if (!user) return res.sendStatus(404);

        // associate author with this user
        await user.addAuthor(author);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.get('/list_favorites', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.userId
            }, 
            include: Author
        })
        return res.json(user.authors)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

module.exports = router;
