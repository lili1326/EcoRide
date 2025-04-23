// ecoride_back/routes/trajetRoutes.js
const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');

// Routes GET et POST
router.get('/trajets', trajetController.getTrajets);
router.post('/trajets', trajetController.createTrajet);

module.exports = router;