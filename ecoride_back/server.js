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

// Lancement du serveur
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
