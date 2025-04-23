// ecoride_back/models/trajetModel.js
const db = require('../db');

// Récupère tous les trajets (avec le pseudo du conducteur)
exports.getAllTrajets = (callback) => {
  const sql = `
    SELECT t.*, u.pseudo AS conducteur_pseudo
    FROM trajets t
    JOIN users u ON t.conducteur_id = u.id
  `;
  db.query(sql, callback);
};

// Ajoute un trajet en base
exports.addTrajet = (trajet, callback) => {
  const sql = `
    INSERT INTO trajets (depart, arrivee, places, prix, date, horaire, energie, conducteur_id, vehicule_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    trajet.depart,
    trajet.arrivee,
    trajet.places,
    trajet.prix,
    trajet.date,
    trajet.horaire,
    trajet.energie,
    trajet.conducteur_id,
    trajet.vehicule_id,
  ], callback);
};