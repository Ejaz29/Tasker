const express = require('express');
const taskController = require('./../controller/taskController');
const authController = require('./../controller/authController');
const router = express.Router();

//Firstly it checks whether user is logged in or not.
// If logged only then the other operations are allowed.
router.use(authController.protect);
router.get('/getTasks', taskController.getTasks);
router.post('/createTask', taskController.createTask);

module.exports = router;
