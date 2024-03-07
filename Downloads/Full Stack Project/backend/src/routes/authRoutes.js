const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.get('/posts', authMiddleware, authController.getPosts);
router.post('/login', authController.login);
module.exports = router;
