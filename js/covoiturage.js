function initCovoiturage() {
  console.log("✅ Page covoiturage initialisée");

  const listSection = document.getElementById('listCovoiturage');
  const filter = document.getElementById('filter-container');
  const container = document.querySelector('.containerList');

  // === Fonction d'affichage des trajets ===
  function afficherTrajets(trajets) {
    container.innerHTML = ''; // Nettoyage avant nouvel affichage

    if (trajets.length === 0) {
      // 🔴 Aucun trajet trouvé → On masque les filtres mais on affiche le container
      filter.style.display = 'none';
      listSection.style.display = 'block'; // on garde visible pour afficher le message
      container.innerHTML = `
        <div class="no-result" style="color:#555; text-align:center; padding:20px;">
          🚫 Aucun trajet trouvé pour cette recherche.
        </div>
      `;
      return;
    }

    // ✅ Trajets trouvés → affichage complet
    listSection.style.display = 'block';
    filter.style.display = 'block';

    trajets.forEach(t => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="profile">
          <h3>${t.conducteur_pseudo || "Conducteur"}</h3>
          <img src="/assets/images/avatar.png" alt="Avatar" width="70px">
        </div>
        <p><strong>${t.depart}</strong> → <strong>${t.arrivee}</strong></p>
        <p><strong>Places :</strong> ${t.places ?? '?'}</p>
        <p><strong>Prix :</strong> ${t.prix} €</p>
        <p><strong>Date :</strong> ${new Date(t.date).toLocaleDateString()}</p>
        <p><strong>Horaire :</strong> ${t.horaire}</p>
        <p><strong>Énergie :</strong> ${t.energie}</p>
      `;
      container.appendChild(card);
    });
  }

  // === Récupère les trajets depuis l'API et filtre selon les champs ===
  function chargerTrajetsEtFiltrer() {
    fetch('http://localhost:3001/api/trajets')
      .then(res => res.json())
      .then(trajets => {
        const depart = document.getElementById('depart')?.value.trim().toLowerCase();
        const arrivee = document.getElementById('arrivee')?.value.trim().toLowerCase();
        const dateInput = document.getElementById('date')?.value;

        const filtres = trajets.filter(t => {
          const matchDepart = !depart || t.depart.toLowerCase().includes(depart);
          const matchArrivee = !arrivee || t.arrivee.toLowerCase().includes(arrivee);
          const matchDate = !dateInput || new Date(t.date).toISOString().slice(0, 10) === dateInput;

          return matchDepart && matchArrivee && matchDate;
        });

        afficherTrajets(filtres);
      })
      .catch(err => {
        console.error("❌ Erreur de fetch :", err);
        container.innerHTML = '<p style="color: red;">Erreur lors du chargement des trajets.</p>';
        listSection.style.display = 'block';
        filter.style.display = 'none';
      });
  }

  // 🔍 Bouton recherche cliqué → on lance la recherche
  document.getElementById('btn-recherche')?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("🔍 Recherche lancée !");
    chargerTrajetsEtFiltrer();
  });

  // 🔒 Au démarrage, on masque les résultats et les filtres
  listSection.style.display = 'none';
  filter.style.display = 'none';
  container.innerHTML = '';
}

window.initCovoiturage = initCovoiturage;
