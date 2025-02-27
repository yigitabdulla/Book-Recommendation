// routes/bookRoutes.js
const express = require('express');
const { addRecommendation, removeRecommendation, getRecommendation } = require('../controllers/recommendationController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-recommendation', verifyToken, addRecommendation);
router.delete('/remove-recommendation', verifyToken, removeRecommendation);
router.get('/get-recommendations/:userId', verifyToken, getRecommendation);

module.exports = router;
