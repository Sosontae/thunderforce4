#!/bin/bash

# Create asset directories if they don't exist
mkdir -p assets/sprites
mkdir -p assets/audio
mkdir -p assets/backgrounds
mkdir -p assets/fonts

echo "🎮 Thunder Force IV Asset Downloader"
echo "===================================="

# Function to download sprite sheets from spriters-resource
download_sprites() {
    echo "📦 Downloading sprites..."
    
    # Note: Direct download from spriters-resource requires manual navigation
    # These are example commands - you'll need to get the actual URLs from the site
    
    # Player ship (Rynex)
    echo "  ⬇️  Downloading Rynex sprite..."
    curl -L "https://www.spriters-resource.com/download/2845/" -o assets/sprites/rynex_temp.zip 2>/dev/null || echo "    ❌ Failed to download Rynex"
    
    # Extract if zip
    if [ -f assets/sprites/rynex_temp.zip ]; then
        unzip -q assets/sprites/rynex_temp.zip -d assets/sprites/
        rm assets/sprites/rynex_temp.zip
    fi
    
    # For now, let's create placeholder images
    echo "  ⚠️  Note: You'll need to manually download sprites from spriters-resource"
    echo "  Visit: https://www.spriters-resource.com/sega_genesis_32x/thunderforce4/"
}

# Function to download music from archive.org
download_music() {
    echo "🎵 Downloading music from Archive.org..."
    
    # Archive.org allows direct downloads
    BASE_URL="https://archive.org/download/md_music_thunder_force_iv"
    
    # Download key music tracks
    declare -a tracks=(
        "01_lightning_strikes_again.ogg:lightning_strikes_again.ogg"
        "02_tan_tan_ta_ta_ta_tan.ogg:tan_tan_ta_ta_ta_tan.ogg"
        "03_dont_go_off.ogg:dont_go_off.ogg"
        "04_fighting_back.ogg:fighting_back.ogg"
        "06_evil_destroyer.ogg:evil_destroyer.ogg"
        "07_space_walk.ogg:space_walk.ogg"
        "09_attack_sharply.ogg:attack_sharply.ogg"
        "10_the_sky_line.ogg:the_sky_line.ogg"
        "13_sand_hell.ogg:sand_hell.ogg"
        "17_battle_ship.ogg:battle_ship.ogg"
        "25_metal_squad.ogg:metal_squad.ogg"
        "31_war_like_requiem.ogg:war_like_requiem.ogg"
        "36_stand_up_against_myself.ogg:stand_up_against_myself.ogg"
        "37_dead_end.ogg:dead_end.ogg"
    )
    
    for track in "${tracks[@]}"; do
        IFS=':' read -r source dest <<< "$track"
        echo "  ⬇️  Downloading $dest..."
        curl -L "$BASE_URL/$source" -o "assets/audio/$dest" --progress-bar
    done
}

# Function to create placeholder assets
create_placeholders() {
    echo "🎨 Creating placeholder assets..."
    
    # Create a simple Python script to generate placeholder images
    cat > create_placeholders.py << 'EOF'
from PIL import Image, ImageDraw, ImageFont
import os

def create_sprite(name, width, height, color, text=None):
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw border
    draw.rectangle([0, 0, width-1, height-1], outline=color, width=2)
    
    # Draw cross
    draw.line([0, 0, width-1, height-1], fill=color, width=1)
    draw.line([width-1, 0, 0, height-1], fill=color, width=1)
    
    # Add text if provided
    if text:
        try:
            # Try to use a basic font
            font = ImageFont.load_default()
            draw.text((5, 5), text, fill=color, font=font)
        except:
            pass
    
    return img

# Create sprite placeholders
sprites = {
    'rynex.png': (48, 32, '#00ffff', 'SHIP'),
    'gargoyle_diver.png': (32, 32, '#ff6600', 'E1'),
    'faust.png': (40, 40, '#ff0066', 'E2'),
    'armament_claw.png': (64, 48, '#ff0000', 'E3'),
    'evil_core.png': (128, 96, '#9900ff', 'BOSS'),
    'hell_arm.png': (96, 80, '#ff00ff', 'ARM'),
    'ratt_carry.png': (48, 32, '#ffaa00', 'RAT'),
    'spark_lancer.png': (80, 64, '#00ff00', 'SPK'),
    'versus.png': (64, 64, '#ffff00', 'VS'),
    'dust_eag.png': (48, 48, '#ff9900', 'DST'),
    'explosion_set2.png': (512, 512, '#ff6600', None),
    'pixel_explosion.png': (256, 256, '#ffff00', None),
    'simple_explosion.png': (128, 128, '#ff0000', None),
    'bullet_collection.png': (256, 64, '#00ffff', None)
}

os.makedirs('assets/sprites', exist_ok=True)

for filename, (w, h, color, text) in sprites.items():
    sprite = create_sprite(filename.split('.')[0], w, h, color, text)
    sprite.save(f'assets/sprites/{filename}')
    print(f"Created placeholder: {filename}")

# Create simple background
bg = Image.new('RGB', (800, 600), '#000033')
draw = ImageDraw.Draw(bg)
for i in range(50):
    import random
    x = random.randint(0, 800)
    y = random.randint(0, 600)
    draw.point((x, y), fill='#ffffff')
bg.save('assets/backgrounds/starfield1.jpg')
print("Created placeholder: starfield1.jpg")
EOF

    # Check if PIL is installed
    if python3 -c "import PIL" 2>/dev/null; then
        echo "  ✅ Creating placeholder images..."
        python3 create_placeholders.py
        rm create_placeholders.py
    else
        echo "  ⚠️  Pillow not installed. Install with: pip install Pillow"
        echo "  ⚠️  Skipping placeholder creation"
    fi
}

# Function to download sound effects
download_sound_effects() {
    echo "🔊 Downloading sound effects..."
    
    # Create some basic sound effects using sox if available
    if command -v sox &> /dev/null; then
        echo "  ✅ Generating sound effects with sox..."
        
        # Laser sound
        sox -n assets/audio/laser1.wav synth 0.1 sine 800-400 fade 0 0.1 0.05
        
        # Explosion
        sox -n assets/audio/explosion_01.ogg synth 0.5 noise fade 0 0.5 0.2
        
        # Beep
        sox -n assets/audio/retro_beep_04.ogg synth 0.1 sine 440
        
        echo "  ✅ Basic sound effects created"
    else
        echo "  ⚠️  sox not installed. Install with: sudo apt-get install sox"
        echo "  ⚠️  Sound effects will be missing"
    fi
}

# Main execution
echo ""
echo "Starting asset download process..."
echo ""

# Download sprites
# download_sprites

# Download music
download_music

# Download/create sound effects
download_sound_effects

# Create placeholders for missing assets
create_placeholders

echo ""
echo "✅ Asset download complete!"
echo ""
echo "📝 Next steps:"
echo "1. Manually download sprites from: https://www.spriters-resource.com/sega_genesis_32x/thunderforce4/"
echo "2. Click on each sprite (like 'Fire Leo 04 Rynex') and download the PNG"
echo "3. Place the downloaded PNGs in assets/sprites/ with these names:"
echo "   - Fire Leo 04 'Rynex' → rynex.png"
echo "   - Gargoyle Diver → gargoyle_diver.png"
echo "   - Faust → faust.png"
echo "   - Armament Claw → armament_claw.png"
echo "   - Evil Core → evil_core.png"
echo "   - etc."
echo ""
echo "4. Run the game with: npm start" 