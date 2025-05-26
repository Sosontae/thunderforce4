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
        
        // Define all sprites to load - simplified to match actual files
        const spriteManifest = {
            // Player ship
            player: {
                ship: 'assets/sprites/space_shooter_pack/spritesheets/ship.png',
                ships_human: 'assets/sprites/player/ships_human.png'
            },
            
            // Enemies
            enemies: {
                // Basic enemies
                small: 'assets/sprites/space_shooter_pack/spritesheets/enemy-small.png',
                
                // Medium enemies  
                medium: 'assets/sprites/space_shooter_pack/spritesheets/enemy-medium.png',
                saucer: 'assets/sprites/enemies/medium/ships_saucer.png',
                
                // Heavy enemies
                big: 'assets/sprites/space_shooter_pack/spritesheets/enemy-big.png',
                void: 'assets/sprites/enemies/heavy/ships_void.png',
                
                // Bosses
                biomech: 'assets/sprites/enemies/bosses/ships_biomech.png'
            },
            
            // Weapons and projectiles
            weapons: {
                laser_bolts: 'assets/sprites/space_shooter_pack/spritesheets/laser-bolts.png'
            },
            
            // Power-ups
            powerups: {
                powerup: 'assets/sprites/space_shooter_pack/spritesheets/power-up.png'
            },
            
            // Effects
            effects: {
                explosion: 'assets/sprites/space_shooter_pack/spritesheets/explosion.png'
            }
        };

        // Count total sprites
        this.totalSprites = this.countSprites(spriteManifest);
        
        // Load all sprites
        try {
            await this.loadSpriteCategory(spriteManifest);
            this.loaded = true;
            console.log('All sprites loaded successfully!');
            console.log('Loaded sprites:', Object.keys(this.sprites));
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
            centered = true,
            flipY = false,
            flipX = false
        } = options;

        ctx.save();
        ctx.globalAlpha = alpha;
        
        if (centered) {
            ctx.translate(x, y);
        } else {
            ctx.translate(x + frameWidth * scale / 2, y + frameHeight * scale / 2);
        }
        
        // Apply flipping
        const scaleX = flipX ? -scale : scale;
        const scaleY = flipY ? -scale : scale;
        
        ctx.rotate(rotation);
        ctx.scale(scaleX, scaleY);
        
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

        const { 
            framesPerRow = 8, 
            frameSize = 64,
            frameWidth,
            frameHeight,
            animationSpeed = 200, // milliseconds per frame
            flipY = false,
            flipX = false
        } = options;
        
        // Use frameWidth/frameHeight if provided, otherwise fall back to frameSize
        const width = frameWidth || frameSize;
        const height = frameHeight || frameSize;
        
        // Calculate animated frame based on time if frame is -1
        let actualFrame = frame;
        if (frame === -1) {
            actualFrame = Math.floor(Date.now() / animationSpeed) % framesPerRow;
        }
        
        const frameX = (actualFrame % framesPerRow) * width;
        const frameY = Math.floor(actualFrame / framesPerRow) * height;

        this.drawSprite(ctx, spriteName, x, y, {
            ...options,
            frameX,
            frameY,
            frameWidth: width,
            frameHeight: height,
            flipY,
            flipX
        });
    }
}

// Create global sprite manager instance
window.spriteManager = new SpriteManager(); 