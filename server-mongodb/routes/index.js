const express = require('express');
const router = express.Router()
const newsRouter = require('./news');
const userRouter = require('./admin');
const adminController = require('../controllers/adminController');


router.use('/news',newsRouter)
router.use('/admin',userRouter)

module.exports = router