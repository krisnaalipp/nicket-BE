const express = require('express');
const router = express.Router()
const transactionController = require('../controllers/transactionController');

router.post('/input', transactionController.postTransaction )
router.post('/',transactionController.postOrder)
router.get('/',transactionController.allTransactions)
router.post('/payment',transactionController.paymentHandler)
router.get('/:transactionId',transactionController.transactionById)




module.exports = router