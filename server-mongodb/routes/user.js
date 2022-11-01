const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController');

router.get('/',userController.readAllUser)
router.post('/',userController.addNewUser)
router.get('/:userId',userController.getUserById)
router.delete('/:userId',userController.deleteUser)


module.exports=router