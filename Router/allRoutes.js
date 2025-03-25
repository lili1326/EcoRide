import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/covoiturage","Covoiturage","/pages/covoiturage.html"),
    new Route("/vueDetaileeCovoiturage","Vue détaillée du Covoiturage","/pages/vueDetaileeCovoiturage.html"),
    new Route("/signin"," Connection","/pages/auth/signin.html"),  
    new Route("/signinup"," Inscription","/pages/auth/signinup.html"),  
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Eco Ride";