// ParticleSystem class

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500;
    }

    update(deltaTime) {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.age += deltaTime;
            
            // Update position
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            
            // Apply gravity if specified
            if (particle.gravity) {
                particle.vy += particle.gravity * (deltaTime / 16);
            }
            
            // Apply friction
            if (particle.friction) {
                particle.vx *= particle.friction;
                particle.vy *= particle.friction;
            }
            
            // Update alpha based on fade
            if (particle.fadeOut) {
                particle.alpha = 1 - (particle.age / particle.lifetime);
            }
            
            // Update size
            if (particle.shrink) {
                particle.size *= 0.98;
            }
            
            // Remove dead particles
            if (particle.age >= particle.lifetime || particle.alpha <= 0 || particle.size <= 0.1) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        ctx.save();
        
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.alpha;
            
            if (particle.type === 'spark') {
                this.drawSpark(ctx, particle);
            } else if (particle.type === 'smoke') {
                this.drawSmoke(ctx, particle);
            } else {
                this.drawDefault(ctx, particle);
            }
        });
        
        ctx.restore();
    }

    addParticle(config) {
        if (this.particles.length >= this.maxParticles) return;
        
        const particle = {
            x: config.x || 0,
            y: config.y || 0,
            vx: config.vx || 0,
            vy: config.vy || 0,
            size: config.size || 4,
            color: config.color || '#ffffff',
            alpha: config.alpha || 1,
            lifetime: config.lifetime || 1000,
            age: 0,
            type: config.type || 'default',
            fadeOut: config.fadeOut !== false,
            shrink: config.shrink || false,
            gravity: config.gravity || 0,
            friction: config.friction || 1,
            rotation: config.rotation || 0,
            rotationSpeed: config.rotationSpeed || 0
        };
        
        this.particles.push(particle);
    }

    createExplosion(x, y, count = 20, color = '#ff6600') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + randomRange(-0.2, 0.2);
            const speed = randomRange(PARTICLES.EXPLOSION.MIN_SPEED, PARTICLES.EXPLOSION.MAX_SPEED);
            
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: randomRange(2, PARTICLES.EXPLOSION.SIZE),
                color: color,
                lifetime: PARTICLES.EXPLOSION.LIFETIME,
                fadeOut: true,
                shrink: true,
                friction: 0.98
            });
        }
        
        // Add some sparks
        for (let i = 0; i < count / 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = randomRange(PARTICLES.EXPLOSION.MIN_SPEED * 1.5, PARTICLES.EXPLOSION.MAX_SPEED * 1.5);
            
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: randomRange(1, 3),
                color: '#ffff00',
                lifetime: PARTICLES.EXPLOSION.LIFETIME / 2,
                type: 'spark',
                fadeOut: true
            });
        }
    }

    createSparks(x, y, count = 5, color = '#ffff00') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = randomRange(1, 4);
            
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: randomRange(1, 3),
                color: color,
                lifetime: 200,
                type: 'spark',
                fadeOut: true,
                gravity: 0.2
            });
        }
    }

    createThrust(x, y, angle, color = '#00ffff') {
        for (let i = 0; i < PARTICLES.THRUST.COUNT; i++) {
            const spread = randomRange(-0.3, 0.3);
            const thrustAngle = angle + Math.PI + spread;
            const speed = PARTICLES.THRUST.SPEED + randomRange(-1, 1);
            
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(thrustAngle) * speed,
                vy: Math.sin(thrustAngle) * speed,
                size: PARTICLES.THRUST.SIZE,
                color: color,
                lifetime: PARTICLES.THRUST.LIFETIME,
                fadeOut: true,
                shrink: true
            });
        }
    }

    createSmoke(x, y, count = 10, color = '#666666') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = randomRange(0.5, 2);
            
            this.addParticle({
                x: x + randomRange(-5, 5),
                y: y + randomRange(-5, 5),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: randomRange(8, 15),
                color: color,
                lifetime: 1000,
                type: 'smoke',
                fadeOut: true,
                friction: 0.95,
                gravity: -0.05
            });
        }
    }

    createPowerUpCollect(x, y, color) {
        const count = 20;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = randomRange(3, 6);
            
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: randomRange(2, 5),
                color: color,
                lifetime: 500,
                fadeOut: true,
                friction: 0.95,
                type: 'spark'
            });
        }
    }

    createHitEffect(x, y, color = '#ffffff') {
        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = randomRange(2, 4);
            
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: randomRange(1, 3),
                color: color,
                lifetime: 300,
                fadeOut: true,
                shrink: true
            });
        }
    }

    drawDefault(ctx, particle) {
        ctx.fillStyle = particle.color;
        ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
        );
    }

    drawSpark(ctx, particle) {
        // Draw spark with trail
        const gradient = ctx.createLinearGradient(
            particle.x - particle.vx * 2,
            particle.y - particle.vy * 2,
            particle.x,
            particle.y
        );
        gradient.addColorStop(0, fadeColor(particle.color, 0));
        gradient.addColorStop(1, particle.color);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = particle.size;
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
        
        // Bright point at tip
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
            particle.x - particle.size / 4,
            particle.y - particle.size / 4,
            particle.size / 2,
            particle.size / 2
        );
    }

    drawSmoke(ctx, particle) {
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, fadeColor(particle.color, particle.alpha * 0.5));
        gradient.addColorStop(1, fadeColor(particle.color, 0));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            particle.x - particle.size,
            particle.y - particle.size,
            particle.size * 2,
            particle.size * 2
        );
    }

    clear() {
        this.particles = [];
    }

    getParticleCount() {
        return this.particles.length;
    }
} 