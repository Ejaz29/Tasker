const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.use(authController.protect);
router.get('/', userController.getUser);
router.patch('/me/updateUser', userController.updateUser);
router.patch('/me/updateUser/updateTasks', userController.updateUserTasks);

module.exports = router;
