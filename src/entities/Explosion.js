// Explosion class

class Explosion extends GameObject {
    constructor(x, y, size = 20, color = '#ff6600') {
        super(x, y, size, size);
        
        this.maxSize = size;
        this.color = color;
        this.lifetime = 300;
        this.age = 0;
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
        
        // Update main explosion
        const progress = this.age / this.lifetime;
        this.scale = easeOutCubic(progress) * 2;
        this.alpha = 1 - easeInQuad(progress);
        
        // Update particles
        this.particles.forEach(particle => {
            particle.age += deltaTime;
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            const particleProgress = particle.age / particle.lifetime;
            particle.size = particle.maxSize * (1 - particleProgress);
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(p => p.age < p.lifetime);
        
        // Destroy explosion when done
        if (this.age >= this.lifetime && this.particles.length === 0) {
            this.destroy();
        }
    }

    draw(ctx) {
        // Draw particles
        this.particles.forEach(particle => {
            const particleAlpha = 1 - (particle.age / particle.lifetime);
            ctx.fillStyle = fadeColor(particle.color, particleAlpha);
            ctx.fillRect(
                particle.x - particle.size / 2,
                particle.y - particle.size / 2,
                particle.size,
                particle.size
            );
        });
        
        // Draw main explosion flash
        if (this.age < this.lifetime / 3) {
            const flashProgress = this.age / (this.lifetime / 3);
            const flashSize = this.maxSize * (1 + flashProgress);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flashSize);
            
            gradient.addColorStop(0, fadeColor('#ffffff', (1 - flashProgress) * 0.8));
            gradient.addColorStop(0.3, fadeColor(this.color, (1 - flashProgress) * 0.6));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(-flashSize, -flashSize, flashSize * 2, flashSize * 2);
        }
        
        // Draw explosion ring
        if (this.age < this.lifetime * 0.7) {
            const ringProgress = this.age / (this.lifetime * 0.7);
            const ringRadius = this.maxSize * ringProgress * 1.5;
            const ringAlpha = (1 - ringProgress) * 0.5;
            
            ctx.strokeStyle = fadeColor(this.color, ringAlpha);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
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