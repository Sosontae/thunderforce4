# Thunder Force IV Sprite Assets

This directory contains sprite assets for the Thunder Force IV replica game. While we've collected high-quality free sprites as a starting point, achieving the authentic Thunder Force IV aesthetic will require additional work.

## Directory Structure

```
sprites/
├── player/              # Player ship sprites
├── enemies/             # Enemy sprites organized by type
│   ├── basic/          # Small, simple enemies
│   ├── medium/         # Mid-sized enemies  
│   ├── heavy/          # Large enemies
│   └── bosses/         # Boss sprites
├── weapons/            # Projectile and weapon sprites
├── effects/            # Visual effects (explosions, etc.)
├── powerups/           # Power-up item sprites
├── ui/                 # User interface elements
└── backgrounds/        # Background elements (if any)
```

## Available Sprites

We have collected sprites from the following sources:

1. **Space Shooter Pack** by ansimuz (CC0)
   - Player ship with animations
   - Various enemy types
   - Explosions and effects
   - Power-up items

2. **Shmup Ships** by surt (CC-BY-SA 3.0/GPL)
   - High-quality ship designs
   - Multiple factions (human, biomech, void, saucer)
   - Great for bosses and special enemies

3. **Arcade Space Shooter** by GrafxKid (CC0)
   - Retro-style sprites
   - Complete sprite sheet with UI elements

## Using the Sprites

### In Your Game Code
The sprites are organized in folders matching the SpriteManager.js structure. You can load them using:

```javascript
// Example loading code
spriteManager.loadSprite('player/player_ship.png', 'player');
spriteManager.loadSprite('enemies/basic/enemy-small.png', 'enemy_basic');
```

### Sprite Specifications
Most sprites are provided as sprite sheets with multiple frames. Check each sprite's dimensions and frame layout before use.

## Thunder Force IV Style Guide

See `THUNDER_FORCE_IV_STYLE_GUIDE.svg` for visual reference on:
- Color palettes
- Metallic shading techniques
- Engine and weapon glow effects
- Design principles

## Enhancing the Sprites

To achieve authentic Thunder Force IV quality:

1. **Apply Metallic Shading**
   - Use gradients from the style guide
   - Add highlights and shadows
   - Create reflective surfaces

2. **Add Glow Effects**
   - Bright orange/yellow for engines
   - Cyan/blue for weapons
   - Use blur and overlay layers

3. **Create Animations**
   - Banking animations for ships
   - Thrust variations
   - Damage states
   - Death sequences

4. **Maintain Consistency**
   - Use the same color palette across all sprites
   - Keep similar pixel density
   - Match lighting direction (top-left)

## Tools Recommended

- **Aseprite** - Excellent for pixel art and animations
- **GraphicsGale** - Free pixel art editor
- **GIMP/Photoshop** - For advanced effects and touch-ups
- **Piskel** - Browser-based sprite editor

## Next Steps

1. Review the existing sprites and identify gaps
2. Enhance sprites to match Thunder Force IV style
3. Create missing sprites (especially bosses and special weapons)
4. Test sprites in-game for proper scaling and appearance

## License Notes

Please respect the licenses of the sprite sources:
- CC0 sprites can be used freely
- CC-BY-SA sprites require attribution and sharing under same license
- See `SPRITE_DOCUMENTATION.md` for detailed license information 