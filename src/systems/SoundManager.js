// SoundManager class

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.7;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.currentMusic = null;
        this.initialized = false;
        
        // Sound pools for frequently played sounds
        this.soundPools = {};
        this.poolSize = 5;
    }

    init() {
        // Initialize audio context
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
            return;
        }

        // Create dummy sounds for now (in a real implementation, you'd load actual audio files)
        this.createDummySounds();
        this.initialized = true;
    }

    createDummySounds() {
        // Define sound configurations
        const soundConfigs = {
            shoot: { type: 'sfx', pooled: true },
            explosion: { type: 'sfx', pooled: true },
            powerup: { type: 'sfx', pooled: false },
            hit: { type: 'sfx', pooled: true },
            game_over: { type: 'sfx', pooled: false },
            level_start: { type: 'sfx', pooled: false },
            boss_warning: { type: 'sfx', pooled: false },
            boss_explosion: { type: 'sfx', pooled: false },
            menu_music: { type: 'music', pooled: false },
            game_music: { type: 'music', pooled: false },
            boss_music: { type: 'music', pooled: false }
        };

        // Create sound objects
        Object.keys(soundConfigs).forEach(soundName => {
            const config = soundConfigs[soundName];
            
            if (config.pooled) {
                this.createSoundPool(soundName, config.type);
            } else {
                this.sounds[soundName] = this.createSound(soundName, config.type);
            }
        });
    }

    createSound(name, type) {
        // In a real implementation, this would load an actual audio file
        // For now, we'll create a dummy object
        return {
            name: name,
            type: type,
            volume: type === 'music' ? this.musicVolume : this.sfxVolume,
            playing: false,
            play: function() {
                if (this.playing) return;
                this.playing = true;
                console.log(`Playing ${type}: ${name}`);
                
                // Simulate sound duration
                setTimeout(() => {
                    this.playing = false;
                }, type === 'music' ? 0 : 500);
            },
            stop: function() {
                this.playing = false;
                console.log(`Stopping ${type}: ${name}`);
            },
            setVolume: function(volume) {
                this.volume = volume;
            }
        };
    }

    createSoundPool(name, type) {
        this.soundPools[name] = [];
        
        for (let i = 0; i < this.poolSize; i++) {
            this.soundPools[name].push(this.createSound(name, type));
        }
    }

    play(soundName, options = {}) {
        if (!this.enabled || !this.initialized) return;

        // Check if it's a pooled sound
        if (this.soundPools[soundName]) {
            const pool = this.soundPools[soundName];
            const availableSound = pool.find(sound => !sound.playing);
            
            if (availableSound) {
                availableSound.setVolume(options.volume || this.sfxVolume);
                availableSound.play();
            }
        } else if (this.sounds[soundName]) {
            const sound = this.sounds[soundName];
            sound.setVolume(options.volume || 
                          (sound.type === 'music' ? this.musicVolume : this.sfxVolume));
            sound.play();
        }
    }

    playMusic(musicName, loop = true) {
        if (!this.enabled || !this.initialized) return;

        // Stop current music
        if (this.currentMusic) {
            this.stopMusic();
        }

        // Play new music
        if (this.sounds[musicName]) {
            this.currentMusic = this.sounds[musicName];
            this.currentMusic.loop = loop;
            this.currentMusic.play();
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    pauseMusic() {
        if (this.currentMusic && this.currentMusic.playing) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && !this.currentMusic.playing) {
            this.currentMusic.play();
        }
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].stop();
        }
    }

    stopAll() {
        // Stop all individual sounds
        Object.keys(this.sounds).forEach(soundName => {
            this.sounds[soundName].stop();
        });

        // Stop all pooled sounds
        Object.keys(this.soundPools).forEach(poolName => {
            this.soundPools[poolName].forEach(sound => sound.stop());
        });

        // Stop music
        this.stopMusic();
    }

    setVolume(volume) {
        this.volume = clamp(volume, 0, 1);
        this.updateAllVolumes();
    }

    setMusicVolume(volume) {
        this.musicVolume = clamp(volume, 0, 1);
        
        // Update all music volumes
        Object.keys(this.sounds).forEach(soundName => {
            if (this.sounds[soundName].type === 'music') {
                this.sounds[soundName].setVolume(this.musicVolume);
            }
        });
    }

    setSFXVolume(volume) {
        this.sfxVolume = clamp(volume, 0, 1);
        
        // Update all sfx volumes
        Object.keys(this.sounds).forEach(soundName => {
            if (this.sounds[soundName].type === 'sfx') {
                this.sounds[soundName].setVolume(this.sfxVolume);
            }
        });

        // Update pooled sounds
        Object.keys(this.soundPools).forEach(poolName => {
            this.soundPools[poolName].forEach(sound => {
                sound.setVolume(this.sfxVolume);
            });
        });
    }

    updateAllVolumes() {
        this.setMusicVolume(this.musicVolume * this.volume);
        this.setSFXVolume(this.sfxVolume * this.volume);
    }

    mute() {
        this.enabled = false;
        this.stopAll();
    }

    unmute() {
        this.enabled = true;
    }

    toggleMute() {
        if (this.enabled) {
            this.mute();
        } else {
            this.unmute();
        }
    }

    // Preload sounds (in a real implementation)
    preload(soundList, callback) {
        // Simulate loading
        console.log('Preloading sounds:', soundList);
        
        if (callback) {
            setTimeout(callback, 100);
        }
    }

    // Play a random sound from a list
    playRandom(soundNames) {
        if (soundNames.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * soundNames.length);
        this.play(soundNames[randomIndex]);
    }

    // Play sound with 3D positioning (simplified)
    play3D(soundName, x, y, listenerX = GAME_WIDTH / 2, listenerY = GAME_HEIGHT / 2) {
        const distance = distance(x, y, listenerX, listenerY);
        const maxDistance = GAME_WIDTH;
        const volume = Math.max(0, 1 - (distance / maxDistance));
        
        this.play(soundName, { volume: volume * this.sfxVolume });
    }
} 