// Thunder Force IV Constants

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

const PLAYER = {
    WIDTH: 48,
    HEIGHT: 32,
    SPEED: 5,
    MAX_SPEED: 8,
    ACCELERATION: 0.3,
    DECELERATION: 0.2,
    INITIAL_LIVES: 3,
    INVULNERABLE_TIME: 2000, // milliseconds
    RESPAWN_TIME: 1000
};

const BULLETS = {
    PLAYER: {
        WIDTH: 16,
        HEIGHT: 4,
        SPEED: 12,
        DAMAGE: 1,
        COLOR: '#00ffff'
    },
    ENEMY: {
        WIDTH: 8,
        HEIGHT: 8,
        SPEED: 5,
        DAMAGE: 1,
        COLOR: '#ff0000'
    },
    TYPES: {
        NORMAL: 'normal',
        LASER: 'laser',
        SPREAD: 'spread',
        HOMING: 'homing'
    }
};

const ENEMIES = {
    BASIC: {
        WIDTH: 32,
        HEIGHT: 32,
        SPEED: 2,
        HEALTH: 1,
        SCORE: 100,
        COLOR: '#ff6600'
    },
    MEDIUM: {
        WIDTH: 48,
        HEIGHT: 48,
        SPEED: 1.5,
        HEALTH: 3,
        SCORE: 300,
        COLOR: '#ff0066'
    },
    HEAVY: {
        WIDTH: 64,
        HEIGHT: 64,
        SPEED: 1,
        HEALTH: 5,
        SCORE: 500,
        COLOR: '#ff0000'
    },
    BOSS: {
        WIDTH: 128,
        HEIGHT: 96,
        SPEED: 0.5,
        HEALTH: 50,
        SCORE: 5000,
        COLOR: '#9900ff'
    }
};

const ENEMY_TYPES = {
    BASIC: 'basic',
    MEDIUM: 'medium', 
    HEAVY: 'heavy',
    BOSS: 'boss'
};

const POWERUPS = {
    TYPES: {
        WEAPON_UPGRADE: 'weapon_upgrade',
        SHIELD: 'shield',
        SPEED_BOOST: 'speed_boost',
        EXTRA_LIFE: 'extra_life',
        BOMB: 'bomb'
    },
    SIZE: 24,
    SPEED: 1,
    DURATION: 10000 // milliseconds
};

const WEAPONS = {
    LEVELS: {
        1: { fireRate: 200, bulletCount: 1 },
        2: { fireRate: 180, bulletCount: 2 },
        3: { fireRate: 160, bulletCount: 3 },
        4: { fireRate: 140, bulletCount: 4 },
        5: { fireRate: 120, bulletCount: 5 }
    },
    MAX_LEVEL: 5
};

const COLORS = {
    BACKGROUND: '#000033',
    STAR_1: '#ffffff',
    STAR_2: '#cccccc',
    STAR_3: '#999999',
    EXPLOSION: ['#ffff00', '#ff9900', '#ff6600', '#ff3300', '#ff0000'],
    SHIELD: '#00ff00',
    UI_PRIMARY: '#00ffff',
    UI_SECONDARY: '#ffff00',
    UI_DANGER: '#ff0000'
};

const AUDIO = {
    SHOOT: 'assets/audio/laser1.wav',
    SHOOT_ALT: 'assets/audio/shoot_01.ogg',
    EXPLOSION: 'assets/audio/explosion_01.ogg',
    EXPLOSION_ALT: 'assets/audio/retro_explosion_01.ogg',
    POWERUP: 'assets/audio/retro_beep_04.ogg',
    HIT: 'assets/audio/retro_impact_hit_13.ogg',
    GAME_OVER: 'assets/audio/misc_03.ogg',
    LEVEL_START: 'assets/audio/misc_01.ogg',
    BOSS_WARNING: 'assets/audio/misc_09.ogg',
    MENU_SELECT: 'assets/audio/beep_01.ogg',
    MENU_MOVE: 'assets/audio/terminal_01.ogg',
            BACKGROUND_LOOP: 'assets/audio/misc_01.ogg' // Using available sound as placeholder
};

const LEVELS = {
    1: {
        name: 'STRITE',
        duration: 120000, // 2 minutes
        enemySpawnRate: 1000,
        scrollSpeed: 1
    },
    2: {
        name: 'LAND RUIN',
        duration: 150000,
        enemySpawnRate: 800,
        scrollSpeed: 1.5
    },
    3: {
        name: 'DASER',
        duration: 180000,
        enemySpawnRate: 600,
        scrollSpeed: 2
    },
    4: {
        name: 'VOLBADOS',
        duration: 210000,
        enemySpawnRate: 500,
        scrollSpeed: 2.5
    }
};

const PARTICLES = {
    EXPLOSION: {
        COUNT: 20,
        MIN_SPEED: 2,
        MAX_SPEED: 8,
        LIFETIME: 500,
        SIZE: 4
    },
    THRUST: {
        COUNT: 3,
        SPEED: 2,
        LIFETIME: 200,
        SIZE: 2
    }
};

const UI = {
    FONT: {
        SMALL: '14px Courier New',
        MEDIUM: '18px Courier New',
        LARGE: '24px Courier New',
        TITLE: '48px Courier New'
    },
    PADDING: 10,
    LINE_HEIGHT: 24
}; 