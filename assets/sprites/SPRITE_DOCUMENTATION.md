# Thunder Force IV Sprite Assets Documentation

## Overview
This directory contains sprite assets for the Thunder Force IV replica game. The sprites come from various open-source collections and are organized by category.

## Available Sprites

### Player Ships
- **player_ship.png** - Player spaceship sprite with animation frames
  - Source: Space Shooter Pack by ansimuz (CC0)
  - Frames: Multiple animation states
- **ships_human.png** - Collection of human faction ships
  - Source: Shmup Ships by surt (CC-BY-SA 3.0/GPL)
  - Multiple ship designs suitable for player ship

### Enemies

#### Basic Enemies
- **enemy-small.png** - Small enemy sprites
  - Source: Space Shooter Pack by ansimuz (CC0)
  - Multiple small enemy types

#### Medium Enemies  
- **enemy-medium.png** - Medium sized enemy sprites
  - Source: Space Shooter Pack by ansimuz (CC0)
- **ships_saucer.png** - UFO/saucer type enemies
  - Source: Shmup Ships by surt (CC-BY-SA 3.0/GPL)

#### Heavy Enemies
- **ships_void.png** - Large void faction ships
  - Source: Shmup Ships by surt (CC-BY-SA 3.0/GPL)

#### Bosses
- **enemy-big.png** - Large enemy/boss sprites
  - Source: Space Shooter Pack by ansimuz (CC0)
- **ships_biomech.png** - Biomechanical boss designs
  - Source: Shmup Ships by surt (CC-BY-SA 3.0/GPL)

### Weapons
- **laser-bolts.png** - Various projectile sprites
  - Source: Space Shooter Pack by ansimuz (CC0)
  - Includes player and enemy projectiles

### Effects
- **explosion.png** - Explosion animation frames
  - Source: Space Shooter Pack by ansimuz (CC0)
  - 8-frame explosion animation

### Power-ups
- **power-up.png** - Power-up item sprites
  - Source: Space Shooter Pack by ansimuz (CC0)
  - Various power-up types

### UI Elements
- **arcade_space_shooter.png** - Complete retro arcade sprite sheet
  - Source: Arcade Space Shooter by GrafxKid (CC0)
  - Includes UI elements, enemies, player ship, and effects

## Sprite Integration Guidelines

### Color Palette
To match Thunder Force IV's aesthetic:
- Primary colors: Metallic blues, grays, and silvers
- Accent colors: Bright oranges, reds for weapons/engines
- Use gradients for metallic shading
- Add scan lines or dithering for retro feel

### Recommended Modifications
1. **Metallic Shading**: Add metallic highlights and shadows
2. **Engine Glow**: Add bright thrust effects to ships
3. **Weapon Effects**: Enhance projectiles with glow/trail effects
4. **Damage States**: Create damaged versions of sprites
5. **Animation**: Add rotation frames for smooth movement

### Performance Considerations
- Keep sprite sheets under 2048x2048 for compatibility
- Use power-of-2 dimensions when possible
- Optimize transparent areas to reduce file size
- Consider sprite batching for similar objects

## License Information

### CC0 (Public Domain)
- Space Shooter Pack sprites
- Arcade Space Shooter sprites
- Can be used freely without attribution

### CC-BY-SA 3.0 / GPL
- Shmup Ships by surt
- Requires attribution: "Sprites by surt"
- Share modifications under same license

## Next Steps

To achieve AAA-quality Thunder Force IV style sprites:

1. **Art Direction**: Commission or create custom sprites that match Thunder Force IV's specific aesthetic
2. **Sprite Enhancement**: Use image editing software to add:
   - Metallic textures and shading
   - Detailed mechanical parts
   - Glowing elements (engines, weapons)
   - Battle damage variations
   
3. **Animation**: Create smooth animation sequences:
   - Banking animations for player ship
   - Thrust variations
   - Weapon charging effects
   - Death/explosion sequences

4. **Consistency**: Ensure all sprites share:
   - Similar color palette
   - Consistent pixel density
   - Matching art style
   - Proper scale relationships

## Sprite Requirements Still Needed

### High Priority
- Thunder Sword weapon effect
- Stage-specific boss sprites
- Environmental hazards
- Background elements
- HUD/UI elements in TF4 style

### Medium Priority
- Weapon power-up variations
- Shield effects
- Speed boost trails
- Collectible items
- Mini-boss sprites

### Low Priority
- Background decoration sprites
- Particle effects
- Menu graphics
- Victory/defeat animations 