// Base Scene class

class Scene {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.active = false;
        this.initialized = false;
        
        // Scene-specific objects
        this.gameObjects = [];
        this.uiElements = [];
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            shakeIntensity: 0,
            shakeDuration: 0,
            shakeTime: 0
        };
        
        // Effects
        this.screenFlash = {
            active: false,
            color: '#ffffff',
            alpha: 0,
            duration: 0,
            time: 0
        };
        
        this.floatingTexts = [];
    }

    init() {
        // Override in subclasses
        this.initialized = true;
    }

    enter() {
        if (!this.initialized) {
            this.init();
        }
        this.active = true;
        this.onEnter();
    }

    exit() {
        this.active = false;
        this.onExit();
    }

    onEnter() {
        // Override in subclasses
    }

    onExit() {
        // Override in subclasses
    }

    update(deltaTime) {
        if (!this.active) return;

        // Update camera shake
        if (this.camera.shakeDuration > 0) {
            this.camera.shakeTime += deltaTime;
            this.camera.shakeDuration -= deltaTime;
            
            if (this.camera.shakeDuration <= 0) {
                this.camera.x = 0;
                this.camera.y = 0;
                this.camera.shakeIntensity = 0;
            } else {
                const decay = 1 - (this.camera.shakeTime / (this.camera.shakeTime + this.camera.shakeDuration));
                this.camera.x = randomRange(-this.camera.shakeIntensity, this.camera.shakeIntensity) * decay;
                this.camera.y = randomRange(-this.camera.shakeIntensity, this.camera.shakeIntensity) * decay;
            }
        }

        // Update screen flash
        if (this.screenFlash.active) {
            this.screenFlash.time += deltaTime;
            const progress = this.screenFlash.time / this.screenFlash.duration;
            
            if (progress >= 1) {
                this.screenFlash.active = false;
                this.screenFlash.alpha = 0;
            } else {
                this.screenFlash.alpha = 1 - progress;
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            text.time += deltaTime;
            text.y -= text.speed * (deltaTime / 16);
            text.alpha = 1 - (text.time / text.duration);
            
            if (text.time >= text.duration) {
                this.floatingTexts.splice(i, 1);
            }
        }

        // Update game objects
        this.gameObjects.forEach(obj => {
            if (obj.active) {
                obj.update(deltaTime);
            }
        });

        // Remove inactive objects
        this.gameObjects = this.gameObjects.filter(obj => obj.active);
    }

    render() {
        if (!this.active) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera transform
        this.ctx.save();
        this.ctx.translate(this.camera.x, this.camera.y);

        // Render background
        this.renderBackground();

        // Render game objects
        this.gameObjects.forEach(obj => {
            if (obj.visible) {
                obj.render(this.ctx);
            }
        });

        // Render effects
        this.renderEffects();

        this.ctx.restore();

        // Render UI (not affected by camera)
        this.renderUI();

        // Render screen flash
        if (this.screenFlash.active && this.screenFlash.alpha > 0) {
            this.ctx.fillStyle = fadeColor(this.screenFlash.color, this.screenFlash.alpha);
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    renderBackground() {
        // Override in subclasses
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderEffects() {
        // Render floating texts
        this.floatingTexts.forEach(text => {
            drawText(this.ctx, text.text, text.x, text.y, {
                font: text.font,
                color: fadeColor(text.color, text.alpha),
                align: 'center',
                baseline: 'middle',
                shadow: true
            });
        });
    }

    renderUI() {
        // Override in subclasses
    }

    addGameObject(obj) {
        this.gameObjects.push(obj);
        return obj;
    }

    removeGameObject(obj) {
        const index = this.gameObjects.indexOf(obj);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    shakeCamera(intensity, duration) {
        this.camera.shakeIntensity = intensity;
        this.camera.shakeDuration = duration;
        this.camera.shakeTime = 0;
    }

    createScreenFlash(color, duration) {
        this.screenFlash.active = true;
        this.screenFlash.color = color;
        this.screenFlash.alpha = 1;
        this.screenFlash.duration = duration;
        this.screenFlash.time = 0;
    }

    createFloatingText(x, y, text, color, duration = 1000) {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            font: UI.FONT.MEDIUM,
            duration: duration,
            time: 0,
            speed: 1,
            alpha: 1
        });
    }

    handleInput(inputManager) {
        // Override in subclasses
    }

    pause() {
        // Override in subclasses
    }

    resume() {
        // Override in subclasses
    }

    cleanup() {
        // Clean up scene resources
        this.gameObjects = [];
        this.uiElements = [];
        this.floatingTexts = [];
        this.camera.x = 0;
        this.camera.y = 0;
        this.screenFlash.active = false;
    }

    // Utility method to find objects by type
    findObjectsByType(type) {
        return this.gameObjects.filter(obj => obj instanceof type);
    }

    // Utility method to find first object by type
    findObjectByType(type) {
        return this.gameObjects.find(obj => obj instanceof type);
    }
} 