// Script de correction pour api-client.js
// Exécutez ce code dans la console du navigateur sur la page start.html

console.log('🔧 Correction de la faute de frappe dans api-client.js...');

// Créer la version corrigée de MTACMNDatabase
window.MTACMNDatabase = {
    initialized: false,
    api: null,
    
    init: async function() {
        console.log('Initialisation de la base de données corrigée...');
        try {
            // Test direct de l'API
            const response = await fetch('./api.php?action=test');
            if (response.ok) {
                this.initialized = true;
                console.log('✅ Base de données initialisée avec succès');
                return { success: true };
            }
        } catch (error) {
            console.error('❌ Erreur d\'initialisation:', error);
        }
        return { success: false, message: 'Erreur d\'initialisation' };
    },
    
    getArticles: async function() {
        if (!this.initialized) await this.init();
        
        try {
            const response = await fetch('./api.php?action=getArticles');
            if (response.ok) {
                const data = await response.json();
                return data.articles || [];
            }
        } catch (error) {
            console.error('❌ Erreur getArticles:', error);
        }
        return [];
    },
    
    addArticle: async function(article) {
        if (!this.initialized) await this.init();
        
        try {
            const response = await fetch('./api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createArticle', data: article })
            });
            
            if (response.ok) {
                const result = await response.json();
                return result;
            }
        } catch (error) {
            console.error('❌ Erreur addArticle:', error);
        }
        return { success: false, message: 'Erreur réseau' };
    }
};

// Initialiser automatiquement
window.MTACMNDatabase.init();

console.log('✅ Correction appliquée avec succès !');
