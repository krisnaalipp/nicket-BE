const express = require('express');
const router = express.Router()

const Controller = require('../controllers/transactionController')

router.get('/',Controller.readAllTransaction)
router.post('/',Controller.createTransaction)
router.get('/:transactionId',Controller.transactionById)
router.patch('/:transactionId',Controller.updateTransaction)




module.exports = router