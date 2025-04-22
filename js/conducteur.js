 // conducteur.js — gestion du conducteur, ajout de véhicules et trajets

let vehiculeIndex = 0;

// === FONCTION POUR AJOUTER UN FORMULAIRE DE VÉHICULE DANS LE DOM ===
function ajouterVehicule() {
  const container = document.getElementById("vehicules-container");
  const select = document.getElementById("selectVehicule");

  const ref = prompt("Entrez une référence pour ce véhicule (ex: 'Peugeot 208') :");
  if (!ref) return;

  const idVehicule = `vehicule-${vehiculeIndex}`;
  const div = document.createElement("div");
  div.classList.add("vehicule-group");
  div.id = idVehicule;
  div.style.display = "none";

  // Création dynamique du bloc de formulaire
  div.innerHTML = `
    <input type="hidden" name="vehicule[${vehiculeIndex}][reference]" value="${ref}">
    <label>Marque: <input type="text" name="vehicule[${vehiculeIndex}][marque]" required></label>
    <label>Modèle: <input type="text" name="vehicule[${vehiculeIndex}][modele]" required></label>
    <label>Énergie utilisée: <input type="text" name="vehicule[${vehiculeIndex}][energie]" required></label>
    <label>Plaque d'immatriculation: <input type="text" name="vehicule[${vehiculeIndex}][plaque]" required></label>
    <label>Date de première immatriculation: <input type="date" name="vehicule[${vehiculeIndex}][date_immat]" required></label>
    <label>Couleur: <input type="text" name="vehicule[${vehiculeIndex}][couleur]" required></label>
    <label>Nombre de places disponibles: <input type="number" name="vehicule[${vehiculeIndex}][places]" min="1" max="9" required></label>
    <label>Type de véhicule:
      <select name="vehicule[${vehiculeIndex}][type]" required>
        <option value="" disabled selected>-- Choisir un type --</option>
        <option value="Électrique">Électrique</option>
        <option value="Hybride">Hybride</option>
        <option value="Gazoil">Gazoil</option>
        <option value="Essence">Essence</option>
        <option value="GPL">GPL</option>
      </select>
    </label>
    <button type="button" class="valider-vehicule">Valider ce véhicule</button>
  `;

  // Ajoute l'option de sélection dans la liste
  const option = document.createElement("option");
  option.value = idVehicule;
  option.textContent = ref;
  select.appendChild(option);

  container.appendChild(div);
  vehiculeIndex++;
}

// === AFFICHE UNIQUEMENT LE VÉHICULE SÉLECTIONNÉ ===
function afficherVehicule(id) {
  document.querySelectorAll(".vehicule-group").forEach(group => group.style.display = "none");
  const selected = document.getElementById(id);
  if (selected) selected.style.display = "block";
}

// === CRÉE UN RÉCAP DU FORMULAIRE DE VÉHICULE ===
function afficherRecapitulatif(div) {
  const inputs = div.querySelectorAll("input");
  const selects = div.querySelectorAll("select");
  let recapHTML = "<div class='recap'><strong>Véhicule ajouté :</strong><ul>";

  inputs.forEach(input => {
    const label = input.closest("label")?.childNodes[0].textContent.trim().replace(":", "") || input.name;
    if (input.type !== "hidden") {
      recapHTML += `<li><strong>${label}:</strong> ${input.value}</li>`;
    }
  });

  selects.forEach(select => {
    const label = select.closest("label")?.childNodes[0].textContent.trim().replace(":", "") || select.name;
    const value = select.options[select.selectedIndex]?.textContent || "";
    recapHTML += `<li><strong>${label}:</strong> ${value}</li>`;
  });

  recapHTML += "</ul></div>";
  div.innerHTML = recapHTML;
}

// === ÉVÉNEMENTS ===
document.getElementById("btn-ajouter-vehicule").addEventListener("click", ajouterVehicule);

document.getElementById("selectVehicule").addEventListener("change", function () {
  afficherVehicule(this.value);
});

document.getElementById("vehicules-container").addEventListener("click", function (e) {
  if (e.target.classList.contains("valider-vehicule")) {
    const bloc = e.target.closest(".vehicule-group");
    const allInputs = bloc.querySelectorAll("input");
    let valid = true;

    allInputs.forEach(input => {
      if (input.hasAttribute("required") && input.value.trim() === "") {
        valid = false;
        input.style.border = "1px solid red";
      } else {
        input.style.border = "";
      }
    });

    if (!valid) {
      alert("Merci de remplir tous les champs du véhicule.");
      return;
    }

    // Enregistrer le véhicule en base
    const vehicule = {
      user_id: 1, // À adapter avec localStorage/session
      marque: bloc.querySelector("input[name$='[marque]']").value,
      modele: bloc.querySelector("input[name$='[modele]']").value,
      energie: bloc.querySelector("input[name$='[energie]']").value,
      plaque: bloc.querySelector("input[name$='[plaque]']").value,
      date_immat: bloc.querySelector("input[name$='[date_immat]']").value,
      couleur: bloc.querySelector("input[name$='[couleur]']").value,
      places: bloc.querySelector("input[name$='[places]']").value,
      type: bloc.querySelector("select[name$='[type]']").value,
    };

    fetch("http://localhost:3001/api/vehicules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicule),
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Véhicule enregistré :", data);
        bloc.setAttribute("data-vehicule-id", data.vehicule_id);
        afficherRecapitulatif(bloc);
        afficherVehicule(bloc.id);
        document.getElementById("selectVehicule").value = bloc.id;
      })
      .catch(err => {
        console.error("Erreur enregistrement véhicule :", err);
        alert("Erreur lors de l'enregistrement du véhicule.");
      });
  }
});

// === TRAJET : Envoi du trajet avec ID véhicule ===
document.getElementById("form-trajet").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const selectedId = document.getElementById("selectVehicule").value;
  const bloc = document.getElementById(selectedId);

  if (!bloc || !bloc.hasAttribute("data-vehicule-id")) {
    alert("Validez un véhicule d'abord !");
    return;
  }

  // 💡 Ici, on prend la valeur renseignée dans le champ trajet, sinon celle du véhicule
  const placesForm = form.places.value?.trim();
  const placesVehicule = bloc.querySelector("input[name$='[places]']").value;
  const places = placesForm !== "" ? placesForm : placesVehicule;

  const trajet = {
    depart: form.depart.value,
    arrivee: form.arrivee.value,
    places: places,
    prix: form.prix.value,
    date: form.date.value,
    horaire: form.horaire.value,
    energie: form.energie.value,
    vehicule_id: bloc.getAttribute("data-vehicule-id"),
    conducteur_id: 1, // ← à remplacer dynamiquement plus tard
  };

  const res = await fetch("http://localhost:3001/api/trajets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trajet)
  });

  const data = await res.json();
  console.log("🚗 Trajet ajouté :", data);
  window.location.href = "covoiturage.html";
});
