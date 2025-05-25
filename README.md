# Thunder Force IV Replica

A faithful web-based replica of the classic 1992 Sega Genesis/Mega Drive shoot 'em up Thunder Force IV (Lightening Force in North America).

## 🎮 Play Online

Simply open `index.html` in a modern web browser to play!

## 🎯 Features

### Authentic Thunder Force 4 Gameplay
- **10 Selectable Weapons**: All original weapons including Twin Shot, Back Shot, Rail Gun, Snake, Free Way, Hunter, Blade, Wave, Shield, and CRAW
- **Speed Control System**: 3-speed settings (Slow/Normal/Fast) just like the original
- **Stage-Based Progression**: Multiple stages with unique enemy patterns and boss fights
- **Power-Up System**: Collect power-ups to upgrade weapons and gain abilities
- **Scoring System**: Combo multipliers and bonus scoring

### Controls
- **Arrow Keys / WASD**: Move ship
- **Space / Z**: Fire weapon
- **X**: Change weapon (cycles through all 10 weapons)
- **C**: Speed control (Slow → Normal → Fast)
- **ESC / P**: Pause game
- **M**: Mute/Unmute sound
- **F1**: Show/Hide controls help
- **F11**: Toggle fullscreen

### Technical Features
- **Sprite-Based Graphics**: Uses authentic sprite sheets when available
- **Particle Effects**: Dynamic explosions and visual effects
- **Collision Detection**: Grid-based spatial partitioning for performance
- **Touch Controls**: Virtual joystick support for mobile devices
- **60 FPS Target**: Smooth gameplay with frame limiting
- **Save System**: Progress saving (F5 to save, F9 to load)

## 🎵 Music & Sound

The game is designed to use the original Thunder Force 4 soundtrack. Due to copyright, you'll need to provide your own music files.

### Required Music Tracks:
- Configuration theme (Menu)
- Stage music (Fighting Back, Space Walk, Metal Squad, etc.)
- Boss themes
- Game Over and Staff Roll

See `ASSETS_SETUP.md` for detailed instructions on obtaining and setting up the music files.

## 🎨 Assets Required

### Sprites
- Player ship (Rynex)
- Enemy sprites (Gargoyle Diver, Faust, Armament Claw, etc.)
- Boss sprites
- Explosion animations
- Background images

### How to Set Up Assets:
1. Read `ASSETS_SETUP.md` for detailed instructions
2. Download sprites from Spriters Resource or similar sites
3. Download Thunder Force 4 OST and convert to OGG format
4. Place files in the correct `assets/` subdirectories

## 🚀 Getting Started

1. Clone or download this repository
2. Set up the required assets (see `ASSETS_SETUP.md`)
3. Open `index.html` in Chrome, Firefox, or Edge
4. Press F1 in-game to see controls
5. Enjoy the classic Thunder Force 4 experience!

## 🛠️ Development

### Project Structure
```
thunderforce4/
├── assets/          # Game assets (sprites, audio, backgrounds)
├── src/            
│   ├── entities/    # Game objects (Player, Enemy, Bullet, etc.)
│   ├── scenes/      # Game scenes (Menu, Game, etc.)
│   ├── systems/     # Core systems (Input, Sound, Collision, etc.)
│   └── utils/       # Helper functions and constants
├── index.html       # Main game file
├── style.css        # Game styling
└── README.md        # This file
```

### Key Systems
- **AssetLoader**: Handles loading of all game assets
- **WeaponSystem**: Implements all 10 Thunder Force 4 weapons
- **SpriteRenderer**: Handles sprite animation and rendering
- **CollisionSystem**: Efficient collision detection
- **ParticleSystem**: Visual effects system
- **SoundManager**: Audio playback with pooling

### Debug Features

Access debug functions via browser console:
```javascript
window.debugGame.addLife()      // Add an extra life
window.debugGame.maxPower()     // Max weapon power
window.debugGame.skipLevel()    // Skip to next level
window.debugGame.spawnBoss()    // Spawn boss immediately
window.debugGame.clearEnemies() // Destroy all enemies on screen
```

### Adding New Features
1. Enemies: Add to `ENEMIES` constant and create movement patterns
2. Weapons: Extend `WeaponSystem` with new firing patterns
3. Stages: Add to `STAGES` configuration with enemy waves
4. Effects: Use `ParticleSystem` for new visual effects

## 🎮 Gameplay Tips

1. **Weapon Selection**: Each weapon has unique advantages
   - Twin Shot: Balanced forward firepower
   - Back Shot: Covers front and rear
   - Rail Gun: Piercing high damage
   - Hunter: Homing missiles
   - Wave: Wide coverage

2. **Speed Control**: Master the 3-speed system
   - Slow: Precise dodging
   - Normal: Balanced movement
   - Fast: Quick positioning

3. **Power-Ups**: Collect wisely
   - P: Increases weapon power
   - S: Shield protection
   - 1UP: Extra life

## 🔧 Browser Compatibility

- **Chrome**: ✅ Recommended
- **Firefox**: ✅ Fully supported
- **Edge**: ✅ Fully supported
- **Safari**: ⚠️ May have audio issues
- **Mobile**: ✅ Touch controls supported

## 📝 License

This is a fan-made educational project. Thunder Force IV is owned by Technosoft/Sega. 
Please support the official releases.

## 🙏 Credits

- Original Game: Technosoft (1992)
- Music: Takeshi Yoshida, Toshiharu Yamanishi
- Web Replica: Created with Claude AI assistance

## 🐛 Known Issues

- Sprites may not load without proper asset files
- Audio requires user interaction to start on some browsers
- Performance may vary on older devices

## 🚧 Future Improvements

- [ ] All 10 stages from the original
- [ ] Two-player support
- [ ] Online leaderboards
- [ ] More authentic enemy patterns
- [ ] Options menu with difficulty settings
- [ ] Stage select after completion

---

**Remember**: This replica requires you to provide your own game assets. See `ASSETS_SETUP.md` for instructions! 