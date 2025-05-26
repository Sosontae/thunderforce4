// Bullet class

class Bullet extends GameObject {
    constructor(x, y, vx, vy, owner = 'player', level = 1) {
        const config = owner === 'player' ? BULLETS.PLAYER : BULLETS.ENEMY;
        super(x, y, config.WIDTH, config.HEIGHT);
        
        this.vx = vx;
        this.vy = vy;
        this.owner = owner;
        this.damage = config.DAMAGE * (owner === 'player' ? level : 1);
        this.color = config.COLOR;
        this.level = level;
        
        // Special bullet properties
        this.wavePattern = false;
        this.waveAmplitude = 0;
        this.waveFrequency = 0;
        this.waveOffset = 0;
        this.initialY = y;
        
        // Homing properties
        this.homing = false;
        this.target = null;
        this.turnSpeed = 0.05;
        
        this.piercing = level >= 4;
        this.trail = [];
        this.maxTrailLength = owner === 'player' ? 5 : 3;
    }

    update(deltaTime) {
        if (!this.active) return;

        // Update trail
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Fade trail
        this.trail.forEach((point, index) => {
            point.alpha = (index + 1) / this.trail.length * 0.5;
        });

        // Wave pattern movement
        if (this.wavePattern) {
            const waveY = Math.sin((this.x * this.waveFrequency) + this.waveOffset) * this.waveAmplitude;
            this.y = this.initialY + waveY;
        }

        // Homing behavior
        if (this.homing && this.target && this.target.active) {
            const angle = this.angleTo(this.target);
            const targetVx = Math.cos(angle) * Math.abs(this.vx);
            const targetVy = Math.sin(angle) * Math.abs(this.vx);
            
            this.vx = lerp(this.vx, targetVx, this.turnSpeed);
            this.vy = lerp(this.vy, targetVy, this.turnSpeed);
        }

        // Update position
        super.update(deltaTime);

        // Remove if out of bounds
        if (!this.isInBounds()) {
            this.destroy();
        }
    }

    draw(ctx) {
        // Draw trail
        if (this.trail.length > 0) {
            this.trail.forEach((point, index) => {
                ctx.fillStyle = fadeColor(this.color, point.alpha);
                const size = (this.width / 2) * (index / this.trail.length);
                ctx.fillRect(
                    point.x - this.x - this.width / 2,
                    point.y - this.y - this.height / 2,
                    size,
                    size
                );
            });
        }

        // Draw bullet based on owner and type
        if (this.owner === 'player') {
            this.drawPlayerBullet(ctx);
        } else {
            this.drawEnemyBullet(ctx);
        }
    }

    drawPlayerBullet(ctx) {
        // Glow effect
        const glowSize = this.width * 2;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        gradient.addColorStop(0, fadeColor(this.color, 0.8));
        gradient.addColorStop(0.5, fadeColor(this.color, 0.3));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);

        // Main bullet
        if (this.level >= 3) {
            // Laser beam style for high levels
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            
            // Core
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-this.width / 4, -1, this.width / 2, 2);
        } else {
            // Regular bullet
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight
            ctx.fillStyle = fadeColor('#ffffff', 0.6);
            ctx.beginPath();
            ctx.ellipse(-this.width / 4, -this.height / 4, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawEnemyBullet(ctx) {
        // Enemy bullets are more menacing
        ctx.fillStyle = this.color;
        
        if (this.wavePattern) {
            // Wave pattern bullets are special
            ctx.save();
            ctx.rotate(Math.atan2(this.vy, this.vx));
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, 0);
            ctx.lineTo(0, -this.height / 2);
            ctx.lineTo(this.width / 2, 0);
            ctx.lineTo(0, this.height / 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else {
            // Regular enemy bullet
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Danger glow for enemy bullets
        const glowSize = this.width * 1.5;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        gradient.addColorStop(0, fadeColor(this.color, 0.3));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
    }

    onHit(target) {
        // Create hit effect
        if (window.particleSystem) {
            window.particleSystem.createSparks(
                this.x,
                this.y,
                5,
                this.color
            );
        }

        // Destroy bullet unless it's piercing
        if (!this.piercing) {
            this.destroy();
        }
    }
} 