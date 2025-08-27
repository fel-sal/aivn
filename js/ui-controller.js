// UI Controller for managing interface interactions

class UIController {
    static isInitialized = false;
    static currentScreen = 'start';

    // Initialize UI Controller
    static init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupAnimationHelpers();
        this.isInitialized = true;
        
        console.log('UI Controller initialized');
    }

    // Set up global event listeners
    static setupEventListeners() {
        // Handle button clicks with sound feedback
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .option-button, .round-select')) {
                this.playClickSound();
                this.addButtonPressEffect(e.target);
            }
        });

        // Handle hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('.option-button')) {
                this.addHoverEffect(e.target);
            }
        });

        // Handle responsive design changes
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle state changes
        StateManager.onStateChange((e) => {
            this.handleStateChange(e.detail);
        });

        // Handle data updates
        StateManager.onDataUpdate((e) => {
            this.updateDisplayElements(e.detail);
        });
    }

    // Set up keyboard shortcuts
    static setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Number keys for option selection
            if (e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                this.selectOption(parseInt(e.key) - 1);
            }
            
            // Space or Enter for continue
            if (e.key === ' ' || e.key === 'Enter') {
                if (!DialogueSystem.isDialogueActive()) {
                    this.handleContinueAction();
                }
            }
            
            // Escape for menu
            if (e.key === 'Escape') {
                this.showMenu();
            }
            
            // R for restart
            if (e.key === 'r' || e.key === 'R') {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.confirmRestart();
                }
            }
        });
    }

    // Select option by index
    static selectOption(index) {
        const options = document.querySelectorAll('.option-button');
        if (options[index] && !options[index].disabled) {
            options[index].click();
        }
    }

    // Handle continue action
    static handleContinueAction() {
        const continueBtn = document.querySelector('.continue-btn, .next-btn');
        if (continueBtn && !continueBtn.disabled) {
            continueBtn.click();
        }
    }

    // Add button press effect
    static addButtonPressEffect(button) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 150);
    }

    // Add hover effect
    static addHoverEffect(element) {
        if (!element.classList.contains('disabled')) {
            element.style.transform = 'translateY(-2px)';
        }
    }

    // Play click sound (placeholder)
    static playClickSound() {
        // TODO: Implement sound system
        // For now, just add visual feedback
    }

    // Handle screen transitions
    static transitionToScreen(screenName, element = null) {
        const container = element || document.querySelector('.game-container');
        
        // Fade out current content
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.currentScreen = screenName;
            
            // Fade in new content
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 300);
    }

    // Show loading indicator
    static showLoading(message = 'Loading...') {
        const loadingHTML = `
            <div class="loading-screen fade-in">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        const container = document.querySelector('.game-container');
        container.innerHTML = loadingHTML;
    }

    // Hide loading indicator
    static hideLoading() {
        const loading = document.querySelector('.loading-screen');
        if (loading) {
            loading.classList.add('fade-out');
            setTimeout(() => loading.remove(), 300);
        }
    }

    // Show confirmation dialog
    static showConfirmation(message, onConfirm, onCancel = null) {
        const confirmHTML = `
            <div class="confirmation-overlay">
                <div class="confirmation-dialog scale-in">
                    <div class="confirmation-message">${message}</div>
                    <div class="confirmation-buttons">
                        <button class="confirm-btn">Yes</button>
                        <button class="cancel-btn">No</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', confirmHTML);
        
        // Handle button clicks
        document.querySelector('.confirm-btn').addEventListener('click', () => {
            this.hideConfirmation();
            if (onConfirm) onConfirm();
        });
        
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.hideConfirmation();
            if (onCancel) onCancel();
        });
    }

    // Hide confirmation dialog
    static hideConfirmation() {
        const overlay = document.querySelector('.confirmation-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Show menu
    static showMenu() {
        // TODO: Implement pause/settings menu
        console.log('Menu requested');
    }

    // Confirm restart
    static confirmRestart() {
        this.showConfirmation(
            'Are you sure you want to restart the game?',
            () => {
                location.reload();
            }
        );
    }

    // Handle window resize
    static handleResize() {
        // Adjust UI elements for different screen sizes
        const container = document.querySelector('.game-container');
        if (container) {
            if (window.innerWidth < 768) {
                container.classList.add('mobile-layout');
            } else {
                container.classList.remove('mobile-layout');
            }
        }
    }

    // Handle state changes
    static handleStateChange(detail) {
        const { previousState, newState } = detail;
        
        console.log(`State changed: ${previousState} → ${newState}`);
        
        // Add visual effects for state transitions
        if (newState === 'success') {
            this.showFloatingText('Great job!', 'success');
        } else if (newState === 'failure') {
            this.showFloatingText('Keep trying!', 'warning');
        }
    }

    // Update display elements
    static updateDisplayElements(detail) {
        const { updates } = detail;
        
        // Update score display
        if (updates.score !== undefined) {
            this.updateScoreDisplay(updates.score);
        }
        
        // Update round counter
        if (updates.round !== undefined) {
            this.updateRoundDisplay(updates.round);
        }
    }

    // Update score display with animation
    static updateScoreDisplay(newScore) {
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${newScore}`;
            scoreElement.classList.add('score-update');
            setTimeout(() => scoreElement.classList.remove('score-update'), 400);
        }
    }

    // Update round display
    static updateRoundDisplay(currentRound) {
        const roundElement = document.querySelector('.round-info');
        if (roundElement) {
            const totalRounds = StateManager.getGameData().totalRounds;
            roundElement.textContent = `Round ${currentRound}/${totalRounds}`;
        }
    }

    // Show floating text
    static showFloatingText(text, type = 'info') {
        const floatingText = document.createElement('div');
        floatingText.className = `floating-text floating-${type}`;
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2rem;
            font-weight: bold;
            z-index: 1500;
            pointer-events: none;
            color: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#3498db'};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;
        
        document.body.appendChild(floatingText);
        
        // Animate and remove
        floatingText.classList.add('floating-points');
        setTimeout(() => floatingText.remove(), 1500);
    }

    // Set up animation helpers
    static setupAnimationHelpers() {
        // Add CSS for dynamic animations
        const style = document.createElement('style');
        style.textContent = `
            .confirmation-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            
            .confirmation-dialog {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                max-width: 400px;
                margin: 2rem;
            }
            
            .confirmation-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            
            .confirm-btn, .cancel-btn {
                padding: 0.5rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
            }
            
            .confirm-btn {
                background: #e74c3c;
                color: white;
            }
            
            .cancel-btn {
                background: #95a5a6;
                color: white;
            }
            
            .mobile-layout .kanji-display {
                font-size: 4rem !important;
            }
            
            .mobile-layout .question-panel {
                padding: 1rem !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Get current screen
    static getCurrentScreen() {
        return this.currentScreen;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});
