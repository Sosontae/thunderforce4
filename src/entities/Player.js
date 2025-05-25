// Player class

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, PLAYER.WIDTH, PLAYER.HEIGHT);
        
        // Player stats
        this.lives = PLAYER.INITIAL_LIVES;
        this.score = 0;
        this.weaponLevel = 1;
        this.speed = PLAYER.SPEED;
        this.maxSpeed = PLAYER.MAX_SPEED;
        
        // Player state
        this.isInvulnerable = false;
        this.invulnerableTime = 0;
        this.isDead = false;
        this.respawnTime = 0;
        
        // Shooting
        this.canShoot = true;
        this.lastShotTime = 0;
        this.bullets = [];
        
        // Power-ups
        this.hasShield = false;
        this.shieldTime = 0;
        this.speedBoostTime = 0;
        
        // Visual
        this.color = '#00ffff';
        this.engineGlow = 0;
        this.trailParticles = [];
    }

    update(deltaTime, inputManager) {
        if (!this.active) return;

        // Handle respawn
        if (this.isDead) {
            this.respawnTime -= deltaTime;
            if (this.respawnTime <= 0) {
                this.respawn();
            }
            return;
        }

        // Handle invulnerability
        if (this.isInvulnerable) {
            this.invulnerableTime -= deltaTime;
            if (this.invulnerableTime <= 0) {
                this.isInvulnerable = false;
                this.alpha = 1;
            } else {
                // Flashing effect
                this.alpha = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
            }
        }

        // Handle power-up timers
        if (this.hasShield) {
            this.shieldTime -= deltaTime;
            if (this.shieldTime <= 0) {
                this.hasShield = false;
            }
        }

        if (this.speedBoostTime > 0) {
            this.speedBoostTime -= deltaTime;
            this.speed = PLAYER.MAX_SPEED;
        } else {
            this.speed = PLAYER.SPEED;
        }

        // Movement
        this.handleMovement(inputManager);

        // Shooting
        if (inputManager.isKeyPressed('Space') || inputManager.isKeyPressed('KeyZ')) {
            this.shoot();
        }

        // Update position
        super.update(deltaTime);

        // Keep player in bounds
        this.x = clamp(this.x, 0, GAME_WIDTH - this.width);
        this.y = clamp(this.y, 0, GAME_HEIGHT - this.height);

        // Update engine glow
        this.engineGlow = lerp(this.engineGlow, this.vx !== 0 || this.vy !== 0 ? 1 : 0, 0.1);

        // Create engine trail particles
        if (this.engineGlow > 0.5 && Math.random() < 0.3) {
            this.createTrailParticle();
        }

        // Update trail particles
        this.updateTrailParticles(deltaTime);
    }

    handleMovement(inputManager) {
        // Reset velocity
        this.vx = 0;
        this.vy = 0;

        // Keyboard input
        if (inputManager.isKeyPressed('ArrowLeft') || inputManager.isKeyPressed('KeyA')) {
            this.vx = -this.speed;
        }
        if (inputManager.isKeyPressed('ArrowRight') || inputManager.isKeyPressed('KeyD')) {
            this.vx = this.speed;
        }
        if (inputManager.isKeyPressed('ArrowUp') || inputManager.isKeyPressed('KeyW')) {
            this.vy = -this.speed;
        }
        if (inputManager.isKeyPressed('ArrowDown') || inputManager.isKeyPressed('KeyS')) {
            this.vy = this.speed;
        }

        // Normalize diagonal movement
        if (this.vx !== 0 && this.vy !== 0) {
            const normalized = normalize(this.vx, this.vy);
            this.vx = normalized.x * this.speed;
            this.vy = normalized.y * this.speed;
        }
    }

    shoot() {
        const now = Date.now();
        const weaponConfig = WEAPONS.LEVELS[this.weaponLevel];
        
        if (now - this.lastShotTime < weaponConfig.fireRate) return;
        
        this.lastShotTime = now;
        
        // Create bullets based on weapon level
        const bulletCount = weaponConfig.bulletCount;
        const spreadAngle = 15; // degrees
        
        for (let i = 0; i < bulletCount; i++) {
            let angle = 0;
            let offsetY = 0;
            
            if (bulletCount > 1) {
                const spreadIndex = i - (bulletCount - 1) / 2;
                angle = degToRad(spreadIndex * spreadAngle);
                offsetY = spreadIndex * 8;
            }
            
            const bullet = new Bullet(
                this.x + this.width,
                this.y + this.height / 2 + offsetY,
                Math.cos(angle) * BULLETS.PLAYER.SPEED,
                Math.sin(angle) * BULLETS.PLAYER.SPEED,
                'player',
                this.weaponLevel
            );
            
            this.bullets.push(bullet);
        }
        
        // Play shoot sound
        if (window.soundManager) {
            window.soundManager.play('shoot');
        }
    }

    takeDamage(damage = 1) {
        if (this.isInvulnerable || this.isDead) return false;

        if (this.hasShield) {
            this.hasShield = false;
            this.makeInvulnerable(1000);
            return false;
        }

        this.lives -= damage;
        
        if (this.lives <= 0) {
            this.die();
            return true;
        }

        this.makeInvulnerable(PLAYER.INVULNERABLE_TIME);
        
        // Screen shake effect
        if (window.game && window.game.camera) {
            window.game.camera.shake(10, 300);
        }

        return false;
    }

    die() {
        this.isDead = true;
        this.visible = false;
        this.respawnTime = PLAYER.RESPAWN_TIME;
        
        // Create explosion effect
        if (window.particleSystem) {
            window.particleSystem.createExplosion(
                this.x + this.width / 2,
                this.y + this.height / 2,
                30,
                '#00ffff'
            );
        }

        // Play death sound
        if (window.soundManager) {
            window.soundManager.play('explosion');
        }
    }

    respawn() {
        if (this.lives <= 0) return;

        this.isDead = false;
        this.visible = true;
        this.x = 100;
        this.y = GAME_HEIGHT / 2 - this.height / 2;
        this.vx = 0;
        this.vy = 0;
        this.weaponLevel = Math.max(1, this.weaponLevel - 1);
        this.makeInvulnerable(PLAYER.INVULNERABLE_TIME);
        this.fadeIn(500);
    }

    makeInvulnerable(duration) {
        this.isInvulnerable = true;
        this.invulnerableTime = duration;
    }

    addScore(points) {
        this.score += points;
        
        // Extra life every 10000 points
        if (this.score % 10000 === 0 && this.score > 0) {
            this.lives++;
            if (window.soundManager) {
                window.soundManager.play('powerup');
            }
        }
    }

    upgradeWeapon() {
        if (this.weaponLevel < WEAPONS.MAX_LEVEL) {
            this.weaponLevel++;
            return true;
        }
        return false;
    }

    activateShield(duration = 5000) {
        this.hasShield = true;
        this.shieldTime = duration;
    }

    activateSpeedBoost(duration = 5000) {
        this.speedBoostTime = duration;
    }

    createTrailParticle() {
        this.trailParticles.push({
            x: this.x - 5,
            y: this.y + this.height / 2 + randomRange(-5, 5),
            vx: -randomRange(2, 4),
            vy: randomRange(-0.5, 0.5),
            size: randomRange(2, 4),
            alpha: 1,
            color: '#00ffff',
            life: 500
        });
    }

    updateTrailParticles(deltaTime) {
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const particle = this.trailParticles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            particle.alpha = particle.life / 500;
            particle.size *= 0.98;
            
            if (particle.life <= 0 || particle.alpha <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // Draw trail particles
        this.trailParticles.forEach(particle => {
            ctx.fillStyle = fadeColor(particle.color, particle.alpha);
            ctx.fillRect(
                particle.x - this.x - this.width / 2,
                particle.y - this.y - this.height / 2,
                particle.size,
                particle.size
            );
        });

        // Draw ship body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(-this.width / 2, -this.height / 2);
        ctx.lineTo(-this.width / 4, 0);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fill();

        // Draw cockpit
        ctx.fillStyle = '#004466';
        ctx.beginPath();
        ctx.moveTo(this.width / 4, 0);
        ctx.lineTo(-this.width / 4, -this.height / 4);
        ctx.lineTo(-this.width / 4, this.height / 4);
        ctx.closePath();
        ctx.fill();

        // Draw engine glow
        if (this.engineGlow > 0) {
            const gradient = ctx.createRadialGradient(
                -this.width / 2, 0, 0,
                -this.width / 2, 0, this.height * this.engineGlow
            );
            gradient.addColorStop(0, fadeColor('#00ffff', this.engineGlow));
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(
                -this.width / 2 - this.height / 2,
                -this.height / 2,
                this.height,
                this.height
            );
        }

        // Draw shield
        if (this.hasShield) {
            ctx.strokeStyle = fadeColor(COLORS.SHIELD, 0.5 + Math.sin(Date.now() * 0.01) * 0.3);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.width * 0.8, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
} 