/* ============================================================
   Configuration Supabase MTACMN
   Ministère des Transports, Aviation Civile & Météorologie Nationale
   ============================================================ */

// Configuration Supabase
const SUPABASE_CONFIG = {
    // URL et clés (remplacez XXXXXX par vos vraies valeurs)
    url: 'https://modpcwtnnnnxjhfhqfzw.supabase.co',
    anonKey: 'sb_publishable_XInFbMcsLX7Iac8qNsofCA_6gETzyTB', // Votre clé publique
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Votre clé secrète (temporairement utilisée comme clé anon pour tester)
    
    // Options de configuration
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        db: {
            schema: 'public'
        }
    },
    
    // Configuration du site
    site: {
        name: 'Ministère des Transports, de l\'Aviation Civile et de la Météorologie Nationale',
        sigle: 'MTACMN',
        url: window.location.origin,
        adminUrl: `${window.location.origin}/admin.html`
    },
    
    // Upload et médias
    upload: {
        maxSize: 5242880, // 5MB
        path: 'uploads/',
        bucket: 'images',
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    },
    
    // Cache
    cache: {
        enabled: true,
        duration: 3600000 // 1 heure en ms
    }
};

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}

// Configuration globale
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
