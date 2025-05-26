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
        // Draw health bar for bosses and heavy enemies
        if (this.type === 'boss' || this.type === 'heavy') {
            this.drawHealthBar(ctx);
        }
        
        // Draw using programmatic shapes
        switch (this.type) {
            case 'basic':
                this.drawBasicEnemy(ctx);
                break;
            case 'medium':
                this.drawMediumEnemy(ctx);
                break;
            case 'heavy':
                this.drawHeavyEnemy(ctx);
                break;
            case 'boss':
                this.drawBoss(ctx);
                break;
            default:
                super.draw(ctx);
        }
    }

    drawBasicEnemy(ctx) {
        // Outer ring with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.7, this.color);
        gradient.addColorStop(1, fadeColor(this.color, 0.5));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = fadeColor(this.color, 0.8);
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye glow
        const eyeGlow = 0.5 + Math.sin(Date.now() * 0.01 + this.x) * 0.5;
        ctx.fillStyle = fadeColor('#ff0000', eyeGlow);
        ctx.beginPath();
        ctx.arc(this.width / 4, 0, this.width / 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.width / 4, 0, this.width / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Decorative spikes
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const x1 = Math.cos(angle) * (this.width / 2 - 2);
            const y1 = Math.sin(angle) * (this.width / 2 - 2);
            const x2 = Math.cos(angle) * (this.width / 2 + 4);
            const y2 = Math.sin(angle) * (this.width / 2 + 4);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    drawMediumEnemy(ctx) {
        // Rotating effect
        ctx.save();
        ctx.rotate(Date.now() * 0.002);
        
        // Main diamond shape with gradient
        const gradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        gradient.addColorStop(0, fadeColor(this.color, 0.8));
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, fadeColor(this.color, 0.8));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);
        ctx.lineTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Inner diamond
        ctx.fillStyle = fadeColor(this.color, 0.5);
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, 0);
        ctx.lineTo(0, -this.height / 3);
        ctx.lineTo(this.width / 3, 0);
        ctx.lineTo(0, this.height / 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
        // Core with pulsing effect
        const coreGlow = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 3);
        coreGradient.addColorStop(0, fadeColor('#ff0000', coreGlow));
        coreGradient.addColorStop(0.5, fadeColor('#660000', coreGlow));
        coreGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Energy bolts at corners
        ctx.fillStyle = fadeColor('#ffff00', coreGlow);
        const boltSize = 4;
        ctx.fillRect(-this.width / 2 - boltSize/2, -boltSize/2, boltSize, boltSize);
        ctx.fillRect(this.width / 2 - boltSize/2, -boltSize/2, boltSize, boltSize);
        ctx.fillRect(-boltSize/2, -this.height / 2 - boltSize/2, boltSize, boltSize);
        ctx.fillRect(-boltSize/2, this.height / 2 - boltSize/2, boltSize, boltSize);
    }

    drawHeavyEnemy(ctx) {
        // Main body with metallic gradient
        const bodyGradient = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        bodyGradient.addColorStop(0, fadeColor(this.color, 0.9));
        bodyGradient.addColorStop(0.3, this.color);
        bodyGradient.addColorStop(0.7, this.color);
        bodyGradient.addColorStop(1, fadeColor(this.color, 0.7));
        
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Armor plates with 3D effect
        const armorGradient = ctx.createLinearGradient(-this.width / 2, 0, -this.width / 6, 0);
        armorGradient.addColorStop(0, '#555555');
        armorGradient.addColorStop(0.5, '#888888');
        armorGradient.addColorStop(1, '#333333');
        
        ctx.fillStyle = armorGradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width / 3, this.height);
        
        // Top and bottom armor
        ctx.fillStyle = '#666666';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height / 4);
        ctx.fillRect(-this.width / 2, this.height / 4, this.width, this.height / 4);
        
        // Armor details
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const y = -this.height / 2 + (i + 1) * (this.height / 5);
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, y);
            ctx.lineTo(this.width / 2, y);
            ctx.stroke();
        }
        
        // Weapon ports with glow
        const weaponGlow = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
        for (let i = 0; i < 3; i++) {
            const y = -this.height / 3 + i * (this.height / 3);
            
            // Port glow
            const glowGradient = ctx.createRadialGradient(this.width / 3, y, 0, this.width / 3, y, 10);
            glowGradient.addColorStop(0, fadeColor('#ff0000', weaponGlow));
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.fillRect(this.width / 4 - 10, y - 10, 20, 20);
            
            // Port
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.width / 3, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Engine exhausts
        const engineGlow = 0.7 + Math.sin(Date.now() * 0.02) * 0.3;
        ctx.fillStyle = fadeColor('#0099ff', engineGlow);
        ctx.fillRect(-this.width / 2 - 5, -this.height / 4, 5, 8);
        ctx.fillRect(-this.width / 2 - 5, this.height / 4 - 8, 5, 8);
    }

    drawBoss(ctx) {
        // Rotating parts
        ctx.save();
        ctx.rotate(Date.now() * 0.0005);
        
        // Outer shield ring
        const shieldGlow = 0.3 + Math.sin(Date.now() * 0.003) * 0.2;
        ctx.strokeStyle = fadeColor('#ff00ff', shieldGlow);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2 + 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        
        // Main hull with gradient
        const hullGradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        hullGradient.addColorStop(0, fadeColor(this.color, 0.8));
        hullGradient.addColorStop(0.5, this.color);
        hullGradient.addColorStop(1, fadeColor(this.color, 0.8));
        
        ctx.fillStyle = hullGradient;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);
        ctx.lineTo(-this.width / 4, -this.height / 2);
        ctx.lineTo(this.width / 2, -this.height / 3);
        ctx.lineTo(this.width / 2, this.height / 3);
        ctx.lineTo(-this.width / 4, this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Armor plating details
        ctx.strokeStyle = fadeColor(this.color, 0.5);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, -this.height / 3);
        ctx.lineTo(this.width / 3, -this.height / 4);
        ctx.lineTo(this.width / 3, this.height / 4);
        ctx.lineTo(-this.width / 3, this.height / 3);
        ctx.closePath();
        ctx.stroke();
        
        // Core with multi-layer effects
        const coreGlow = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
        
        // Outer core glow
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 4);
        coreGradient.addColorStop(0, fadeColor('#ff00ff', coreGlow));
        coreGradient.addColorStop(0.5, fadeColor('#ff0066', coreGlow * 0.7));
        coreGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGradient;
        ctx.fillRect(-this.width / 4, -this.width / 4, this.width / 2, this.width / 2);
        
        // Inner core
        ctx.fillStyle = fadeColor('#ffffff', coreGlow);
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Weapon systems with energy effects
        const weaponCharge = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
        
        // Top weapon
        ctx.save();
        ctx.translate(-this.width / 3, -this.height / 3);
        ctx.rotate(-Math.PI / 6);
        
        ctx.fillStyle = '#660066';
        ctx.fillRect(0, 0, this.width / 5, this.height / 8);
        
        // Energy charge
        ctx.fillStyle = fadeColor('#ff00ff', weaponCharge);
        ctx.beginPath();
        ctx.arc(this.width / 5, this.height / 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Bottom weapon
        ctx.save();
        ctx.translate(-this.width / 3, this.height / 4);
        ctx.rotate(Math.PI / 6);
        
        ctx.fillStyle = '#660066';
        ctx.fillRect(0, 0, this.width / 5, this.height / 8);
        
        // Energy charge
        ctx.fillStyle = fadeColor('#ff00ff', weaponCharge);
        ctx.beginPath();
        ctx.arc(this.width / 5, this.height / 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Engine thrusters
        for (let i = -1; i <= 1; i++) {
            const y = i * this.height / 4;
            const thrustGlow = 0.5 + Math.sin(Date.now() * 0.02 + i) * 0.5;
            
            const thrustGradient = ctx.createRadialGradient(
                -this.width / 2, y, 0,
                -this.width / 2, y, 15
            );
            thrustGradient.addColorStop(0, fadeColor('#00ffff', thrustGlow));
            thrustGradient.addColorStop(0.5, fadeColor('#0066ff', thrustGlow * 0.5));
            thrustGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = thrustGradient;
            ctx.fillRect(-this.width / 2 - 15, y - 15, 30, 30);
        }
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barY = -this.height / 2 - 10;
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#00ff00' : 
                          healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = healthColor;
        ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);
    }
} 