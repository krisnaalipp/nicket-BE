const express = require('express');
const router = express.Router()
const newsController = require('../controllers/newsController');

router.get('/',newsController.readAllNews)
router.get('/limit',newsController.readLimitedNews)
router.post('/',newsController.addNewNews)
router.get('/:newsId',newsController.getNewsById)
router.delete('/:newsId',newsController.deleteNews)



module.exports = router