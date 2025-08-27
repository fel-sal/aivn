// Version configuration for cache busting
const VERSION_CONFIG = {
    // Main version
    APP_VERSION: '2.0.339',
    
    // Individual file versions (timestamp based)
    FILE_VERSIONS: {
        'kanji-database.js': 1756260339389,
        'quiz-engine.js': 1756260339389,
        'dialogue-system.js': 1756260339389,
        'state-manager.js': 1756260339389,
        'ui-controller.js': 1756260339389,
        'game.js': 1756260339389,
        'kanji-n5.json': 1756260339389
    },
    
    // Helper function to get versioned URL
    getVersionedUrl: function(filename) {
        const version = this.FILE_VERSIONS[filename] || Date.now();
        return `${filename}?v=${version}`;
    },
    
    // Helper to get data URL with version
    getDataUrl: function(filename) {
        const version = this.FILE_VERSIONS[filename] || Date.now();
        return `data/${filename}?v=${version}`;
    }
};

// Make globally available
window.VERSION_CONFIG = VERSION_CONFIG;

console.log('🔄 Version Config loaded:', VERSION_CONFIG.APP_VERSION);
