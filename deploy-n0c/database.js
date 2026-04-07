/* ============================================================
   BASE DE DONNÉES MTACMN - VERSION MYSQL UNIQUE
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================
   Utilisation EXCLUSIVE de MySQL via API PHP
   Plus de localStorage/IndexedDB - Système centralisé
   ============================================================ */

// ─── DONNÉES INITIALES (pour fallback et mode local) ──────────────────
const INITIAL_DATA = {
    articles: [
        {
            id: 1,
            titre: "Audit OACI : La ministre évalue les préparatifs à l'aéroport Hassan Djamous",
            date: "21 mars 2026",
            categorie: "Aviation Civile",
            resume: "La ministre Fatimé Goukouni Weddeye a effectué une visite à l'Aéroport international Hassan Djamous à quelques jours d'un audit international de l'OACI.",
            contenu: "La ministre des Transports, de l'Aviation civile et de la Météorologie nationale, Fatimé Goukouni Weddeye, a effectué ce samedi 21 mars une visite à l'Aéroport international Hassan Djamous. Cette descente sur le terrain visait à galvaniser les équipes et à s'assurer de la pleine préparation avant l'audit OACI. La piste d'atterrissage a bénéficié d'une réhabilitation complète avec installation de nouveaux équipements de sécurité modernisés. Le ministère entend se conformer à toutes les normes internationales de l'Organisation de l'Aviation Civile Internationale.",
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
            imageKey: "article_1",
            une: true,
            statut: "Publié",
            vues: 1240,
            createdAt: new Date('2026-03-21'),
            updatedAt: new Date('2026-03-21')
        },
        {
            id: 2,
            titre: "Semaine Nationale de la Météorologie 2026 : « Observer aujourd'hui pour protéger demain »",
            date: "24 mars 2026",
            categorie: "Météorologie",
            resume: "L'ANAM a lancé officiellement la Semaine nationale de la météorologie (SENAMET) sous le thème « Observer aujourd'hui et protéger demain ».",
            contenu: "Le ministère des Transports, à travers l'Agence nationale de la météorologie (ANAM), a lancé officiellement la Semaine nationale de la météorologie (SENAMET). L'objectif est de sensibiliser les populations et de mobiliser des ressources pour moderniser le réseau d'observation météorologique. Les activités comprennent des panels et ateliers avec l'appui du PAM, la Banque mondiale, le PNUD et l'OMM.",
            image: "https://images.unsplash.com/photo-1504608524841-42584120d238?w=800&q=80",
            imageKey: "article_2",
            une: false,
            statut: "Publié",
            vues: 876,
            createdAt: new Date('2026-03-24'),
            updatedAt: new Date('2026-03-24')
        },
        {
            id: 3,
            titre: "Normes ASSA-AC : Atelier de vulgarisation de la réglementation aéronautique CEMAC",
            date: "16 février 2026",
            categorie: "Aviation Civile",
            resume: "Atelier de vulgarisation des normes communautaires de l'ASSA-AC au Centre CIFOP de Farcha pour renforcer la sécurité du transport aérien national.",
            contenu: "Le Secrétaire général Dihoulne Laurent a présidé l'atelier de vulgarisation de la réglementation communautaire de l'Agence de Supervision de la Sécurité Aérienne en Afrique Centrale (ASSA-AC). Cet atelier vise à renforcer la compréhension et l'application effective des normes aéronautiques communautaires de la zone CEMAC par les acteurs de l'aviation civile tchadienne.",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
            imageKey: "article_3",
            une: false,
            statut: "Publié",
            vues: 543,
            createdAt: new Date('2026-02-16'),
            updatedAt: new Date('2026-02-16')
        },
        {
            id: 4,
            titre: "Transports : Évaluation stratégique du programme présidentiel — Chantier 8",
            date: "2 mars 2026",
            categorie: "Transports",
            resume: "Le Premier ministre Allah Maye Halina a présidé une réunion d'évaluation du volet transport du programme présidentiel, couvrant le désenclavement et la modernisation des infrastructures.",
            contenu: "La réunion a évalué l'état d'avancement des projets prioritaires : modernisation des infrastructures routières et aéroportuaires, le projet de voie ferrée Tchad–Cameroun, le développement des ports secs à Moundou et Amdjarass, et le renforcement des partenariats avec les compagnies aériennes internationales.",
            image: "https://images.unsplash.com/photo-1545173168-9f1947eb7a44?w=800&q=80",
            imageKey: "article_4",
            une: false,
            statut: "Publié",
            vues: 678,
            createdAt: new Date('2026-03-02'),
            updatedAt: new Date('2026-03-02')
        },
        {
            id: 5,
            titre: "Sécurité routière : Lancement du programme « Ambassadeurs routiers »",
            date: "15 janvier 2026",
            categorie: "Transports",
            resume: "Le ministère lance le programme des ambassadeurs routiers pour la vulgarisation du code de la route et l'amélioration de la sécurité sur les grands axes nationaux.",
            contenu: "Dans le cadre du renforcement de la sécurité routière, le ministère a lancé le programme des « ambassadeurs routiers » pour vulgariser le code de la route et aménager des aires de repos sur les grands axes.",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            imageKey: "article_5",
            une: false,
            statut: "Publié",
            vues: 432,
            createdAt: new Date('2026-01-15'),
            updatedAt: new Date('2026-01-15')
        },
        {
            id: 6,
            titre: "Modernisation du réseau météorologique : Installation de 15 nouvelles stations",
            date: "10 mars 2026",
            categorie: "Météorologie",
            resume: "L'ANAM procède à l'installation de 15 nouvelles stations météorologiques automatiques sur l'ensemble du territoire national.",
            contenu: "Dans le cadre de la modernisation de son réseau d'observation, l'Agence Nationale de la Météorologie a installé 15 nouvelles stations automatiques dans les régions de l'Ennedi, du Ouaddaï et du Logone Oriental. Ces équipements de dernière génération permettront d'améliorer la précision des prévisions et la surveillance des phénomènes climatiques extrêmes.",
            image: "https://images.unsplash.com/photo-1534088568-c1a89c8c1b91?w=800&q=80",
            imageKey: "article_6",
            une: false,
            statut: "Publié",
            vues: 321,
            createdAt: new Date('2026-03-10'),
            updatedAt: new Date('2026-03-10')
        }
    ],
    settings: {
        siteTitle: "Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale",
        ministerName: "Mme Fatimé Goukouni Weddeye",
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

// ─── CLIENT API MYSQL ────────────────────────────────────────────────
class MTACMNMySQLClient {
    constructor() {
        // Correction de l'URL de l'API
        this.baseURL = './api.php'; // URL relative simple
        this.timeout = 10000;
    }

    // Articles
    async getArticles(filters = {}) {
        try {
            // Construire l'URL correctement
            let url = `${this.baseURL}`;
            const params = new URLSearchParams();
            
            // Ajouter les paramètres de filtre
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.categorie) params.append('categorie', filters.categorie);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);
            
            // Ajouter les paramètres à l'URL
            if (params.toString()) {
                url += '?' + params.toString();
            }
            
            console.log('🔍 URL appelée:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 Réponse API:', data);
            return data;
        } catch (error) {
            console.error('❌ Erreur getArticles:', error);
            throw error;
        }
    }

    async createArticle(articleData) {
        try {
            const response = await fetch(`${this.baseURL}?action=createArticle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur createArticle:', error);
            throw error;
        }
    }

    async updateArticle(id, updates) {
        try {
            const response = await fetch(`${this.baseURL}?action=updateArticle&id=${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur updateArticle:', error);
            throw error;
        }
    }

    async deleteArticle(id) {
        try {
            const response = await fetch(`${this.baseURL}?action=deleteArticle&id=${id}`, {
                method: 'POST'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur deleteArticle:', error);
            throw error;
        }
    }

    // Paramètres
    async getSettings() {
        try {
            const response = await fetch(`${this.baseURL}?action=getSettings`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur getSettings:', error);
            throw error;
        }
    }

    async updateSetting(key, value) {
        try {
            const response = await fetch(`${this.baseURL}?action=updateSetting`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erreur updateSetting:', error);
            throw error;
        }
    }
}

// ─── CLASSE PRINCIPALE DE BASE DE DONNÉES (MYSQL UNIQUE) ───────────────
class MTACMNDatabase {
    constructor() {
        this.api = new MTACMNMySQLClient();
        this.initialized = false;
        this.fallbackMode = false;
        this.fallbackArticlesKey = "mtacmn_articles";
        this.fallbackSettingsKey = "mtacmn_settings";
    }

    async init() {
        try {
            console.log('🔄 Initialisation de la base de données MySQL...');
            
            // Test de connexion à l'API
            const response = await this.api.getArticles();

            const articles = this.extractArticles(response);
            if (Array.isArray(articles)) {
                this.initialized = true;
                console.log('✅ Base de données MySQL initialisée avec succès');
                console.log(`📊 ${articles.length} articles chargés`);
                return { success: true, articles };
            } else {
                throw new Error('Réponse API invalide');
            }
        } catch (error) {
            console.error('❌ Erreur de connexion MySQL:', error);
            console.log('🔄 Activation du mode fallback avec les données initiales...');
            return this.initFallback();
        }
    }

    // Mode fallback (uniquement si MySQL indisponible)
    initFallback() {
        this.fallbackMode = true;
        this.initialized = true;
        this.ensureFallbackData();
        console.log('⚠️ Mode fallback activé - Utilisation des données initiales');
        return { success: true, articles: this.getFallbackArticles() };
    }

    ensureFallbackData() {
        try {
            if (!localStorage.getItem(this.fallbackArticlesKey)) {
                localStorage.setItem(this.fallbackArticlesKey, JSON.stringify(INITIAL_DATA.articles));
            }
            if (!localStorage.getItem(this.fallbackSettingsKey)) {
                localStorage.setItem(this.fallbackSettingsKey, JSON.stringify(INITIAL_DATA.settings));
            }
        } catch (error) {
            console.error("❌ Erreur init fallback localStorage:", error);
        }
    }

    getFallbackArticles() {
        try {
            this.ensureFallbackData();
            const raw = localStorage.getItem(this.fallbackArticlesKey);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("❌ Erreur lecture fallback articles:", error);
            return [];
        }
    }

    saveFallbackArticles(articles) {
        try {
            localStorage.setItem(this.fallbackArticlesKey, JSON.stringify(articles));
            return true;
        } catch (error) {
            console.error("❌ Erreur sauvegarde fallback articles:", error);
            return false;
        }
    }

    getFallbackSettings() {
        try {
            this.ensureFallbackData();
            const raw = localStorage.getItem(this.fallbackSettingsKey);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (error) {
            console.error("❌ Erreur lecture fallback settings:", error);
            return {};
        }
    }

    saveFallbackSettings(settings) {
        try {
            localStorage.setItem(this.fallbackSettingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error("❌ Erreur sauvegarde fallback settings:", error);
            return false;
        }
    }

    // Articles
    extractArticles(response) {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.articles)) return response.articles;
        if (response && response.data && Array.isArray(response.data.articles)) return response.data.articles;
        return [];
    }

    async getArticles(filters = {}) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            let articles = this.getFallbackArticles();
            
            // Appliquer les filtres
            if (filters.statut) {
                articles = articles.filter(a => a.statut === filters.statut);
            }
            if (filters.categorie) {
                articles = articles.filter(a => a.categorie === filters.categorie);
            }
            
            return articles;
        }
        
        try {
            const response = await this.api.getArticles(filters);
            return this.extractArticles(response);
        } catch (error) {
            console.error('❌ Erreur getArticles:', error);
            return [];
        }
    }

    async addArticle(article) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            const articles = this.getFallbackArticles();
            const nextId = articles.length ? Math.max(...articles.map((a) => Number(a.id) || 0)) + 1 : 1;
            const newArticle = {
                ...article,
                id: nextId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const updated = [newArticle, ...articles];
            const ok = this.saveFallbackArticles(updated);
            return ok
                ? { success: true, id: nextId, message: "Article sauvegardé en mode local" }
                : { success: false, message: "Échec sauvegarde locale" };
        }
        
        try {
            const result = await this.api.createArticle(article);
            console.log('✅ Article créé avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur addArticle:', error);
            return { success: false, message: error.message };
        }
    }

    async updateArticle(id, updates) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            const articles = this.getFallbackArticles();
            const idx = articles.findIndex((a) => Number(a.id) === Number(id));
            if (idx === -1) return { success: false, message: "Article introuvable" };
            articles[idx] = { ...articles[idx], ...updates, updatedAt: new Date().toISOString() };
            const ok = this.saveFallbackArticles(articles);
            return ok
                ? { success: true, message: "Article mis à jour en mode local" }
                : { success: false, message: "Échec mise à jour locale" };
        }
        
        try {
            const result = await this.api.updateArticle(id, updates);
            console.log('✅ Article mis à jour avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur updateArticle:', error);
            return { success: false, message: error.message };
        }
    }

    async deleteArticle(id) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            const articles = this.getFallbackArticles();
            const updated = articles.filter((a) => Number(a.id) !== Number(id));
            if (updated.length === articles.length) {
                return { success: false, message: "Article introuvable" };
            }
            const ok = this.saveFallbackArticles(updated);
            return ok
                ? { success: true, message: "Article supprimé en mode local" }
                : { success: false, message: "Échec suppression locale" };
        }
        
        try {
            const result = await this.api.deleteArticle(id);
            console.log('✅ Article supprimé avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur deleteArticle:', error);
            return { success: false, message: error.message };
        }
    }

    // Paramètres
    async getSettings() {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            return this.getFallbackSettings();
        }
        
        try {
            const response = await this.api.getSettings();
            if (response && response.settings && typeof response.settings === 'object') {
                return response.settings;
            }
            return response && typeof response === 'object' ? response : {};
        } catch (error) {
            console.error('❌ Erreur getSettings:', error);
            return {};
        }
    }

    async updateSettings(key, value) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            const current = this.getFallbackSettings();
            current[key] = value;
            const ok = this.saveFallbackSettings(current);
            return ok
                ? { success: true, message: "Paramètres sauvegardés en mode local" }
                : { success: false, message: "Échec sauvegarde paramètres locale" };
        }
        
        try {
            const result = await this.api.updateSetting(key, value);
            console.log('✅ Paramètres mis à jour avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur updateSettings:', error);
            return { success: false, message: error.message };
        }
    }

    async saveSettings(settingsObj) {
        if (!settingsObj || typeof settingsObj !== 'object') {
            return { success: false, message: 'Paramètres invalides' };
        }

        const entries = Object.entries(settingsObj);
        for (const [key, value] of entries) {
            const result = await this.updateSettings(key, value);
            if (!result || result.success === false) {
                return result || { success: false, message: `Échec sauvegarde pour ${key}` };
            }
        }

        return { success: true, message: 'Paramètres sauvegardés' };
    }

    // Synchronisation (pour compatibilité)
    notifyDataChange(type, action, data) {
        // Émettre un événement pour la synchronisation entre onglets
        const event = new CustomEvent('mtacmn-data-change', {
            detail: { type, action, data }
        });
        window.dispatchEvent(event);
        
        console.log(`🔄 Changement de données: ${type} - ${action}`);
    }
}

// ─── INSTANCE GLOBALE ─────────────────────────────────────────────────
window.MTACMNDatabase = new MTACMNDatabase();

// Auto-initialisation
if (typeof window !== 'undefined') {
    window.MTACMNDatabase.init().then(result => {
        console.log('🎉 Système de base de données MTACMN MySQL prêt');
        console.log('📊 Mode:', window.MTACMNDatabase.fallbackMode ? 'Fallback' : 'MySQL');
    }).catch(error => {
        console.error('💥 Erreur critique d\'initialisation:', error);
    });
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTACMNDatabase;
}
