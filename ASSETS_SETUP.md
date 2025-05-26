# Thunder Force IV Asset Setup

## Overview
This document explains the asset setup for the Thunder Force IV HTML5 replica game.

## Current Asset Status

### ✅ Music (Downloaded from Archive.org)
The following authentic Thunder Force IV music tracks have been downloaded:
- `lightning_strikes_again.ogg` - Opening Theme
- `tan_tan_ta_ta_ta_tan.ogg` - Configuration/Menu Music
- `dont_go_off.ogg` - Stage Select
- `fighting_back.ogg` - Stage 1 Music
- `evil_destroyer.ogg` - Stage 1 Boss
- `space_walk.ogg` - Stage 2 Music
- `attack_sharply.ogg` - Stage 2 Boss
- `the_sky_line.ogg` - Stage 3 Music
- `sand_hell.ogg` - Stage 4 Music
- `battle_ship.ogg` - Stage 5 Music
- `metal_squad.ogg` - Stage 8 Music
- `war_like_requiem.ogg` - Final Boss Music
- `stand_up_against_myself.ogg` - Staff Roll/Ending
- `dead_end.ogg` - Game Over

### ✅ Sound Effects (Generated with Sox)
Basic sound effects have been generated:
- `laser1.wav` - Primary shoot sound
- `shoot_01.ogg` - Alternative shoot
- `explosion_01.ogg` - Basic explosion
- `retro_explosion.ogg` - Alternative explosion
- `boss_explosion.ogg` - Boss explosion
- `powerup.ogg` - Power-up collection
- `beep_01.ogg` - Menu select
- `terminal_01.ogg` - Menu move
- `weapon_switch.ogg` - Weapon switching
- And more...

### 🎨 Sprites (Generated Retro-Style)
Custom retro-style sprites have been generated using Python/PIL:

#### Player Ship
- `rynex.png` - Player ship sprite sheet (240x32, 5 frames)
  - Frame 0: Idle
  - Frame 1: Moving up
  - Frame 2: Moving down
  - Frame 3: Banking left
  - Frame 4: Banking right

#### Enemies
- `gargoyle_diver.png` - Basic flying enemy (32x32)
- `faust.png` - Medium diamond-shaped enemy (40x40)
- `armament_claw.png` - Heavy mechanical enemy (64x48)
- `evil_core.png` - Boss enemy (128x96)
- `hell_arm.png` - Large enemy (96x80)
- `spark_lancer.png` - Advanced enemy (80x64)
- And more...

#### Effects
- `explosion_set2.png` - Explosion animation (512x64, 8 frames)
- `pixel_explosion.png` - Pixel explosion effect (256x256)
- `simple_explosion.png` - Simple explosion (128x128)

#### Power-ups
- `powerup_weapon.png` - Weapon upgrade
- `powerup_shield.png` - Shield
- `powerup_speed.png` - Speed boost
- `powerup_life.png` - Extra life
- `powerup_bomb.png` - Screen-clearing bomb

#### Backgrounds
- `starfield1.jpg` - Basic starfield
- `starfield2.jpg` - Detailed starfield with nebula

## Getting Authentic Sprites

For authentic Thunder Force IV sprites, you can:

1. Visit https://www.spriters-resource.com/sega_genesis_32x/thunderforce4/
2. Click on each sprite sheet to view
3. Download the PNG files
4. Replace the generated sprites in `assets/sprites/`

### Sprite Naming Convention
When downloading authentic sprites, rename them to match:
- Fire Leo 04 "Rynex" → `rynex.png`
- Gargoyle Diver → `gargoyle_diver.png`
- Faust → `faust.png`
- Armament Claw → `armament_claw.png`
- Evil Core → `evil_core.png`
- Hell Arm → `hell_arm.png`
- Spark Lancer → `spark_lancer.png`
- Versus → `versus.png`

## Running the Asset Scripts

### Download Music and Create Placeholders
```bash
./download_assets.sh
```

### Generate Better Sprites
```bash
python3 generate_sprites.py
```

### Generate Additional Sound Effects
```bash
./generate_sound_effects.sh
```

## Asset Requirements

- **Audio**: OGG format for music, WAV/OGG for sound effects
- **Sprites**: PNG format with transparency
- **Backgrounds**: JPG or PNG format

## Notes

- The generated sprites are stylized retro recreations, not exact replicas
- Music is authentic from the Sega Genesis/Mega Drive version
- Sound effects are synthesized approximations
- For the most authentic experience, manually download the original sprite sheets 