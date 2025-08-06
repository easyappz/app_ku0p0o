const express = require('express');
const authController = require('@src/controllers/authController');
const photoController = require('@src/controllers/photoController');
const { authenticateToken } = require('@src/middleware/auth');

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Photo routes
router.post('/photos/upload', authenticateToken, photoController.uploadPhoto);
router.post('/photos/rate', authenticateToken, photoController.ratePhoto);
router.get('/photos', photoController.getPhotos);
router.get('/stats', authenticateToken, photoController.getUserStats);

// Basic routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
