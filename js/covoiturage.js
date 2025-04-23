function initCovoiturage() {
  console.log("🚗 Page covoiturage chargée");

  const listSection = document.getElementById('listCovoiturage');
  const filter = document.getElementById('filter-container');
  const container = document.querySelector('.containerList');
  const messageDiv = document.getElementById('messageTrajet');

  // 🔧 Convertit JJ/MM/AAAA vers AAAA-MM-DD (optionnel selon input type)
  function convertirEnISO(dateFr) {
    const [jour, mois, annee] = dateFr.split('/');
    return `${annee}-${mois.padStart(2, '0')}-${jour.padStart(2, '0')}`;
  }

  // 🔍 Affiche les trajets (ou message si vide)
  function afficherTrajets(trajets) {
    container.innerHTML = ''; // On vide la liste

    if (trajets.length === 0) {
      listSection.style.display = 'none';
      filter.style.display = 'none';


    //  Affiche un message dans la div dédiée
    messageDiv.innerHTML = ' Aucun trajet trouvé.';
      return;
    }

    // ✅ Sinon on affiche les blocs trajets et filtres
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
        <p><strong>${t.depart}</strong> ----> <strong>${t.arrivee}</strong></p>
        <p><strong>Places :</strong> ${t.places ?? '?'}</p>
        <p><strong>Prix :</strong> ${t.prix} €</p>
        <p><strong>Date :</strong> ${new Date(t.date).toLocaleDateString()}</p>
        <p><strong>Horaire :</strong> ${t.horaire}</p>
        <p><strong>Énergie :</strong> ${t.energie}</p>
      `;
      container.appendChild(card);
    });
  }

  // 🔁 Récupère les trajets et applique les filtres
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
        console.error("❌ Erreur de chargement des trajets :", err);
        container.innerHTML = '<p>Erreur lors du chargement des trajets.</p>';
      });
  }

  // 🟢 Lancer la recherche au clic
  document.getElementById('btn-recherche')?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("🔍 Recherche lancée...");
    chargerTrajetsEtFiltrer();
  });

  // 🔕 NE PAS charger directement au démarrage
  // chargerTrajetsEtFiltrer(); ← on l’enlève pour ne rien afficher tant que pas de recherche
}

window.initCovoiturage = initCovoiturage;
