# Thunder Force IV Replica

A web-based replica of the classic Thunder Force IV shoot 'em up game, built with vanilla JavaScript and HTML5 Canvas.

## Features

- **Classic Shoot 'em Up Gameplay**: Side-scrolling action with multiple enemy types
- **Weapon System**: Thunder Force-inspired weapon selection and power-ups
- **Touch Controls**: Full support for mobile devices (iOS/Android)
- **Fullscreen Mode**: Press F11 or click the fullscreen button
- **Power-ups**: Collect weapon upgrades, shields, speed boosts, extra lives, and bombs
- **Boss Battles**: Face challenging boss enemies at the end of each level
- **Particle Effects**: Explosions, thrust effects, and visual feedback
- **Sound System**: Sound effects and background music

## How to Play

### Controls

**Desktop:**
- **Arrow Keys/WASD**: Move your ship
- **Space/Z**: Shoot
- **X**: Switch weapons
- **C**: Change speed mode
- **ESC**: Pause game
- **F11**: Toggle fullscreen
- **M**: Mute/unmute sound

**Mobile/Touch:**
- **Left side of screen**: Virtual joystick for movement
- **Right side of screen**: Touch to shoot
- The game automatically enters fullscreen on mobile devices

### Game Features

- Start with 5 lives and full weapon power
- Collect power-ups to enhance your abilities
- Defeat enemies to increase your score
- Extra life every 10,000 points

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thunderforce4.git
cd thunderforce4
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:8080`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technical Details

- Built with vanilla JavaScript (ES6+)
- HTML5 Canvas for rendering
- Modular architecture with separate systems for input, sound, particles, etc.
- Sprite-based graphics with animation support
- Optimized collision detection with spatial partitioning
- Touch-optimized controls for mobile devices

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome for Android)

## Credits

This is a fan-made replica inspired by Thunder Force IV (Lightening Force) by Technosoft. All rights to the original game belong to their respective owners.

## License

This project is for educational purposes only. Please support the official releases of Thunder Force games. 