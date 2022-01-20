const express = require('express');
const router = express.Router();

const mendeley = require('../modules/mendeleyClient');
const Author = require('../models/Author');
const User = require("../models/User")

async function GetDbAuthors(catalogs) {
    let scopus_ids = []

    for (let i = 0; i < catalogs.length; ++i) {
        if (!catalogs[i].authors) continue;

        scopus_ids.push(...catalogs[i].authors.filter(aut => aut.scopus_author_id !== undefined).map(aut => aut.scopus_author_id));
    }

    return await Author.findAll({
        attributes: ['id', 'scopus_id'],
        where: {
            scopus_id: scopus_ids
        },
        include: {model: User, attributes: ['id']}
    })
}

router.post('/search', async (req, res) => {
    const keywords = req.body.keywords;
    if (!keywords) return res.sendStatus(400);

    try {
        let catalogs = await mendeley.SearchCatalogs(keywords);

        let allAuthors = await GetDbAuthors(catalogs);

        for (let i = 0; i < catalogs.length; ++i) {
            if (!catalogs[i].authors) continue;

            for (let j = 0; j < catalogs[i].authors.length; ++j) {
                delete catalogs[i].identifiers;
                delete catalogs[i].keywords;
                if (!catalogs[i].authors[j].scopus_author_id) {
                    catalogs[i].authors[j].id = null;
                    catalogs[i].authors[j].addedToFav = false;
                    continue;
                }

                let existingAuthor = allAuthors.find(aut => aut.dataValues.scopus_id === catalogs[i].authors[j].scopus_author_id);

                if (existingAuthor) {
                    catalogs[i].authors[j].id = existingAuthor.dataValues.id;
                    catalogs[i].authors[j].addedToFav = false;
                    for (let fav of existingAuthor.dataValues.users) {
                        if (fav.dataValues.id === req.userId) {
                            catalogs[i].authors[j].addedToFav = true;
                            break;
                        }
                    }
                } else {
                    const authorProfile = await mendeley.SearchAuthorProfileByScopusId(catalogs[i].authors[j].scopus_author_id);
                    if (authorProfile.length == 0) {
                        catalogs[i].authors[j].id = null;
                        catalogs[i].authors[j].addedToFav = false;
                        continue;
                    }
                    let author;
                    try {
                        author = await Author.create({
                            scopus_id: catalogs[i].authors[j].scopus_author_id,
                            profile_id: authorProfile[0].id,
                            first_name: authorProfile[0].first_name,
                            last_name: authorProfile[0].last_name
                        })
                        author.dataValues.users = [];
                    } catch (error) {
                        if (error.name === "SequelizeUniqueConstraintError")
                            continue;
                        throw error;
                    }
                    allAuthors.push(author);
                    catalogs[i].authors[j].id = author.dataValues.id;
                    catalogs[i].authors[j].addedToFav = false;
                }
            }
        }

        return res.json(catalogs);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.get('/authored_by', async (req, res) => {
    // get author id (our db) from query
    const authorId = req.query.author_id;
    if (!authorId) return res.sendStatus(400);

    try {
        const currentAuthor = await Author.findOne({
            where: {
                id: authorId
            }
        })

        if (!currentAuthor) return res.sendStatus(404);

        const catalogs = await mendeley.GetArticlesAuthoredById(currentAuthor.dataValues.profile_id);

        const allAuthors = await GetDbAuthors(catalogs);

        for (let i = 0; i < Math.min(catalogs.length, 25); ++i) {
            if (!catalogs[i].authors) continue;
            for (let j = 0; j < catalogs[i].authors.length; ++j) {
                delete catalogs[i].identifiers;
                delete catalogs[i].keywords;
                delete catalogs[i].abstract;
                catalogs[i].authors[j].standOut = false;

                if (!catalogs[i].authors[j].scopus_author_id) {
                    catalogs[i].authors[j].id = null;
                    catalogs[i].authors[j].addedToFav = false;
                    continue;
                }

                let existingAuthor = allAuthors.find(aut => aut.dataValues.scopus_id === catalogs[i].authors[j].scopus_author_id);

                if (existingAuthor) {
                    catalogs[i].authors[j].id = existingAuthor.dataValues.id;
                    catalogs[i].authors[j].addedToFav = false;
                        for (let fav of existingAuthor.dataValues.users) {
                            if (fav.dataValues.id === req.userId) {
                                catalogs[i].authors[j].addedToFav = true;
                                break;
                            }
                        }
                    if (currentAuthor.dataValues.id === existingAuthor.dataValues.id){
                        catalogs[i].authors[j].standOut = true;
                    }
                } else {
                    catalogs[i].authors[j].id = null;
                    catalogs[i].authors[j].addedToFav = false;
                    const authorProfile = await mendeley.SearchAuthorProfileByScopusId(catalogs[i].authors[j].scopus_author_id);
                    if (authorProfile.length == 0) {
                        continue;
                    }
                    let author;
                    try {
                        author = await Author.create({
                            scopus_id: catalogs[i].authors[j].scopus_author_id,
                            profile_id: authorProfile[0].id,
                            first_name: authorProfile[0].first_name,
                            last_name: authorProfile[0].last_name
                        })
                        author.dataValues.users = [];
                    } catch (error) {
                        if (error.name === "SequelizeUniqueConstraintError")
                            continue;
                        throw error;
                    }
                    allAuthors.push(author);
                    catalogs[i].authors[j].id = author.dataValues.id;
                    catalogs[i].authors[j].addedToFav = false;
                }
            }
        }
        res.json(catalogs);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
