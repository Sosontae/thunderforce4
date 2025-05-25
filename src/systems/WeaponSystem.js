// WeaponSystem class - Implements Thunder Force 4's weapon selection system

class WeaponSystem {
    constructor() {
        // Thunder Force 4 weapons
        this.weapons = {
            TWIN_SHOT: {
                name: 'Twin Shot',
                code: 0,
                color: '#00ffff',
                fireRate: 150,
                damage: 1,
                pattern: 'twin'
            },
            BACK_SHOT: {
                name: 'Back Shot',
                code: 1,
                color: '#ff00ff',
                fireRate: 200,
                damage: 1,
                pattern: 'back'
            },
            RAIL_GUN: {
                name: 'Rail Gun',
                code: 2,
                color: '#ffff00',
                fireRate: 100,
                damage: 3,
                pattern: 'rail'
            },
            SNAKE: {
                name: 'Snake',
                code: 3,
                color: '#00ff00',
                fireRate: 180,
                damage: 1,
                pattern: 'snake'
            },
            FREE_WAY: {
                name: 'Free Way',
                code: 4,
                color: '#ff6600',
                fireRate: 120,
                damage: 2,
                pattern: 'freeway'
            },
            HUNTER: {
                name: 'Hunter',
                code: 5,
                color: '#6600ff',
                fireRate: 250,
                damage: 1,
                pattern: 'hunter'
            },
            BLADE: {
                name: 'Blade',
                code: 6,
                color: '#00ffff',
                fireRate: 80,
                damage: 4,
                pattern: 'blade'
            },
            WAVE: {
                name: 'Wave',
                code: 7,
                color: '#ff00ff',
                fireRate: 200,
                damage: 2,
                pattern: 'wave'
            },
            SHIELD: {
                name: 'Shield',
                code: 8,
                color: '#00ff00',
                fireRate: 300,
                damage: 1,
                pattern: 'shield'
            },
            CRAW: {
                name: 'Craw',
                code: 9,
                color: '#ffff00',
                fireRate: 150,
                damage: 1,
                pattern: 'craw'
            }
        };
        
        // Current weapon selection
        this.selectedWeapon = this.weapons.TWIN_SHOT;
        this.weaponLevel = 1;
        this.maxLevel = 5;
        
        // Claw options (Thunder Force 4 feature)
        this.claws = [];
        this.maxClaws = 2;
        this.clawFormation = 'normal';
    }

    selectWeapon(weaponCode) {
        const weapon = Object.values(this.weapons).find(w => w.code === weaponCode);
        if (weapon) {
            this.selectedWeapon = weapon;
        }
    }

    cycleWeapon(direction = 1) {
        const currentCode = this.selectedWeapon.code;
        const nextCode = (currentCode + direction + 10) % 10;
        this.selectWeapon(nextCode);
    }

    upgrade() {
        if (this.weaponLevel < this.maxLevel) {
            this.weaponLevel++;
            return true;
        }
        return false;
    }

    downgrade() {
        if (this.weaponLevel > 1) {
            this.weaponLevel--;
        }
    }

    fire(x, y, direction = 0) {
        const bullets = [];
        const weapon = this.selectedWeapon;
        
        switch (weapon.pattern) {
            case 'twin':
                bullets.push(...this.fireTwinShot(x, y, direction));
                break;
            case 'back':
                bullets.push(...this.fireBackShot(x, y, direction));
                break;
            case 'rail':
                bullets.push(...this.fireRailGun(x, y, direction));
                break;
            case 'snake':
                bullets.push(...this.fireSnake(x, y, direction));
                break;
            case 'freeway':
                bullets.push(...this.fireFreeway(x, y, direction));
                break;
            case 'hunter':
                bullets.push(...this.fireHunter(x, y, direction));
                break;
            case 'blade':
                bullets.push(...this.fireBlade(x, y, direction));
                break;
            case 'wave':
                bullets.push(...this.fireWave(x, y, direction));
                break;
            case 'shield':
                bullets.push(...this.fireShield(x, y, direction));
                break;
            case 'craw':
                bullets.push(...this.fireClaw(x, y, direction));
                break;
        }
        
        // Add claw bullets
        this.claws.forEach(claw => {
            bullets.push(...claw.fire());
        });
        
        return bullets;
    }

    fireTwinShot(x, y, direction) {
        const bullets = [];
        const spread = 8 * this.weaponLevel;
        
        for (let i = 0; i < this.weaponLevel + 1; i++) {
            const offsetY = (i - this.weaponLevel / 2) * spread;
            const bullet = new Bullet(
                x,
                y + offsetY,
                BULLETS.PLAYER.SPEED * Math.cos(direction),
                BULLETS.PLAYER.SPEED * Math.sin(direction) + offsetY * 0.1,
                'player',
                this.weaponLevel
            );
            bullet.color = this.selectedWeapon.color;
            bullets.push(bullet);
        }
        
        return bullets;
    }

    fireBackShot(x, y, direction) {
        const bullets = [];
        
        // Forward shot
        bullets.push(new Bullet(
            x,
            y,
            BULLETS.PLAYER.SPEED,
            0,
            'player',
            this.weaponLevel
        ));
        
        // Backward shot
        if (this.weaponLevel >= 2) {
            bullets.push(new Bullet(
                x,
                y,
                -BULLETS.PLAYER.SPEED * 0.8,
                0,
                'player',
                this.weaponLevel
            ));
        }
        
        // Additional diagonal shots at higher levels
        if (this.weaponLevel >= 3) {
            bullets.push(new Bullet(
                x,
                y,
                BULLETS.PLAYER.SPEED * 0.7,
                BULLETS.PLAYER.SPEED * 0.7,
                'player',
                this.weaponLevel
            ));
            bullets.push(new Bullet(
                x,
                y,
                BULLETS.PLAYER.SPEED * 0.7,
                -BULLETS.PLAYER.SPEED * 0.7,
                'player',
                this.weaponLevel
            ));
        }
        
        bullets.forEach(b => b.color = this.selectedWeapon.color);
        return bullets;
    }

    fireRailGun(x, y, direction) {
        const bullet = new Bullet(
            x,
            y,
            BULLETS.PLAYER.SPEED * 2,
            0,
            'player',
            this.weaponLevel
        );
        bullet.color = this.selectedWeapon.color;
        bullet.damage = this.selectedWeapon.damage * this.weaponLevel;
        bullet.width = 32;
        bullet.height = 4;
        bullet.piercing = true;
        
        return [bullet];
    }

    fireSnake(x, y, direction) {
        const bullets = [];
        
        for (let i = 0; i < this.weaponLevel; i++) {
            const bullet = new Bullet(
                x - i * 10,
                y,
                BULLETS.PLAYER.SPEED,
                0,
                'player',
                this.weaponLevel
            );
            bullet.color = this.selectedWeapon.color;
            bullet.wavePattern = true;
            bullet.waveAmplitude = 30;
            bullet.waveFrequency = 0.1;
            bullet.waveOffset = i * Math.PI / 2;
            bullets.push(bullet);
        }
        
        return bullets;
    }

    fireFreeway(x, y, direction) {
        const bullets = [];
        const angleSpread = 30; // degrees
        
        for (let i = 0; i < this.weaponLevel + 2; i++) {
            const angle = degToRad((i - (this.weaponLevel + 1) / 2) * angleSpread);
            const bullet = new Bullet(
                x,
                y,
                BULLETS.PLAYER.SPEED * Math.cos(angle),
                BULLETS.PLAYER.SPEED * Math.sin(angle),
                'player',
                this.weaponLevel
            );
            bullet.color = this.selectedWeapon.color;
            bullets.push(bullet);
        }
        
        return bullets;
    }

    fireHunter(x, y, direction) {
        const bullet = new Bullet(
            x,
            y,
            BULLETS.PLAYER.SPEED * 0.8,
            0,
            'player',
            this.weaponLevel
        );
        bullet.color = this.selectedWeapon.color;
        bullet.homingTarget = this.findNearestEnemy(x, y);
        bullet.homingStrength = 0.05 * this.weaponLevel;
        
        return [bullet];
    }

    fireBlade(x, y, direction) {
        const bullet = new Bullet(
            x,
            y,
            BULLETS.PLAYER.SPEED * 1.5,
            0,
            'player',
            this.weaponLevel
        );
        bullet.color = this.selectedWeapon.color;
        bullet.damage = this.selectedWeapon.damage * this.weaponLevel;
        bullet.width = 48;
        bullet.height = 8;
        bullet.rotation = Date.now() * 0.01;
        
        return [bullet];
    }

    fireWave(x, y, direction) {
        const bullets = [];
        
        for (let i = 0; i < 3; i++) {
            const bullet = new Bullet(
                x,
                y + (i - 1) * 20,
                BULLETS.PLAYER.SPEED,
                0,
                'player',
                this.weaponLevel
            );
            bullet.color = this.selectedWeapon.color;
            bullet.wavePattern = true;
            bullet.waveAmplitude = 20 + this.weaponLevel * 10;
            bullet.waveFrequency = 0.2;
            bullet.waveOffset = i * (Math.PI * 2 / 3);
            bullets.push(bullet);
        }
        
        return bullets;
    }

    fireShield(x, y, direction) {
        const bullets = [];
        const count = 8;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const bullet = new Bullet(
                x,
                y,
                Math.cos(angle) * BULLETS.PLAYER.SPEED * 0.5,
                Math.sin(angle) * BULLETS.PLAYER.SPEED * 0.5,
                'player',
                this.weaponLevel
            );
            bullet.color = this.selectedWeapon.color;
            bullet.lifetime = 500; // Short range
            bullets.push(bullet);
        }
        
        return bullets;
    }

    fireClaw(x, y, direction) {
        // CRAW weapon creates controllable options
        const bullet = new Bullet(
            x,
            y,
            BULLETS.PLAYER.SPEED,
            0,
            'player',
            this.weaponLevel
        );
        bullet.color = this.selectedWeapon.color;
        
        return [bullet];
    }

    findNearestEnemy(x, y) {
        if (!window.game || !window.game.currentScene) return null;
        
        const enemies = window.game.currentScene.enemies;
        let nearest = null;
        let minDistance = Infinity;
        
        enemies.forEach(enemy => {
            if (enemy.active) {
                const dist = distance(x, y, enemy.x, enemy.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = enemy;
                }
            }
        });
        
        return nearest;
    }

    addClaw() {
        if (this.claws.length < this.maxClaws) {
            const claw = new ClawOption(this.claws.length);
            this.claws.push(claw);
            return true;
        }
        return false;
    }

    removeClaw() {
        if (this.claws.length > 0) {
            this.claws.pop();
        }
    }

    updateClaws(playerX, playerY) {
        this.claws.forEach((claw, index) => {
            claw.update(playerX, playerY, index, this.clawFormation);
        });
    }
}

// Claw Option class
class ClawOption {
    constructor(index) {
        this.index = index;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.distance = 50;
    }

    update(playerX, playerY, index, formation) {
        switch (formation) {
            case 'normal':
                this.x = playerX - 30 - index * 20;
                this.y = playerY + (index === 0 ? -20 : 20);
                break;
            case 'front':
                this.x = playerX + 30 + index * 20;
                this.y = playerY + (index === 0 ? -10 : 10);
                break;
            case 'rotate':
                this.angle += 0.05;
                this.x = playerX + Math.cos(this.angle + index * Math.PI) * this.distance;
                this.y = playerY + Math.sin(this.angle + index * Math.PI) * this.distance;
                break;
        }
    }

    fire() {
        const bullet = new Bullet(
            this.x,
            this.y,
            BULLETS.PLAYER.SPEED,
            0,
            'player',
            1
        );
        bullet.color = '#ffff00';
        return [bullet];
    }
} 