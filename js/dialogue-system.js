// JRPG-style Dialogue System

class DialogueSystem {
    static currentDialogue = null;
    static isActive = false;
    static typewriterSpeed = 50; // milliseconds per character

    // Show a dialogue with typewriter effect
    static showDialogue(character, text, onComplete = null) {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentDialogue = {
            character: character,
            text: text,
            onComplete: onComplete
        };

        this.createDialogueBox();
        this.animateText(text, onComplete);
    }

    // Create the dialogue box HTML
    static createDialogueBox() {
        // Remove existing dialogue if any
        this.hideDialogue();

        const dialogueHTML = `
            <div class="dialogue-container" id="dialogue-container">
                <div class="dialogue-box">
                    <div class="dialogue-content">
                        <div class="character-portrait ${this.currentDialogue.character}">
                            ${this.getCharacterEmoji(this.currentDialogue.character)}
                        </div>
                        <div class="dialogue-text-area">
                            <div class="character-name">
                                ${this.getCharacterName(this.currentDialogue.character)}
                            </div>
                            <div class="dialogue-text" id="dialogue-text"></div>
                        </div>
                    </div>
                    <div class="continue-indicator" id="continue-indicator" style="display: none;">
                        ▼
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dialogueHTML);
        
        // Trigger animation
        setTimeout(() => {
            const container = document.getElementById('dialogue-container');
            container.classList.add('active');
        }, 50);
    }

    // Get character emoji
    static getCharacterEmoji(character) {
        const emojis = {
            'girl': '👧',
            'man': '👨',
            'sensei': '👨‍🏫'
        };
        return emojis[character] || '🤖';
    }

    // Get character display name
    static getCharacterName(character) {
        const names = {
            'girl': 'Yuki',
            'man': 'Sensei',
            'sensei': 'Sensei'
        };
        return names[character] || 'Unknown';
    }

    // Animate text with typewriter effect
    static animateText(text, onComplete) {
        const textElement = document.getElementById('dialogue-text');
        const continueIndicator = document.getElementById('continue-indicator');
        
        if (!textElement) return;

        textElement.textContent = '';
        let currentIndex = 0;

        const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
                textElement.textContent += text[currentIndex];
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                
                // Show continue indicator
                continueIndicator.style.display = 'block';
                
                // Set up click to continue
                this.setupContinueHandler(onComplete);
            }
        }, this.typewriterSpeed);

        // Allow skipping animation
        this.setupSkipHandler(typeInterval, text, textElement, continueIndicator, onComplete);
    }

    // Set up handler for continuing dialogue
    static setupContinueHandler(onComplete) {
        const continueHandler = (e) => {
            // Check if clicking on dialogue box or pressing space/enter
            if (e.type === 'click' || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                
                // Remove event listeners
                document.removeEventListener('click', continueHandler);
                document.removeEventListener('keydown', continueHandler);
                
                // Hide dialogue and call completion callback
                this.hideDialogue(() => {
                    if (onComplete) onComplete();
                });
            }
        };

        document.addEventListener('click', continueHandler);
        document.addEventListener('keydown', continueHandler);
    }

    // Set up handler for skipping typewriter animation
    static setupSkipHandler(interval, fullText, textElement, continueIndicator, onComplete) {
        const skipHandler = (e) => {
            if (e.type === 'click' || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                
                // Clear the typing interval
                clearInterval(interval);
                
                // Show full text immediately
                textElement.textContent = fullText;
                
                // Show continue indicator
                continueIndicator.style.display = 'block';
                
                // Remove skip handler
                document.removeEventListener('click', skipHandler);
                document.removeEventListener('keydown', skipHandler);
                
                // Set up continue handler
                this.setupContinueHandler(onComplete);
            }
        };

        // Only allow skipping while text is being typed
        document.addEventListener('click', skipHandler);
        document.addEventListener('keydown', skipHandler);
        
        // Remove skip handler after typing is done
        setTimeout(() => {
            document.removeEventListener('click', skipHandler);
            document.removeEventListener('keydown', skipHandler);
        }, fullText.length * this.typewriterSpeed + 100);
    }

    // Hide the dialogue box
    static hideDialogue(onComplete = null) {
        const container = document.getElementById('dialogue-container');
        
        if (container) {
            container.classList.remove('active');
            
            setTimeout(() => {
                container.remove();
                this.isActive = false;
                this.currentDialogue = null;
                
                if (onComplete) onComplete();
            }, 500); // Match CSS transition duration
        } else {
            this.isActive = false;
            this.currentDialogue = null;
            if (onComplete) onComplete();
        }
    }

    // Show multiple dialogues in sequence
    static showSequence(dialogues, onComplete = null) {
        if (!dialogues || dialogues.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        let currentIndex = 0;
        
        const showNext = () => {
            if (currentIndex < dialogues.length) {
                const dialogue = dialogues[currentIndex];
                currentIndex++;
                
                this.showDialogue(
                    dialogue.character, 
                    dialogue.text, 
                    showNext
                );
            } else {
                if (onComplete) onComplete();
            }
        };

        showNext();
    }

    // Quick dialogue for feedback
    static showQuickFeedback(text, duration = 2000) {
        const feedback = document.createElement('div');
        feedback.className = 'quick-feedback fade-in';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1.2rem;
            z-index: 2000;
            text-align: center;
        `;
        feedback.textContent = text;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, duration);
    }

    // Set typing speed
    static setTypewriterSpeed(speed) {
        this.typewriterSpeed = speed;
    }

    // Check if dialogue is currently active
    static isDialogueActive() {
        return this.isActive;
    }
}
