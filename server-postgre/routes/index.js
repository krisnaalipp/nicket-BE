const express = require('express');
const router = express.Router()
const matchRouter = require('./match');
const transactionRouter = require('./transaction');
const seatRouter = require('./seat')

router.use('/match',matchRouter)
router.use('/order',transactionRouter)
router.use('/seat',seatRouter)

module.exports = router