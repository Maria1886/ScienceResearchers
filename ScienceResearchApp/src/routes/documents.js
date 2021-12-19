const express = require('express');
const router = express.Router();

const mendeley = require('../modules/mendeleyClient');

router.get('/types', async (req, res) => {
    try {
        // get all document types from mendeley
        const result = await mendeley.ListDocumentTypes();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
