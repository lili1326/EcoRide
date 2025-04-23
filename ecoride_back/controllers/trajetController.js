// ecoride_back/controllers/trajetController.js
const trajetModel = require('../models/trajetModel');

exports.getTrajets = (req, res) => {
  trajetModel.getAllTrajets((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Récupère tous les trajets
exports.createTrajet = (req, res) => {
  trajetModel.addTrajet(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Trajet ajouté', id: result.insertId });
  });
};


 