// URL de l'API REST Countries v2
const url = 'https://restcountries.com/v2/all';

/**
 * @param {string} url URL de l'API REST Countries v2
 * @returns {Promise} Promesse contenant les données de l'API REST Countries v2
 */

// Fonction pour charger les pays
function loadCountries() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('Nationalité');
            
            // Ajoute les pays à la liste déroulante
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.alpha3Code; 
                option.textContent = country.name; 
                select.appendChild(option);
            });
            
            // Option "Autre"
            const autreOption = document.createElement('option');
            autreOption.value = "Autre";
            autreOption.textContent = "Autre";
            select.appendChild(autreOption);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des pays:', error);
        });
}

// Appel de la fonction pour charger les pays au chargement de la page
document.addEventListener('DOMContentLoaded', loadCountries);
