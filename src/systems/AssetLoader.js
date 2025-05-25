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
                hellArm: 'assets/sprites/hell_arm.png',
                rattCarry: 'assets/sprites/ratt_carry.png',
                sparkLancer: 'assets/sprites/spark_lancer.png',
                versus: 'assets/sprites/versus.png',
                
                // Effects
                bulletCollection: 'assets/sprites/bullet_collection.png',
                explosionSet: 'assets/sprites/explosion_set2.png',
                pixelExplosion: 'assets/sprites/pixel_explosion.png',
                simpleExplosion: 'assets/sprites/simple_explosion.png',
                
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
                shootAlt: 'assets/audio/shoot_01.ogg',
                explosion: 'assets/audio/explosion_01.ogg',
                explosionAlt: 'assets/audio/retro_explosion.ogg',
                powerup: 'assets/audio/powerup.ogg',
                hit: 'assets/audio/retro_laser_01.ogg',
                gameOver: 'assets/audio/dead_end.ogg',
                levelStart: 'assets/audio/misc_01.ogg',
                bossWarning: 'assets/audio/misc_09.ogg',
                menuSelect: 'assets/audio/beep_01.ogg',
                menuMove: 'assets/audio/terminal_01.ogg',
                weaponSwitch: 'assets/audio/weapon_switch.ogg',
                boss_explosion: 'assets/audio/boss_explosion.ogg',
                
                // Thunder Force 4 Music Tracks - Using actual downloaded files
                opening: 'assets/audio/lightning_strikes_again.ogg', // Opening Theme
                menuMusic: 'assets/audio/tan_tan_ta_ta_ta_tan.ogg', // Configuration
                stageSelect: 'assets/audio/dont_go_off.ogg', // Course Select
                stage1Music: 'assets/audio/fighting_back.ogg', // Stage 1A
                stage1BossMusic: 'assets/audio/evil_destroyer.ogg', // Stage 1 Boss
                stage2Music: 'assets/audio/space_walk.ogg', // Stage 2A
                stage2BossMusic: 'assets/audio/attack_sharply.ogg', // Stage 2 Boss
                stage3Music: 'assets/audio/the_sky_line.ogg', // Stage 3A
                stage3BossMusic: 'assets/audio/simmer_down.ogg', // Stage 3 Boss (not downloaded yet)
                stage4Music: 'assets/audio/sand_hell.ogg', // Stage 4A
                stage4BossMusic: 'assets/audio/strike_out.ogg', // Stage 4 Boss (not downloaded yet)
                stage5Music: 'assets/audio/battle_ship.ogg', // Stage 5
                stage5BossMusic: 'assets/audio/stranger.ogg', // Stage 5 Boss (not downloaded yet)
                stage8Music: 'assets/audio/metal_squad.ogg', // Stage 8
                bossMusic: 'assets/audio/war_like_requiem.ogg', // Final Boss
                endingMusic: 'assets/audio/stand_up_against_myself.ogg', // Staff Roll
                gameMusic: 'assets/audio/fighting_back.ogg' // Default game music
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
                console.error(`Failed to load sprite: ${name} from ${path}`);
                reject(new Error(`Failed to load sprite: ${name}`));
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
                console.error(`Failed to load audio: ${name} from ${path}`);
                reject(new Error(`Failed to load audio: ${name}`));
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