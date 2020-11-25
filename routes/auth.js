const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const { route } = require('./admin');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

module.exports = router;