// Quiz Engine for generating questions and handling answers

class QuizEngine {
    // Generate a multiple choice question for a given kanji
    static generateQuestion(kanjiData) {
        // Randomly choose question type
        const questionTypes = ['meaning', 'kunyomi', 'onyomi'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        return this.createQuestion(kanjiData, questionType);
    }

    // Create a question based on type
    static createQuestion(kanjiData, type) {
        switch (type) {
            case 'meaning':
                return this.createMeaningQuestion(kanjiData);
            case 'kunyomi':
                return this.createKunyomiQuestion(kanjiData);
            case 'onyomi':
                return this.createOnyomiQuestion(kanjiData);
            default:
                return this.createMeaningQuestion(kanjiData);
        }
    }

    // Create a meaning question
    static createMeaningQuestion(kanjiData) {
        const correctAnswer = kanjiData.meanings[0]; // Use first meaning as correct
        const distractors = KanjiDatabase.getSimilarMeanings(correctAnswer, 3);
        
        const options = this.shuffleOptions([
            { text: correctAnswer, isCorrect: true },
            ...distractors.map(meaning => ({ text: meaning, isCorrect: false }))
        ]);

        return {
            kanji: kanjiData.kanji,
            questionText: "What does this kanji mean?",
            type: 'meaning',
            options: options,
            correctAnswer: correctAnswer
        };
    }

    // Create a kunyomi reading question
    static createKunyomiQuestion(kanjiData) {
        const correctAnswer = kanjiData.kunyomi[0]; // Use first kunyomi as correct
        const distractors = KanjiDatabase.getRandomReadings('kunyomi', [correctAnswer], 3);
        
        const options = this.shuffleOptions([
            { text: correctAnswer, isCorrect: true },
            ...distractors.map(reading => ({ text: reading, isCorrect: false }))
        ]);

        return {
            kanji: kanjiData.kanji,
            questionText: "What is the kunyomi (Japanese reading) of this kanji?",
            type: 'kunyomi',
            options: options,
            correctAnswer: correctAnswer
        };
    }

    // Create an onyomi reading question
    static createOnyomiQuestion(kanjiData) {
        const correctAnswer = kanjiData.onyomi[0]; // Use first onyomi as correct
        const distractors = KanjiDatabase.getRandomReadings('onyomi', [correctAnswer], 3);
        
        const options = this.shuffleOptions([
            { text: correctAnswer, isCorrect: true },
            ...distractors.map(reading => ({ text: reading, isCorrect: false }))
        ]);

        return {
            kanji: kanjiData.kanji,
            questionText: "What is the onyomi (Chinese reading) of this kanji?",
            type: 'onyomi',
            options: options,
            correctAnswer: correctAnswer
        };
    }

    // Shuffle array of options
    static shuffleOptions(options) {
        const shuffled = [...options];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Validate an answer
    static validateAnswer(question, selectedOption) {
        return selectedOption.isCorrect;
    }

    // Get explanation for the correct answer
    static getExplanation(kanjiData, questionType) {
        const explanations = {
            meaning: `The kanji ${kanjiData.kanji} means "${kanjiData.meanings.join(', ')}".`,
            kunyomi: `The kunyomi reading of ${kanjiData.kanji} is ${kanjiData.kunyomi.join(', ')}.`,
            onyomi: `The onyomi reading of ${kanjiData.kanji} is ${kanjiData.onyomi.join(', ')}.`
        };
        
        return explanations[questionType] || 'No explanation available.';
    }

    // Generate hint for a question
    static generateHint(kanjiData, questionType) {
        const hints = {
            meaning: `Think about the examples: ${kanjiData.examples.slice(0, 2).join(', ')}`,
            kunyomi: `This is the native Japanese reading for ${kanjiData.kanji}`,
            onyomi: `This is the Chinese-derived reading for ${kanjiData.kanji}`
        };
        
        return hints[questionType] || 'No hint available.';
    }

    // Calculate score based on accuracy and time
    static calculateScore(isCorrect, timeElapsed) {
        if (!isCorrect) return 0;
        
        let baseScore = 100;
        
        // Time bonus for quick answers (under 5 seconds)
        if (timeElapsed < 5000) {
            baseScore += 20;
        }
        
        return baseScore;
    }

    // Get difficulty rating for a kanji
    static getDifficulty(kanjiData) {
        // Simple difficulty based on number of readings and stroke count estimation
        const readingCount = kanjiData.kunyomi.length + kanjiData.onyomi.length;
        
        if (readingCount <= 2) return 'easy';
        if (readingCount <= 4) return 'medium';
        return 'hard';
    }
}
