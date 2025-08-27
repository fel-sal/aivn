// Kanji Database for JLPT N5

class KanjiDatabase {
    static kanjiData = [];
    static isLoaded = false;

    // Load kanji data from JSON file
    static async loadKanjiData() {
        if (this.isLoaded) return;
        
        try {
            // Use version config for cache busting
            const url = window.VERSION_CONFIG ? 
                window.VERSION_CONFIG.getDataUrl('kanji-n5.json') : 
                `data/kanji-n5.json?v=${Date.now()}`;
            
            console.log('Loading kanji data from:', url);
            const response = await fetch(url);
            const data = await response.json();
            
            // Transform JSON data to match expected format
            this.kanjiData = data.kanji.map(kanji => ({
                kanji: kanji.character,
                meanings: kanji.meanings,
                kunyomi: kanji.kunyomi,
                onyomi: kanji.onyomi,
                examples: kanji.examples ? kanji.examples.map(ex => ex.word) : [],
                difficulty: kanji.difficulty || 'medium'
            }));
            
            this.isLoaded = true;
            console.log(`Loaded ${this.kanjiData.length} kanji characters`);
            console.log('Sample of loaded kanjis:', this.kanjiData.slice(0, 5).map(k => k.kanji));
            console.log('Last few kanjis:', this.kanjiData.slice(-5).map(k => k.kanji));
        } catch (error) {
            console.error('❌ CRITICAL: Failed to load kanji data:', error);
            console.error('❌ ERROR DETAILS:', error.stack);
            console.error('❌ URL was:', url);
            
            // Use fallback data as last resort
            console.warn('⚠️ Using fallback data - only 5 basic kanjis available');
            this.loadFallbackData();
        }
    }

    // Fallback data in case JSON loading fails
    static loadFallbackData() {
        this.kanjiData = [
            {
                kanji: "一",
                meanings: ["one", "first"],
                kunyomi: ["ひと", "ひとつ"],
                onyomi: ["イチ", "イツ"],
                examples: ["一つ", "一人", "一日"]
            },
            {
                kanji: "人",
                meanings: ["person", "people"],
                kunyomi: ["ひと"],
                onyomi: ["ジン", "ニン"],
                examples: ["人", "日本人", "外国人"]
            },
            {
                kanji: "日",
                meanings: ["day", "sun"],
                kunyomi: ["ひ", "か"],
                onyomi: ["ニチ", "ジツ"],
                examples: ["日", "今日", "毎日"]
            },
            {
                kanji: "水",
                meanings: ["water"],
                kunyomi: ["みず"],
                onyomi: ["スイ"],
                examples: ["水", "水曜日", "お水"]
            },
            {
                kanji: "大",
                meanings: ["big", "large"],
                kunyomi: ["おお", "おおきい"],
                onyomi: ["ダイ", "タイ"],
                examples: ["大きい", "大学", "大人"]
            }
        ];
        this.isLoaded = true;
        console.log('Loaded fallback kanji data');
    }

    // Get a random kanji from the database
    static getRandomKanji() {
        if (!this.isLoaded) {
            console.warn('Kanji data not loaded yet');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.kanjiData.length);
        return this.kanjiData[randomIndex];
    }

    // Get all kanji data
    static getAllKanji() {
        return this.kanjiData;
    }

    // Get kanji by character
    static getKanjiByCharacter(character) {
        return this.kanjiData.find(kanji => kanji.kanji === character);
    }

    // Get random meanings (for creating distractors)
    static getRandomMeanings(exclude = [], count = 3) {
        const allMeanings = this.kanjiData.flatMap(kanji => kanji.meanings);
        const filtered = allMeanings.filter(meaning => !exclude.includes(meaning));
        
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Get random readings (for creating distractors)
    static getRandomReadings(type = 'kunyomi', exclude = [], count = 3) {
        const allReadings = this.kanjiData.flatMap(kanji => kanji[type]);
        const filtered = allReadings.filter(reading => !exclude.includes(reading));
        
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Get similar meanings for better distractors
    static getSimilarMeanings(targetMeaning, count = 3) {
        // Simple similarity based on word length and first letter
        const allMeanings = this.kanjiData.flatMap(kanji => kanji.meanings);
        const filtered = allMeanings.filter(meaning => 
            meaning !== targetMeaning && 
            Math.abs(meaning.length - targetMeaning.length) <= 2
        );
        
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}
