// Game State Management

class StateManager {
    static currentState = 'normal';
    static gameData = {
        score: 0,
        round: 0,
        totalRounds: 0,
        correctAnswers: 0,
        startTime: null,
        roundStartTime: null
    };

    // Initialize state manager
    static init() {
        this.loadFromStorage();
        this.setupStorageSync();
    }

    // Set the visual state
    static setState(newState) {
        const validStates = ['normal', 'success', 'failure'];
        
        if (!validStates.includes(newState)) {
            console.warn(`Invalid state: ${newState}`);
            return;
        }

        const previousState = this.currentState;
        this.currentState = newState;

        // Update body class for CSS styling
        document.body.className = `state-${newState} background-transition`;

        // Trigger state change event
        this.triggerStateChangeEvent(previousState, newState);

        // Save to storage
        this.saveToStorage();
    }

    // Get current state
    static getState() {
        return this.currentState;
    }

    // Update game data
    static updateGameData(updates) {
        this.gameData = { ...this.gameData, ...updates };
        this.saveToStorage();
        
        // Trigger data update event
        this.triggerDataUpdateEvent(updates);
    }

    // Get game data
    static getGameData() {
        return { ...this.gameData };
    }

    // Reset game data
    static resetGameData() {
        this.gameData = {
            score: 0,
            round: 0,
            totalRounds: 0,
            correctAnswers: 0,
            startTime: null,
            roundStartTime: null
        };
        this.saveToStorage();
    }

    // Calculate accuracy percentage
    static getAccuracy() {
        if (this.gameData.round === 0) return 0;
        return (this.gameData.correctAnswers / this.gameData.round) * 100;
    }

    // Get elapsed time
    static getElapsedTime() {
        if (!this.gameData.startTime) return 0;
        return Date.now() - this.gameData.startTime;
    }

    // Get round elapsed time
    static getRoundElapsedTime() {
        if (!this.gameData.roundStartTime) return 0;
        return Date.now() - this.gameData.roundStartTime;
    }

    // Start new round timer
    static startRoundTimer() {
        this.gameData.roundStartTime = Date.now();
    }

    // Determine appropriate state based on performance
    static evaluatePerformance() {
        const accuracy = this.getAccuracy();
        const roundsCompleted = this.gameData.round;
        
        // Need at least a few rounds to evaluate
        if (roundsCompleted < 3) return 'normal';
        
        // Success state: high accuracy
        if (accuracy >= 70) {
            return 'success';
        }
        
        // Failure state: low accuracy after several rounds
        if (accuracy < 40 && roundsCompleted >= 5) {
            return 'failure';
        }
        
        return 'normal';
    }

    // Auto-update state based on performance
    static autoUpdateState() {
        // Disable auto state updates during gameplay
        // State should only change at the end of the game
        // Keep this method for backward compatibility but do nothing
        return;
    }

    // Save state to localStorage
    static saveToStorage() {
        try {
            const stateData = {
                currentState: this.currentState,
                gameData: this.gameData,
                timestamp: Date.now()
            };
            localStorage.setItem('kanjiquest_state', JSON.stringify(stateData));
        } catch (error) {
            console.warn('Failed to save state to localStorage:', error);
        }
    }

    // Load state from localStorage
    static loadFromStorage() {
        try {
            const saved = localStorage.getItem('kanjiquest_state');
            if (saved) {
                const stateData = JSON.parse(saved);
                
                // Check if data is recent (within last hour)
                const isRecent = Date.now() - stateData.timestamp < 3600000;
                
                if (isRecent && stateData.gameData.totalRounds > 0) {
                    this.currentState = stateData.currentState || 'normal';
                    this.gameData = { ...this.gameData, ...stateData.gameData };
                    
                    // Update visual state
                    document.body.className = `state-${this.currentState}`;
                }
            }
        } catch (error) {
            console.warn('Failed to load state from localStorage:', error);
        }
    }

    // Clear saved state
    static clearStorage() {
        try {
            localStorage.removeItem('kanjiquest_state');
        } catch (error) {
            console.warn('Failed to clear state from localStorage:', error);
        }
    }

    // Set up automatic storage sync
    static setupStorageSync() {
        // Save state periodically
        setInterval(() => {
            if (this.gameData.totalRounds > 0) {
                this.saveToStorage();
            }
        }, 30000); // Every 30 seconds

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }

    // Trigger state change event
    static triggerStateChangeEvent(previousState, newState) {
        const event = new CustomEvent('statechange', {
            detail: {
                previousState,
                newState,
                gameData: this.getGameData()
            }
        });
        document.dispatchEvent(event);
    }

    // Trigger data update event
    static triggerDataUpdateEvent(updates) {
        const event = new CustomEvent('dataupdate', {
            detail: {
                updates,
                gameData: this.getGameData()
            }
        });
        document.dispatchEvent(event);
    }

    // Add event listener for state changes
    static onStateChange(callback) {
        document.addEventListener('statechange', callback);
    }

    // Add event listener for data updates
    static onDataUpdate(callback) {
        document.addEventListener('dataupdate', callback);
    }

    // Get performance summary
    static getPerformanceSummary() {
        const accuracy = this.getAccuracy();
        const elapsedTime = this.getElapsedTime();
        const avgTimePerRound = this.gameData.round > 0 ? elapsedTime / this.gameData.round : 0;
        
        let performance = 'Beginner';
        if (accuracy >= 90) performance = 'Expert';
        else if (accuracy >= 75) performance = 'Advanced';
        else if (accuracy >= 60) performance = 'Intermediate';
        else if (accuracy >= 40) performance = 'Novice';
        
        return {
            accuracy: accuracy.toFixed(1),
            performance,
            totalTime: Math.floor(elapsedTime / 1000),
            avgTimePerRound: Math.floor(avgTimePerRound / 1000),
            score: this.gameData.score,
            correctAnswers: this.gameData.correctAnswers,
            totalRounds: this.gameData.round
        };
    }
}
