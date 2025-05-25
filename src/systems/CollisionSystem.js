// CollisionSystem class

class CollisionSystem {
    constructor() {
        this.collisionPairs = [];
        this.spatialGrid = null;
        this.gridCellSize = 100;
    }

    init(width, height) {
        // Initialize spatial grid for optimization
        const cols = Math.ceil(width / this.gridCellSize);
        const rows = Math.ceil(height / this.gridCellSize);
        this.spatialGrid = new SpatialGrid(cols, rows, this.gridCellSize);
    }

    update(gameObjects) {
        // Clear previous frame data
        this.collisionPairs = [];
        this.spatialGrid.clear();
        
        // Add objects to spatial grid
        gameObjects.forEach(obj => {
            if (obj.active) {
                this.spatialGrid.add(obj);
            }
        });
        
        // Check collisions using spatial grid
        gameObjects.forEach(obj => {
            if (obj.active) {
                const nearbyObjects = this.spatialGrid.getNearby(obj);
                nearbyObjects.forEach(other => {
                    if (obj !== other && this.shouldCheckCollision(obj, other)) {
                        if (obj.collidesWith(other)) {
                            this.collisionPairs.push({ a: obj, b: other });
                        }
                    }
                });
            }
        });
        
        return this.collisionPairs;
    }

    shouldCheckCollision(objA, objB) {
        // Define which object types should check collisions
        const collisionMatrix = {
            'player': ['enemy', 'enemyBullet', 'powerup'],
            'playerBullet': ['enemy'],
            'enemy': ['player', 'playerBullet'],
            'enemyBullet': ['player'],
            'powerup': ['player']
        };
        
        const typeA = this.getObjectType(objA);
        const typeB = this.getObjectType(objB);
        
        return collisionMatrix[typeA]?.includes(typeB) || 
               collisionMatrix[typeB]?.includes(typeA);
    }

    getObjectType(obj) {
        if (obj instanceof Player) return 'player';
        if (obj instanceof Enemy) return 'enemy';
        if (obj instanceof Bullet) {
            return obj.owner === 'player' ? 'playerBullet' : 'enemyBullet';
        }
        if (obj instanceof PowerUp) return 'powerup';
        return 'unknown';
    }

    checkPlayerEnemyCollisions(player, enemies) {
        if (!player.active || player.isDead || player.isInvulnerable) return;
        
        enemies.forEach(enemy => {
            if (enemy.active && player.collidesWith(enemy)) {
                // Player takes damage
                player.takeDamage(1);
                
                // Small enemies are destroyed on contact
                if (enemy.type === 'basic') {
                    enemy.takeDamage(999);
                }
            }
        });
    }

    checkBulletCollisions(bullets, targets, isPlayerBullets = true) {
        const hits = [];
        
        bullets.forEach(bullet => {
            if (!bullet.active) return;
            
            targets.forEach(target => {
                if (!target.active) return;
                
                // Skip if target is invulnerable
                if (target.isInvulnerable) return;
                
                if (bullet.collidesWith(target)) {
                    hits.push({ bullet, target });
                    
                    // Apply damage
                    if (isPlayerBullets) {
                        const destroyed = target.takeDamage(bullet.damage);
                        if (destroyed && target.score) {
                            // Add score for destroying enemy
                            if (window.game && window.game.player) {
                                window.game.player.addScore(target.score);
                            }
                        }
                    } else {
                        target.takeDamage(bullet.damage);
                    }
                    
                    // Handle bullet hit
                    bullet.onHit(target);
                }
            });
        });
        
        return hits;
    }

    checkPowerUpCollisions(player, powerUps) {
        if (!player.active || player.isDead) return;
        
        powerUps.forEach(powerUp => {
            if (powerUp.active && !powerUp.collected && player.collidesWith(powerUp)) {
                powerUp.collect(player);
            }
        });
    }

    // Optimized collision check for circular objects
    checkCircleCollision(obj1, obj2) {
        const dx = obj1.x + obj1.width / 2 - (obj2.x + obj2.width / 2);
        const dy = obj1.y + obj1.height / 2 - (obj2.y + obj2.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius1 = Math.min(obj1.width, obj1.height) / 2;
        const radius2 = Math.min(obj2.width, obj2.height) / 2;
        
        return distance < radius1 + radius2;
    }

    // Check if a point is inside any enemy
    pointInAnyEnemy(x, y, enemies) {
        return enemies.some(enemy => {
            if (!enemy.active) return false;
            return pointInRect(x, y, enemy.getBounds());
        });
    }

    // Get all objects within radius
    getObjectsInRadius(x, y, radius, objects) {
        return objects.filter(obj => {
            if (!obj.active) return false;
            const dx = obj.x + obj.width / 2 - x;
            const dy = obj.y + obj.height / 2 - y;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
    }
}

// Spatial Grid for optimization
class SpatialGrid {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.grid = [];
        
        // Initialize grid
        for (let i = 0; i < cols * rows; i++) {
            this.grid[i] = [];
        }
    }

    clear() {
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = [];
        }
    }

    add(obj) {
        const bounds = obj.getBounds();
        const startCol = Math.floor(bounds.x / this.cellSize);
        const endCol = Math.floor((bounds.x + bounds.width) / this.cellSize);
        const startRow = Math.floor(bounds.y / this.cellSize);
        const endRow = Math.floor((bounds.y + bounds.height) / this.cellSize);
        
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    const index = row * this.cols + col;
                    this.grid[index].push(obj);
                }
            }
        }
    }

    getNearby(obj) {
        const nearby = new Set();
        const bounds = obj.getBounds();
        const startCol = Math.floor(bounds.x / this.cellSize);
        const endCol = Math.floor((bounds.x + bounds.width) / this.cellSize);
        const startRow = Math.floor(bounds.y / this.cellSize);
        const endRow = Math.floor((bounds.y + bounds.height) / this.cellSize);
        
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    const index = row * this.cols + col;
                    this.grid[index].forEach(other => nearby.add(other));
                }
            }
        }
        
        nearby.delete(obj); // Remove self
        return Array.from(nearby);
    }
} 