# Thunder Force IV Replica

A web-based replica of the classic Thunder Force IV (Lightening Force) shoot 'em up game, built with HTML5 Canvas and JavaScript.

## Features

- **Classic Gameplay**: Side-scrolling shoot 'em up action inspired by Thunder Force IV
- **Multiple Enemy Types**: Basic, Medium, Heavy, and Boss enemies with different behaviors
- **Power-Up System**: 
  - Weapon upgrades (up to 5 levels)
  - Shield protection
  - Speed boost
  - Extra lives
  - Screen-clearing bombs
- **4 Levels**: Each with unique backgrounds and enemy patterns
- **Particle Effects**: Explosions, sparks, smoke, and engine trails
- **Combo System**: Build combos for score multipliers
- **Touch Controls**: Full support for mobile devices
- **Sound System**: Simulated sound effects and music (audio files not included)

## How to Play

### Controls

**Keyboard:**
- **Arrow Keys** or **WASD**: Move your ship
- **Space** or **Z**: Shoot
- **Esc** or **P**: Pause/Resume
- **M**: Mute/Unmute sound
- **F1**: Toggle debug mode
- **F11**: Toggle fullscreen

**Touch/Mobile:**
- Touch and drag on the left side of the screen to move
- Touch the right side of the screen to shoot continuously

### Game Mechanics

1. **Lives**: You start with 3 lives. Lose all lives and it's game over!
2. **Power Levels**: Collect weapon power-ups to increase your firepower
3. **Shield**: Protects you from one hit
4. **Score**: Destroy enemies to earn points. Build combos for multipliers!
5. **Boss Battles**: Each level ends with a challenging boss fight

## Running the Game

1. **Direct Opening**: Simply open the `index.html` file in a modern web browser
2. **Local Server** (recommended for best performance):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
   Then navigate to `http://localhost:8000`

## Browser Requirements

- Modern browser with HTML5 Canvas support
- JavaScript enabled
- Recommended: Chrome, Firefox, Safari, or Edge (latest versions)

## Debug Features

When debug mode is enabled (F1), you can see:
- FPS counter
- Current scene name
- Particle count

### Console Commands

The game provides debug functions accessible via the browser console:
```javascript
window.debugGame.addLife()      // Add an extra life
window.debugGame.maxPower()     // Max weapon power
window.debugGame.skipLevel()    // Skip to next level
window.debugGame.spawnBoss()    // Spawn boss immediately
window.debugGame.clearEnemies() // Destroy all enemies on screen
```

## Project Structure

```
thunderforce4/
├── index.html              # Main HTML file
├── style.css              # Game styling
├── src/
│   ├── main.js            # Entry point
│   ├── Game.js            # Main game class
│   ├── entities/          # Game objects
│   │   ├── GameObject.js  # Base class
│   │   ├── Player.js      # Player ship
│   │   ├── Enemy.js       # Enemy ships
│   │   ├── Bullet.js      # Projectiles
│   │   ├── PowerUp.js     # Power-up items
│   │   └── Explosion.js   # Explosion effects
│   ├── systems/           # Game systems
│   │   ├── InputManager.js    # Input handling
│   │   ├── CollisionSystem.js # Collision detection
│   │   ├── ParticleSystem.js  # Particle effects
│   │   └── SoundManager.js    # Audio management
│   ├── scenes/            # Game scenes
│   │   ├── Scene.js       # Base scene class
│   │   ├── MenuScene.js   # Main menu
│   │   ├── GameScene.js   # Main gameplay
│   │   └── Level1.js      # Level-specific logic
│   └── utils/             # Utilities
│       ├── constants.js   # Game constants
│       └── helpers.js     # Helper functions
└── assets/               # Game assets (empty)
    ├── sprites/          # Sprite images
    ├── audio/            # Sound effects
    └── backgrounds/      # Background images
```

## Customization

### Adding New Levels

1. Modify the `LEVELS` constant in `constants.js`
2. Create new level classes extending `GameScene`
3. Implement custom enemy patterns and backgrounds

### Modifying Game Balance

Edit values in `src/utils/constants.js`:
- Player stats (speed, lives, etc.)
- Enemy health and damage
- Weapon power levels
- Power-up durations

## Performance Tips

- The game is optimized for 60 FPS
- Particle effects are limited to prevent slowdown
- Spatial partitioning is used for collision detection
- Off-screen objects are automatically removed

## Known Limitations

- Audio files are not included (sound system uses placeholders)
- Sprite graphics are procedurally drawn (no image assets)
- Save/Load functionality is basic (localStorage only)

## Credits

This is a fan-made replica created for educational purposes. Thunder Force IV is owned by Technosoft/SEGA.

## License

This project is for educational purposes only. All rights to Thunder Force IV belong to their respective owners. 