// Main Game Logic for Kanji Quest

class KanjiQuest {
    constructor() {
        this.currentState = 'normal'; // normal, success, failure
        this.currentRound = 0;
        this.totalRounds = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.currentKanji = null;
        this.gameStarted = false;
    }

    // Initialize the game
    async init() {
        console.log('Kanji Quest initialized');
        
        try {
            // Load kanji data first
            await KanjiDatabase.loadKanjiData();
            console.log('Kanji data loaded successfully');
            
            this.setupEventListeners();
            this.showStartScreen();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to load game data. Please refresh the page.');
        }
    }

    // Set up event listeners
    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Round selection buttons
        document.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target);
            
            if (e.target.classList.contains('round-select')) {
                console.log('Round select clicked:', e.target.dataset.rounds);
                const rounds = parseInt(e.target.dataset.rounds);
                this.startGame(rounds);
            }
            
            if (e.target.classList.contains('option-button')) {
                console.log('Option button clicked');
                this.handleAnswer(e.target);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '4') {
                const optionIndex = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option-button');
                if (options[optionIndex]) {
                    this.handleAnswer(options[optionIndex]);
                }
            }
        });
    }

    // Show the start screen
    showStartScreen() {
        const container = document.querySelector('.game-container');
        console.log('Showing start screen, container found:', !!container);
        
        if (container) {
            container.innerHTML = `
                <div class="start-screen fade-in">
                    <h1 class="game-title">Kanji Quest</h1>
                    <p class="game-subtitle">Test your JLPT N5 knowledge!</p>
                    <div class="round-selection">
                        <h2>How many rounds do you want to play?</h2>
                        <div class="round-buttons">
                            <button class="round-select" data-rounds="5" onclick="window.KanjiGame.startGame(5)">5 Rounds</button>
                            <button class="round-select" data-rounds="10" onclick="window.KanjiGame.startGame(10)">10 Rounds</button>
                            <button class="round-select" data-rounds="20" onclick="window.KanjiGame.startGame(20)">20 Rounds</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Verify buttons were created
            const buttons = container.querySelectorAll('.round-select');
            console.log('Round select buttons created:', buttons.length);
            
            // Also add direct event listeners as backup
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    console.log('Direct click listener triggered');
                    const rounds = parseInt(e.target.dataset.rounds);
                    this.startGame(rounds);
                });
            });
        } else {
            console.error('Game container not found!');
        }
    }

    // Show error message
    showError(message) {
        const container = document.querySelector('.game-container');
        if (container) {
            container.innerHTML = `
                <div class="error-screen fade-in">
                    <h1>Error</h1>
                    <p>${message}</p>
                    <button onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }

    // Start the game with selected rounds
    startGame(rounds) {
        console.log('Starting game with', rounds, 'rounds');
        
        this.totalRounds = rounds;
        this.currentRound = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.gameStarted = true;
        
        // Set initial state to normal (maintain throughout game)
        this.setState('normal');
        
        console.log('Game state set, showing dialogue');
        
        // Show intro dialogue
        DialogueSystem.showDialogue('girl', 'Do you know your kanji?', () => {
            console.log('Dialogue completed, starting first round');
            this.nextRound();
        });
    }

    // Move to next round
    nextRound() {
        this.currentRound++;
        
        if (this.currentRound > this.totalRounds) {
            this.endGame();
            return;
        }

        // Generate new question
        this.currentKanji = KanjiDatabase.getRandomKanji();
        const question = QuizEngine.generateQuestion(this.currentKanji);
        
        this.displayQuestion(question);
        this.updateUI();
    }

    // Display the current question
    displayQuestion(question) {
        const container = document.querySelector('.game-container');
        container.innerHTML = `
            <div class="score-panel">
                <div class="score">Score: ${this.score}</div>
                <div class="round-info">Round ${this.currentRound}/${this.totalRounds}</div>
            </div>
            
            <div class="kanji-display kanji-reveal">
                ${question.kanji}
            </div>
            
            <div class="question-panel slide-in-bottom">
                <div class="question-text">${question.questionText}</div>
                <div class="options-grid">
                    ${question.options.map((option, index) => `
                        <button class="option-button" data-option="${index}" data-correct="${option.isCorrect}">
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Handle answer selection
    handleAnswer(button) {
        const isCorrect = button.dataset.correct === 'true';
        const allButtons = document.querySelectorAll('.option-button');
        
        // Disable all buttons
        allButtons.forEach(btn => btn.disabled = true);
        
        if (isCorrect) {
            button.classList.add('pulse-correct');
            this.score += 100;
            this.correctAnswers++;
            this.showFeedback('Correct! +100 points', 'success');
        } else {
            button.classList.add('shake-wrong');
            // Highlight correct answer
            allButtons.forEach(btn => {
                if (btn.dataset.correct === 'true') {
                    btn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                }
            });
            this.showFeedback('Wrong answer!', 'error');
        }

        // Wait for animation, then continue
        setTimeout(() => {
            this.nextRound();
        }, 2000);
    }

    // Show feedback message
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type} fade-in`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    // End the game and show results
    endGame() {
        const accuracy = (this.correctAnswers / this.totalRounds) * 100;
        
        // Determine final state based on accuracy
        if (accuracy > 70) {
            this.setState('success');
            DialogueSystem.showDialogue('girl', 'やった！これが君の賞品だ！', () => {
                this.showResults();
            });
        } else {
            this.setState('failure');
            DialogueSystem.showDialogue('man', '出て行け、この外人！', () => {
                this.showResults();
            });
        }
    }

    // Show final results
    showResults() {
        const accuracy = (this.correctAnswers / this.totalRounds) * 100;
        const container = document.querySelector('.game-container');
        
        container.innerHTML = `
            <div class="results-screen fade-in">
                <h1>Game Complete!</h1>
                <div class="results-stats">
                    <div class="stat">
                        <span class="stat-label">Final Score:</span>
                        <span class="stat-value">${this.score}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Correct Answers:</span>
                        <span class="stat-value">${this.correctAnswers}/${this.totalRounds}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Accuracy:</span>
                        <span class="stat-value">${accuracy.toFixed(1)}%</span>
                    </div>
                </div>
                <button onclick="location.reload()" class="play-again-btn">Play Again</button>
            </div>
        `;
    }

    // Set visual state
    setState(state) {
        this.currentState = state;
        document.body.className = `state-${state} background-transition`;
    }

    // Update UI elements
    updateUI() {
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
            scoreElement.classList.add('score-update');
            setTimeout(() => scoreElement.classList.remove('score-update'), 400);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const game = new KanjiQuest();
    await game.init();
    
    // Make game globally accessible
    window.KanjiGame = game;
});
