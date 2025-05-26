// GameScene class

class GameScene extends Scene {
    constructor(game) {
        super(game);
        
        // Game entities
        this.player = null;
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.explosions = [];
        
        // Game state
        this.paused = false;
        this.gameTime = 0;
        this.currentLevel = 1;
        this.levelTime = 0;
        this.enemySpawnTimer = 0;
        this.bossSpawned = false;
        
        // Background
        this.stars = [];
        this.backgroundLayers = [];
        this.scrollSpeed = 1;
        
        // Wave management
        this.currentWave = 0;
        this.waveEnemies = [];
        this.waveTimer = 0;
        this.lastRandomSpawnTime = 0;
        this.randomSpawnInterval = 3000; // Spawn random enemies every 3 seconds
        
        // Score multiplier
        this.scoreMultiplier = 1;
        this.comboTimer = 0;
        this.comboCount = 0;
    }

    init() {
        super.init();
        
        // Initialize systems
        window.particleSystem = new ParticleSystem();
        window.collisionSystem = new CollisionSystem();
        window.collisionSystem.init(GAME_WIDTH, GAME_HEIGHT);
        
        // Create background
        this.createBackground();
        
        // Create player
        this.createPlayer();
        
        // Start level
        this.startLevel(this.currentLevel);
        
        // Update UI
        this.updateUI();
    }

    createBackground() {
        // Create multi-layer starfield for parallax effect
        this.stars = [];
        
        // Far stars (slow)
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: randomRange(0, GAME_WIDTH),
                y: randomRange(0, GAME_HEIGHT),
                size: randomRange(0.5, 1),
                speed: randomRange(0.2, 0.5),
                brightness: randomRange(0.3, 0.6),
                layer: 0
            });
        }
        
        // Medium stars
        for (let i = 0; i < 30; i++) {
            this.stars.push({
                x: randomRange(0, GAME_WIDTH),
                y: randomRange(0, GAME_HEIGHT),
                size: randomRange(1, 1.5),
                speed: randomRange(0.5, 1),
                brightness: randomRange(0.6, 0.8),
                layer: 1
            });
        }
        
        // Near stars (fast)
        for (let i = 0; i < 20; i++) {
            this.stars.push({
                x: randomRange(0, GAME_WIDTH),
                y: randomRange(0, GAME_HEIGHT),
                size: randomRange(1.5, 2),
                speed: randomRange(1, 2),
                brightness: randomRange(0.8, 1),
                layer: 2
            });
        }
    }

    createPlayer() {
        this.player = new Player(100, GAME_HEIGHT / 2 - PLAYER.HEIGHT / 2);
        this.addGameObject(this.player);
        
        // Set global reference for other systems
        window.game.player = this.player;
    }

    startLevel(levelNumber) {
        const levelConfig = LEVELS[levelNumber];
        if (!levelConfig) {
            console.error(`Level ${levelNumber} not found`);
            return;
        }
        
        this.currentLevel = levelNumber;
        this.levelTime = 0;
        this.scrollSpeed = levelConfig.scrollSpeed;
        this.bossSpawned = false;
        
        // Show level name
        this.createFloatingText(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 3,
            `LEVEL ${levelNumber}: ${levelConfig.name}`,
            '#00ffff',
            3000
        );
        
        // Play level start sound and music
        if (window.soundManager) {
            window.soundManager.play('levelStart');
            
            // Play stage-specific music
            // Using available music tracks as placeholders for different stages
            const stageMusic = {
                1: 'stage1Music',
                2: 'stage1Music', // Reuse stage1Music
                3: 'stage1Music', // Reuse stage1Music
                4: 'stage1Music', // Reuse stage1Music
                5: 'stage1Music', // Reuse stage1Music
                8: 'stage1Music'  // Reuse stage1Music
            };
            
            const musicTrack = stageMusic[levelNumber] || 'stage1Music';
            window.soundManager.playMusic(musicTrack);
        }
    }

    onEnter() {
        // Hide menu screens
        document.getElementById('menu-screen').classList.remove('active');
        document.getElementById('game-over-screen').classList.remove('active');
        
        // Reset game state if needed
        if (this.game.options && this.game.options.restart) {
            this.resetGame();
        }
    }

    update(deltaTime) {
        if (this.paused) return;
        
        super.update(deltaTime);
        
        // Update game time
        this.gameTime += deltaTime;
        this.levelTime += deltaTime;
        
        // Update background
        this.updateBackground(deltaTime);
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime, this.game.inputManager);
        }
        
        // Update enemies
        this.updateEnemies(deltaTime);
        
        // Update bullets
        this.updateBullets(deltaTime);
        
        // Update power-ups
        this.updatePowerUps(deltaTime);
        
        // Update explosions
        this.updateExplosions(deltaTime);
        
        // Update particle system
        if (window.particleSystem) {
            window.particleSystem.update(deltaTime);
        }
        
        // Spawn enemies
        this.spawnEnemies(deltaTime);
        
        // Check collisions
        this.checkCollisions();
        
        // Update combo system
        this.updateComboSystem(deltaTime);
        
        // Check level completion
        this.checkLevelCompletion();
        
        // Update UI
        this.updateUI();
        
        // Check game over
        if (this.player && this.player.lives <= 0 && !this.player.isDead) {
            this.gameOver();
        }
    }

    updateBackground(deltaTime) {
        // Update starfield
        this.stars.forEach(star => {
            star.x -= star.speed * this.scrollSpeed * (deltaTime / 16);
            
            if (star.x < -star.size) {
                star.x = GAME_WIDTH + star.size;
                star.y = randomRange(0, GAME_HEIGHT);
            }
        });
    }

    updateEnemies(deltaTime) {
        // Update existing enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (enemy.active) {
                enemy.update(deltaTime, this.player);
                
                // Collect enemy bullets
                if (enemy.bullets.length > 0) {
                    this.enemyBullets.push(...enemy.bullets);
                    enemy.bullets = [];
                }
            } else {
                this.enemies.splice(i, 1);
                this.removeGameObject(enemy);
            }
        }
    }

    updateBullets(deltaTime) {
        // Update player bullets
        if (this.player && this.player.bullets.length > 0) {
            this.playerBullets.push(...this.player.bullets);
            this.player.bullets = [];
        }
        
        // Update all bullets
        [...this.playerBullets, ...this.enemyBullets].forEach(bullet => {
            if (bullet.active) {
                bullet.update(deltaTime);
            }
        });
        
        // Remove inactive bullets
        this.playerBullets = this.playerBullets.filter(b => b.active);
        this.enemyBullets = this.enemyBullets.filter(b => b.active);
    }

    updatePowerUps(deltaTime) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (powerUp.active) {
                powerUp.update(deltaTime);
            } else {
                this.powerUps.splice(i, 1);
                this.removeGameObject(powerUp);
            }
        }
    }

    updateExplosions(deltaTime) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            
            if (explosion.active) {
                explosion.update(deltaTime);
            } else {
                this.explosions.splice(i, 1);
                this.removeGameObject(explosion);
            }
        }
    }

    spawnEnemies(deltaTime) {
        const stageConfig = STAGES[this.currentLevel];
        if (!stageConfig) return;
        
        // Spawn waves based on stage time
        stageConfig.waves.forEach(wave => {
            if (this.levelTime >= wave.time && !wave.spawned) {
                wave.spawned = true;
                
                wave.enemies.forEach(enemyGroup => {
                    spawnEnemyWave(this, enemyGroup, GAME_WIDTH + 50, GAME_HEIGHT / 2);
                });
            }
        });
        
        // Random enemy spawning to fill gaps
        if (this.levelTime - this.lastRandomSpawnTime > this.randomSpawnInterval && !this.bossSpawned) {
            // Only spawn if there are less than 10 enemies on screen
            if (this.enemies.length < 10) {
                this.spawnRandomEnemies();
                this.lastRandomSpawnTime = this.levelTime;
                
                // Vary the spawn interval
                this.randomSpawnInterval = randomRange(2000, 4000);
            }
        }
        
        // Check for boss spawn
        const levelConfig = LEVELS[this.currentLevel];
        if (!this.bossSpawned && this.levelTime >= levelConfig.duration * 0.8) {
            this.spawnBoss();
        }
    }
    
    spawnRandomEnemies() {
        // Random enemy configurations
        const configs = [
            { count: 3, type: 'basic', pattern: 'straight' },
            { count: 2, type: 'basic', pattern: 'sine' },
            { count: 4, type: 'basic', pattern: 'circle' },
            { count: 1, type: 'medium', pattern: 'straight' },
            { count: 2, type: 'medium', pattern: 'zigzag' },
            { count: 5, type: 'basic', pattern: 'wave' }
        ];
        
        // Pick a random configuration
        const config = configs[Math.floor(Math.random() * configs.length)];
        
        // Spawn the enemies
        for (let i = 0; i < config.count; i++) {
            setTimeout(() => {
                const y = randomRange(50, GAME_HEIGHT - 50);
                const enemy = new Enemy(GAME_WIDTH + 50 + i * 30, y, config.type);
                enemy.setMovementPattern(config.pattern);
                
                this.enemies.push(enemy);
                this.addGameObject(enemy);
            }, i * 200);
        }
    }

    spawnEnemyWave() {
        const waveTypes = [
            { count: 3, type: 'basic', pattern: 'straight' },
            { count: 5, type: 'basic', pattern: 'sine' },
            { count: 2, type: 'medium', pattern: 'straight' },
            { count: 4, type: 'basic', pattern: 'zigzag' },
            { count: 1, type: 'heavy', pattern: 'straight' }
        ];
        
        const wave = waveTypes[Math.floor(Math.random() * waveTypes.length)];
        
        for (let i = 0; i < wave.count; i++) {
            setTimeout(() => {
                const y = randomRange(50, GAME_HEIGHT - 50);
                const enemy = new Enemy(GAME_WIDTH + 50, y, wave.type);
                enemy.setMovementPattern(wave.pattern);
                
                this.enemies.push(enemy);
                this.addGameObject(enemy);
            }, i * 200);
        }
    }

    spawnBoss() {
        this.bossSpawned = true;
        
        // Clear all existing enemies for dramatic effect
        this.enemies.forEach(enemy => {
            if (enemy.active && enemy.type !== 'boss') {
                enemy.fadeOut(500);
            }
        });
        
        // Warning
        this.createFloatingText(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            'WARNING! BOSS APPROACHING!',
            '#ff0000',
            2000
        );
        
        // Screen flash effect
        this.createScreenFlash('#ff0000', 300);
        
        // Play boss warning sound
        if (window.soundManager) {
            window.soundManager.play('bossWarning');
        }
        
        // Spawn boss after delay
        setTimeout(() => {
            const boss = new Enemy(
                GAME_WIDTH + 100,
                GAME_HEIGHT / 2 - ENEMIES.BOSS.HEIGHT / 2,
                'boss'
            );
            
            // Give boss some special properties
            boss.score = ENEMIES.BOSS.SCORE * this.currentLevel;
            boss.health = ENEMIES.BOSS.HEALTH * (1 + (this.currentLevel - 1) * 0.5);
            boss.maxHealth = boss.health;
            
            this.enemies.push(boss);
            this.addGameObject(boss);
            
            // Change to boss music
            if (window.soundManager) {
                // Use the same boss music for all levels
                window.soundManager.playMusic('bossMusic');
            }
            
            // Camera shake for dramatic entrance
            this.shakeCamera(20, 500);
        }, 2000);
    }

    spawnPowerUp(x, y, type) {
        const powerUp = new PowerUp(x, y, type);
        this.powerUps.push(powerUp);
        this.addGameObject(powerUp);
    }

    checkCollisions() {
        if (!this.player || this.player.isDead) return;
        
        // Player vs Enemies
        window.collisionSystem.checkPlayerEnemyCollisions(this.player, this.enemies);
        
        // Player bullets vs Enemies
        const playerHits = window.collisionSystem.checkBulletCollisions(
            this.playerBullets, 
            this.enemies, 
            true
        );
        
        // Update combo for hits
        playerHits.forEach(hit => {
            this.addCombo();
        });
        
        // Enemy bullets vs Player
        window.collisionSystem.checkBulletCollisions(
            this.enemyBullets,
            [this.player],
            false
        );
        
        // Player vs PowerUps
        window.collisionSystem.checkPowerUpCollisions(this.player, this.powerUps);
    }

    updateComboSystem(deltaTime) {
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            
            if (this.comboTimer <= 0) {
                this.comboCount = 0;
                this.scoreMultiplier = 1;
            }
        }
    }

    addCombo() {
        this.comboCount++;
        this.comboTimer = 2000; // 2 seconds to maintain combo
        this.scoreMultiplier = Math.min(1 + (this.comboCount * 0.1), 5); // Max 5x multiplier
        
        if (this.comboCount > 0 && this.comboCount % 10 === 0) {
            this.createFloatingText(
                GAME_WIDTH / 2,
                100,
                `${this.comboCount} COMBO! x${this.scoreMultiplier.toFixed(1)}`,
                '#ffff00',
                1000
            );
        }
    }

    checkLevelCompletion() {
        const levelConfig = LEVELS[this.currentLevel];
        
        // Check if boss is defeated
        const boss = this.enemies.find(e => e.type === 'boss');
        if (this.bossSpawned && !boss) {
            // Level complete!
            this.completeLevel();
        }
    }

    completeLevel() {
        // Show completion message
        this.createFloatingText(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            'LEVEL COMPLETE!',
            '#00ff00',
            3000
        );
        
        // Bonus score
        const timeBonus = Math.max(0, 10000 - Math.floor(this.levelTime / 10));
        this.player.addScore(timeBonus);
        
        // Next level after delay
        setTimeout(() => {
            this.currentLevel++;
            if (this.currentLevel <= Object.keys(LEVELS).length) {
                this.startLevel(this.currentLevel);
            } else {
                // Game complete!
                this.gameComplete();
            }
        }, 3000);
    }

    gameComplete() {
        this.createFloatingText(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            'CONGRATULATIONS!\nGAME COMPLETE!',
            '#ffff00',
            5000
        );
        
        // Return to menu after delay
        setTimeout(() => {
            this.game.changeScene('menu');
        }, 5000);
    }

    updateUI() {
        if (!this.player) return;
        
        // Update score
        document.getElementById('scoreValue').textContent = formatScore(this.player.score);
        
        // Update lives
        document.getElementById('livesValue').textContent = this.player.lives;
        
        // Update power
        const powerPercent = (this.player.weaponLevel / WEAPONS.MAX_LEVEL) * 100;
        document.getElementById('powerValue').textContent = Math.floor(powerPercent);
        
        // Update weapon name
        const weaponName = this.player.weaponSystem.selectedWeapon.name;
        const weaponDisplay = document.getElementById('weaponName');
        if (weaponDisplay) {
            weaponDisplay.textContent = weaponName;
        }
        
        // Update speed mode
        const speedDisplay = document.getElementById('speedMode');
        if (speedDisplay) {
            speedDisplay.textContent = this.player.speedMode.toUpperCase();
        }
        
        // Update level
        const levelDisplay = document.getElementById('levelValue');
        if (levelDisplay) {
            levelDisplay.textContent = this.currentLevel;
        }
    }

    renderBackground() {
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(0.5, '#000011');
        gradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            this.ctx.fillStyle = fadeColor(COLORS.STAR_1, star.brightness);
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    renderEffects() {
        super.renderEffects();
        
        // Render bullets
        [...this.playerBullets, ...this.enemyBullets].forEach(bullet => {
            if (bullet.visible) {
                bullet.render(this.ctx);
            }
        });
        
        // Render particles
        if (window.particleSystem) {
            window.particleSystem.render(this.ctx);
        }
    }

    handleInput(inputManager) {
        // Pause game
        if (inputManager.isPaused()) {
            this.togglePause();
            inputManager.keys['Escape'] = false;
        }
    }

    togglePause() {
        this.paused = !this.paused;
        
        if (this.paused) {
            this.createFloatingText(
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2,
                'PAUSED',
                '#ffff00',
                999999
            );
            
            if (window.soundManager) {
                window.soundManager.pauseMusic();
            }
        } else {
            // Clear pause text
            this.floatingTexts = this.floatingTexts.filter(t => t.text !== 'PAUSED');
            
            if (window.soundManager) {
                window.soundManager.resumeMusic();
            }
        }
    }

    gameOver() {
        // Show game over screen
        document.getElementById('game-over-screen').classList.add('active');
        document.getElementById('finalScore').textContent = formatScore(this.player.score);
        
        // Play game over sound
        if (window.soundManager) {
            window.soundManager.stopMusic();
            window.soundManager.play('gameOver');
        }
        
        // Set up restart handler
        const restartButton = document.getElementById('restartButton');
        restartButton.onclick = () => {
            this.game.changeScene('game', { restart: true });
        };
    }

    resetGame() {
        // Clear all entities
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.explosions = [];
        this.gameObjects = [];
        
        // Reset game state
        this.gameTime = 0;
        this.currentLevel = 1;
        this.levelTime = 0;
        this.enemySpawnTimer = 0;
        this.bossSpawned = false;
        this.comboCount = 0;
        this.scoreMultiplier = 1;
        
        // Recreate player
        this.createPlayer();
        
        // Start first level
        this.startLevel(1);
    }
} 