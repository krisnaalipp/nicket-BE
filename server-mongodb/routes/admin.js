const express = require('express');
const router = express.Router()
const adminController = require('../controllers/adminController');

router.get('/',adminController.readAllUser)
router.post('/',adminController.addNewUser)
router.get('/:adminId',adminController.getUserById)
router.delete('/:adminId',adminController.deleteUser)


module.exports=router