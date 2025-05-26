// AssetLoader class - Handles loading of all game assets

class AssetLoader {
    constructor() {
        this.assets = {
            sprites: {},
            audio: {},
            backgrounds: {}
        };
        this.loaded = false;
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    async loadAll() {
        console.log('Loading Thunder Force 4 assets...');
        
        // Define all assets to load
        const assetManifest = {
            sprites: {
                // Player ship
                rynex: 'assets/sprites/rynex.png',
                
                // Enemies
                gargoyleDiver: 'assets/sprites/gargoyle_diver.png',
                faust: 'assets/sprites/faust.png',
                armamentClaw: 'assets/sprites/armament_claw.png',
                evilCore: 'assets/sprites/evil_core.png',
                
                // Effects
                bulletCollection: 'assets/sprites/bullet_collection.png',
                explosionSet: 'assets/sprites/explosion_set.png',
                
                // Power-ups
                powerupWeapon: 'assets/sprites/powerup_weapon.png',
                powerupShield: 'assets/sprites/powerup_shield.png',
                powerupSpeed: 'assets/sprites/powerup_speed.png',
                powerupLife: 'assets/sprites/powerup_life.png',
                powerupBomb: 'assets/sprites/powerup_bomb.png'
            },
            
            audio: {
                // Sound effects
                shoot: 'assets/audio/laser1.wav',
                explosion: 'assets/audio/explosion_01.ogg',
                powerup: 'assets/audio/powerup.ogg',
                gameOver: 'assets/audio/dead_end.ogg',
                levelStart: 'assets/audio/misc_01.ogg',
                bossWarning: 'assets/audio/misc_09.ogg',
                menuSelect: 'assets/audio/beep_01.ogg',
                menuMove: 'assets/audio/terminal_01.ogg',
                weaponSwitch: 'assets/audio/weapon_switch.ogg',
                boss_explosion: 'assets/audio/boss_explosion.ogg',
                
                // Music tracks - Using available sounds as placeholders
                menuMusic: 'assets/audio/charge_up.ogg',
                stage1Music: 'assets/audio/laser_beam.ogg',
                stage1BossMusic: 'assets/audio/boss_explosion.ogg',
                stage2Music: 'assets/audio/laser_beam.ogg',
                stage2BossMusic: 'assets/audio/boss_explosion.ogg',
                stage3Music: 'assets/audio/laser_beam.ogg',
                stage3BossMusic: 'assets/audio/boss_explosion.ogg',
                stage4Music: 'assets/audio/laser_beam.ogg',
                stage4BossMusic: 'assets/audio/boss_explosion.ogg',
                stage5Music: 'assets/audio/laser_beam.ogg',
                stage5BossMusic: 'assets/audio/boss_explosion.ogg',
                stage8Music: 'assets/audio/laser_beam.ogg',
                bossMusic: 'assets/audio/boss_explosion.ogg'
            },
            
            backgrounds: {
                starfield1: 'assets/backgrounds/starfield1.jpg',
                starfield2: 'assets/backgrounds/starfield2.jpg',
                starfield3: 'assets/backgrounds/starfield3.jpg'
            }
        };

        // Count total assets
        this.totalAssets = 0;
        for (const category in assetManifest) {
            this.totalAssets += Object.keys(assetManifest[category]).length;
        }

        // Load all assets
        try {
            await Promise.all([
                this.loadSprites(assetManifest.sprites),
                this.loadAudio(assetManifest.audio),
                this.loadBackgrounds(assetManifest.backgrounds)
            ]);
            
            this.loaded = true;
            console.log('All assets loaded successfully!');
            return true;
        } catch (error) {
            console.error('Error loading assets:', error);
            return false;
        }
    }

    async loadSprites(spriteManifest) {
        const promises = [];
        
        for (const [name, path] of Object.entries(spriteManifest)) {
            promises.push(this.loadSprite(name, path));
        }
        
        await Promise.all(promises);
    }

    async loadSprite(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.assets.sprites[name] = img;
                this.loadedAssets++;
                this.loadingProgress = this.loadedAssets / this.totalAssets;
                console.log(`Loaded sprite: ${name}`);
                resolve();
            };
            
            img.onerror = () => {
                console.warn(`Failed to load sprite: ${name} from ${path}, using placeholder`);
                // Create a placeholder image instead of failing
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px monospace';
                ctx.fillText(name, 5, 30);
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const placeholderImg = new Image();
                    placeholderImg.onload = () => {
                        this.assets.sprites[name] = placeholderImg;
                        this.loadedAssets++;
                        this.loadingProgress = this.loadedAssets / this.totalAssets;
                        console.log(`Created placeholder for sprite: ${name}`);
                        resolve();
                    };
                    placeholderImg.src = url;
                });
            };
            
            img.src = path;
        });
    }

    async loadAudio(audioManifest) {
        const promises = [];
        
        for (const [name, path] of Object.entries(audioManifest)) {
            promises.push(this.loadSound(name, path));
        }
        
        await Promise.all(promises);
    }

    async loadSound(name, path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.addEventListener('canplaythrough', () => {
                this.assets.audio[name] = audio;
                this.loadedAssets++;
                this.loadingProgress = this.loadedAssets / this.totalAssets;
                console.log(`Loaded audio: ${name}`);
                resolve();
            }, { once: true });
            
            audio.addEventListener('error', () => {
                console.warn(`Failed to load audio: ${name} from ${path}, creating silent placeholder`);
                // Create a silent audio placeholder instead of failing
                this.assets.audio[name] = {
                    play: () => console.log(`Playing placeholder sound: ${name}`),
                    pause: () => {},
                    load: () => {},
                    cloneNode: () => ({
                        play: () => console.log(`Playing placeholder sound: ${name}`),
                        pause: () => {},
                        addEventListener: () => {}
                    })
                };
                this.loadedAssets++;
                this.loadingProgress = this.loadedAssets / this.totalAssets;
                resolve();
            }, { once: true });
            
            audio.src = path;
            audio.load();
        });
    }

    async loadBackgrounds(backgroundManifest) {
        const promises = [];
        
        for (const [name, path] of Object.entries(backgroundManifest)) {
            promises.push(this.loadBackground(name, path));
        }
        
        await Promise.all(promises);
    }

    async loadBackground(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.assets.backgrounds[name] = img;
                this.loadedAssets++;
                this.loadingProgress = this.loadedAssets / this.totalAssets;
                console.log(`Loaded background: ${name}`);
                resolve();
            };
            
            img.onerror = () => {
                console.error(`Failed to load background: ${name} from ${path}`);
                reject(new Error(`Failed to load background: ${name}`));
            };
            
            img.src = path;
        });
    }

    getSprite(name) {
        return this.assets.sprites[name];
    }

    getAudio(name) {
        return this.assets.audio[name];
    }

    getBackground(name) {
        return this.assets.backgrounds[name];
    }

    getLoadingProgress() {
        return Math.floor(this.loadingProgress * 100);
    }

    isLoaded() {
        return this.loaded;
    }
}

// Create global asset loader instance
window.assetLoader = new AssetLoader(); 