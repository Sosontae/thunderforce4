// Main Game class

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentScene = null;
        this.scenes = {};
        this.options = {};
        
        // Game loop variables
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.running = false;
        
        // Systems
        this.inputManager = null;
        this.soundManager = null;
        
        // Performance monitoring
        this.frameCount = 0;
        this.fpsDisplay = 0;
        this.lastFpsUpdate = 0;
        
        // Camera for screen effects
        this.camera = {
            x: 0,
            y: 0,
            shake: (intensity, duration) => {
                if (this.currentScene && this.currentScene.shakeCamera) {
                    this.currentScene.shakeCamera(intensity, duration);
                }
            }
        };
    }

    init() {
        // Get canvas
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas not found!');
            return false;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        
        // Initialize systems
        this.initializeSystems();
        
        // Create scenes
        this.createScenes();
        
        // Start with menu scene
        this.changeScene('menu');
        
        return true;
    }

    initializeSystems() {
        // Initialize input manager
        this.inputManager = new InputManager();
        
        // Initialize sound manager
        window.soundManager = new SoundManager();
        window.soundManager.init();
        
        // Set global game reference
        window.game = this;
    }

    createScenes() {
        // Create all game scenes
        this.scenes.menu = new MenuScene(this);
        this.scenes.game = new GameScene(this);
        // Could add more scenes like options, credits, etc.
    }

    changeScene(sceneName, options = {}) {
        // Exit current scene
        if (this.currentScene) {
            this.currentScene.exit();
        }
        
        // Store options for the new scene
        this.options = options;
        
        // Enter new scene
        const newScene = this.scenes[sceneName];
        if (newScene) {
            this.currentScene = newScene;
            this.currentScene.enter();
        } else {
            console.error(`Scene '${sceneName}' not found!`);
        }
    }

    start() {
        if (this.running) return;
        
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    stop() {
        this.running = false;
    }

    gameLoop(currentTime = performance.now()) {
        if (!this.running) return;
        
        // Request next frame
        requestAnimationFrame((time) => this.gameLoop(time));
        
        // Calculate delta time
        this.deltaTime = currentTime - this.lastTime;
        
        // Limit delta time to prevent large jumps
        if (this.deltaTime > 100) {
            this.deltaTime = this.frameInterval;
        }
        
        // Update FPS counter
        this.updateFPS(currentTime);
        
        // Only update if enough time has passed (frame rate limiting)
        if (this.deltaTime >= this.frameInterval) {
            // Update
            this.update(this.deltaTime);
            
            // Render
            this.render();
            
            // Update last time
            this.lastTime = currentTime - (this.deltaTime % this.frameInterval);
        }
    }

    update(deltaTime) {
        // Handle input
        if (this.currentScene) {
            this.currentScene.handleInput(this.inputManager);
        }
        
        // Update current scene
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
        
        // Update input manager's previous keys state
        this.inputManager.updatePreviousKeys();
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render current scene
        if (this.currentScene) {
            this.currentScene.render();
        }
        
        // Render debug info if enabled
        if (this.debug) {
            this.renderDebugInfo();
        }
        
        // Render touch controls on mobile
        if (this.inputManager.touches.length > 0) {
            this.inputManager.drawTouchControls(this.ctx);
        }
    }

    updateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fpsDisplay = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
    }

    renderDebugInfo() {
        const debugInfo = [
            `FPS: ${this.fpsDisplay}`,
            `Scene: ${this.currentScene ? this.currentScene.constructor.name : 'None'}`,
            `Particles: ${window.particleSystem ? window.particleSystem.getParticleCount() : 0}`
        ];
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(5, 5, 150, debugInfo.length * 20 + 10);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '14px monospace';
        debugInfo.forEach((info, index) => {
            this.ctx.fillText(info, 10, 20 + index * 20);
        });
        this.ctx.restore();
    }

    toggleDebug() {
        this.debug = !this.debug;
    }

    // Utility methods
    getCanvasRect() {
        return this.canvas.getBoundingClientRect();
    }

    isPointInCanvas(x, y) {
        const rect = this.getCanvasRect();
        return x >= rect.left && x <= rect.right && 
               y >= rect.top && y <= rect.bottom;
    }

    // Screen utilities
    screenToCanvas(screenX, screenY) {
        const rect = this.getCanvasRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (screenX - rect.left) * scaleX,
            y: (screenY - rect.top) * scaleY
        };
    }

    // Save/Load functionality (for future implementation)
    saveGame() {
        const saveData = {
            score: this.currentScene.player ? this.currentScene.player.score : 0,
            lives: this.currentScene.player ? this.currentScene.player.lives : 3,
            level: this.currentScene.currentLevel || 1,
            weaponLevel: this.currentScene.player ? this.currentScene.player.weaponLevel : 1
        };
        
        localStorage.setItem('thunderforce4_save', JSON.stringify(saveData));
        console.log('Game saved!');
    }

    loadGame() {
        const saveData = localStorage.getItem('thunderforce4_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            console.log('Game loaded:', data);
            // TODO: Implement loading logic
        }
    }

    // Pause/Resume
    pause() {
        this.running = false;
        if (this.currentScene && this.currentScene.pause) {
            this.currentScene.pause();
        }
    }

    resume() {
        this.running = true;
        this.lastTime = performance.now();
        if (this.currentScene && this.currentScene.resume) {
            this.currentScene.resume();
        }
        this.gameLoop();
    }

    // Fullscreen support
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const container = document.getElementById('game-container');
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
} 