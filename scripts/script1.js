///////////////////////////////////////////////////////
// Traduction des codes météo
///////////////////////////////////////////////////////

function traductionWeatherCode(weatherCode) {
  //interprete le code météo
  //correspondance entre le code wmo et les images prise ici : https://gist.github.com/stellasphere/
  switch (weatherCode) {
    case 0:
      return {
        description: "Ciel dégagé",
        image: "http://openweathermap.org/img/wn/01d@2x.png"
      };
    case 1:
      return {
        description: "Ciel principalement dégagé",
        image: "http://openweathermap.org/img/wn/01d@2x.png"
      };
    case 2:
      return {
        description: "Ciel partiellement couvert",
        image: "http://openweathermap.org/img/wn/02d@2x.png"
      };
    case 3:
      return {
        description: "Ciel couvert",
        image: "http://openweathermap.org/img/wn/03d@2x.png"
      };
    case 45:
      return {
        description: "Brouillard",
        image: "http://openweathermap.org/img/wn/50d@2x.png"
      };
    case 48:
      return {
        description: "Brouillard et dépôt de givre blanc",
        image: "http://openweathermap.org/img/wn/50d@2x.png"
      };
    case 51:
      return {
        description: "Bruine faible",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 53:
      return {
        description: "Bruine modérée",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 55:
      return {
        description: "Bruine forte",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 56:
      return {
        description: "Bruine verglaçante faible",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 57:
      return {
        description: "Bruine verglaçante forte",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 61:
      return {
        description: "Pluie faible",
        image: "http://openweathermap.org/img/wn/10d@2x.png"
      };
    case 63:
      return {
        description: "Pluie modérée",
        image: "http://openweathermap.org/img/wn/10d@2x.png"
      };
    case 65:
      return {
        description: "Pluie forte",
        image: "http://openweathermap.org/img/wn/10d@2x.png"
      };
    case 66:
      return {
        description: "Pluie verglaçante faible",
        image: "http://openweathermap.org/img/wn/10d@2x.png"
      };
    case 67:
      return {
        description: "Pluie verglaçante forte",
        image: "http://openweathermap.org/img/wn/10d@2x.png"
      };
    case 71:
      return {
        description: "Faible chute de neige",
        image: "http://openweathermap.org/img/wn/13d@2x.png"
      };
    case 73:
      return {
        description: "Chute de neige modérée",
        image: "http://openweathermap.org/img/wn/13d@2x.png"
      };
    case 75:
      return {
        description: "Chute de neige forte",
        image: "http://openweathermap.org/img/wn/13d@2x.png"
      };
    case 80:
      return {
        description: "Averses de pluie faibles",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 81:
      return {
        description: "Averses de pluie modérées",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 82:
      return {
        description: "Averses exceptionnellement fortes",
        image: "http://openweathermap.org/img/wn/09d@2x.png"
      };
    case 85:
      return {
        description: "Averses de neige faibles",
        image: "http://openweathermap.org/img/wn/13d@2x.png"
      };
    case 86:
      return {
        description: "Averses de neige fortes",
        image: "http://openweathermap.org/img/wn/13d@2x.png"
      };
    case 95:
      return {
        description: "Orage",
        image: "http://openweathermap.org/img/wn/11d@2x.png"
      };
    case 96:
      return {
        description: "Orage accompagné de grêle",
        image: "http://openweathermap.org/img/wn/11d@2x.png"
      };
    case 99:
      return {
        description: "Orage violent accompagné de grêle",
        image: "http://openweathermap.org/img/wn/11d@2x.png"
      };
    default:
      return {
        description: "Code météo non reconnu",
        image: "http://openweathermap.org/img/wn/50d@2x.png"
      };
  }
}


///////////////////////////////////////////////////////
// Fetch et lance l'ajout des données au graphe
///////////////////////////////////////////////////////

function ajoutDonnee(latitude, longitude, ville) {
  //ajoute les données météo pour la ville
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m&timezone=Europe%2FBerlin`;
    fetchData(url, gereMeteo, latitude, longitude, ville);
}

function fetchData(url, callback, latitude, longitude, ville) {
  //récupère les données météo
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => callback(data, latitude, longitude, ville))
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
}

function gereMeteo(data, latitude, longitude, ville) {
  //lance l'affichage des données météo
  //pour chaque information, on l'affiche sur la page
    let date = document.getElementById("date");
    let dateObj = new Date(data.current.time);
    date.innerHTML = dateObj.toLocaleString();

    let temperature = document.getElementById("temperature");
    temperature.innerHTML = data.current.temperature_2m;

    let precipitation = document.getElementById("precipitation");
    precipitation.innerHTML = data.current.precipitation;

    let wind = document.getElementById("vent");
    wind.innerHTML = data.current.wind_speed_10m;

    let proba = document.getElementById("proba");
    proba.innerHTML = data.current.precipitation_probability;

    let weather = document.getElementById("code");
    let weatherCode = traductionWeatherCode(data.current.weather_code);
    weather.innerHTML = `${data.current.weather_code} - ${weatherCode.description}`;

    let weatherImage = document.getElementById("image_code");
    weatherImage.innerHTML = ''; // supprime ce qu'il y avait avant
    let img = document.createElement("img");
    img.src = weatherCode.image;
    weatherImage.appendChild(img);

    let tableau_temperatures = data.hourly.temperature_2m;
    printChart(tableau_temperatures); //lance l'affichage du graphique

    initMap(latitude, longitude, ville, weatherCode.description); //lance l'affichage de la carte
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
          const div = document.createElement('div'); //crée un div pour chaque suggestion
          div.className = 'suggestion-item'; //ajoute une classe pour le style
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
  ajoutDonnee(latitude, longitude, input.value); // appelle la fonction pour afficher les données météo
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

function printChart(tableau_temperatures) {
  //pour afficher le graphique
    const xValues = []; // axe X
    const dateMaintenant = new Date(); //date du jour
    dateMaintenant.setHours(0, 0, 0, 0); // fixe l'heure de base à minuit
    const jourSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    // crée la liste avec les labels pour le graphe
    for (let i = 0; i < tableau_temperatures.length; i++) {
        const date = new Date(dateMaintenant.getTime() + i * 60 * 60 * 1000); // convertion pour ajouter i heures
        let etiquetteJour;
        if (i % 24 === 0) { //si c'est minuit donc un nouveau jour
            if (i === 0) { //correspond à aujourd'hui
              etiquetteJour = "Aujourd'hui";
            } 
            else if (i === 24) { //correspond à demain
              etiquetteJour = "Demain";
            }
            else { //coorespond à un autre jour
              etiquetteJour = jourSemaine[date.getDay()];
            }
        } 
        else { //correspond à l'heure
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
                tension: 0.2 // lisse la courbe
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { //affiche les étiquettes correctement
                        callback: function(value, index) {
                            // tri les étiquettes avec des heures pour ne pas les afficher
                            if (/\d/.test(xValues[index])) { //si c'est un chiffre donc une heure
                                return "";
                            } else {//sinon c'est un jour donc affiche le jour
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
// Pour la carte
///////////////////////////////////////////////////////

let map;

function initMap(latitude, longitude, ville, description) {
    if (map) {
        map.remove(); // enlève la map déjà là
    }

    map = L.map('map').setView([latitude, longitude], 13); //ajuste la vue de la carte sur la ville

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map) //ajout du marqueur sur la ville
        .bindPopup(`<b>${ville}</b><br>${description}`).openPopup();
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