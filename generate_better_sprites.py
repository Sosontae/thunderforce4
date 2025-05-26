#!/usr/bin/env python3
"""
Generate better quality sprites for Thunder Force 4 replica
"""

from PIL import Image, ImageDraw, ImageFilter
import os

# Create sprites directory if it doesn't exist
os.makedirs('assets/sprites', exist_ok=True)

def create_gradient(draw, x1, y1, x2, y2, color1, color2):
    """Create a gradient effect between two colors"""
    for i in range(int(abs(y2 - y1))):
        ratio = i / abs(y2 - y1)
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(x1, y1 + i), (x2, y1 + i)], fill=(r, g, b))

def create_rynex_sprite():
    """Create the player ship (Rynex) sprite with multiple frames"""
    width, height = 240, 32  # 5 frames of 48x32
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Define colors
    body_color = (0, 200, 255)
    dark_body = (0, 100, 150)
    cockpit_color = (0, 50, 100)
    engine_color = (255, 150, 0)
    
    # Draw 5 frames: idle, up, down, left, right
    for frame in range(5):
        x_offset = frame * 48
        
        # Main body
        if frame == 0:  # Idle
            # Fuselage
            draw.polygon([
                (x_offset + 40, 16),
                (x_offset + 8, 8),
                (x_offset + 8, 24),
            ], fill=body_color, outline=dark_body)
            
            # Wings
            draw.polygon([
                (x_offset + 20, 16),
                (x_offset + 10, 4),
                (x_offset + 10, 8),
                (x_offset + 25, 16),
            ], fill=body_color, outline=dark_body)
            
            draw.polygon([
                (x_offset + 20, 16),
                (x_offset + 10, 24),
                (x_offset + 10, 28),
                (x_offset + 25, 16),
            ], fill=body_color, outline=dark_body)
            
        elif frame == 1:  # Moving up
            # Tilted up
            draw.polygon([
                (x_offset + 40, 14),
                (x_offset + 8, 6),
                (x_offset + 8, 22),
            ], fill=body_color, outline=dark_body)
            
            # Wings angled
            draw.polygon([
                (x_offset + 20, 14),
                (x_offset + 10, 2),
                (x_offset + 10, 6),
                (x_offset + 25, 14),
            ], fill=body_color, outline=dark_body)
            
            draw.polygon([
                (x_offset + 20, 14),
                (x_offset + 10, 22),
                (x_offset + 10, 26),
                (x_offset + 25, 14),
            ], fill=body_color, outline=dark_body)
            
        elif frame == 2:  # Moving down
            # Tilted down
            draw.polygon([
                (x_offset + 40, 18),
                (x_offset + 8, 10),
                (x_offset + 8, 26),
            ], fill=body_color, outline=dark_body)
            
            # Wings angled
            draw.polygon([
                (x_offset + 20, 18),
                (x_offset + 10, 6),
                (x_offset + 10, 10),
                (x_offset + 25, 18),
            ], fill=body_color, outline=dark_body)
            
            draw.polygon([
                (x_offset + 20, 18),
                (x_offset + 10, 26),
                (x_offset + 10, 30),
                (x_offset + 25, 18),
            ], fill=body_color, outline=dark_body)
        
        # Cockpit for all frames
        draw.ellipse([
            (x_offset + 25, 12),
            (x_offset + 35, 20)
        ], fill=cockpit_color, outline=(0, 255, 255))
        
        # Engine glow
        for i in range(3):
            alpha = 255 - i * 80
            draw.ellipse([
                (x_offset + 8 - i*2, 14 - i),
                (x_offset + 12 - i*2, 18 + i)
            ], fill=(engine_color[0], engine_color[1], engine_color[2], alpha))
    
    img.save('assets/sprites/rynex.png')
    print("Created rynex.png")

def create_enemy_sprite(filename, width, height, base_color, enemy_type):
    """Create enemy sprites with better detail"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    if enemy_type == 'gargoyle_diver':
        # Create a diving enemy with wings
        body_color = (255, 100, 0)
        dark_color = (150, 50, 0)
        
        # Body
        draw.ellipse([width//3, height//3, 2*width//3, 2*height//3], 
                     fill=body_color, outline=dark_color)
        
        # Wings
        draw.polygon([
            (width//2, height//2),
            (width//6, height//4),
            (width//6, height//2),
        ], fill=dark_color)
        
        draw.polygon([
            (width//2, height//2),
            (5*width//6, height//4),
            (5*width//6, height//2),
        ], fill=dark_color)
        
        # Eye
        draw.ellipse([
            (width//2 - 3, height//2 - 3),
            (width//2 + 3, height//2 + 3)
        ], fill=(255, 0, 0))
        
    elif enemy_type == 'faust':
        # Medium enemy with armor
        body_color = (200, 0, 200)
        armor_color = (100, 0, 100)
        
        # Main body - diamond shape
        draw.polygon([
            (width//2, height//4),
            (3*width//4, height//2),
            (width//2, 3*height//4),
            (width//4, height//2),
        ], fill=body_color, outline=armor_color)
        
        # Armor plates
        draw.polygon([
            (width//2, height//3),
            (2*width//3, height//2),
            (width//2, 2*height//3),
            (width//3, height//2),
        ], fill=armor_color)
        
        # Core
        draw.ellipse([
            (width//2 - 4, height//2 - 4),
            (width//2 + 4, height//2 + 4)
        ], fill=(255, 255, 0))
        
    elif enemy_type == 'armament_claw':
        # Heavy enemy with claws
        body_color = (100, 100, 100)
        claw_color = (200, 50, 50)
        
        # Main body
        draw.rectangle([width//4, height//3, 3*width//4, 2*height//3], 
                       fill=body_color, outline=(50, 50, 50))
        
        # Claws
        draw.polygon([
            (width//4, height//2),
            (width//8, height//3),
            (width//8, 2*height//3),
        ], fill=claw_color, outline=(100, 0, 0))
        
        draw.polygon([
            (3*width//4, height//2),
            (7*width//8, height//3),
            (7*width//8, 2*height//3),
        ], fill=claw_color, outline=(100, 0, 0))
        
        # Weapon ports
        for i in range(3):
            y = height//3 + i * height//6
            draw.ellipse([
                (width//2 - 3, y - 2),
                (width//2 + 3, y + 2)
            ], fill=(255, 0, 0))
    
    elif enemy_type == 'evil_core':
        # Boss enemy
        core_color = (255, 0, 255)
        shell_color = (100, 0, 100)
        
        # Outer shell
        draw.ellipse([width//6, height//6, 5*width//6, 5*height//6], 
                     fill=shell_color, outline=(50, 0, 50))
        
        # Inner segments
        for angle in range(0, 360, 45):
            import math
            x1 = width//2 + math.cos(math.radians(angle)) * width//3
            y1 = height//2 + math.sin(math.radians(angle)) * height//3
            x2 = width//2 + math.cos(math.radians(angle)) * width//6
            y2 = height//2 + math.sin(math.radians(angle)) * height//6
            draw.line([(x1, y1), (x2, y2)], fill=core_color, width=2)
        
        # Core
        draw.ellipse([
            (width//2 - width//8, height//2 - height//8),
            (width//2 + width//8, height//2 + height//8)
        ], fill=core_color)
        
        # Pulsing effect
        draw.ellipse([
            (width//2 - width//12, height//2 - height//12),
            (width//2 + width//12, height//2 + height//12)
        ], fill=(255, 255, 255))
    
    img.save(f'assets/sprites/{filename}')
    print(f"Created {filename}")

def create_explosion_sprite():
    """Create explosion animation sprite sheet"""
    frames = 8
    frame_size = 64
    img = Image.new('RGBA', (frame_size * frames, frame_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for frame in range(frames):
        x_offset = frame * frame_size
        center_x = x_offset + frame_size // 2
        center_y = frame_size // 2
        
        # Progress through explosion
        progress = frame / (frames - 1)
        
        # Outer explosion
        if progress < 0.5:
            radius = int(frame_size * 0.3 * (1 + progress * 2))
            alpha = int(255 * (1 - progress * 2))
            draw.ellipse([
                (center_x - radius, center_y - radius),
                (center_x + radius, center_y + radius)
            ], fill=(255, 200, 0, alpha))
        
        # Inner explosion
        radius2 = int(frame_size * 0.2 * (1 + progress))
        alpha2 = int(255 * (1 - progress))
        if alpha2 > 0:
            draw.ellipse([
                (center_x - radius2, center_y - radius2),
                (center_x + radius2, center_y + radius2)
            ], fill=(255, 255, 100, alpha2))
        
        # Debris
        import random
        random.seed(42 + frame)
        for i in range(8):
            angle = random.uniform(0, 360)
            distance = progress * frame_size * 0.4
            import math
            x = center_x + math.cos(math.radians(angle)) * distance
            y = center_y + math.sin(math.radians(angle)) * distance
            size = max(1, int(4 * (1 - progress)))
            if size > 0:
                draw.ellipse([
                    (x - size, y - size),
                    (x + size, y + size)
                ], fill=(255, 100, 0, alpha2))
    
    img.save('assets/sprites/explosion_set.png')
    print("Created explosion_set.png")

def create_powerup_sprites():
    """Create power-up sprites"""
    powerups = {
        'powerup_weapon.png': {'color': (255, 255, 0), 'symbol': 'W'},
        'powerup_shield.png': {'color': (0, 255, 0), 'symbol': 'S'},
        'powerup_speed.png': {'color': (0, 255, 255), 'symbol': '>'},
        'powerup_life.png': {'color': (255, 0, 255), 'symbol': '1'},
        'powerup_bomb.png': {'color': (255, 100, 0), 'symbol': 'B'}
    }
    
    for filename, config in powerups.items():
        img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Outer glow
        for i in range(3):
            alpha = 100 - i * 30
            size = 14 + i * 2
            draw.ellipse([
                (16 - size, 16 - size),
                (16 + size, 16 + size)
            ], fill=(*config['color'], alpha))
        
        # Main circle
        draw.ellipse([8, 8, 24, 24], fill=config['color'], outline=(255, 255, 255))
        
        # Symbol
        draw.text((16, 16), config['symbol'], fill=(0, 0, 0), anchor='mm')
        
        img.save(f'assets/sprites/{filename}')
        print(f"Created {filename}")

def create_bullet_sprite():
    """Create bullet collection sprite"""
    img = Image.new('RGBA', (64, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Player bullet (cyan)
    draw.ellipse([4, 4, 12, 12], fill=(0, 255, 255))
    draw.ellipse([6, 6, 10, 10], fill=(255, 255, 255))
    
    # Enemy bullet (red)
    draw.ellipse([20, 4, 28, 12], fill=(255, 0, 0))
    draw.ellipse([22, 6, 26, 10], fill=(255, 255, 255))
    
    # Power bullet (yellow)
    draw.rectangle([36, 6, 48, 10], fill=(255, 255, 0))
    draw.rectangle([38, 7, 46, 9], fill=(255, 255, 255))
    
    img.save('assets/sprites/bullet_collection.png')
    print("Created bullet_collection.png")

# Generate all sprites
if __name__ == "__main__":
    print("Generating improved sprites...")
    
    # Player ship
    create_rynex_sprite()
    
    # Enemies
    create_enemy_sprite('gargoyle_diver.png', 32, 32, None, 'gargoyle_diver')
    create_enemy_sprite('faust.png', 40, 40, None, 'faust')
    create_enemy_sprite('armament_claw.png', 64, 48, None, 'armament_claw')
    create_enemy_sprite('evil_core.png', 128, 96, None, 'evil_core')
    
    # Effects
    create_explosion_sprite()
    create_bullet_sprite()
    
    # Power-ups
    create_powerup_sprites()
    
    print("All sprites generated successfully!") 