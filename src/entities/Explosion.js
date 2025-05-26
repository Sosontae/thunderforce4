// Explosion class

class Explosion extends GameObject {
    constructor(x, y, size = 20, color = '#ff6600') {
        super(x, y, size, size);
        
        this.maxSize = size;
        this.color = color;
        this.lifetime = 300;
        this.age = 0;
        this.animationProgress = 0;
        this.particles = [];
        
        // Create explosion particles
        this.createParticles();
        
        // Play sound
        if (window.soundManager) {
            window.soundManager.play('explosion');
        }
    }

    createParticles() {
        const particleCount = Math.floor(this.maxSize / 2);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + randomRange(-0.2, 0.2);
            const speed = randomRange(1, 4) * (this.maxSize / 20);
            const size = randomRange(2, 6);
            
            this.particles.push({
                x: 0,
                y: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                color: this.color,
                lifetime: randomRange(200, 400),
                age: 0
            });
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        this.age += deltaTime;
        this.animationProgress = this.age / this.lifetime;
        
        if (this.age >= this.lifetime) {
            this.destroy();
            return;
        }

        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.size *= 0.95;
            particle.age += deltaTime;
            particle.alpha = 1 - (particle.age / particle.lifetime);
        });

        // Remove dead particles
        this.particles = this.particles.filter(p => p.age < p.lifetime);

        // Update alpha
        this.alpha = 1 - (this.age / this.lifetime);
    }

    draw(ctx) {
        if (window.spriteManager && window.spriteManager.loaded) {
            // The explosion sprite sheet is 80x16 with 5 frames (each 16x16 pixels)
            const frameWidth = 16;
            const frameHeight = 16;
            const totalFrames = 5;
            
            // Calculate current frame based on animation progress
            const frame = Math.floor(this.animationProgress * totalFrames);
            if (frame >= totalFrames) return; // Animation complete
            
            const frameX = frame * frameWidth;
            const frameY = 0;
            
            // Draw explosion sprite
            window.spriteManager.drawSprite(ctx, 'effects.explosion', 0, 0, {
                scale: this.size / 8, // Scale based on explosion size
                alpha: this.alpha,
                centered: true,
                frameX: frameX,
                frameY: frameY,
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                flipY: false
            });
        } else {
            // Fallback to particle-based explosion
            this.particles.forEach(particle => {
                ctx.fillStyle = fadeColor(particle.color, particle.alpha);
                ctx.fillRect(
                    particle.x - this.x - particle.size / 2,
                    particle.y - this.y - particle.size / 2,
                    particle.size,
                    particle.size
                );
            });
        }
    }
}

// Specialized explosion types
class SmallExplosion extends Explosion {
    constructor(x, y, color = '#ffaa00') {
        super(x, y, 15, color);
        this.lifetime = 200;
    }
}

class LargeExplosion extends Explosion {
    constructor(x, y, color = '#ff6600') {
        super(x, y, 40, color);
        this.lifetime = 500;
        
        // Add screen shake for large explosions
        if (window.game && window.game.camera) {
            window.game.camera.shake(15, 300);
        }
    }
}

class ChainExplosion extends Explosion {
    constructor(x, y, chainCount = 3, delay = 100) {
        super(x, y, 25, '#ff9900');
        
        // Create chain explosions
        for (let i = 1; i < chainCount; i++) {
            setTimeout(() => {
                const offsetX = randomRange(-30, 30);
                const offsetY = randomRange(-30, 30);
                new Explosion(x + offsetX, y + offsetY, 20, '#ffaa00');
            }, i * delay);
        }
    }
} 