# Game Design Document - Kanji Quest

## Overview
Kanji Quest is an educational web game designed to teach JLPT N5 kanji through interactive multiple-choice questions with JRPG-style presentation.

## Core Gameplay Loop

### 1. Start Screen
- Player selects number of rounds (5, 10, or 20)
- Clean, minimalist interface with Japanese aesthetic

### 2. Introduction
- JRPG-style dialogue box appears
- Character (Yuki) asks: "Do you know your kanji?"
- Sets the tone and context for learning

### 3. Quiz Phase
- Random kanji is displayed prominently
- Question type randomly selected:
  - Meaning (English translation)
  - Kunyomi reading (Japanese reading)
  - Onyomi reading (Chinese reading)
- 4 multiple choice options presented
- Player selects answer via click or keyboard (1-4)

### 4. Feedback
- Immediate visual feedback for correct/incorrect answers
- Correct answer highlighted if player was wrong
- Score updated in real-time

### 5. State Transitions
- **Normal State**: Default background and neutral dialogues
- **Success State**: Triggered at 70%+ accuracy, celebratory background
- **Failure State**: Triggered at <40% accuracy, different background

### 6. End Game
- Final score and statistics displayed
- State-appropriate dialogue from characters
- Option to play again

## Visual Design

### Background System
- **bg-normal.jpg**: Default state, encouraging learning environment
- **bg-success.jpg**: Celebratory scene for high performance
- **bg-failure.jpg**: Motivational scene for improvement needed

### JRPG Dialogue System
- Classic RPG-style dialogue box at bottom of screen
- Character portraits (girl/man avatars)
- Typewriter text animation for immersion
- Continue indicator (blinking arrow)
- Keyboard/click to advance

### UI Components
- Large, centered kanji display (8rem font)
- Question panel with rounded corners and transparency
- 2x2 grid layout for multiple choice options
- Persistent score panel in top-right corner
- Progress indicator showing current round

## Character System

### Yuki (Girl Character)
- **Role**: Primary guide and encourager
- **Appearance**: Pink/feminine color scheme
- **Dialogues**:
  - Introduction: "Do you know your kanji?"
  - Success: "やった！これが君の賞品だ！" (Yatta! This is your prize!)
  - Encouragement during gameplay

### Sensei (Man Character)
- **Role**: Stern but fair teacher
- **Appearance**: Gray/masculine color scheme  
- **Dialogues**:
  - Failure: "出て行け、この外人！" (Get out, foreigner!)
  - Tough love approach to motivation

## Scoring System

### Points Breakdown
- **Correct Answer**: 100 points
- **Wrong Answer**: 0 points
- **Time Bonus**: +20 points for answers <5 seconds
- **No Penalties**: Focus on positive reinforcement

### Performance Evaluation
- **Success Threshold**: 70%+ accuracy
- **Failure Threshold**: <40% accuracy after 5+ rounds
- **Normal Range**: 40-69% accuracy

## Question Generation

### Algorithm
1. Select random kanji from N5 database
2. Choose question type (meaning, kunyomi, or onyomi)
3. Get correct answer from kanji data
4. Generate 3 plausible distractors:
   - Similar meanings for meaning questions
   - Similar readings for reading questions
5. Randomize option order

### Difficulty Balancing
- Equal probability for all question types
- Distractors chosen to be challenging but fair
- No trick questions or ambiguous options

## Technical Architecture

### File Structure
```
css/
├── styles.css          # Main visual styles
├── jrpg-ui.css        # Dialogue system styles
└── animations.css      # Transitions and effects

js/
├── game.js            # Core game logic
├── kanji-database.js  # Kanji data management
├── quiz-engine.js     # Question generation
├── dialogue-system.js # JRPG dialogue handling
├── state-manager.js   # Game state and persistence
└── ui-controller.js   # Interface interactions

assets/images/
├── bg-normal.jpg      # Default background
├── bg-success.jpg     # Success state background
└── bg-failure.jpg     # Failure state background
```

### Data Management
- Local storage for progress persistence
- JSON-based kanji database
- State management for visual transitions
- Performance tracking and analytics

## Accessibility Features

### Keyboard Navigation
- Number keys (1-4) for option selection
- Space/Enter for continue actions
- Escape for menu access
- R for restart confirmation

### Visual Accessibility
- High contrast text on backgrounds
- Large, readable fonts for kanji display
- Clear visual feedback for interactions
- Scalable UI elements

### Mobile Support
- Responsive grid layouts
- Touch-friendly button sizes
- Optimized image loading
- Gesture prevention (zoom, context menu)

## Educational Philosophy

### Learning Approach
- **Positive Reinforcement**: Focus on encouragement over punishment
- **Immediate Feedback**: Quick response to maintain engagement
- **Contextual Learning**: Examples provided in kanji database
- **Progressive Difficulty**: Random selection maintains challenge

### Motivation Techniques
- **Visual Progression**: Background changes based on performance
- **Character Interaction**: JRPG elements make learning fun
- **Achievement Recognition**: Success states celebrate progress
- **Low Stakes**: No harsh penalties for mistakes

## Future Enhancements

### Phase 2 Features
- Sound effects and background music
- Achievement/badge system
- Detailed statistics and progress tracking
- Hint system for difficult questions

### Phase 3 Features
- User accounts and cloud save
- Multiplayer modes
- Custom study sets
- Integration with spaced repetition

### Technical Improvements
- Progressive Web App (PWA) capabilities
- Offline functionality
- Performance optimizations
- Analytics integration

## Success Metrics

### Engagement
- Average session duration
- Completion rate for different round counts
- Return visit frequency

### Educational Effectiveness
- Score improvement over time
- Accuracy trends by kanji difficulty
- Learning retention measurement

### User Experience
- Positive feedback and ratings
- Social sharing frequency
- Download/play statistics on itch.io
