#!/bin/bash

echo "🎮 Downloading Thunder Force IV Music..."
echo "====================================="

cd assets/audio || exit

# Define the tracks we need
declare -A tracks=(
    ["lightning_strikes_again.mp3"]="01%20-%20Lightning%20Strikes%20Again%20%28Opening%20Theme%29.mp3"
    ["tan_tan_ta_ta_ta_tan.mp3"]="02%20-%20Tan%20Tan%20Ta%20Ta%20Ta%20Tan%20%28Configuration%29.mp3"
    ["dont_go_off.mp3"]="03%20-%20Don't%20Go%20Off%20%28Course%20Select%29.mp3"
    ["fighting_back.mp3"]="04%20-%20Fighting%20Back%20%28Stage%201A%29.mp3"
    ["evil_destroyer.mp3"]="06%20-%20Evil%20Destroyer%20%28Stage%201%20Boss%29.mp3"
    ["space_walk.mp3"]="07%20-%20Space%20Walk%20%28Stage%202A%29.mp3"
    ["attack_sharply.mp3"]="09%20-%20Attack%20Sharply%20%28Stage%202%20Boss%29.mp3"
    ["the_sky_line.mp3"]="10%20-%20The%20Sky%20Line%20%28Stage%203A%29.mp3"
    ["sand_hell.mp3"]="13%20-%20Sand%20Hell%20%28Stage%204A%29.mp3"
    ["battle_ship.mp3"]="17%20-%20Battle%20Ship%20%28Stage%205%29.mp3"
    ["metal_squad.mp3"]="25%20-%20Metal%20Squad%20%28Stage%208%29.mp3"
    ["war_like_requiem.mp3"]="31%20-%20War%20Like%20Requiem%20%28Stage%2010%20Boss%29.mp3"
    ["stand_up_against_myself.mp3"]="36%20-%20Stand%20Up%20Against%20Myself%20%28Staff%20Roll%29.mp3"
    ["dead_end.mp3"]="37%20-%20Dead%20End%20%28Game%20Over%29.mp3"
)

# Base URL for VBR MP3 files
BASE_URL="https://archive.org/download/md_music_thunder_force_iv"

echo "📥 Downloading MP3 files..."
for dest in "${!tracks[@]}"; do
    source="${tracks[$dest]}"
    echo "  ⬇️  Downloading $dest..."
    
    # Use wget with proper headers
    wget -q --show-progress \
         -O "$dest" \
         --user-agent="Mozilla/5.0" \
         "$BASE_URL/$source"
    
    # Check if download was successful
    if [ -f "$dest" ] && [ $(stat -c%s "$dest") -gt 1000 ]; then
        echo "    ✅ Downloaded successfully"
    else
        echo "    ❌ Download failed, trying alternative..."
        # Try without URL encoding
        alt_source="${source//%20/ }"
        wget -q --show-progress \
             -O "$dest" \
             --user-agent="Mozilla/5.0" \
             "$BASE_URL/$alt_source"
    fi
done

echo ""
echo "🔄 Converting MP3 to OGG..."

# Convert MP3 to OGG using ffmpeg
for mp3_file in *.mp3; do
    if [ -f "$mp3_file" ]; then
        ogg_file="${mp3_file%.mp3}.ogg"
        echo "  Converting $mp3_file → $ogg_file"
        
        if command -v ffmpeg &> /dev/null; then
            ffmpeg -i "$mp3_file" -c:a libvorbis -q:a 4 "$ogg_file" -y -loglevel error
            rm "$mp3_file"
            echo "    ✅ Converted"
        else
            echo "    ⚠️  ffmpeg not installed. Keeping MP3 format."
        fi
    fi
done

cd ../..

echo ""
echo "✅ Music download complete!" 