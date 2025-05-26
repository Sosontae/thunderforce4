// SoundManager class

class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.muted = false;
        this.soundVolume = 0.5;
        this.musicVolume = 0.3;
        this.audioContext = null;
        this.userInteracted = false;
        
        // Sound pools for frequently played sounds
        this.soundPools = {};
        this.poolSize = 5;
    }

    init() {
        // Create audio context
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
        
        // Load all sounds
        this.loadSounds();
        
        // Set up user interaction handler
        this.setupUserInteraction();
    }

    setupUserInteraction() {
        const handleInteraction = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                
                // Resume audio context if suspended
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('Audio context resumed');
                    });
                }
                
                // Remove listeners after first interaction
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('keydown', handleInteraction);
                document.removeEventListener('touchstart', handleInteraction);
            }
        };
        
        // Add interaction listeners
        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);
    }

    loadSounds() {
        // Initialize sounds from loaded assets
        this.initializeSounds();
    }

    initializeSounds() {
        // Define sound configurations
        const soundConfigs = {
            // Sound effects
            shoot: { type: 'sfx', pooled: true },
            explosion: { type: 'sfx', pooled: true },
            boss_explosion: { type: 'sfx', pooled: false },
            powerup: { type: 'sfx', pooled: false },
            gameOver: { type: 'sfx', pooled: false },
            levelStart: { type: 'sfx', pooled: false },
            bossWarning: { type: 'sfx', pooled: false },
            menuSelect: { type: 'sfx', pooled: false },
            menuMove: { type: 'sfx', pooled: false },
            weaponSwitch: { type: 'sfx', pooled: false },
            
            // Music
            menuMusic: { type: 'music', pooled: false },
            stage1Music: { type: 'music', pooled: false },
            stage1BossMusic: { type: 'music', pooled: false },
            stage2Music: { type: 'music', pooled: false },
            stage2BossMusic: { type: 'music', pooled: false },
            stage3Music: { type: 'music', pooled: false },
            stage3BossMusic: { type: 'music', pooled: false },
            stage4Music: { type: 'music', pooled: false },
            stage4BossMusic: { type: 'music', pooled: false },
            stage5Music: { type: 'music', pooled: false },
            stage5BossMusic: { type: 'music', pooled: false },
            stage8Music: { type: 'music', pooled: false },
            bossMusic: { type: 'music', pooled: false }
        };

        // Create sound objects from loaded assets
        Object.keys(soundConfigs).forEach(soundName => {
            const config = soundConfigs[soundName];
            const audioElement = window.assetLoader.getAudio(soundName);
            
            if (!audioElement) {
                console.warn(`Audio asset not found: ${soundName}`);
                return;
            }
            
            // Skip if it's a placeholder
            if (!audioElement.duration && !audioElement.cloneNode) {
                console.log(`Skipping placeholder audio: ${soundName}`);
                return;
            }
            
            if (config.pooled) {
                this.createSoundPool(soundName, audioElement, config.type);
            } else {
                this.sounds[soundName] = this.createSound(soundName, audioElement, config.type);
            }
        });
    }

    createSound(name, audioElement, type) {
        // Clone the audio element for this sound instance
        const audio = audioElement.cloneNode();
        
        return {
            name: name,
            type: type,
            audio: audio,
            volume: type === 'music' ? this.musicVolume : this.soundVolume,
            playing: false,
            play: function() {
                if (this.playing && this.type === 'music') return;
                
                this.audio.volume = this.volume;
                this.audio.currentTime = 0;
                
                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.playing = true;
                    }).catch(error => {
                        // Silently handle autoplay errors
                        if (error.name === 'NotAllowedError') {
                            console.log(`Autoplay blocked for ${this.name}, waiting for user interaction`);
                        } else {
                            console.error(`Error playing ${this.name}:`, error);
                        }
                    });
                }
            },
            stop: function() {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.playing = false;
            },
            pause: function() {
                this.audio.pause();
                this.playing = false;
            },
            setVolume: function(volume) {
                this.volume = volume;
                this.audio.volume = volume;
            }
        };
        
        // Set up event listeners
        audio.addEventListener('ended', () => {
            if (type === 'music' && this.currentMusic === this.sounds[name]) {
                // Loop music
                audio.currentTime = 0;
                audio.play();
            } else if (this.sounds[name]) {
                this.sounds[name].playing = false;
            }
        });
    }

    createSoundPool(name, audioElement, type) {
        this.soundPools[name] = [];
        
        for (let i = 0; i < this.poolSize; i++) {
            this.soundPools[name].push(this.createSound(name, audioElement, type));
        }
    }

    play(soundName, options = {}) {
        if (this.muted) return;

        // Check if it's a pooled sound
        if (this.soundPools[soundName]) {
            const pool = this.soundPools[soundName];
            const availableSound = pool.find(sound => !sound.playing);
            
            if (availableSound) {
                availableSound.setVolume(options.volume || this.soundVolume);
                availableSound.play();
            }
        } else if (this.sounds[soundName]) {
            const sound = this.sounds[soundName];
            sound.setVolume(options.volume || 
                          (sound.type === 'music' ? this.musicVolume : this.soundVolume));
            sound.play();
        }
    }

    playMusic(musicName, loop = true) {
        if (this.muted) return;

        // Stop current music
        if (this.currentMusic) {
            this.stopMusic();
        }

        // Play new music
        if (this.sounds[musicName]) {
            this.currentMusic = this.sounds[musicName];
            this.currentMusic.audio.loop = loop;
            
            // Only play if user has interacted
            if (this.userInteracted) {
                this.currentMusic.play();
            } else {
                // Queue music to play after user interaction
                const checkInterval = setInterval(() => {
                    if (this.userInteracted && this.currentMusic === this.sounds[musicName]) {
                        clearInterval(checkInterval);
                        this.currentMusic.play();
                    }
                }, 100);
                
                // Clear interval after 10 seconds to prevent memory leak
                setTimeout(() => clearInterval(checkInterval), 10000);
            }
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
        this.soundVolume = clamp(volume, 0, 1);
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
        this.soundVolume = clamp(volume, 0, 1);
        
        // Update all sfx volumes
        Object.keys(this.sounds).forEach(soundName => {
            if (this.sounds[soundName].type === 'sfx') {
                this.sounds[soundName].setVolume(this.soundVolume);
            }
        });

        // Update pooled sounds
        Object.keys(this.soundPools).forEach(poolName => {
            this.soundPools[poolName].forEach(sound => {
                sound.setVolume(this.soundVolume);
            });
        });
    }

    updateAllVolumes() {
        this.setMusicVolume(this.musicVolume * this.soundVolume);
        this.setSFXVolume(this.soundVolume);
    }

    mute() {
        this.muted = true;
        this.stopAll();
    }

    unmute() {
        this.muted = false;
    }

    toggleMute() {
        if (this.muted) {
            this.unmute();
        } else {
            this.mute();
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
        
        this.play(soundName, { volume: volume * this.soundVolume });
    }
} 