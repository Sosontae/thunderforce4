#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw
import random
import math

# Create output directory
os.makedirs('assets/sprites', exist_ok=True)

def create_pixel_gradient(color1, color2, steps):
    """Create a gradient between two colors"""
    r1, g1, b1 = [int(color1[i:i+2], 16) for i in (1, 3, 5)]
    r2, g2, b2 = [int(color2[i:i+2], 16) for i in (1, 3, 5)]
    
    gradient = []
    for i in range(steps):
        t = i / (steps - 1) if steps > 1 else 0
        r = int(r1 + (r2 - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        gradient.append(f'#{r:02x}{g:02x}{b:02x}')
    return gradient

def draw_pixel(draw, x, y, size, color):
    """Draw a pixel block"""
    draw.rectangle([x, y, x + size - 1, y + size - 1], fill=color)

def create_rynex_sprite():
    """Create the player ship (Rynex) sprite"""
    width, height = 48, 32
    frames = 5  # idle, up, down, banking left, banking right
    sprite_sheet = Image.new('RGBA', (width * frames, height), (0, 0, 0, 0))
    
    # Colors for the ship
    body_color = '#00ccff'
    dark_body = '#0088aa'
    cockpit = '#003366'
    engine = '#ff6600'
    highlight = '#66ddff'
    
    for frame in range(frames):
        draw = ImageDraw.Draw(sprite_sheet)
        offset_x = frame * width
        
        # Base ship shape
        if frame == 0:  # Idle
            # Main body
            points = [
                (offset_x + 8, 16),   # Rear center
                (offset_x + 20, 8),   # Upper wing
                (offset_x + 40, 12),  # Nose upper
                (offset_x + 44, 16),  # Nose tip
                (offset_x + 40, 20),  # Nose lower
                (offset_x + 20, 24),  # Lower wing
                (offset_x + 8, 16)    # Back to rear
            ]
            draw.polygon(points, fill=body_color, outline=dark_body)
            
            # Cockpit
            draw.ellipse([offset_x + 25, 13, offset_x + 35, 19], fill=cockpit)
            
            # Engine glow
            for i in range(3):
                draw.ellipse([offset_x + 5 - i*2, 14 - i, offset_x + 11 - i*2, 18 + i], 
                            fill=engine if i == 0 else '#ff9933')
            
            # Details
            draw.line([offset_x + 20, 16, offset_x + 25, 16], fill=highlight, width=1)
            draw.rectangle([offset_x + 35, 15, offset_x + 38, 17], fill=highlight)
            
        elif frame == 1:  # Moving up
            # Similar to idle but shifted up and angled
            points = [
                (offset_x + 8, 14),
                (offset_x + 20, 4),
                (offset_x + 40, 8),
                (offset_x + 44, 12),
                (offset_x + 40, 16),
                (offset_x + 20, 20),
                (offset_x + 8, 14)
            ]
            draw.polygon(points, fill=body_color, outline=dark_body)
            draw.ellipse([offset_x + 25, 9, offset_x + 35, 15], fill=cockpit)
            
        elif frame == 2:  # Moving down
            points = [
                (offset_x + 8, 18),
                (offset_x + 20, 12),
                (offset_x + 40, 16),
                (offset_x + 44, 20),
                (offset_x + 40, 24),
                (offset_x + 20, 28),
                (offset_x + 8, 18)
            ]
            draw.polygon(points, fill=body_color, outline=dark_body)
            draw.ellipse([offset_x + 25, 17, offset_x + 35, 23], fill=cockpit)
    
    sprite_sheet.save('assets/sprites/rynex.png')
    print("Created: rynex.png (48x32 per frame, 5 frames)")

def create_enemy_sprite(name, width, height, base_color, style='basic'):
    """Create various enemy sprites"""
    sprite = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(sprite)
    
    # Create color variations
    colors = create_pixel_gradient(base_color, '#000000', 4)
    highlight = create_pixel_gradient(base_color, '#ffffff', 3)[2]
    
    if style == 'basic':
        # Gargoyle Diver style - flying enemy
        # Body
        draw.ellipse([width//4, height//4, 3*width//4, 3*height//4], 
                    fill=colors[0], outline=colors[2])
        # Wings
        draw.polygon([(2, height//2), (width//4, height//3), (width//4, 2*height//3)], 
                    fill=colors[1])
        draw.polygon([(width-2, height//2), (3*width//4, height//3), (3*width//4, 2*height//3)], 
                    fill=colors[1])
        # Eye
        draw.ellipse([width//2-3, height//2-3, width//2+3, height//2+3], fill='#ff0000')
        
    elif style == 'medium':
        # Faust style - diamond shaped
        cx, cy = width//2, height//2
        points = [
            (cx, 4),           # Top
            (width-4, cy),     # Right
            (cx, height-4),    # Bottom
            (4, cy)            # Left
        ]
        draw.polygon(points, fill=colors[0], outline=colors[2])
        # Inner diamond
        inner_points = [
            (cx, cy-height//4),
            (cx+width//4, cy),
            (cx, cy+height//4),
            (cx-width//4, cy)
        ]
        draw.polygon(inner_points, fill=colors[1])
        # Core
        draw.ellipse([cx-4, cy-4, cx+4, cy+4], fill='#ff00ff')
        
    elif style == 'heavy':
        # Armament Claw style - mechanical
        # Main body
        draw.rectangle([width//4, height//4, 3*width//4, 3*height//4], 
                      fill=colors[0], outline=colors[2])
        # Arms/claws
        draw.rectangle([2, height//3, width//4, 2*height//3], fill=colors[1])
        draw.rectangle([3*width//4, height//3, width-2, 2*height//3], fill=colors[1])
        # Weapon ports
        draw.ellipse([width//2-6, height//3, width//2+6, height//3+8], fill='#660066')
        draw.ellipse([width//2-6, 2*height//3-8, width//2+6, 2*height//3], fill='#660066')
        # Details
        draw.line([width//4, height//2, 3*width//4, height//2], fill=highlight, width=2)
        
    elif style == 'boss':
        # Evil Core style - large mechanical boss
        # Outer shell
        draw.ellipse([4, 4, width-4, height-4], fill=colors[0], outline=colors[2])
        # Inner rings
        draw.ellipse([width//4, height//4, 3*width//4, 3*height//4], 
                    fill=colors[1], outline=colors[2])
        # Core
        cx, cy = width//2, height//2
        # Pulsing core effect
        for i in range(3):
            radius = 15 - i*4
            alpha = 255 - i*50
            # Create RGBA color properly
            r, g, b = int('ff', 16), int('00', 16), int('ff', 16)
            core_color = (r, g, b, alpha)
            draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=core_color)
        # Mechanical details
        for angle in range(0, 360, 45):
            rad = math.radians(angle)
            x1 = cx + math.cos(rad) * (width//2 - 10)
            y1 = cy + math.sin(rad) * (height//2 - 10)
            x2 = cx + math.cos(rad) * (width//2 - 4)
            y2 = cy + math.sin(rad) * (height//2 - 4)
            draw.line([x1, y1, x2, y2], fill=highlight, width=2)
    
    sprite.save(f'assets/sprites/{name}')
    print(f"Created: {name} ({width}x{height})")

def create_explosion_sprite():
    """Create explosion animation sprite sheet"""
    frame_size = 64
    frames = 8
    sprite_sheet = Image.new('RGBA', (frame_size * frames, frame_size), (0, 0, 0, 0))
    
    colors = ['#ffffff', '#ffff00', '#ff9900', '#ff6600', '#ff3300', '#cc0000', '#660000', '#330000']
    
    for frame in range(frames):
        draw = ImageDraw.Draw(sprite_sheet)
        offset_x = frame * frame_size
        cx = offset_x + frame_size // 2
        cy = frame_size // 2
        
        # Explosion expands and fades
        progress = frame / (frames - 1)
        max_radius = frame_size // 2 - 4
        
        # Multiple layers for depth
        for layer in range(3):
            radius = max_radius * progress * (1 - layer * 0.2)
            if radius > 0:
                color_idx = min(frame + layer, len(colors) - 1)
                alpha = int(255 * (1 - progress * 0.7))
                # Parse color properly
                hex_color = colors[color_idx][1:]  # Remove #
                r = int(hex_color[0:2], 16)
                g = int(hex_color[2:4], 16)
                b = int(hex_color[4:6], 16)
                color = (r, g, b, alpha)
                draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color)
        
        # Add some particles
        if frame < frames - 2:
            for _ in range(5):
                px = cx + random.randint(-int(radius), int(radius))
                py = cy + random.randint(-int(radius), int(radius))
                particle_size = random.randint(1, 3)
                draw.ellipse([px - particle_size, py - particle_size, 
                            px + particle_size, py + particle_size], 
                            fill=colors[min(frame + 1, len(colors) - 1)])
    
    sprite_sheet.save('assets/sprites/explosion_set2.png')
    print("Created: explosion_set2.png (64x64 per frame, 8 frames)")

def create_power_up_sprite():
    """Create power-up sprites"""
    size = 24
    types = {
        'weapon': '#ffff00',
        'shield': '#00ff00',
        'speed': '#00ffff',
        'life': '#ff00ff',
        'bomb': '#ff6600'
    }
    
    for name, color in types.items():
        sprite = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(sprite)
        
        # Outer glow with transparency
        hex_color = color[1:]  # Remove #
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        draw.ellipse([2, 2, size-2, size-2], fill=(r, g, b, 128))  # 50% transparency
        draw.ellipse([4, 4, size-4, size-4], fill=color)
        
        # Inner symbol
        cx, cy = size // 2, size // 2
        if name == 'weapon':
            draw.text((cx-4, cy-6), 'W', fill='#000000')
        elif name == 'shield':
            draw.polygon([(cx, 6), (cx-4, 10), (cx-4, 14), (cx, 18), 
                         (cx+4, 14), (cx+4, 10)], fill='#000000')
        elif name == 'speed':
            draw.polygon([(cx-4, cy), (cx+2, cy-4), (cx+2, cy-1), (cx+6, cy-1),
                         (cx+6, cy+1), (cx+2, cy+1), (cx+2, cy+4)], fill='#000000')
        elif name == 'life':
            draw.text((cx-6, cy-6), '1UP', fill='#000000')
        elif name == 'bomb':
            draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill='#000000')
            draw.line([cx, cy-3, cx, cy-6], fill='#000000', width=1)
        
        sprite.save(f'assets/sprites/powerup_{name}.png')
        print(f"Created: powerup_{name}.png ({size}x{size})")

def create_background_elements():
    """Create additional background elements"""
    # Create a more detailed starfield
    starfield = Image.new('RGB', (800, 600), '#000033')
    draw = ImageDraw.Draw(starfield)
    
    # Different star layers
    for _ in range(100):  # Distant stars
        x, y = random.randint(0, 799), random.randint(0, 599)
        brightness = random.randint(100, 150)
        draw.point((x, y), fill=(brightness, brightness, brightness))
    
    for _ in range(50):  # Medium stars
        x, y = random.randint(0, 799), random.randint(0, 599)
        brightness = random.randint(150, 200)
        size = random.choice([1, 2])
        draw.ellipse([x, y, x+size, y+size], fill=(brightness, brightness, brightness))
    
    for _ in range(20):  # Near stars
        x, y = random.randint(0, 799), random.randint(0, 599)
        draw.ellipse([x, y, x+2, y+2], fill='#ffffff')
    
    # Add some nebula clouds
    for _ in range(5):
        x, y = random.randint(0, 799), random.randint(0, 599)
        radius = random.randint(50, 100)
        for i in range(radius, 0, -10):
            alpha = int(20 * (1 - i/radius))
            color = (0, 0, 50 + alpha)
            draw.ellipse([x-i, y-i, x+i, y+i], fill=color)
    
    starfield.save('assets/backgrounds/starfield2.jpg')
    print("Created: starfield2.jpg (800x600)")

# Generate all sprites
print("🎮 Generating Thunder Force IV style sprites...")
print("=" * 50)

# Player ship
create_rynex_sprite()

# Enemies
create_enemy_sprite('gargoyle_diver.png', 32, 32, '#ff6600', 'basic')
create_enemy_sprite('faust.png', 40, 40, '#ff0066', 'medium')
create_enemy_sprite('armament_claw.png', 64, 48, '#ff0000', 'heavy')
create_enemy_sprite('evil_core.png', 128, 96, '#9900ff', 'boss')

# Additional enemies
create_enemy_sprite('hell_arm.png', 96, 80, '#ff00ff', 'heavy')
create_enemy_sprite('spark_lancer.png', 80, 64, '#00ff00', 'heavy')
create_enemy_sprite('versus.png', 64, 64, '#ffff00', 'medium')
create_enemy_sprite('dust_eag.png', 48, 48, '#ff9900', 'medium')
create_enemy_sprite('ratt_carry.png', 48, 32, '#ffaa00', 'basic')

# Effects
create_explosion_sprite()

# Simple versions for other effects
for name, (w, h, color) in {
    'pixel_explosion.png': (256, 256, '#ffff00'),
    'simple_explosion.png': (128, 128, '#ff0000'),
    'bullet_collection.png': (256, 64, '#00ffff')
}.items():
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Create a simple gradient circle
    cx, cy = w // 2, h // 2
    max_r = min(w, h) // 2
    for r in range(max_r, 0, -5):
        alpha = int(255 * (r / max_r))
        # Parse color properly
        hex_color = color[1:]  # Remove #
        red = int(hex_color[0:2], 16)
        green = int(hex_color[2:4], 16)
        blue = int(hex_color[4:6], 16)
        c = (red, green, blue, alpha)
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=c)
    img.save(f'assets/sprites/{name}')
    print(f"Created: {name} ({w}x{h})")

# Power-ups
create_power_up_sprite()

# Background
create_background_elements()

print("\n✅ All sprites generated successfully!")
print("\nNote: These are stylized retro sprites. For authentic Thunder Force IV sprites,")
print("visit: https://www.spriters-resource.com/sega_genesis_32x/thunderforce4/") 