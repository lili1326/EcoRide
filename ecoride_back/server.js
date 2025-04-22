const express = require('express');          // Framework pour créer le serveur/API
const mysql = require('mysql2');             // Module pour connecter à MySQL
const cors = require('cors');                // Pour autoriser les appels frontend
require('dotenv').config();                  // Pour lire le .env

const app = express();                       // On initialise Express
const PORT = process.env.PORT || 3001;       // On récupère le port depuis le .env

// On crée la connexion MySQL avec les infos .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// On tente de se connecter à MySQL
db.connect((err) => {
  if (err) {
    console.error(" Erreur de connexion :", err.message);
  } else {
    console.log(" Connecté à MySQL !");
  }
});

app.use(cors());                // Autorise les requêtes depuis le frontend
app.use(express.json());        // Autorise les données JSON dans les requêtes

// Route test
app.get('/api', (req, res) => {
  res.send("Hello depuis EcoRide backend ");
});

// === API POST /api/vehicules ===
app.post('/api/vehicules', (req, res) => {
  const { user_id, marque, modele, energie, plaque, date_immat, couleur, places, type } = req.body;

  const sql = `
    INSERT INTO vehicules (user_id, marque, modele, energie, plaque, date_immat, couleur, places, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, marque, modele, energie, plaque, date_immat, couleur, places, type], (err, result) => {
    if (err) {
      console.error(" Erreur ajout véhicule :", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: " Véhicule ajouté", vehicule_id: result.insertId });
  });
});


// Lancement du serveur
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});


//Crée une route pour ajouter un trajet (POST /api/trajets)

app.post('/api/trajets', (req, res) => {
  const { depart, arrivee, places, prix, date, horaire, energie, conducteur_id, vehicule_id } = req.body;

  const sql = `
    INSERT INTO trajets (depart, arrivee, places, prix, date, horaire, energie, conducteur_id, vehicule_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [depart, arrivee, places, prix, date, horaire, energie, conducteur_id, vehicule_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Trajet ajouté', id: result.insertId });
  });
});

// Crée une route pour récupérer les trajets (GET /api/trajets)
app.get('/api/trajets', (req, res) => {
  const sql = `
   SELECT 
  t.*, 
  u.pseudo AS conducteur_pseudo
FROM trajets t
JOIN users u ON t.conducteur_id = u.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur dans /api/trajets :", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
