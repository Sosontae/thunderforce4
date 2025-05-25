// SpriteRenderer class - Handles sprite rendering and animation

class SpriteRenderer {
    constructor(spriteImage, frameWidth, frameHeight) {
        this.sprite = spriteImage;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.framesPerRow = Math.floor(this.sprite.width / frameWidth);
        this.totalFrames = Math.floor(this.sprite.width / frameWidth) * Math.floor(this.sprite.height / frameHeight);
        
        // Animation state
        this.currentFrame = 0;
        this.animationSpeed = 100; // milliseconds per frame
        this.lastFrameTime = 0;
        this.playing = false;
        this.loop = true;
        
        // Animation sequences
        this.animations = {};
        this.currentAnimation = null;
    }

    defineAnimation(name, frames, speed = 100, loop = true) {
        this.animations[name] = {
            frames: frames,
            speed: speed,
            loop: loop,
            currentIndex: 0
        };
    }

    playAnimation(name) {
        if (this.animations[name]) {
            this.currentAnimation = name;
            this.animations[name].currentIndex = 0;
            this.playing = true;
            this.lastFrameTime = Date.now();
        }
    }

    stopAnimation() {
        this.playing = false;
        this.currentAnimation = null;
    }

    update() {
        if (!this.playing || !this.currentAnimation) return;
        
        const now = Date.now();
        const animation = this.animations[this.currentAnimation];
        
        if (now - this.lastFrameTime >= animation.speed) {
            animation.currentIndex++;
            
            if (animation.currentIndex >= animation.frames.length) {
                if (animation.loop) {
                    animation.currentIndex = 0;
                } else {
                    this.stopAnimation();
                    return;
                }
            }
            
            this.currentFrame = animation.frames[animation.currentIndex];
            this.lastFrameTime = now;
        }
    }

    draw(ctx, x, y, options = {}) {
        const {
            scale = 1,
            rotation = 0,
            alpha = 1,
            flipX = false,
            flipY = false,
            centerX = 0.5,
            centerY = 0.5
        } = options;

        ctx.save();
        
        // Apply transformations
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(flipX ? -scale : scale, flipY ? -scale : scale);
        
        // Calculate source position in sprite sheet
        const frameX = (this.currentFrame % this.framesPerRow) * this.frameWidth;
        const frameY = Math.floor(this.currentFrame / this.framesPerRow) * this.frameHeight;
        
        // Draw sprite
        ctx.drawImage(
            this.sprite,
            frameX, frameY,
            this.frameWidth, this.frameHeight,
            -this.frameWidth * centerX,
            -this.frameHeight * centerY,
            this.frameWidth,
            this.frameHeight
        );
        
        ctx.restore();
    }

    drawFrame(ctx, frameIndex, x, y, options = {}) {
        const oldFrame = this.currentFrame;
        this.currentFrame = frameIndex;
        this.draw(ctx, x, y, options);
        this.currentFrame = oldFrame;
    }

    // Helper method to extract a specific sprite from the sheet
    extractSprite(frameIndex) {
        const canvas = document.createElement('canvas');
        canvas.width = this.frameWidth;
        canvas.height = this.frameHeight;
        const ctx = canvas.getContext('2d');
        
        const frameX = (frameIndex % this.framesPerRow) * this.frameWidth;
        const frameY = Math.floor(frameIndex / this.framesPerRow) * this.frameHeight;
        
        ctx.drawImage(
            this.sprite,
            frameX, frameY,
            this.frameWidth, this.frameHeight,
            0, 0,
            this.frameWidth, this.frameHeight
        );
        
        return canvas;
    }
}

// Sprite sheet configuration for Thunder Force 4 sprites
const SPRITE_CONFIGS = {
    rynex: {
        frameWidth: 48,
        frameHeight: 32,
        animations: {
            idle: { frames: [0], speed: 100 },
            moveUp: { frames: [1], speed: 100 },
            moveDown: { frames: [2], speed: 100 },
            bankLeft: { frames: [3], speed: 100 },
            bankRight: { frames: [4], speed: 100 }
        }
    },
    gargoyleDiver: {
        frameWidth: 32,
        frameHeight: 32,
        animations: {
            fly: { frames: [0, 1, 2, 1], speed: 150 },
            attack: { frames: [3, 4, 5], speed: 100 }
        }
    },
    faust: {
        frameWidth: 40,
        frameHeight: 40,
        animations: {
            idle: { frames: [0, 1], speed: 200 },
            attack: { frames: [2, 3, 4], speed: 150 }
        }
    },
    armamentClaw: {
        frameWidth: 64,
        frameHeight: 48,
        animations: {
            idle: { frames: [0], speed: 100 },
            open: { frames: [1, 2], speed: 150 },
            fire: { frames: [3, 4, 3], speed: 100 }
        }
    },
    evilCore: {
        frameWidth: 128,
        frameHeight: 96,
        animations: {
            idle: { frames: [0, 1, 2, 1], speed: 200 },
            damaged: { frames: [3, 4, 5], speed: 100 },
            critical: { frames: [6, 7], speed: 50 }
        }
    },
    hellArm: {
        frameWidth: 96,
        frameHeight: 80,
        animations: {
            idle: { frames: [0, 1], speed: 300 },
            attack: { frames: [2, 3, 4, 5], speed: 150 }
        }
    },
    sparkLancer: {
        frameWidth: 80,
        frameHeight: 64,
        animations: {
            idle: { frames: [0], speed: 100 },
            charge: { frames: [1, 2, 3], speed: 100 },
            fire: { frames: [4, 5], speed: 50 }
        }
    },
    explosion: {
        frameWidth: 64,
        frameHeight: 64,
        animations: {
            explode: { frames: [0, 1, 2, 3, 4, 5, 6, 7], speed: 50, loop: false }
        }
    },
    explosionSet: {
        frameWidth: 128,
        frameHeight: 128,
        animations: {
            small: { frames: [0, 1, 2, 3], speed: 60, loop: false },
            medium: { frames: [4, 5, 6, 7, 8, 9], speed: 50, loop: false },
            large: { frames: [10, 11, 12, 13, 14, 15], speed: 40, loop: false }
        }
    }
}; 