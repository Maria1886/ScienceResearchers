const express = require('express');
const router = express.Router();

const mendeley = require('../modules/mendeleyClient');

const Author = require('../models/Author')
const User  = require('../models/User')

router.get('/favorites', async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: [],
            where: {
                id: req.userId
            },
            include: {
                model: Author, 
                attributes: ['id', 'first_name', 'last_name']
            }
        })
        return res.json(user.authors)
    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }
})

router.post('/favorites', async (req, res) => {
    // get author id (our db) from query
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

router.delete('/favorites', async (req, res) => {
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

        user.removeAuthor(author);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
})

router.get('/:author_id', async (req, res) => {
    // get author param id (our db)
    const authorId = parseInt(req.params.author_id);

    if (!authorId || isNaN(authorId)) return res.sendStatus(400);

    try {
        let author = await Author.findOne({
            where: {
                id: authorId
            },
            include: User
        })

        if (!author) return res.sendStatus(404);

        mendeleyResult = await mendeley.SearchAuthorProfileById(author.dataValues.profile_id);
        delete mendeleyResult.first_name;
        delete mendeleyResult.last_name;
        delete mendeleyResult.verified;
        delete mendeleyResult.user_type;
        delete mendeleyResult.created;
        mendeleyResult.displayName = mendeleyResult.display_name;
        delete mendeleyResult.display_name;
        mendeleyResult.academicStatus = mendeleyResult.academic_status;
        delete mendeleyResult.academic_status;
        mendeleyResult.disciplines = mendeleyResult.disciplines.map(dis => dis.name);
        mendeleyResult.photo = mendeleyResult.photos[mendeleyResult.photos.length - 1].url;
        delete mendeleyResult.photos;
        mendeleyResult.id = author.dataValues.id
        mendeleyResult.addedToFav = false;

        for (let fav of author.dataValues.users) {
            if (fav.dataValues.id === req.userId) {
                mendeleyResult.addedToFav = true;
                break;
            }
        }

        res.json(mendeleyResult);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
})


module.exports = router;
