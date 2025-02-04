///////////////////////////////////////////////////////
// Fetch et lance l'ajout des données au graphe
///////////////////////////////////////////////////////

function ajoutDonnee(latitude, longitude) {
    //ajoute les données météo pour la ville
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&past_days=7&forecast_days=1&timezone=Europe%2FBerlin`;
    fetchData(url, gereMeteo);
}

function fetchData(url, callback) {
    //récupère les données météo
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => callback(data))
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
}

function gereMeteo(data) {
    //lance l'affichage des données météo
    let tableau_temperatures = data.hourly.temperature_2m;
    afficheChart(tableau_temperatures);
}

///////////////////////////////////////////////////////
//Gestion des suggestions de villes
///////////////////////////////////////////////////////

function obtientSuggestions(query) {
    //récupère les suggestions de ville
    const url = `https://api-adresse.data.gouv.fr/search/?q=${query}&type=municipality&limit=5`;

    return fetch(url) // appelle l'API Adresse
        .then((resp) => resp.json()) // conversion en JSON
        .then((data) => {
            // retourne liste de suggestions formatées
            return data.features.map((feature) => ({
                label: feature.properties.label,
                coordinates: feature.geometry.coordinates
            }));
        })
        .catch((error) => { // en cas d'erreur
            console.log("Erreur lors de la récupération des suggestions :", error);
            return [];
        });
}

function majSuggestions(query) {
    // maj des suggestions en fonction de la saisie
    if (query.length < 3) { //affiche les suggestions si saisie supérieure à 3 caractères
        suggestionsBox.innerHTML = ''; // supprime les suggestions si trop court
        return;
    }

    obtientSuggestions(query).then((suggestions) => {
        suggestionsBox.innerHTML = ''; // réinitialise les suggestions

        suggestions.forEach((suggestion) => { //pour ajouter les suggestions à la liste de suggestions
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = suggestion.label;
            div.onclick = () => choisiSuggestion(suggestion); //lance le choix de la suggestion si cliqué
            suggestionsBox.appendChild(div);
        });
    });
}

function choisiSuggestion(suggestion) {
    //quand une suggestion est sélectionnée
    input.value = suggestion.label; // met la ville dans la zone de texte
    suggestionsBox.innerHTML = ''; // supprime les suggestions

    const [longitude, latitude] = suggestion.coordinates; //affiche les coordonnées
    result.textContent = `Coordonnées : [Longitude: ${longitude}, Latitude: ${latitude}]`;
    let villeTitre = document.getElementById('titre_ville');
    villeTitre.innerHTML = suggestion.label;
    ajoutDonnee(latitude, longitude); // appelle la fonction pour afficher les données météo
}

// récupération des éléments du html pour la gestion des évènements liés à la saisie de texte
const input = document.getElementById('entreeVille');
const suggestionsBox = document.getElementById('suggestions');
const result = document.getElementById('result');

input.addEventListener('input', (event) => {
    // évènement de saisie de texte
    const query = event.target.value;
    majSuggestions(query);
});

document.addEventListener('click', (event) => {
    //cache les suggestion si on clique ailleurs
    if (!suggestionsBox.contains(event.target) && event.target !== input) {
        suggestionsBox.innerHTML = '';
    }
});



///////////////////////////////////////////////////////
//Graphique de température
///////////////////////////////////////////////////////

let chart;

function afficheChart(tableau_temperatures) {
    //pour afficher le graphique
    const xValues = []; // axe X
    const dateMaintenant = new Date(); //date du jour
    dateMaintenant.setHours(0, 0, 0, 0); // fixe l'heure de base à minuit

    // crée la liste avec les labels pour le graphe
    for (let i = 0; i < tableau_temperatures.length; i++) {
        const date = new Date(dateMaintenant.getTime() + i * 60 * 60 * 1000); // ajoute i heures
        let etiquetteJour;
        if (i % 24 === 0) { //si c'est minuit donc un nouveau jour
            if (i === 7*24) { //correspond à aujourd'hui car il y a 8 jours dans le tableau
                etiquetteJour = "Aujourd'hui";
            } 
            else if (i === 6*24) { //correspond à hier
                etiquetteJour = "Hier";
            }
            else { // pour tous les autres jours
                date.setDate(dateMaintenant.getDate() - Math.floor(7 - (i / 24)));
                etiquetteJour = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            }
        } 
        else { // pour toutes les autres heures
            etiquetteJour = `${date.getHours()}h`;
        }
        xValues.push(etiquetteJour); //ajout dans la liste de l'axe X
    }

    // détruit l'ancien graphique s'il existe
    if (chart) {
        chart.destroy();
    }

    // création du graphe
    chart = new Chart("graphe", {
        type: "line",
        data: {
            labels: xValues, // toutes les heures avec des points marqués pour les jours
            datasets: [{
                data: tableau_temperatures,
                borderColor: "red",
                fill: false,
                tension: 0.2 //lisse la courbe
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value, index) {
                            // tri les étiquettes avec des heures pour ne pas les afficher
                            if (/^\d{1,2}h$/.test(xValues[index])) {
                                return "";
                            } else {//sinon c'est un jour donc affiche la date
                                return xValues[index];
                            }
                        },
                        maxRotation: 0, //étiquettes alignées horizontalement
                        autoSkip: false
                    },
                    title: {
                        display: true,
                        text: "Jours"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Température (°C)"
                    }
                }
            }
        }
    });
}

///////////////////////////////////////////////////////
//Pour la barre latérale
///////////////////////////////////////////////////////

var ferme = true;

        function gereSidebar() {
            if (ferme) {
                document.getElementById("sidebar").style.width = "250px";
                this.ferme = false;
            } else {
                document.getElementById("sidebar").style.width = "85px";
                this.ferme = true;
            }
        }

///////////////////////////////////////////////////////
//Ville par défaut
///////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function() {
    //ajoute les données pour la ville par défaut
    const defaultLatitude = 48.7326;
    const defaultLongitude = -3.4566;
    const defaultCity = "Lannion"; // ville par défaut
    let villeTitre = document.getElementById('titre_ville');
    villeTitre.innerHTML = defaultCity;

    ajoutDonnee(defaultLatitude, defaultLongitude, defaultCity);
});