const express = require('express');
const router = express.Router()
const newsRouter = require('./news');
const userRouter = require('./user');

router.use('/news',newsRouter)
router.use('/user',userRouter)

module.exports = router