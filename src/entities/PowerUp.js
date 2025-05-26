// PowerUp class

class PowerUp extends GameObject {
    constructor(x, y, type) {
        super(x, y, POWERUPS.SIZE, POWERUPS.SIZE);
        
        this.type = type;
        this.vx = -POWERUPS.SPEED;
        this.vy = 0;
        this.bobAmount = 0;
        this.bobSpeed = 0.05;
        this.glowIntensity = 0;
        this.collected = false;
        
        // Set color based on type
        this.colors = {
            [POWERUPS.TYPES.WEAPON_UPGRADE]: '#ffff00',
            [POWERUPS.TYPES.SHIELD]: '#00ff00',
            [POWERUPS.TYPES.SPEED_BOOST]: '#00ffff',
            [POWERUPS.TYPES.EXTRA_LIFE]: '#ff00ff',
            [POWERUPS.TYPES.BOMB]: '#ff6600'
        };
        
        this.color = this.colors[type] || '#ffffff';
        
        // Auto-destroy after duration
        setTimeout(() => {
            if (this.active && !this.collected) {
                this.fadeOut(1000);
            }
        }, POWERUPS.DURATION);

        this.magnetRange = 150;
        this.magnetStrength = 0;
    }

    getColor() {
        switch (this.type) {
            case POWERUPS.TYPES.WEAPON_UPGRADE:
                return '#ffff00'; // Yellow
            case POWERUPS.TYPES.SHIELD:
                return '#00ffff'; // Cyan
            case POWERUPS.TYPES.SPEED_BOOST:
                return '#ff00ff'; // Magenta
            case POWERUPS.TYPES.EXTRA_LIFE:
                return '#00ff00'; // Green
            case POWERUPS.TYPES.BOMB:
                return '#ff0000'; // Red
            default:
                return '#ffffff'; // White
        }
    }

    getSymbol() {
        switch (this.type) {
            case POWERUPS.TYPES.WEAPON_UPGRADE:
                return 'W';
            case POWERUPS.TYPES.SHIELD:
                return 'S';
            case POWERUPS.TYPES.SPEED_BOOST:
                return '»';
            case POWERUPS.TYPES.EXTRA_LIFE:
                return '♥';
            case POWERUPS.TYPES.BOMB:
                return 'B';
            default:
                return '?';
        }
    }

    update(deltaTime) {
        if (!this.active || this.collected) return;

        // Bobbing motion
        this.bobAmount = Math.sin(Date.now() * this.bobSpeed) * 5;
        
        // Pulsing glow
        this.glowIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.5;
        
        // Update position
        super.update(deltaTime);
        
        // Remove if out of bounds
        if (this.x < -this.width) {
            this.destroy();
        }
    }

    collect(player) {
        if (this.collected) return;
        
        this.collected = true;
        
        // Apply power-up effect
        switch (this.type) {
            case POWERUPS.TYPES.WEAPON_UPGRADE:
                player.upgradeWeapon();
                this.showText('WEAPON UP!');
                break;
                
            case POWERUPS.TYPES.SHIELD:
                player.activateShield();
                this.showText('SHIELD!');
                break;
                
            case POWERUPS.TYPES.SPEED_BOOST:
                player.activateSpeedBoost();
                this.showText('SPEED UP!');
                break;
                
            case POWERUPS.TYPES.EXTRA_LIFE:
                player.lives++;
                this.showText('1UP!');
                break;
                
            case POWERUPS.TYPES.BOMB:
                this.clearScreen();
                this.showText('BOMB!');
                break;
        }
        
        // Add score
        player.addScore(500);
        
        // Play sound
        if (window.soundManager) {
            window.soundManager.play('powerup');
        }
        
        // Create collection effect
        this.createCollectionEffect();
        
        // Destroy power-up
        this.destroy();
    }

    showText(text) {
        // Create floating text effect
        if (window.game && window.game.currentScene) {
            window.game.currentScene.createFloatingText(
                this.x,
                this.y,
                text,
                this.color,
                1500
            );
        }
    }

    clearScreen() {
        // Destroy all enemies and bullets on screen
        if (window.game && window.game.currentScene) {
            const scene = window.game.currentScene;
            
            // Destroy all enemies
            scene.enemies.forEach(enemy => {
                if (enemy.active && !enemy.isBoss) {
                    enemy.takeDamage(999);
                }
            });
            
            // Destroy all enemy bullets
            scene.enemyBullets.forEach(bullet => {
                bullet.destroy();
            });
            
            // Create screen flash effect
            scene.createScreenFlash('#ffffff', 500);
        }
    }

    createCollectionEffect() {
        if (window.particleSystem) {
            // Create a burst of particles
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 * i) / 10;
                const speed = randomRange(2, 5);
                
                window.particleSystem.addParticle({
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: randomRange(2, 4),
                    color: this.color,
                    lifetime: 500,
                    fadeOut: true
                });
            }
        }
    }

    draw(ctx) {
        const time = Date.now() * 0.001;
        
        // Rotation effect
        ctx.rotate(time);
        
        // Draw power-up sprite if available
        if (window.spriteManager && window.spriteManager.loaded) {
            // The powerup sprite sheet has 4 frames, each 16x16 pixels
            const frameWidth = 16;
            const frameHeight = 16;
            // Choose frame based on powerup type
            let frame = 0;
            switch(this.type) {
                case POWERUPS.TYPES.WEAPON_UPGRADE:
                    frame = 0;
                    break;
                case POWERUPS.TYPES.SHIELD:
                    frame = 1;
                    break;
                case POWERUPS.TYPES.SPEED_BOOST:
                    frame = 2;
                    break;
                case POWERUPS.TYPES.EXTRA_LIFE:
                case POWERUPS.TYPES.BOMB:
                    frame = 3;
                    break;
            }
            
            // Use animated sprite method for sprite sheet
            window.spriteManager.drawAnimatedSprite(ctx, 'powerups.powerup', 0, 0, frame, {
                scale: 2,
                alpha: this.alpha,
                centered: true,
                framesPerRow: 4,
                frameWidth: frameWidth,
                frameHeight: frameHeight
            });
            
            // Add glow effect
            const glowSize = this.width + Math.sin(time * 3) * 5;
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            gradient.addColorStop(0, fadeColor(this.getColor(), 0.8));
            gradient.addColorStop(0.5, fadeColor(this.getColor(), 0.3));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
        } else {
            // Fallback to programmatic drawing if sprites not loaded
            // Glow effect
            const glowSize = this.width + Math.sin(time * 3) * 5;
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            gradient.addColorStop(0, fadeColor(this.getColor(), 0.8));
            gradient.addColorStop(0.5, fadeColor(this.getColor(), 0.3));
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
            
            // Core
            ctx.fillStyle = this.getColor();
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            
            // Inner detail
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(-this.width/4, -this.height/4, this.width/2, this.height/2);
            
            // Draw type symbol
            ctx.fillStyle = '#000000';
            ctx.font = `${this.height/2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const symbol = this.getSymbol();
            ctx.fillText(symbol, 0, 0);
        }
    }

    drawWeaponUpgrade(ctx) {
        // Draw a "W" symbol
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, -this.height / 3);
        ctx.lineTo(-this.width / 6, this.height / 3);
        ctx.lineTo(0, -this.height / 6);
        ctx.lineTo(this.width / 6, this.height / 3);
        ctx.lineTo(this.width / 3, -this.height / 3);
        ctx.stroke();
    }

    drawShield(ctx) {
        // Draw a shield shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(-this.width / 2, -this.height / 4);
        ctx.lineTo(-this.width / 2, this.height / 4);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 4);
        ctx.lineTo(this.width / 2, -this.height / 4);
        ctx.closePath();
        ctx.fill();
    }

    drawSpeedBoost(ctx) {
        // Draw arrow shapes
        ctx.fillStyle = this.color;
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(-this.width / 3 + i * this.width / 3, 0);
            ctx.beginPath();
            ctx.moveTo(0, -this.height / 3);
            ctx.lineTo(-this.width / 6, 0);
            ctx.lineTo(0, this.height / 3);
            ctx.lineTo(this.width / 6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    drawExtraLife(ctx) {
        // Draw "1UP" text
        ctx.fillStyle = this.color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1UP', 0, 0);
    }

    drawBomb(ctx) {
        // Draw a bomb shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Fuse
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.width / 3, -this.width / 3);
        ctx.lineTo(this.width / 2, -this.width / 2);
        ctx.stroke();
        
        // Spark
        const sparkSize = 3 + Math.random() * 2;
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.width / 2, -this.width / 2, sparkSize, 0, Math.PI * 2);
        ctx.fill();
    }
} 