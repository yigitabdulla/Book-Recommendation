// routes/bookRoutes.js
const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/bookController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-favorite', verifyToken, addFavorite);
router.delete('/remove-favorite', verifyToken, removeFavorite);
router.get('/favorites/:userId', verifyToken, getFavorites);

module.exports = router;
