// Enemy class

class Enemy extends GameObject {
    constructor(x, y, type = 'basic') {
        const config = ENEMIES[type.toUpperCase()] || ENEMIES.BASIC;
        super(x, y, config.WIDTH, config.HEIGHT);
        
        this.type = type;
        this.config = config;
        this.health = config.HEALTH;
        this.maxHealth = config.HEALTH;
        this.speed = config.SPEED;
        this.score = config.SCORE;
        this.color = config.COLOR;
        
        // Movement pattern
        this.movementPattern = null;
        this.movementTime = 0;
        this.targetX = null;
        this.targetY = null;
        
        // Shooting
        this.canShoot = true;
        this.lastShotTime = 0;
        this.shootInterval = randomRange(1000, 3000);
        this.bullets = [];
        
        // Visual effects
        this.hitFlash = 0;
        this.originalColor = this.color;
        
        // Boss specific
        this.isBoss = type === 'boss';
        this.bossPhase = 1;
        this.bossAttackPattern = 0;
        
        // No sprite initialization - we'll use programmatic drawing
    }

    update(deltaTime, player) {
        if (!this.active) return;

        this.movementTime += deltaTime;

        // Update movement based on pattern
        if (this.movementPattern) {
            const position = this.movementPattern(this.movementTime);
            this.x = position.x;
            this.y = position.y;
        } else {
            // Default movement
            this.vx = -this.speed;
        }

        // Update position
        super.update(deltaTime);

        // Shooting behavior
        if (this.canShoot && player && !player.isDead) {
            this.updateShooting(deltaTime, player);
        }

        // Update visual effects
        if (this.hitFlash > 0) {
            this.hitFlash -= deltaTime;
            this.color = this.hitFlash > 0 ? '#ffffff' : this.originalColor;
        }

        // Boss behavior
        if (this.isBoss) {
            this.updateBossBehavior(deltaTime, player);
        }

        // Remove if out of bounds (left side)
        if (this.x < -this.width - 100) {
            this.destroy();
        }
    }

    updateShooting(deltaTime, player) {
        const now = Date.now();
        
        if (now - this.lastShotTime > this.shootInterval) {
            this.lastShotTime = now;
            
            switch (this.type) {
                case 'basic':
                    this.shootStraight();
                    break;
                case 'medium':
                    this.shootAimed(player);
                    break;
                case 'heavy':
                    this.shootSpread();
                    break;
                case 'boss':
                    this.shootBossPattern(player);
                    break;
            }
            
            // Randomize next shot interval
            this.shootInterval = randomRange(1000, 3000);
        }
    }

    shootStraight() {
        const bullet = new Bullet(
            this.x,
            this.y + this.height / 2,
            -BULLETS.ENEMY.SPEED,
            0,
            'enemy'
        );
        this.bullets.push(bullet);
    }

    shootAimed(player) {
        const angle = this.angleTo(player);
        const bullet = new Bullet(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * BULLETS.ENEMY.SPEED,
            Math.sin(angle) * BULLETS.ENEMY.SPEED,
            'enemy'
        );
        this.bullets.push(bullet);
    }

    shootSpread() {
        const bulletCount = 3;
        const spreadAngle = 30;
        
        for (let i = 0; i < bulletCount; i++) {
            const angle = degToRad(-180 + (i - (bulletCount - 1) / 2) * spreadAngle);
            const bullet = new Bullet(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle) * BULLETS.ENEMY.SPEED,
                Math.sin(angle) * BULLETS.ENEMY.SPEED,
                'enemy'
            );
            this.bullets.push(bullet);
        }
    }

    shootBossPattern(player) {
        switch (this.bossAttackPattern) {
            case 0: // Circular burst
                this.shootCircularBurst();
                break;
            case 1: // Aimed stream
                this.shootAimedStream(player);
                break;
            case 2: // Wave pattern
                this.shootWavePattern();
                break;
        }
        
        // Cycle through patterns
        this.bossAttackPattern = (this.bossAttackPattern + 1) % 3;
    }

    shootCircularBurst() {
        const bulletCount = 16;
        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 * i) / bulletCount;
            const bullet = new Bullet(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * BULLETS.ENEMY.SPEED * 0.7,
                Math.sin(angle) * BULLETS.ENEMY.SPEED * 0.7,
                'enemy'
            );
            this.bullets.push(bullet);
        }
    }

    shootAimedStream(player) {
        const angle = this.angleTo(player);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (!this.active) return;
                const bullet = new Bullet(
                    this.x,
                    this.y + this.height / 2,
                    Math.cos(angle) * BULLETS.ENEMY.SPEED * 1.5,
                    Math.sin(angle) * BULLETS.ENEMY.SPEED * 1.5,
                    'enemy'
                );
                this.bullets.push(bullet);
            }, i * 100);
        }
    }

    shootWavePattern() {
        const waveAmplitude = 50;
        const waveFrequency = 0.1;
        
        for (let i = 0; i < 3; i++) {
            const bullet = new Bullet(
                this.x,
                this.y + this.height / 2 + (i - 1) * 20,
                -BULLETS.ENEMY.SPEED,
                0,
                'enemy'
            );
            bullet.wavePattern = true;
            bullet.waveAmplitude = waveAmplitude;
            bullet.waveFrequency = waveFrequency;
            bullet.waveOffset = i * Math.PI / 3;
            this.bullets.push(bullet);
        }
    }

    updateBossBehavior(deltaTime, player) {
        // Boss movement pattern
        if (!this.targetX || !this.targetY) {
            this.targetX = GAME_WIDTH - this.width - 50;
            this.targetY = GAME_HEIGHT / 2;
        }
        
        // Move to target position
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx = dx * 0.02;
        this.vy = dy * 0.02;
        
        // Change target position periodically
        if (Math.random() < 0.01) {
            this.targetY = randomRange(this.height, GAME_HEIGHT - this.height);
        }
        
        // Update boss phase based on health
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent < 0.3 && this.bossPhase === 1) {
            this.bossPhase = 2;
            this.shootInterval = 500; // Faster shooting
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        this.hitFlash = 100;
        
        if (this.health <= 0) {
            this.destroy();
            
            // Create explosion
            if (window.particleSystem) {
                const explosionSize = this.isBoss ? 50 : 20;
                window.particleSystem.createExplosion(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    explosionSize,
                    this.color
                );
            }
            
            // Play sound
            if (window.soundManager) {
                window.soundManager.play(this.isBoss ? 'boss_explosion' : 'explosion');
            }
            
            // Drop power-up chance
            if (Math.random() < 0.2) {
                this.dropPowerUp();
            }
            
            return true;
        }
        
        return false;
    }

    dropPowerUp() {
        const types = Object.values(POWERUPS.TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        if (window.game && window.game.currentScene) {
            window.game.currentScene.spawnPowerUp(
                this.x + this.width / 2,
                this.y + this.height / 2,
                randomType
            );
        }
    }

    setMovementPattern(patternName) {
        this.movementPattern = generateEnemyPattern(
            patternName,
            this.x,
            this.y
        );
    }

    draw(ctx) {
        ctx.save();
        
        // Apply any rotation
        if (this.rotation) {
            ctx.rotate(this.rotation);
        }
        
        // Draw enemy sprite if available
        if (window.spriteManager && window.spriteManager.loaded) {
            let spriteName;
            let frameWidth, frameHeight, frame = 0, framesPerRow = 1, scale = 1;
            
            // Choose sprite and dimensions based on enemy type
            switch(this.type) {
                case ENEMY_TYPES.BOSS:
                    spriteName = 'enemies.biomech';
                    scale = 1;
                    break;
                case ENEMY_TYPES.HEAVY:
                    spriteName = 'enemies.big';
                    frameWidth = 32;
                    frameHeight = 32;
                    frame = Math.floor(Date.now() / 200) % 6; // Animate through 6 frames
                    framesPerRow = 6;
                    scale = 2;
                    break;
                case ENEMY_TYPES.MEDIUM:
                    spriteName = 'enemies.medium';
                    frameWidth = 32;
                    frameHeight = 16;
                    frame = Math.floor(Date.now() / 200) % 6; // Animate through 6 frames
                    framesPerRow = 6;
                    scale = 1.5;
                    break;
                case ENEMY_TYPES.BASIC:
                default:
                    spriteName = 'enemies.small';
                    frameWidth = 16;
                    frameHeight = 16;
                    frame = Math.floor(Date.now() / 200) % 6; // Animate through 6 frames
                    framesPerRow = 6;
                    scale = 2;
                    break;
            }
            
            // Draw the sprite
            if (frameWidth && frameHeight) {
                // Use animated sprite for sprite sheets
                window.spriteManager.drawAnimatedSprite(ctx, spriteName, 0, 0, frame, {
                    scale: scale,
                    alpha: this.alpha,
                    centered: true,
                    framesPerRow: framesPerRow,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight
                });
            } else {
                // Use regular sprite for single images
                window.spriteManager.drawSprite(ctx, spriteName, 0, 0, {
                    scale: scale,
                    alpha: this.alpha,
                    centered: true
                });
            }
            
            // Add glow effect for bosses
            if (this.type === ENEMY_TYPES.BOSS) {
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 20;
            }
        } else {
            // Fallback to programmatic drawing if sprites not loaded
            ctx.fillStyle = this.color;
            
            switch(this.type) {
                case ENEMY_TYPES.BOSS:
                    // Boss - large diamond shape
                    ctx.beginPath();
                    ctx.moveTo(0, -this.height/2);
                    ctx.lineTo(this.width/2, 0);
                    ctx.lineTo(0, this.height/2);
                    ctx.lineTo(-this.width/2, 0);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Boss details
                    ctx.fillStyle = '#ff0000';
                    ctx.beginPath();
                    ctx.arc(0, 0, this.width/4, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case ENEMY_TYPES.HEAVY:
                    // Heavy enemy - rectangular with details
                    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                    
                    // Details
                    ctx.fillStyle = '#800000';
                    ctx.fillRect(-this.width/3, -this.height/3, this.width/3, this.height/3);
                    ctx.fillRect(0, -this.height/3, this.width/3, this.height/3);
                    break;
                    
                case ENEMY_TYPES.MEDIUM:
                    // Medium enemy - hexagon shape
                    const size = this.width/2;
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI * 2 / 6) * i;
                        const x = Math.cos(angle) * size;
                        const y = Math.sin(angle) * size;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    break;
                    
                case ENEMY_TYPES.BASIC:
                default:
                    // Basic enemy - simple circle
                    ctx.beginPath();
                    ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Eye effect
                    ctx.fillStyle = '#ffaa00';
                    ctx.beginPath();
                    ctx.arc(-this.width/4, -this.height/4, 3, 0, Math.PI * 2);
                    ctx.arc(this.width/4, -this.height/4, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
        }
        
        // Draw health bar for heavy enemies and bosses
        if ((this.type === ENEMY_TYPES.HEAVY || this.type === ENEMY_TYPES.BOSS) && this.health < this.maxHealth) {
            const barWidth = this.width;
            const barHeight = 4;
            const barY = -this.height/2 - 10;
            
            // Background
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(-barWidth/2, barY, barWidth, barHeight);
            
            // Health
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(-barWidth/2, barY, barWidth * healthPercent, barHeight);
        }
        
        ctx.restore();
    }
} 