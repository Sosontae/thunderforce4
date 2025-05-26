// SpriteManager class - Handles all sprite loading and management

class SpriteManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadProgress = 0;
        this.totalSprites = 0;
        this.loadedSprites = 0;
    }

    async loadAll() {
        console.log('Loading Thunder Force IV sprites...');
        
        // Define all sprites to load
        const spriteManifest = {
            // Player ship
            player: {
                rynex: 'assets/sprites/rynex.png',
                rynex_thrust: 'assets/sprites/rynex_thrust.png',
                rynex_damaged: 'assets/sprites/rynex_damaged.png'
            },
            
            // Enemies
            enemies: {
                // Basic enemies
                basic_orb: 'assets/sprites/enemies/basic_orb.png',
                basic_fighter: 'assets/sprites/enemies/basic_fighter.png',
                basic_drone: 'assets/sprites/enemies/basic_drone.png',
                
                // Medium enemies
                medium_diamond: 'assets/sprites/enemies/medium_diamond.png',
                medium_cruiser: 'assets/sprites/enemies/medium_cruiser.png',
                medium_mech: 'assets/sprites/enemies/medium_mech.png',
                
                // Heavy enemies
                heavy_tank: 'assets/sprites/enemies/heavy_tank.png',
                heavy_fortress: 'assets/sprites/enemies/heavy_fortress.png',
                heavy_battleship: 'assets/sprites/enemies/heavy_battleship.png',
                
                // Bosses
                gargoyle_diver: 'assets/sprites/bosses/gargoyle_diver.png',
                faust: 'assets/sprites/bosses/faust.png',
                armament_claw: 'assets/sprites/bosses/armament_claw.png',
                evil_core: 'assets/sprites/bosses/evil_core.png'
            },
            
            // Weapons and projectiles
            weapons: {
                // Player bullets
                twin_shot: 'assets/sprites/weapons/twin_shot.png',
                blade: 'assets/sprites/weapons/blade.png',
                rail_gun: 'assets/sprites/weapons/rail_gun.png',
                hunter: 'assets/sprites/weapons/hunter.png',
                snake: 'assets/sprites/weapons/snake.png',
                free_way: 'assets/sprites/weapons/free_way.png',
                thunder_sword: 'assets/sprites/weapons/thunder_sword.png',
                
                // Enemy bullets
                enemy_bullet_small: 'assets/sprites/weapons/enemy_bullet_small.png',
                enemy_bullet_medium: 'assets/sprites/weapons/enemy_bullet_medium.png',
                enemy_laser: 'assets/sprites/weapons/enemy_laser.png',
                enemy_missile: 'assets/sprites/weapons/enemy_missile.png'
            },
            
            // Power-ups
            powerups: {
                weapon: 'assets/sprites/powerups/weapon.png',
                shield: 'assets/sprites/powerups/shield.png',
                speed: 'assets/sprites/powerups/speed.png',
                life: 'assets/sprites/powerups/life.png',
                bomb: 'assets/sprites/powerups/bomb.png',
                claw: 'assets/sprites/powerups/claw.png'
            },
            
            // Effects
            effects: {
                explosion_small: 'assets/sprites/effects/explosion_small.png',
                explosion_medium: 'assets/sprites/effects/explosion_medium.png',
                explosion_large: 'assets/sprites/effects/explosion_large.png',
                shield_effect: 'assets/sprites/effects/shield_effect.png',
                thrust_effect: 'assets/sprites/effects/thrust_effect.png',
                hit_spark: 'assets/sprites/effects/hit_spark.png'
            },
            
            // UI elements
            ui: {
                hud_frame: 'assets/sprites/ui/hud_frame.png',
                numbers: 'assets/sprites/ui/numbers.png',
                weapon_icons: 'assets/sprites/ui/weapon_icons.png',
                life_icon: 'assets/sprites/ui/life_icon.png'
            },
            
            // Backgrounds
            backgrounds: {
                stage1_layer1: 'assets/sprites/backgrounds/stage1_layer1.png',
                stage1_layer2: 'assets/sprites/backgrounds/stage1_layer2.png',
                stage1_layer3: 'assets/sprites/backgrounds/stage1_layer3.png'
            }
        };

        // Count total sprites
        this.totalSprites = this.countSprites(spriteManifest);
        
        // Load all sprites
        try {
            await this.loadSpriteCategory(spriteManifest);
            this.loaded = true;
            console.log('All sprites loaded successfully!');
            return true;
        } catch (error) {
            console.error('Error loading sprites:', error);
            return false;
        }
    }

    countSprites(manifest) {
        let count = 0;
        for (const category in manifest) {
            if (typeof manifest[category] === 'string') {
                count++;
            } else {
                count += this.countSprites(manifest[category]);
            }
        }
        return count;
    }

    async loadSpriteCategory(manifest, parentKey = '') {
        const promises = [];
        
        for (const [key, value] of Object.entries(manifest)) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            
            if (typeof value === 'string') {
                promises.push(this.loadSprite(fullKey, value));
            } else {
                promises.push(this.loadSpriteCategory(value, fullKey));
            }
        }
        
        await Promise.all(promises);
    }

    async loadSprite(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.sprites[name] = img;
                this.loadedSprites++;
                this.loadProgress = this.loadedSprites / this.totalSprites;
                console.log(`Loaded sprite: ${name} (${Math.floor(this.loadProgress * 100)}%)`);
                resolve();
            };
            
            img.onerror = () => {
                console.warn(`Failed to load sprite: ${name} from ${path}`);
                // Create placeholder
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                
                // Draw placeholder
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#000000';
                ctx.font = '10px monospace';
                ctx.fillText(name.split('.').pop(), 2, 12);
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const placeholderImg = new Image();
                    placeholderImg.onload = () => {
                        this.sprites[name] = placeholderImg;
                        this.loadedSprites++;
                        this.loadProgress = this.loadedSprites / this.totalSprites;
                        resolve();
                    };
                    placeholderImg.src = url;
                });
            };
            
            img.src = path;
        });
    }

    getSprite(name) {
        return this.sprites[name];
    }

    drawSprite(ctx, spriteName, x, y, options = {}) {
        const sprite = this.getSprite(spriteName);
        if (!sprite) {
            console.warn(`Sprite not found: ${spriteName}`);
            return;
        }

        const {
            scale = 1,
            rotation = 0,
            alpha = 1,
            frameX = 0,
            frameY = 0,
            frameWidth = sprite.width,
            frameHeight = sprite.height,
            centered = true
        } = options;

        ctx.save();
        ctx.globalAlpha = alpha;
        
        if (centered) {
            ctx.translate(x, y);
        } else {
            ctx.translate(x + frameWidth * scale / 2, y + frameHeight * scale / 2);
        }
        
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        
        ctx.drawImage(
            sprite,
            frameX, frameY, frameWidth, frameHeight,
            -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight
        );
        
        ctx.restore();
    }

    // Helper method for animated sprites
    drawAnimatedSprite(ctx, spriteName, x, y, frame, options = {}) {
        const sprite = this.getSprite(spriteName);
        if (!sprite) return;

        const { framesPerRow = 8, frameSize = 64 } = options;
        const frameX = (frame % framesPerRow) * frameSize;
        const frameY = Math.floor(frame / framesPerRow) * frameSize;

        this.drawSprite(ctx, spriteName, x, y, {
            ...options,
            frameX,
            frameY,
            frameWidth: frameSize,
            frameHeight: frameSize
        });
    }
}

// Create global sprite manager instance
window.spriteManager = new SpriteManager(); 