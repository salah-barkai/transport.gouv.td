/* ============================================================
   BASE DE DONNÉES MTACMN - VERSION LOCAL/STANDALONE
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================
   Simulation de base de données en JavaScript pur
   Fonctionne sans PHP/MySQL - Mode développement/démonstration
   ============================================================ */

// Données initiales étendues
const LOCAL_DATA = {
    articles: [
        {
            id: 1,
            titre: "Audit OACI : La ministre évalue les préparatifs à l'aéroport Hassan Djamous",
            date: "21 mars 2026",
            categorie: "Aviation Civile",
            resume: "La ministre Fatimé Goukouni Weddeye a effectué une visite à l'Aéroport international Hassan Djamous à quelques jours d'un audit international de l'OACI en matière de sûreté aérienne.",
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
            resume: "L'ANAM a lancé officiellement la Semaine nationale de la météorologie (SENAMET) sous le thème « Observer aujourd'hui et protéger demain », avec le soutien de partenaires internationaux.",
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
        contactEmail: "contact@transports.gouv.td",
        contactPhone: "+235 22 51 44 92",
        address: "N'Djaména, République du Tchad",
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

// Client API Local (simule les appels API)
class MTACMNLocalClient {
    constructor() {
        this.data = { ...LOCAL_DATA };
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const savedArticles = localStorage.getItem('mtacmn_articles_local');
            const savedSettings = localStorage.getItem('mtacmn_settings_local');
            
            if (savedArticles) {
                this.data.articles = JSON.parse(savedArticles);
            }
            if (savedSettings) {
                this.data.settings = { ...this.data.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.warn('⚠️ Erreur chargement localStorage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('mtacmn_articles_local', JSON.stringify(this.data.articles));
            localStorage.setItem('mtacmn_settings_local', JSON.stringify(this.data.settings));
        } catch (error) {
            console.warn('⚠️ Erreur sauvegarde localStorage:', error);
        }
    }

    // Simule un délai réseau
    async delay(ms = 100) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getArticles(filters = {}) {
        await this.delay(50); // Simuler un délai réseau
        
        console.log('📊 getArticles avec filtres:', filters);
        
        let articles = [...this.data.articles];
        
        // Appliquer les filtres
        if (filters.statut) {
            articles = articles.filter(a => a.statut === filters.statut);
        }
        if (filters.categorie) {
            articles = articles.filter(a => a.categorie === filters.categorie);
        }
        if (filters.une) {
            articles = articles.filter(a => a.une === true);
        }
        
        // Appliquer la pagination
        if (filters.limit) {
            const offset = parseInt(filters.offset) || 0;
            const limit = parseInt(filters.limit);
            articles = articles.slice(offset, offset + limit);
        }
        
        // Trier par date (plus récent d'abord)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log(`📰 ${articles.length} articles retournés`);
        return articles;
    }

    async createArticle(articleData) {
        await this.delay(150);
        
        const newArticle = {
            id: Math.max(...this.data.articles.map(a => a.id)) + 1,
            ...articleData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            vues: 0
        };
        
        this.data.articles.unshift(newArticle);
        this.saveToStorage();
        
        console.log('✅ Article créé:', newArticle);
        return newArticle;
    }

    async updateArticle(id, updates) {
        await this.delay(100);
        
        const index = this.data.articles.findIndex(a => a.id === parseInt(id));
        if (index === -1) {
            throw new Error('Article non trouvé');
        }
        
        this.data.articles[index] = {
            ...this.data.articles[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.saveToStorage();
        
        console.log('✅ Article mis à jour:', this.data.articles[index]);
        return this.data.articles[index];
    }

    async deleteArticle(id) {
        await this.delay(100);
        
        const index = this.data.articles.findIndex(a => a.id === parseInt(id));
        if (index === -1) {
            throw new Error('Article non trouvé');
        }
        
        const deleted = this.data.articles.splice(index, 1)[0];
        this.saveToStorage();
        
        console.log('✅ Article supprimé:', deleted);
        return deleted;
    }

    async getSettings() {
        await this.delay(50);
        return this.data.settings;
    }

    async updateSetting(key, value) {
        await this.delay(100);
        
        this.data.settings[key] = value;
        this.saveToStorage();
        
        console.log(`✅ Paramètre ${key} mis à jour:`, value);
        return { key, value };
    }
}

// Exporter pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MTACMNLocalClient, LOCAL_DATA };
} else {
    window.MTACMNLocalClient = MTACMNLocalClient;
    window.LOCAL_DATA = LOCAL_DATA;
}
