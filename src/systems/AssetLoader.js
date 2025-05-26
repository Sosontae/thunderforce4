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
            // We'll load sprites using the sprite manager
            sprites: {}, // Handled by SpriteManager
            
            audio: {
                // Sound effects - matching actual files
                shoot: 'assets/audio/laser1.wav',
                laser_beam: 'assets/audio/laser_beam.ogg',
                explosion: 'assets/audio/explosion_01.ogg',
                boss_explosion: 'assets/audio/boss_explosion.ogg',
                powerup: 'assets/audio/powerup.ogg',
                menuSelect: 'assets/audio/beep_01.ogg',
                menuMove: 'assets/audio/terminal_01.ogg',
                weaponSwitch: 'assets/audio/weapon_switch.ogg',
                chargeUp: 'assets/audio/charge_up.ogg',
                misc1: 'assets/audio/misc_01.ogg',
                misc9: 'assets/audio/misc_09.ogg',
                
                // Dead end sound can be used for game over
                gameOver: 'assets/audio/dead_end.ogg',
                
                // Using available sounds for missing tracks
                levelStart: 'assets/audio/misc_01.ogg',
                bossWarning: 'assets/audio/misc_09.ogg',
                
                // Music tracks - using available sounds as placeholders
                menuMusic: 'assets/audio/charge_up.ogg',
                stage1Music: 'assets/audio/laser_beam.ogg',
                bossMusic: 'assets/audio/boss_explosion.ogg'
            },
            
            backgrounds: {
                // Backgrounds are optional, generate if missing
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
            // Load sprites first using SpriteManager
            if (window.spriteManager) {
                console.log('Loading sprites via SpriteManager...');
                await window.spriteManager.loadAll();
            }
            
            // Then load other assets
            await Promise.all([
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
                console.warn(`Failed to load background: ${name} from ${path}, generating procedural background`);
                // Generate a procedural starfield background
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 600;
                const ctx = canvas.getContext('2d');
                
                // Black background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add stars
                for (let i = 0; i < 200; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() * 2;
                    const brightness = Math.random();
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Add some nebula effects for variety
                if (name === 'starfield2') {
                    const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 200);
                    gradient.addColorStop(0, 'rgba(128, 0, 128, 0.2)');
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else if (name === 'starfield3') {
                    const gradient = ctx.createRadialGradient(200, 400, 50, 200, 400, 150);
                    gradient.addColorStop(0, 'rgba(0, 128, 255, 0.2)');
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                // Convert canvas to image
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const placeholderImg = new Image();
                    placeholderImg.onload = () => {
                        this.assets.backgrounds[name] = placeholderImg;
                        this.loadedAssets++;
                        this.loadingProgress = this.loadedAssets / this.totalAssets;
                        console.log(`Generated procedural background: ${name}`);
                        resolve();
                    };
                    placeholderImg.src = url;
                });
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