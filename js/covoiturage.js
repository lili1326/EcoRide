 // covoiturage.js

// Fonction d'initialisation appelée quand la page covoiturage.html est chargée
function initCovoiturage() {
  console.log("✅ initCovoiturage lancé !");

  const container = document.querySelector('.containerList');

  // Fonction qui affiche dynamiquement une liste de trajets dans des cartes HTML
  function afficherTrajets(trajets) {
    container.innerHTML = '';
    if (trajets.length === 0) {
      container.innerHTML = '<p>Aucun trajet trouvé.</p>';
      return;
    }

    trajets.forEach(t => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="profile">
          <h3>${t.conducteur_pseudo || "Conducteur"}</h3>
          <img src="/assets/images/avatar.png" alt="Avatar" width="70px">
        </div>
        <p><strong>${t.depart}</strong> ----> <strong>${t.arrivee}</strong></p>
        <p><strong>Places :</strong> ${t.places ?? '?'}</p>
        <p><strong>Prix :</strong> ${t.prix} €</p>
        <p><strong>Date :</strong> ${new Date(t.date).toLocaleDateString()}</p>
        <p><strong>Horaire :</strong> ${t.horaire}</p>
        <p><strong>Energie :</strong> ${t.energie}</p>
      `;
      container.appendChild(card);
    });
  }

  // Fonction qui récupère les trajets depuis l'API, et applique les filtres utilisateur
  function chargerTrajetsEtFiltrer() {
    fetch('http://localhost:3001/api/trajets')
      .then(res => res.json())
      .then(trajets => {
        // Récupération des champs de recherche
        const depart = document.getElementById('depart')?.value.trim().toLowerCase();
        const arrivee = document.getElementById('arrivee')?.value.trim().toLowerCase();
        const dateInput = document.getElementById('date')?.value; // ex: "2025-04-24"

        // Filtrage des trajets en fonction des champs saisis
        const filtres = trajets.filter(t => {
          const matchDepart = !depart || t.depart.toLowerCase().includes(depart);
          const matchArrivee = !arrivee || t.arrivee.toLowerCase().includes(arrivee);

          // Normalisation de la date pour comparer proprement (format yyyy-mm-dd)
          const matchDate = !dateInput || new Date(t.date).toISOString().slice(0, 10) === dateInput;

          return matchDepart && matchArrivee && matchDate;
        });

        afficherTrajets(filtres);
      })
      .catch(err => {
        console.error("❌ Erreur fetch trajets :", err);
        container.innerHTML = '<p>Erreur lors du chargement des trajets.</p>';
      });
  }

  // Chargement initial sans filtre (affiche tous les trajets)
  chargerTrajetsEtFiltrer();

  // Bouton recherche cliqué => on relance le filtrage avec les données saisies
  document.getElementById('btn-recherche')?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("🔍 Bouton recherche cliqué !");
    chargerTrajetsEtFiltrer();
  });
}

// Permet au routeur d'appeler cette fonction d'init
window.initCovoiturage = initCovoiturage;