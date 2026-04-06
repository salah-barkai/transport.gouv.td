/* ============================================================
   BASE DE DONNÉES MTACMN - VERSION SUPABASE
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================
   Utilisation de Supabase (PostgreSQL) avec API JavaScript
   Migration depuis MySQL/PHP vers Supabase
   ============================================================ */

// ─── IMPORTS ET CONFIGURATION ──────────────────────────────────────
// Note: Inclure le SDK Supabase dans votre HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// ─── DONNÉES INITIALES (pour fallback uniquement) ──────────────────
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
            created_at: new Date('2026-03-21'),
            updated_at: new Date('2026-03-21')
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
            created_at: new Date('2026-03-24'),
            updated_at: new Date('2026-03-24')
        }
    ],
    settings: {
        siteName: "Ministère des Transports, de l'Aviation Civile et de la Météorologie Nationale",
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

// ─── CLIENT SUPABASE ───────────────────────────────────────────────────
class MTACMNSupabaseClient {
    constructor() {
        // Charger la configuration
        this.config = window.SUPABASE_CONFIG || {
            url: 'https://XXXXXXX.supabase.co',
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        };
        
        // Initialiser le client Supabase
        this.supabase = null;
        this.initialized = false;
        this.timeout = 10000;
    }

    async init() {
        try {
            if (typeof window.supabase === 'undefined') {
                throw new Error('SDK Supabase non chargé. Veuillez inclure le script dans votre HTML.');
            }

            this.supabase = window.supabase.createClient(
                this.config.url,
                this.config.anonKey,
                this.config.options
            );

            // Test de connexion
            const { data, error } = await this.supabase
                .from('settings')
                .select('key, value')
                .limit(1);

            if (error) throw error;

            this.initialized = true;
            console.log('✅ Client Supabase initialisé avec succès');
            return { success: true };

        } catch (error) {
            console.error('❌ Erreur d\'initialisation Supabase:', error);
            throw error;
        }
    }

    // Articles
    async getArticles(filters = {}) {
        try {
            let query = this.supabase
                .from('articles')
                .select('*');

            // Appliquer les filtres
            if (filters.statut) {
                query = query.eq('statut', filters.statut);
            }
            if (filters.categorie) {
                query = query.eq('categorie', filters.categorie);
            }
            if (filters.une !== undefined) {
                query = query.eq('une', filters.une);
            }

            // Ordre
            query = query.order('created_at', { ascending: false });

            // Limites
            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, articles: data || [] };

        } catch (error) {
            console.error('❌ Erreur getArticles:', error);
            throw error;
        }
    }

    async createArticle(articleData) {
        try {
            const { data, error } = await this.supabase
                .from('articles')
                .insert([{
                    ...articleData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Article créé avec succès');
            return { success: true, article: data };

        } catch (error) {
            console.error('❌ Erreur createArticle:', error);
            throw error;
        }
    }

    async updateArticle(id, updates) {
        try {
            const { data, error } = await this.supabase
                .from('articles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Article mis à jour avec succès');
            return { success: true, article: data };

        } catch (error) {
            console.error('❌ Erreur updateArticle:', error);
            throw error;
        }
    }

    async deleteArticle(id) {
        try {
            const { error } = await this.supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            console.log('✅ Article supprimé avec succès');
            return { success: true };

        } catch (error) {
            console.error('❌ Erreur deleteArticle:', error);
            throw error;
        }
    }

    async incrementViews(id) {
        try {
            // Appeler la fonction PostgreSQL
            const { error } = await this.supabase
                .rpc('incrementer_vues', { article_id_param: id });

            if (error) throw error;

            return { success: true };

        } catch (error) {
            console.error('❌ Erreur incrementViews:', error);
            throw error;
        }
    }

    // Paramètres
    async getSettings() {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .select('key, value');

            if (error) throw error;

            // Convertir en objet
            const settings = {};
            data.forEach(item => {
                settings[item.key] = item.value;
            });

            return { success: true, settings };

        } catch (error) {
            console.error('❌ Erreur getSettings:', error);
            throw error;
        }
    }

    async updateSetting(key, value) {
        try {
            const { error } = await this.supabase
                .from('settings')
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            console.log('✅ Paramètre mis à jour avec succès');
            return { success: true };

        } catch (error) {
            console.error('❌ Erreur updateSetting:', error);
            throw error;
        }
    }

    // Upload de fichiers
    async uploadFile(file, path) {
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `${path}/${fileName}`;

            const { data, error } = await this.supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Obtenir l'URL publique
            const { data: { publicUrl } } = this.supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl, path: filePath };

        } catch (error) {
            console.error('❌ Erreur uploadFile:', error);
            throw error;
        }
    }

    // Authentification
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return { success: true, user: data.user, session: data.session };

        } catch (error) {
            console.error('❌ Erreur signIn:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            return { success: true };

        } catch (error) {
            console.error('❌ Erreur signOut:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            return user;

        } catch (error) {
            console.error('❌ Erreur getCurrentUser:', error);
            return null;
        }
    }
}

// ─── CLASSE PRINCIPALE DE BASE DE DONNÉES (SUPABASE) ─────────────────
class MTACMNSupabaseDatabase {
    constructor() {
        this.client = new MTACMNSupabaseClient();
        this.initialized = false;
        this.fallbackMode = false;
    }

    async init() {
        try {
            console.log('🔄 Initialisation de la base de données Supabase...');
            
            await this.client.init();
            
            this.initialized = true;
            console.log('✅ Base de données Supabase initialisée avec succès');
            
            return { success: true };

        } catch (error) {
            console.error('❌ Erreur de connexion Supabase:', error);
            console.log('🔄 Activation du mode fallback avec les données initiales...');
            return this.initFallback();
        }
    }

    // Mode fallback (uniquement si Supabase indisponible)
    initFallback() {
        this.fallbackMode = true;
        this.initialized = true;
        console.log('⚠️ Mode fallback activé - Utilisation des données initiales');
        return { success: true };
    }

    // Articles
    async getArticles(filters = {}) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            let articles = INITIAL_DATA.articles;
            
            // Appliquer les filtres
            if (filters.statut) {
                articles = articles.filter(a => a.statut === filters.statut);
            }
            if (filters.categorie) {
                articles = articles.filter(a => a.categorie === filters.categorie);
            }
            
            return { success: true, articles: articles };
        }
        
        try {
            const response = await this.client.getArticles(filters);
            return response;
        } catch (error) {
            console.error('❌ Erreur getArticles:', error);
            return { success: false, articles: [] };
        }
    }

    async addArticle(article) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            console.warn('⚠️ Mode fallback: Article non sauvegardé en base de données');
            return { success: false, message: 'Mode fallback - Supabase indisponible' };
        }
        
        try {
            const result = await this.client.createArticle(article);
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
            console.warn('⚠️ Mode fallback: Article non mis à jour en base de données');
            return { success: false, message: 'Mode fallback - Supabase indisponible' };
        }
        
        try {
            const result = await this.client.updateArticle(id, updates);
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
            console.warn('⚠️ Mode fallback: Article non supprimé en base de données');
            return { success: false, message: 'Mode fallback - Supabase indisponible' };
        }
        
        try {
            const result = await this.client.deleteArticle(id);
            console.log('✅ Article supprimé avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur deleteArticle:', error);
            return { success: false, message: error.message };
        }
    }

    async incrementViews(id) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            console.warn('⚠️ Mode fallback: Vues non incrémentées');
            return { success: false };
        }
        
        try {
            const result = await this.client.incrementViews(id);
            return result;
        } catch (error) {
            console.error('❌ Erreur incrementViews:', error);
            return { success: false };
        }
    }

    // Paramètres
    async getSettings() {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            return { success: true, settings: INITIAL_DATA.settings };
        }
        
        try {
            const response = await this.client.getSettings();
            return response;
        } catch (error) {
            console.error('❌ Erreur getSettings:', error);
            return { success: false, settings: {} };
        }
    }

    async updateSettings(key, value) {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            console.warn('⚠️ Mode fallback: Paramètres non sauvegardés');
            return { success: false, message: 'Mode fallback - Supabase indisponible' };
        }
        
        try {
            const result = await this.client.updateSetting(key, value);
            console.log('✅ Paramètres mis à jour avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur updateSettings:', error);
            return { success: false, message: error.message };
        }
    }

    // Upload de fichiers
    async uploadFile(file, path = 'images') {
        if (!this.initialized) await this.init();
        
        if (this.fallbackMode) {
            console.warn('⚠️ Mode fallback: Upload non disponible');
            return { success: false, message: 'Mode fallback - Supabase indisponible' };
        }
        
        try {
            const result = await this.client.uploadFile(file, path);
            console.log('✅ Fichier uploadé avec succès');
            return result;
        } catch (error) {
            console.error('❌ Erreur uploadFile:', error);
            return { success: false, message: error.message };
        }
    }

    // Authentification
    async signIn(email, password) {
        if (!this.initialized) await this.init();
        
        try {
            const result = await this.client.signIn(email, password);
            return result;
        } catch (error) {
            console.error('❌ Erreur signIn:', error);
            return { success: false, message: error.message };
        }
    }

    async signOut() {
        if (!this.initialized) await this.init();
        
        try {
            const result = await this.client.signOut();
            return result;
        } catch (error) {
            console.error('❌ Erreur signOut:', error);
            return { success: false, message: error.message };
        }
    }

    async getCurrentUser() {
        if (!this.initialized) await this.init();
        
        try {
            const user = await this.client.getCurrentUser();
            return user;
        } catch (error) {
            console.error('❌ Erreur getCurrentUser:', error);
            return null;
        }
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
window.MTACMNDatabase = new MTACMNSupabaseDatabase();

// Auto-initialisation
if (typeof window !== 'undefined') {
    window.MTACMNDatabase.init().then(result => {
        console.log('🎉 Système de base de données MTACMN Supabase prêt');
        console.log('📊 Mode:', window.MTACMNDatabase.fallbackMode ? 'Fallback' : 'Supabase');
    }).catch(error => {
        console.error('💥 Erreur critique d\'initialisation:', error);
    });
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTACMNSupabaseDatabase;
}
