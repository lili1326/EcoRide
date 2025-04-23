import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
//const route404 = new Route("404", "Page introuvable", "/pages/404.html",[]);



// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};


// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de l'URL actuelle
  const actualRoute = getRouteByUrl(path);
  console.log("Route actuelle :", actualRoute);

  //Vérifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;
  if(allRolesArray.length > 0){
    if(allRolesArray.includes("disconnected")){
      if(isConnected()){
        window.location.replace("/");
      }
    }
    else{
      const roleUser = getRole();
      if(!allRolesArray.includes(roleUser)){
        window.location.replace("/");
      }
    }
  }
  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  

// Attendre que le HTML soit bien rendu avant d'exécuter le JS
setTimeout(() => {
  if (actualRoute.pathJS && actualRoute.pathJS !== "") {
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "module");
    scriptTag.setAttribute("src", actualRoute.pathJS);

    // Appelle automatiquement init après chargement du JS
    scriptTag.onload = () => {
      if (typeof window.initCovoiturage === "function") {
        window.initCovoiturage();
      }
      // Tu peux ajouter d'autres init ici selon les pages plus tard
    };

    document.body.appendChild(scriptTag);
    console.log("Script ajouté dynamiquement :", actualRoute.pathJS);
     // ✅ Appel de la fonction init une fois le script chargé
     scriptTag.onload = () => {
      const routeName = actualRoute.url.split("/").pop(); // ex: 'covoiturage'
      const initFnName = `init${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`; // ex: 'initCovoiturage'

      if (typeof window[initFnName] === 'function') {
        window[initFnName]();
        console.log(`✅ ${initFnName}() exécutée`);
      } else {
        console.warn(`⚠️ ${initFnName}() non trouvée dans le script chargé.`);
      }
    };

    document.body.appendChild(scriptTag);
    console.log("Script ajouté dynamiquement :", actualRoute.pathJS);
  }
}, 50); // petit délai pour laisser le temps au DOM d'être intégré




  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  //Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};

 

//fonction pour que au onclic le routeur se déclenche-gérer la navigation-et ajouter une vérification pour certaines actions protégées
const routeEvent = (event) => {
  event.preventDefault();

  //on stock dans target l’élément cliqué
  let target = event.target;
  //récupérer l’attribut personnalisé data-url qui contient le chemin vers la page à charger.
  let url = target.getAttribute("data-url");

  if (!url) return;

  // Vérifie si ce bouton demande une connexion (data-protected="true")
  const isProtected = target.getAttribute("data-protected") === "true";

  //Si l’action est protégée et que l’utilisateur n’est pas connecté-on le redirige vers la page d’inscription
  if (isProtected && !isConnected()) {
    alert("Vous devez être connecté(e) pour accéder à cette fonctionnalité.");
    window.location.href = "/signinup";
    return;
  }
  // Si tout est ok, on met à jour l'URL et on charge la page
  window.history.pushState({}, "", url);
  //charger la page 
  LoadContentPage();
};

//rends la fonction routeEvent() accessible globalement dans la page sous le nom route
window.route = routeEvent;
// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
// Chargement du contenu de la page au chargement initial
LoadContentPage();
 


 