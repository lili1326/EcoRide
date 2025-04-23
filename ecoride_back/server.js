// Importe Express pour créer le serveur
const express = require('express');

// CORS permet à ton frontend d'accéder à ton backend même s'ils ne sont pas sur le même port
const cors = require('cors');

// Charge les variables d’environnement depuis le fichier .env
require('dotenv').config();

// Importe les routes des trajets depuis le dossier routes
const trajetRoutes = require('./routes/trajetRoutes');

// Initialise l'application Express
const app = express();

// Définit le port (soit via .env, soit par défaut 3001)
const PORT = process.env.PORT || 3001;

// Active CORS pour autoriser les requêtes entre serveurs (front ↔ back)
app.use(cors());

// Autorise le serveur à comprendre les requêtes JSON
app.use(express.json());

// Test route pour voir si le backend tourne
app.get('/api', (req, res) => res.send("Hello depuis EcoRide backend"));

// Routes MVC Utilise les routes de l’application (trajets ici), préfixées par /api
app.use('/api', trajetRoutes);

// Lance le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});