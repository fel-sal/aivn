# Kanji Quest - JLPT N5 Educational Game

An interactive HTML5 game to learn JLPT N5 kanji through JRPG-style quiz gameplay with visual progression and motivational dialogues.

## 📋 Project Overview

### Objective
Create an educational web game that teaches JLPT N5 kanji through interactive multiple-choice quizzes, featuring JRPG-style dialogue boxes and visual progression based on player performance.

### Visual Concept
- **Normal State (img1.JPG)**: Default game background
- **Success State (img2.JPG)**: Activated when player achieves high scores
- **Failure State (img3.JPG)**: Activated when player has poor performance

## 🎮 Game Mechanics

### Game Flow
1. **Start Screen**: Player selects number of rounds (5, 10, or 20)
2. **Intro Dialogue**: "Do you know your kanji?" in JRPG-style dialogue box
3. **Quiz Rounds**: Random kanji with multiple choice questions
4. **End State**: Success or failure dialogue with visual change

### Scoring System
- **Correct Answer**: +100 points
- **Wrong Answer**: 0 points
- **Time Bonus**: +20 points for quick answers (<5 seconds)

### Visual State Transitions
- **Normal State**: Default state during gameplay
- **Success State**: Triggered when score ≥ 70% correct answers
- **Failure State**: Triggered when score < 40% correct answers

### Question Format
Each round presents:
- **A random JLPT N5 kanji** displayed prominently
- **Question type** (randomly chosen):
  - "What does this kanji mean?" (English meaning)
  - "How do you read this kanji?" (hiragana reading - kunyomi or onyomi)
- **4 multiple choice options** (1 correct, 3 distractors)

## 🏗️ Repository Structure

```
/
├── README.md                 # This file
├── index.html               # Main game page
├── css/
│   ├── styles.css           # Main styles
│   ├── jrpg-ui.css         # JRPG dialogue box styles
│   └── animations.css       # Transitions and animations
├── js/
│   ├── game.js              # Main game logic
│   ├── kanji-database.js    # JLPT N5 kanji data
│   ├── quiz-engine.js       # Quiz logic and scoring
│   ├── dialogue-system.js   # JRPG dialogue box system
│   ├── state-manager.js     # Game state management
│   └── ui-controller.js     # UI interactions
├── assets/
│   ├── images/
│   │   ├── bg-normal.jpg    # img1.JPG - Normal background
│   │   ├── bg-success.jpg   # img2.JPG - Success background
│   │   └── bg-failure.jpg   # img3.JPG - Failure background
│   ├── fonts/
│   │   ├── japanese.woff    # Japanese characters font
│   │   └── pixel-font.woff  # JRPG-style font
│   └── audio/               # (future) Sound effects
├── data/
│   └── kanji-n5.json       # Complete JLPT N5 kanji database
└── docs/
    ├── game-design.md      # Detailed game design document
    └── itch-deployment.md  # itch.io deployment guide
```

## 🎨 Interface Design

### Main Layout
- **Background**: Responsive image that changes based on game state
- **Kanji Display Area**: Large, centered kanji character
- **Question Panel**: Clear question text
- **Multiple Choice Buttons**: 4 clickable options in grid layout
- **Score Panel**: Current score and progress indicator
- **JRPG Dialogue Box**: Bottom overlay for character dialogues

### JRPG Dialogue System
- **Classic RPG-style dialogue box** at bottom of screen
- **Typewriter text effect** for immersive experience
- **Character portrait** (optional sensei avatar)
- **Continue button/key** to advance dialogue

### Dialogue Content

#### Pre-Game Dialogue
- **Girl**: "Do you know your kanji?"

#### Success State (img2.JPG)
- **Girl**: "やった！これが君の賞品だ！"

#### Failure State (img3.JPG)
- **Man**: "出て行け、この外人！"

#### During Gameplay (Normal State)
- "Think carefully about this kanji..."
- "Great job! Keep it up!"
- "Don't give up! Every mistake is learning!"
- "Remember the radicals and components!"

## 🔧 Technical Features

### Core Functionality
- [ ] Round selection screen (5, 10, 20 rounds)
- [ ] JRPG-style dialogue system with typewriter effect
- [ ] Random kanji selection from N5 database
- [ ] Multiple choice question generation
- [ ] Real-time scoring system
- [ ] Dynamic background transitions
- [ ] Progress tracking within rounds
- [ ] Local storage for high scores

### Question Generation Algorithm
1. **Select random kanji** from N5 database
2. **Choose question type**: meaning or reading
3. **Generate correct answer** from kanji data
4. **Create 3 plausible distractors**:
   - Similar meanings for meaning questions
   - Similar hiragana for reading questions
5. **Randomize option order**

### Advanced Features (Future)
- [ ] Achievement system
- [ ] Study mode with explanations
- [ ] Streak counters
- [ ] Detailed statistics
- [ ] Social sharing of scores

## 🎯 Kanji Database Structure

```json
{
  "kanji": "水",
  "meanings": ["water", "fluid"],
  "kunyomi": ["みず"],
  "onyomi": ["スイ"],
  "examples": ["水曜日 (すいようび)", "水道 (すいどう)"],
  "jlpt_level": "N5"
}
```

## 🚀 Development Timeline

### Phase 1: Core Structure (Week 1)
- Set up HTML structure and CSS framework
- Implement basic JRPG dialogue system
- Create round selection screen

### Phase 2: Quiz Engine (Week 2)
- Build kanji database
- Implement multiple choice logic
- Add scoring system

### Phase 3: Visual Polish (Week 3)
- Integrate background images
- Add state transition animations
- Fine-tune JRPG dialogue styling

### Phase 4: Testing & Deployment (Week 4)
- Cross-browser testing
- Mobile responsiveness
- itch.io preparation and deployment

## 📱 Compatibility & Performance

- **Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Devices**: Desktop, tablet, mobile responsive
- **Technologies**: HTML5, CSS3, JavaScript ES6+
- **Performance**: <2MB total size, <1s load time

## 🎮 User Experience Flow

1. **Landing Page**: Game title and "Start Game" button
2. **Round Selection**: Choose 5, 10, or 20 rounds
3. **Intro Dialogue**: "Do you know your kanji?"
4. **Quiz Loop**: 
   - Display kanji
   - Show question
   - Present 4 options
   - Show result feedback
   - Update score
5. **End Game**: Success or failure state with dialogue
6. **Results Screen**: Final score and option to replay

## 🏆 Success Metrics

- **Engagement**: Average session duration > 5 minutes
- **Education**: Player improvement over multiple sessions
- **Retention**: Return rate within 7 days > 30%
- **Distribution**: 1000+ downloads on itch.io in first month

## 📝 Development Notes

### Technical Considerations
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Optimize images, lazy loading
- **Data Management**: Efficient kanji selection algorithms

### JRPG Aesthetics
- **Pixel-perfect fonts** for authentic retro feel
- **Smooth animations** for dialogue and transitions
- **Sound design** for button clicks and feedback
- **Visual hierarchy** with clear focus states

---

**Status**: ✅ v1.0 Released - Complete Visual Novel Game!  
**Last Updated**: January 2025  
**Target Platform**: itch.io  
**License**: MIT  

## 🎮 Play Now
- **Local**: Open `index.html` in your browser
- **Live Demo**: `http://localhost:8000` (with Python server)
- **Development**: Check `examples/` for test versions

## 🎨 v1.0 Release Notes - Visual Novel Style
- **NEW**: Harmonized visual layout with character portraits
- **NEW**: Custom 768x1080px character art integration
- **NEW**: Picture frame system for character display
- **Enhanced**: 20 JLPT N5 kanji with improved quiz system
- **Enhanced**: JRPG-style dialogue system with visual consistency
- **Enhanced**: Responsive design optimized for all devices
- **Ready**: Fully prepared for itch.io deployment

### 🖼️ Character Art Integration
- Professional picture frame display
- Dynamic character states (Normal/Success/Failure)
- Harmonized color scheme across all UI elements
- Mobile-responsive portrait layout

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.