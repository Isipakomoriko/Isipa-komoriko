"// Attendre que le DOM soit chargé avant d'exécuter le code"

document.addEventListener("DOMContentLoaded", async function () {
    
    
    // Configuration des URLs de base et du proxy
    const BASE_URL = "https://inscription.isipa-komoriko.cd/api";
    const proxyUrl = "https://proxy-isipa-komoriko.sebastienlumuna8.workers.dev/?url=";
    const loginUrl = proxyUrl + encodeURIComponent(`${BASE_URL}/auth/login`);
    const refreshTokenUrl = proxyUrl + encodeURIComponent(`${BASE_URL}/auth/refresh-token`);

    // Variables pour la gestion des tokens
    let token = null;
    let refreshToken = null;
    let tokenExpiration = null;
    const TOKEN_EXPIRATION_TIME = 59 * 60 * 1000; // 59 minutes en millisecondes

    /**
     * Fonction pour s'authentifier et obtenir un token
     * @returns {Promise<string>} Le token d'authentification
     */
    async function login() {
        // Identifiants de l'application
        const credentials = {
            applicationID: "9apAVGJzbO",
            applicationSecret: "YzhQQURKa3IudkdkOHNMRQ=="
        };

        try {
            // Envoi de la requête d'authentification
            const response = await fetch(loginUrl, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) throw new Error(`Erreur de connexion: ${response.status}`);

            // Mise à jour des tokens
            const { token: newToken, refreshToken: newRefreshToken } = await response.json();
            token = newToken;
            refreshToken = newRefreshToken;
            tokenExpiration = Date.now() + TOKEN_EXPIRATION_TIME;

            console.log("Token récupéré:");
            // Planifier le rafraîchissement du token
            setTimeout(() => refreshTokenFunc(), TOKEN_EXPIRATION_TIME);

            return token;
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            throw error;
        }
    }

    /**
     * Fonction pour rafraîchir le token
     * @returns {Promise<string>} Le nouveau token
     */
    async function refreshTokenFunc() {
        console.log("Rafraîchissement du token...");
        try {
            // Envoi de la requête de rafraîchissement
            const response = await fetch(refreshTokenUrl, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) throw new Error(`Erreur de rafraîchissement: ${response.status}`);

            // Mise à jour des tokens
            const { token: newToken, refreshToken: newRefreshToken } = await response.json();
            token = newToken;
            refreshToken = newRefreshToken;
            tokenExpiration = Date.now() + TOKEN_EXPIRATION_TIME;

            console.log("Token rafraîchi !");
            return token;
        } catch (error) {
            console.error("Impossible de rafraîchir le token !", error);
            return login();
        }
    }

    /**
     * Fonction pour effectuer des requêtes authentifiées
     * @param {string} url - L'URL de la requête
     * @param {Object} options - Les options de la requête
     * @returns {Promise<Object>} La réponse de la requête
     */
    async function fetchWithAuth(url, options = {}) {
        // Vérifier si le token est expiré
        if (!token || Date.now() >= tokenExpiration) {
            console.log("Token expiré, rafraîchissement en cours...");
            await refreshTokenFunc();
        }

        // Effectuer la requête avec le token
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${token}`
            }
        });

        // Gérer le cas où le token est invalide
        if (response.status === 401) {
            console.warn("Token expiré, rafraîchissement...");
            await refreshTokenFunc();
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => res.json());
        }

        return response.json();
    }

    // Initialisation : première connexion
    try {
        await login();
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
    }
});