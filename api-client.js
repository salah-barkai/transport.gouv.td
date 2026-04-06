/* ============================================================
   CLIENT API MTACMN - MySQL Backend (VERSION CORRIGÉE)
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================
   Client JavaScript pour communiquer avec l'API PHP/MySQL
   Remplace le système IndexedDB/localStorage par MySQL
   ============================================================ */

class MTACMNAPIClient {
    constructor() {
        this.baseURL = './api.php';
        this.timeout = 10000; // 10 secondes
    }

    // Gestion des erreurs
    handleError(error, defaultMessage = 'Une erreur est survenue') {
        console.error('API Error:', error);
        return {
            success: false,
            message: error.message || defaultMessage
        };
    }

    // Requête HTTP générique
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                return this.handleError(new Error('Délai d\'attente dépassé'), 'Timeout');
            }
            return this.handleError(error);
        }
    }

    // Vérifier la connexion à l'API
    async checkConnection() {
        return await this.request('/');
    }

    // Articles
    async getArticles(filters = {}) {
        const params = new URLSearchParams(filters);
        return await this.request(`/articles?${params}`);
    }

    async getArticleById(id) {
        return await this.request(`/articles/${id}`);
    }

    async createArticle(articleData) {
        return await this.request('/articles', {
            method: 'POST',
            body: JSON.stringify(articleData)
        });
    }

    async updateArticle(id, updates) {
        return await this.request(`/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteArticle(id) {
        return await this.request(`/articles/${id}`, {
            method: 'DELETE'
        });
    }

    // Paramètres
    async getSettings() {
        return await this.request('/settings');
    }

    async updateSetting(key, value) {
        return await this.request('/settings', {
            method: 'PUT',
            body: JSON.stringify({ key, value })
        });
    }

    // Authentification
    async authenticate(username, password) {
        return await this.request('/auth', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    // Synchronisation automatique
    startAutoSync() {
        // Implémenter la synchronisation automatique si nécessaire
        console.log('Auto-sync démarré');
    }
}

// Adapter le code existant pour utiliser MySQL au lieu de localStorage
class MTACMNDatabaseMySQL {
    constructor() {
        this.api = new MTACMNAPIClient();
        this.initialized = false; // CORRIGÉ: initialized avec "i"
    }

    async init() {
        try {
            // Vérifier la connexion à l'API
            const connectionTest = await this.api.checkConnection();
            
            if (connectionTest.success) {
                console.log('Base de données MySQL initialisée avec succès');
                this.initialized = true; // CORRIGÉ: initialized avec "i"
                
                // Démarrer la synchronisation automatique
                this.api.startAutoSync();
            } else {
                console.error('Erreur de connexion à la base de données MySQL:', connectionTest.message);
                this.initLocalStorageFallback();
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la base de données MySQL:', error);
            this.initLocalStorageFallback();
        }
    }

    // Fallback localStorage si MySQL n'est pas disponible
    initLocalStorageFallback() {
        console.log('Utilisation du fallback localStorage');
        
        // Initialiser les données par défaut si elles n'existent pas
        if (!localStorage.getItem('mtacmn_articles')) {
            localStorage.setItem('mtacmn_articles', JSON.stringify([]));
        }
        
        this.initialized = true; // CORRIGÉ: initialized avec "i"
    }

    // Implémenter les méthodes requises par l'interface existante
    extractArticles(result) {
        if (Array.isArray(result)) return result;
        if (result && Array.isArray(result.articles)) return result.articles;
        if (result && result.data && Array.isArray(result.data.articles)) return result.data.articles;
        return [];
    }

    async getArticles() {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.getArticles({ statut: 'Publié' });
            return this.extractArticles(result);
        } catch (error) {
            console.error('Erreur getArticles:', error);
            // Fallback localStorage
            const saved = localStorage.getItem('mtacmn_articles');
            return saved ? JSON.parse(saved) : [];
        }
    }

    async addArticle(article) {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.createArticle(article);
            return result;
        } catch (error) {
            console.error('Erreur addArticle:', error);
            return { success: false, message: error.message };
        }
    }

    async updateArticle(id, updates) {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.updateArticle(id, updates);
            return result;
        } catch (error) {
            console.error('Erreur updateArticle:', error);
            return { success: false, message: error.message };
        }
    }

    async deleteArticle(id) {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.deleteArticle(id);
            return result;
        } catch (error) {
            console.error('Erreur deleteArticle:', error);
            return { success: false, message: error.message };
        }
    }

    async getSettings() {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.getSettings();
            if (result && result.settings && typeof result.settings === 'object') {
                return result.settings;
            }
            return result && typeof result === 'object' ? result : {};
        } catch (error) {
            console.error('Erreur getSettings:', error);
            return {};
        }
    }

    async updateSettings(key, value) {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.updateSetting(key, value);
            return result;
        } catch (error) {
            console.error('Erreur updateSettings:', error);
            return { success: false, message: error.message };
        }
    }

    async saveSettings(settingsObj) {
        if (!settingsObj || typeof settingsObj !== 'object') {
            return { success: false, message: 'Paramètres invalides' };
        }

        for (const [key, value] of Object.entries(settingsObj)) {
            const result = await this.updateSettings(key, value);
            if (!result || result.success === false) {
                return result || { success: false, message: `Échec sauvegarde pour ${key}` };
            }
        }
        return { success: true, message: 'Paramètres sauvegardés' };
    }

    async authenticateUser(username, password) {
        if (!this.initialized) await this.init(); // CORRIGÉ: initialized avec "i"
        
        try {
            const result = await this.api.authenticate(username, password);
            return result;
        } catch (error) {
            console.error('Erreur authenticateUser:', error);
            return { success: false, message: error.message };
        }
    }
}

// Données initiales
const INITIAL_DATA = {
    settings: {
        siteTitle: "Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale",
        ministerName: "Dr. Mahamat Taher Allani",
        ministerTitle: "Ministre des Transports, de l'Aviation Civile et de la Météorologie Nationale",
        contactEmail: "contact@mtacmn.td",
        contactPhone: "+235 22 51 03 45",
        address: "Avenue de la Nation, N'Djaména, Tchad",
        facebook: "https://facebook.com/mtacmn",
        twitter: "https://twitter.com/mtacmn",
        linkedin: "https://linkedin.com/company/mtacmn",
        youtube: "https://youtube.com/c/mtacmn",
        instagram: "https://instagram.com/mtacmn",
        aboutText: "Le Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale est chargé de la politique sectorielle dans les domaines des transports, de l'aviation civile et de la météorologie au Tchad.",
        missionText: "Notre mission est d'assurer la sécurité, la régulation et le développement des infrastructures et services de transport, d'aviation civile et de météorologie pour le bien-être des citoyens tchadiens.",
        visionText: "Notre vision est de faire du Tchad une référence régionale en matière de transport, d'aviation civile et de météorologie, avec des infrastructures modernes et des services de qualité.",
        bp: "BP 578"
    }
};

// Remplacer la classe globale existante
window.MTACMNDatabase = new MTACMNDatabaseMySQL();

// Auto-initialisation
if (typeof window !== 'undefined') {
    window.MTACMNDatabase.init().then(() => {
        console.log('Système de base de données MTACMN MySQL prêt');
    }).catch(error => {
        console.error('Erreur lors de l\'initialisation de la base de données MySQL:', error);
    });
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTACMNDatabaseMySQL;
}
