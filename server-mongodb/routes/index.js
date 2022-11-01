const express = require('express');
const router = express.Router()
const newsRouter = require('./news');


router.use('/news',newsRouter)

module.exports = router