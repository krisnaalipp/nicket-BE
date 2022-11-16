const express = require('express');
const router = express.Router()
const matchController = require('../controllers/matchController');

router.get('/',matchController.allMatch)
router.get('/limit',matchController.oneMatch)
router.post('/',matchController.createNewMatch)
router.get('/:matchId',matchController.matchById)
router.patch('/:matchId',matchController.updateMatch)

module.exports = router