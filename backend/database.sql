 
 -- Table des utilisateurs
 
CREATE DATABASE ecoride CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecoride;

 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    role ENUM('passager', 'conducteur', 'both') DEFAULT 'passager',
    credits INT DEFAULT 20
);

 
-- Table des véhicules
 
 
CREATE TABLE vehicules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    marque VARCHAR(100),
    modele VARCHAR(100),
    energie VARCHAR(50),
    plaque VARCHAR(20),
    date_immat DATE,
    couleur VARCHAR(50),
    places INT,
    type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

 
-- Table des trajets
 
 
CREATE TABLE trajets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conducteur_id INT,
    depart VARCHAR(100),
    arrivee VARCHAR(100),
    date DATE,
    horaire VARCHAR(20),
    prix FLOAT,
    vehicule_id INT,
    energie VARCHAR(20),
    FOREIGN KEY (conducteur_id) REFERENCES users(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
);

 
--  Données utilisateurs
 

-- Données de test utilisateurs
 
INSERT INTO users (pseudo, prenom, email, password, role, credits) VALUES
('lili', 'Lila', 'lili@mail.com', '1234', 'conducteur', 50),
('tom', 'Thomas', 'tom@mail.com', 'abcd', 'passager', 20),
('alex', 'Alexandre', 'alex@mail.com', 'xyz', 'both', 40);

 
--  Données véhicules
 
--Données véhicules
 
INSERT INTO vehicules (user_id, marque, modele, energie, plaque, date_immat, couleur, places, type) VALUES
(1, 'Peugeot', '208', 'Électrique', 'AA-123-AA', '2020-03-12', 'Bleu', 4, 'Électrique'),
(3, 'Renault', 'Clio', 'Essence', 'BB-456-BB', '2019-06-20', 'Rouge', 3, 'Essence');

 
--  Données trajets
 
-- Données trajets
 
INSERT INTO trajets (conducteur_id, depart, arrivee, date, horaire, prix, vehicule_id, energie) VALUES
(1, 'Lyon', 'Grenoble', '2025-04-25', '08h00/09h30', 8.50, 1, 'Électrique'),
(3, 'Paris', 'Orléans', '2025-04-24', '13h00/15h00', 12.00, 2, 'Essence');