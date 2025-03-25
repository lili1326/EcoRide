let vehiculeIndex = 0;

function ajouterVehicule() {
  const container = document.getElementById("vehicules-container");
  const select = document.getElementById("selectVehicule");

  const ref = prompt("Entrez une référence pour ce véhicule (ex: 'Peugeot 208') :");
  if (!ref) return;

  const idVehicule = `vehicule-${vehiculeIndex}`;

  // Ajouter l'option de sélection
  const option = document.createElement("option");
  option.value = idVehicule;
  option.textContent = ref;
  select.appendChild(option);

  const div = document.createElement("div");
  div.classList.add("vehicule-group");
  div.id = idVehicule;
  div.style.display = "none"; // cacher au début

  div.innerHTML = `
    <input type="hidden" name="vehicule[${vehiculeIndex}][reference]" value="${ref}">
    <label>Marque:
      <input type="text" name="vehicule[${vehiculeIndex}][marque]" required>
    </label>
    <label>Modèle:
      <input type="text" name="vehicule[${vehiculeIndex}][modele]" required>
    </label>
    <label>Énergie utilisée:
      <input type="text" name="vehicule[${vehiculeIndex}][energie]" required>
    </label>
    <label>Plaque d'immatriculation:
      <input type="text" name="vehicule[${vehiculeIndex}][plaque]" required>
    </label>
    <label>Date de première immatriculation:
      <input type="date" name="vehicule[${vehiculeIndex}][date_immat]" required>
    </label>
    <label>Couleur:
      <input type="text" name="vehicule[${vehiculeIndex}][couleur]" required>
    </label>
    <label>Nombre de places disponibles:
      <input type="number" name="vehicule[${vehiculeIndex}][places]" min="1" max="9" required>
    </label>
    <button type="button" class="valider-vehicule">Valider ce véhicule</button>
  `;

  container.appendChild(div);
  vehiculeIndex++;
}

function afficherRecapitulatif(div) {
  const inputs = div.querySelectorAll("input");
  let recapHTML = "<div class='recap'><strong>Véhicule ajouté :</strong><ul>";
  inputs.forEach(input => {
    const label = input.closest("label")?.textContent.trim().replace(":", "") || input.name;
    if (input.type !== "hidden") {
      recapHTML += `<li><strong>${label}:</strong> ${input.value}</li>`;
    }
  });
  recapHTML += "</ul></div>";
  div.innerHTML = recapHTML;
}

function afficherVehicule(id) {
  document.querySelectorAll(".vehicule-group").forEach(group => {
    group.style.display = "none";
  });
  const selected = document.getElementById(id);
  if (selected) selected.style.display = "block";
}

document.getElementById("btn-ajouter-vehicule").addEventListener("click", ajouterVehicule);

document.getElementById("vehicules-container").addEventListener("click", function(e) {
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

    if (valid) {
      afficherRecapitulatif(bloc);
      afficherVehicule(bloc.id); // Affiche uniquement ce bloc validé
      document.getElementById("selectVehicule").value = bloc.id; // Met à jour la sélection
    } else {
      alert("Merci de remplir tous les champs du véhicule.");
    }
  }
});

// Sélection via le menu déroulant
document.getElementById("selectVehicule").addEventListener("change", function () {
  afficherVehicule(this.value);
});
