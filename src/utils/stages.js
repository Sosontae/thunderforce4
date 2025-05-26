// Thunder Force 4 Stage Configurations

const STAGES = {
    1: {
        name: 'STRITE',
        bgColor: '#000033',
        scrollSpeed: 1.5,
        music: 'stage1Music',
        bossMusic: 'stage1BossMusic',
        boss: 'gargoyle',
        waves: [
            {
                time: 1000,
                enemies: [
                    { type: 'basic', count: 5, pattern: 'sine', spacing: 300 }
                ]
            },
            {
                time: 5000,
                enemies: [
                    { type: 'medium', count: 3, pattern: 'straight', spacing: 400 },
                    { type: 'basic', count: 4, pattern: 'zigzag', spacing: 200 }
                ]
            },
            {
                time: 10000,
                enemies: [
                    { type: 'heavy', count: 1, pattern: 'straight', spacing: 0 },
                    { type: 'basic', count: 6, pattern: 'circle', spacing: 100 }
                ]
            },
            {
                time: 15000,
                enemies: [
                    { type: 'medium', count: 4, pattern: 'dive', spacing: 300 }
                ]
            },
            {
                time: 20000,
                enemies: [
                    { type: 'basic', count: 8, pattern: 'wave', spacing: 250 }
                ]
            },
            {
                time: 25000,
                enemies: [
                    { type: 'medium', count: 2, pattern: 'spiral', spacing: 500 },
                    { type: 'basic', count: 5, pattern: 'straight', spacing: 200 }
                ]
            },
            {
                time: 30000,
                enemies: [
                    { type: 'heavy', count: 2, pattern: 'formation', spacing: 600 }
                ]
            },
            {
                time: 35000,
                enemies: [
                    { type: 'basic', count: 10, pattern: 'swarm', spacing: 150 }
                ]
            },
            {
                time: 40000,
                enemies: [
                    { type: 'medium', count: 5, pattern: 'pincer', spacing: 300 }
                ]
            },
            {
                time: 45000,
                enemies: [
                    { type: 'heavy', count: 1, pattern: 'straight', spacing: 0 },
                    { type: 'basic', count: 8, pattern: 'circle', spacing: 120 }
                ]
            },
            {
                time: 50000,
                enemies: [
                    { type: 'medium', count: 6, pattern: 'crossfire', spacing: 250 }
                ]
            },
            {
                time: 55000,
                enemies: [
                    { type: 'basic', count: 12, pattern: 'wave', spacing: 180 }
                ]
            },
            {
                time: 60000,
                enemies: [
                    { type: 'heavy', count: 3, pattern: 'column', spacing: 400 }
                ]
            },
            {
                time: 65000,
                enemies: [
                    { type: 'medium', count: 4, pattern: 'formation', spacing: 300 },
                    { type: 'basic', count: 6, pattern: 'sine', spacing: 200 }
                ]
            },
            {
                time: 70000,
                enemies: [
                    { type: 'basic', count: 15, pattern: 'swarm', spacing: 100 }
                ]
            },
            {
                time: 75000,
                enemies: [
                    { type: 'heavy', count: 2, pattern: 'straight', spacing: 500 },
                    { type: 'medium', count: 3, pattern: 'dive', spacing: 350 }
                ]
            },
            {
                time: 80000,
                enemies: [
                    { type: 'medium', count: 8, pattern: 'spiral', spacing: 200 }
                ]
            },
            {
                time: 85000,
                enemies: [
                    { type: 'basic', count: 20, pattern: 'storm', spacing: 80 }
                ]
            }
        ]
    },
    
    2: {
        name: 'DASER',
        bgColor: '#000044',
        scrollSpeed: 2,
        music: 'stage2Music',
        bossMusic: 'stage2BossMusic',
        boss: 'bellMite',
        waves: [
            {
                time: 1000,
                enemies: [
                    { type: 'basic', count: 8, pattern: 'wave', spacing: 200 }
                ]
            },
            {
                time: 4000,
                enemies: [
                    { type: 'medium', count: 2, pattern: 'spiral', spacing: 500 },
                    { type: 'basic', count: 6, pattern: 'straight', spacing: 150 }
                ]
            },
            {
                time: 8000,
                enemies: [
                    { type: 'heavy', count: 2, pattern: 'straight', spacing: 600 }
                ]
            }
        ]
    },
    
    3: {
        name: 'RUINS',
        bgColor: '#220033',
        scrollSpeed: 1.2,
        music: 'stage3Music',
        bossMusic: 'stage3BossMusic',
        boss: 'fomalhaut',
        waves: [
            {
                time: 2000,
                enemies: [
                    { type: 'medium', count: 4, pattern: 'formation', spacing: 200 }
                ]
            },
            {
                time: 6000,
                enemies: [
                    { type: 'basic', count: 10, pattern: 'swarm', spacing: 100 }
                ]
            },
            {
                time: 12000,
                enemies: [
                    { type: 'heavy', count: 1, pattern: 'boss_approach', spacing: 0 },
                    { type: 'medium', count: 2, pattern: 'escort', spacing: 300 }
                ]
            }
        ]
    },
    
    4: {
        name: 'VOLBADOS',
        bgColor: '#442200',
        scrollSpeed: 1.8,
        music: 'stage4Music',
        bossMusic: 'stage4BossMusic',
        boss: 'hellArm',
        waves: [
            {
                time: 1500,
                enemies: [
                    { type: 'basic', count: 12, pattern: 'scatter', spacing: 150 }
                ]
            },
            {
                time: 5000,
                enemies: [
                    { type: 'medium', count: 5, pattern: 'pincer', spacing: 250 }
                ]
            },
            {
                time: 10000,
                enemies: [
                    { type: 'heavy', count: 3, pattern: 'column', spacing: 400 }
                ]
            }
        ]
    },
    
    5: {
        name: 'VIOS',
        bgColor: '#002244',
        scrollSpeed: 2.5,
        music: 'stage5Music',
        bossMusic: 'stage5BossMusic',
        boss: 'spark_lancer',
        waves: [
            {
                time: 1000,
                enemies: [
                    { type: 'basic', count: 8, pattern: 'fast_straight', spacing: 100 }
                ]
            },
            {
                time: 3000,
                enemies: [
                    { type: 'medium', count: 6, pattern: 'crossfire', spacing: 200 }
                ]
            },
            {
                time: 7000,
                enemies: [
                    { type: 'heavy', count: 2, pattern: 'pinwheel', spacing: 800 }
                ]
            },
            {
                time: 12000,
                enemies: [
                    { type: 'basic', count: 15, pattern: 'storm', spacing: 50 }
                ]
            }
        ]
    },
    
    8: {
        name: 'VIOS FORTRESS',
        bgColor: '#440044',
        scrollSpeed: 1,
        music: 'stage8Music',
        bossMusic: 'bossMusic',
        boss: 'orn_emperor',
        waves: [
            {
                time: 2000,
                enemies: [
                    { type: 'heavy', count: 4, pattern: 'fortress_defense', spacing: 500 }
                ]
            },
            {
                time: 6000,
                enemies: [
                    { type: 'medium', count: 8, pattern: 'all_range', spacing: 150 }
                ]
            },
            {
                time: 10000,
                enemies: [
                    { type: 'basic', count: 20, pattern: 'final_assault', spacing: 100 }
                ]
            },
            {
                time: 15000,
                enemies: [
                    { type: 'heavy', count: 5, pattern: 'guardian', spacing: 400 }
                ]
            }
        ]
    }
};

// Enemy wave patterns
const WAVE_PATTERNS = {
    straight: (startX, startY, index, time) => ({
        x: startX - time * 0.1,
        y: startY
    }),
    
    sine: (startX, startY, index, time) => ({
        x: startX - time * 0.1,
        y: startY + Math.sin(time * 0.003) * 50
    }),
    
    zigzag: (startX, startY, index, time) => ({
        x: startX - time * 0.1,
        y: startY + (Math.floor(time / 500) % 2 ? 50 : -50)
    }),
    
    circle: (startX, startY, index, time) => ({
        x: startX + Math.cos(time * 0.002 + index) * 100 - time * 0.05,
        y: startY + Math.sin(time * 0.002 + index) * 100
    }),
    
    dive: (startX, startY, index, time) => ({
        x: startX - time * 0.15,
        y: startY + (time < 1000 ? 0 : (time - 1000) * 0.1)
    }),
    
    wave: (startX, startY, index, time) => ({
        x: startX - time * 0.12,
        y: startY + Math.sin(time * 0.004 + index * 0.5) * 80
    }),
    
    spiral: (startX, startY, index, time) => {
        const radius = 50 + time * 0.02;
        const angle = time * 0.003 + index * Math.PI;
        return {
            x: startX + Math.cos(angle) * radius - time * 0.08,
            y: startY + Math.sin(angle) * radius
        };
    },
    
    formation: (startX, startY, index, time) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        return {
            x: startX - time * 0.1 - row * 50,
            y: startY + col * 60 - 30
        };
    },
    
    swarm: (startX, startY, index, time) => ({
        x: startX - time * 0.15 + Math.random() * 20 - 10,
        y: startY + Math.sin(time * 0.005 + index) * 40 + Math.random() * 20 - 10
    }),
    
    pincer: (startX, startY, index, time) => {
        const upper = index % 2 === 0;
        return {
            x: startX - time * 0.1,
            y: upper ? startY - 100 + time * 0.05 : startY + 100 - time * 0.05
        };
    },
    
    column: (startX, startY, index, time) => ({
        x: startX - time * 0.08 - index * 100,
        y: startY
    }),
    
    crossfire: (startX, startY, index, time) => {
        const angle = (index / 6) * Math.PI - Math.PI / 2;
        return {
            x: startX - time * 0.12 + Math.cos(angle) * time * 0.05,
            y: startY + Math.sin(angle) * time * 0.05
        };
    },
    
    storm: (startX, startY, index, time) => {
        const speed = 0.2 + Math.random() * 0.1;
        const angle = Math.random() * Math.PI * 2;
        return {
            x: startX - time * speed + Math.cos(angle + time * 0.001) * 30,
            y: startY + Math.sin(angle + time * 0.002) * 50 + Math.random() * 40 - 20
        };
    },
    
    // Additional patterns for variety
    fast_straight: (startX, startY, index, time) => ({
        x: startX - time * 0.25,
        y: startY
    }),
    
    pinwheel: (startX, startY, index, time) => {
        const radius = 80;
        const angle = time * 0.003 + index * (Math.PI / 4);
        return {
            x: startX - time * 0.08 + Math.cos(angle) * radius,
            y: startY + Math.sin(angle) * radius
        };
    },
    
    fortress_defense: (startX, startY, index, time) => ({
        x: startX - 100 - index * 150,
        y: startY + Math.sin(time * 0.002) * 20
    }),
    
    all_range: (startX, startY, index, time) => {
        const sector = index % 4;
        const offset = Math.floor(index / 4) * 50;
        switch(sector) {
            case 0: return { x: startX - time * 0.1, y: offset };
            case 1: return { x: GAME_WIDTH - offset, y: startY - time * 0.1 };
            case 2: return { x: startX - time * 0.1, y: GAME_HEIGHT - offset };
            case 3: return { x: offset, y: startY + time * 0.1 };
        }
    },
    
    final_assault: (startX, startY, index, time) => ({
        x: startX - time * 0.3 - Math.random() * 50,
        y: startY + Math.sin(time * 0.01 + index) * 100
    }),
    
    guardian: (startX, startY, index, time) => ({
        x: startX - 200 - index * 100,
        y: startY + Math.sin(time * 0.001 + index) * 50
    }),
    
    scatter: (startX, startY, index, time) => {
        const angle = (index / 12) * Math.PI * 2;
        return {
            x: startX - time * 0.15 + Math.cos(angle) * time * 0.1,
            y: startY + Math.sin(angle) * time * 0.1
        };
    },
    
    boss_approach: (startX, startY, index, time) => ({
        x: Math.max(GAME_WIDTH - 200, startX - time * 0.05),
        y: startY + Math.sin(time * 0.001) * 30
    }),
    
    escort: (startX, startY, index, time) => ({
        x: startX - time * 0.05 - 100,
        y: startY + (index === 0 ? -100 : 100) + Math.sin(time * 0.002) * 20
    })
};

// Function to spawn enemy wave
function spawnEnemyWave(scene, waveConfig, startX, startY) {
    const pattern = WAVE_PATTERNS[waveConfig.pattern] || WAVE_PATTERNS.straight;
    
    for (let i = 0; i < waveConfig.count; i++) {
        const delay = i * waveConfig.spacing;
        
        setTimeout(() => {
            const enemy = new Enemy(startX, startY, waveConfig.type);
            
            // Set custom movement pattern
            enemy.movementPattern = (time) => pattern(startX, startY, i, time);
            
            scene.enemies.push(enemy);
            scene.addGameObject(enemy);
        }, delay);
    }
} 