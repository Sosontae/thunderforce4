// Level1 class - Specific implementation for Level 1 (Strite)

class Level1 extends GameScene {
    constructor(game) {
        super(game);
        
        this.levelName = 'STRITE';
        this.levelNumber = 1;
    }

    init() {
        super.init();
        
        // Level-specific initialization
        this.setupLevelSpecifics();
    }

    setupLevelSpecifics() {
        // Custom background layers for this level
        this.backgroundLayers.push({
            type: 'clouds',
            elements: this.createClouds(),
            scrollSpeed: 0.3
        });
        
        this.backgroundLayers.push({
            type: 'mountains',
            elements: this.createMountains(),
            scrollSpeed: 0.5
        });
    }

    createClouds() {
        const clouds = [];
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: randomRange(0, GAME_WIDTH),
                y: randomRange(50, 200),
                width: randomRange(100, 200),
                height: randomRange(40, 80),
                alpha: randomRange(0.3, 0.6)
            });
        }
        return clouds;
    }

    createMountains() {
        const mountains = [];
        const mountainCount = 8;
        
        for (let i = 0; i < mountainCount; i++) {
            mountains.push({
                x: (GAME_WIDTH / mountainCount) * i,
                width: randomRange(100, 150),
                height: randomRange(100, 200),
                color: '#003366'
            });
        }
        
        return mountains;
    }

    renderBackground() {
        super.renderBackground();
        
        // Render background layers
        this.backgroundLayers.forEach(layer => {
            if (layer.type === 'clouds') {
                this.renderClouds(layer.elements);
            } else if (layer.type === 'mountains') {
                this.renderMountains(layer.elements);
            }
        });
    }

    renderClouds(clouds) {
        clouds.forEach(cloud => {
            this.ctx.fillStyle = fadeColor('#ffffff', cloud.alpha);
            this.ctx.beginPath();
            
            // Draw cloud shape
            const x = cloud.x;
            const y = cloud.y;
            const w = cloud.width;
            const h = cloud.height;
            
            // Simple cloud shape with circles
            for (let i = 0; i < 3; i++) {
                const cx = x + (w / 3) * i;
                const cy = y + randomRange(-h/4, h/4);
                const r = w / 4;
                
                this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
            }
            
            this.ctx.fill();
        });
    }

    renderMountains(mountains) {
        mountains.forEach(mountain => {
            const gradient = this.ctx.createLinearGradient(
                0, GAME_HEIGHT - mountain.height,
                0, GAME_HEIGHT
            );
            gradient.addColorStop(0, mountain.color);
            gradient.addColorStop(1, '#000033');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.moveTo(mountain.x, GAME_HEIGHT);
            this.ctx.lineTo(mountain.x + mountain.width / 2, GAME_HEIGHT - mountain.height);
            this.ctx.lineTo(mountain.x + mountain.width, GAME_HEIGHT);
            this.ctx.closePath();
            this.ctx.fill();
        });
    }

    // Custom enemy wave patterns for Level 1
    spawnEnemyWave() {
        const wavePatterns = [
            () => this.spawnFormation('V', 5, 'basic'),
            () => this.spawnFormation('line', 4, 'basic'),
            () => this.spawnFormation('circle', 6, 'basic'),
            () => this.spawnSingleEnemy('medium'),
            () => this.spawnFormation('diagonal', 3, 'basic')
        ];
        
        const pattern = wavePatterns[Math.floor(Math.random() * wavePatterns.length)];
        pattern();
    }

    spawnFormation(type, count, enemyType) {
        const formations = {
            'V': (i) => ({
                x: GAME_WIDTH + 50 + i * 30,
                y: GAME_HEIGHT / 2 + (Math.abs(i - count/2) * 30)
            }),
            'line': (i) => ({
                x: GAME_WIDTH + 50 + i * 40,
                y: GAME_HEIGHT / 2
            }),
            'circle': (i) => ({
                x: GAME_WIDTH + 100 + Math.cos((i / count) * Math.PI * 2) * 50,
                y: GAME_HEIGHT / 2 + Math.sin((i / count) * Math.PI * 2) * 50
            }),
            'diagonal': (i) => ({
                x: GAME_WIDTH + 50 + i * 40,
                y: 100 + i * 50
            })
        };
        
        const formation = formations[type] || formations['line'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const pos = formation(i);
                const enemy = new Enemy(pos.x, pos.y, enemyType);
                enemy.setMovementPattern('straight');
                
                this.enemies.push(enemy);
                this.addGameObject(enemy);
            }, i * 100);
        }
    }

    spawnSingleEnemy(type) {
        const y = randomRange(50, GAME_HEIGHT - 50);
        const enemy = new Enemy(GAME_WIDTH + 50, y, type);
        enemy.setMovementPattern('sine');
        
        this.enemies.push(enemy);
        this.addGameObject(enemy);
    }
} 