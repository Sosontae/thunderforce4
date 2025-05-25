# Thunder Force 4 Assets Setup Guide

## Overview
This Thunder Force 4 replica requires authentic sprites and music to properly recreate the experience. Since we cannot include copyrighted assets, you'll need to obtain them separately.

## Music Files Required

Download the Thunder Force 4 soundtrack and place the files in `assets/audio/`:

### Required Music Files:
- `tan_tan_ta_ta_ta_tan.ogg` - Configuration/Menu Music
- `dont_go_off.ogg` - Stage Select
- `fighting_back.ogg` - Stage 1 (Strite)
- `evil_destroyer.ogg` - Stage 1 Boss
- `space_walk.ogg` - Stage 2 (Daser)
- `attack_sharply.ogg` - Stage 2 Boss
- `the_sky_line.ogg` - Stage 3 (Ruins)
- `simmer_down.ogg` - Stage 3 Boss
- `sand_hell.ogg` - Stage 4 (Volbados)
- `strike_out.ogg` - Stage 4 Boss
- `battle_ship.ogg` - Stage 5 (Vios)
- `stranger.ogg` - Stage 5 Boss
- `metal_squad.ogg` - Stage 8 (Vios Fortress)
- `war_like_requiem.ogg` - Final Boss
- `stand_up_against_myself.ogg` - Staff Roll
- `dead_end.ogg` - Game Over

### Where to Find:
1. **VGM Archives**: https://downloads.khinsider.com/game-soundtracks/album/thunder-force-iv-1992-genesis
2. **Internet Archive**: https://archive.org/details/md_music_thunder_force_iv
3. Convert MP3 files to OGG format using tools like Audacity or FFmpeg

### Converting MP3 to OGG:
```bash
# Using FFmpeg
ffmpeg -i "01 - Lightning Strikes Again.mp3" -c:a libvorbis -q:a 4 lightning_strikes_again.ogg
```

## Sprite Files Required

Place sprite sheets in `assets/sprites/`:

### Player Sprites:
- `rynex.png` - Player ship (Rynex) sprite sheet

### Enemy Sprites:
- `gargoyle_diver.png` - Basic enemy type
- `faust.png` - Medium enemy type
- `armament_claw.png` - Heavy enemy type
- `evil_core.png` - Boss sprite
- `hell_arm.png` - Stage 4 boss
- `spark_lancer.png` - Stage 5 boss

### Effect Sprites:
- `explosion_set2.png` - Explosion animations
- `bullet_collection.png` - Various bullet sprites

### Where to Find:
1. **Spriters Resource**: https://www.spriters-resource.com/genesis_32x_scd/thunderforceiv/
2. **Thunder Force Wiki**: Various fan sites with sprite rips
3. **Genesis/Mega Drive sprite archives**

## Sound Effects

Basic placeholder sound effects are included, but you can replace them with authentic ones:

- `laser1.wav` - Player shot
- `explosion_01.ogg` - Enemy explosion
- `powerup.ogg` - Power-up collection
- `weapon_switch.ogg` - Weapon change sound

## Background Images

Place background images in `assets/backgrounds/`:
- `starfield1.jpg` - Space background
- `starfield2.jpg` - Alternative space background
- Stage-specific backgrounds if available

## File Structure

Your assets folder should look like this:
```
assets/
├── audio/
│   ├── tan_tan_ta_ta_ta_tan.ogg
│   ├── fighting_back.ogg
│   ├── metal_squad.ogg
│   └── ... (other music files)
├── sprites/
│   ├── rynex.png
│   ├── gargoyle_diver.png
│   └── ... (other sprites)
├── backgrounds/
│   └── starfield1.jpg
└── fonts/
    └── retro.ttf (optional retro font)
```

## Quick Start

1. Download the Thunder Force 4 OST from the links above
2. Convert tracks to OGG format (keep quality high)
3. Rename files to match the expected names
4. Download sprite sheets from Spriters Resource
5. Place all files in their respective folders
6. Launch the game!

## Legal Notice

Please only use assets you legally own. This project is for educational purposes and requires you to provide your own game assets.

## Troubleshooting

If assets don't load:
1. Check browser console for 404 errors
2. Verify file names match exactly (case-sensitive)
3. Ensure OGG files are properly encoded
4. Try different browsers (Chrome/Firefox work best) 