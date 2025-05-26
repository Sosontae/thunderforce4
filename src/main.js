// Main entry point for Thunder Force IV Replica

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Thunder Force IV Replica - Starting...');
    
    // Show loading message
    showLoadingMessage('LOADING ASSETS...');
    
    // Load all assets first
    try {
        const assetsLoaded = await window.assetLoader.loadAll();
        
        if (!assetsLoaded) {
            throw new Error('Failed to load assets');
        }
        
        console.log('All assets loaded!');
        
        // Create game instance
        const game = new Game();
        
        // Initialize game
        if (game.init()) {
            console.log('Game initialized successfully!');
            
            // Add keyboard shortcuts
            setupKeyboardShortcuts(game);
            
            // Handle window focus/blur
            setupWindowHandlers(game);
            
            // Start the game
            game.start();
            
            // Hide loading message
            hideLoadingMessage();
        } else {
            console.error('Failed to initialize game!');
            showErrorMessage('Failed to initialize game. Please refresh the page.');
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        showErrorMessage('Failed to load game assets. Please refresh the page.');
    }
});

// Setup keyboard shortcuts
function setupKeyboardShortcuts(game) {
    // Fullscreen button handler
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            game.toggleFullscreen();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        // Toggle controls help with F1
        if (e.key === 'F1') {
            e.preventDefault();
            const controlsOverlay = document.getElementById('controls-overlay');
            controlsOverlay.classList.toggle('active');
        }
        
        // Toggle fullscreen with F11
        if (e.key === 'F11') {
            e.preventDefault();
            game.toggleFullscreen();
        }
        
        // Quick save with F5
        if (e.key === 'F5') {
            e.preventDefault();
            game.saveGame();
        }
        
        // Quick load with F9
        if (e.key === 'F9') {
            e.preventDefault();
            game.loadGame();
        }
        
        // Mute/unmute with M
        if (e.key === 'm' || e.key === 'M') {
            if (window.soundManager) {
                window.soundManager.toggleMute();
            }
        }
    });
}

// Handle window focus/blur events
function setupWindowHandlers(game) {
    // Pause when window loses focus
    window.addEventListener('blur', () => {
        if (game.running && game.currentScene && 
            game.currentScene.constructor.name === 'GameScene') {
            game.pause();
        }
    });
    
    // Resume when window gains focus
    window.addEventListener('focus', () => {
        // Don't auto-resume, let player unpause manually
    });
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (game.running && game.currentScene && 
                game.currentScene.constructor.name === 'GameScene') {
                game.pause();
            }
        }
    });
    
    // Prevent right-click context menu on canvas
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// Show loading message
function showLoadingMessage(message = 'LOADING...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #00ffff;
        font-size: 24px;
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 10px #00ffff;
        pointer-events: none;
        z-index: 1000;
        text-align: center;
    `;
    loadingDiv.textContent = message;
    
    const container = document.getElementById('game-container');
    container.appendChild(loadingDiv);
}

// Hide loading message
function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.style.transition = 'opacity 0.5s';
        loadingDiv.style.opacity = '0';
        setTimeout(() => {
            loadingDiv.remove();
        }, 500);
    }
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ff0000;
        font-size: 20px;
        font-family: 'Courier New', monospace;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border: 2px solid #ff0000;
        border-radius: 10px;
        z-index: 1000;
    `;
    errorDiv.textContent = message;
    
    const container = document.getElementById('game-container');
    container.appendChild(errorDiv);
}

// Mobile detection and setup
function setupMobileControls() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     ('ontouchstart' in window) ||
                     (navigator.maxTouchPoints > 0);
    
    if (isMobile) {
        // Add mobile class to body for CSS styling
        document.body.classList.add('mobile');
        
        // Add touch instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: #ffffff;
            font-size: 14px;
            font-family: 'Courier New', monospace;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px 20px;
            border-radius: 5px;
            pointer-events: none;
            z-index: 100;
            border: 1px solid #00ffff;
        `;
        instructions.innerHTML = 'Touch left side to move • Touch right side to shoot';
        
        const container = document.getElementById('game-container');
        container.appendChild(instructions);
        
        // Hide instructions after 5 seconds
        setTimeout(() => {
            instructions.style.transition = 'opacity 1s';
            instructions.style.opacity = '0';
            setTimeout(() => {
                instructions.remove();
            }, 1000);
        }, 5000);
        
        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (e.target.id === 'gameCanvas') {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    return isMobile;
}

// Call mobile setup
setupMobileControls();

// Performance monitoring
if (window.performance && window.performance.memory) {
    setInterval(() => {
        const memoryInfo = window.performance.memory;
        const usedMemory = (memoryInfo.usedJSHeapSize / 1048576).toFixed(2);
        const totalMemory = (memoryInfo.totalJSHeapSize / 1048576).toFixed(2);
        console.log(`Memory: ${usedMemory}MB / ${totalMemory}MB`);
    }, 10000); // Log every 10 seconds
}

// Debug helper functions (available in console)
window.debugGame = {
    addLife: () => {
        if (window.game && window.game.currentScene && window.game.currentScene.player) {
            window.game.currentScene.player.lives++;
            console.log('Life added!');
        }
    },
    
    maxPower: () => {
        if (window.game && window.game.currentScene && window.game.currentScene.player) {
            window.game.currentScene.player.weaponLevel = WEAPONS.MAX_LEVEL;
            console.log('Max power!');
        }
    },
    
    skipLevel: () => {
        if (window.game && window.game.currentScene && 
            window.game.currentScene.constructor.name === 'GameScene') {
            window.game.currentScene.completeLevel();
            console.log('Level skipped!');
        }
    },
    
    spawnBoss: () => {
        if (window.game && window.game.currentScene && 
            window.game.currentScene.constructor.name === 'GameScene') {
            window.game.currentScene.spawnBoss();
            console.log('Boss spawned!');
        }
    },
    
    clearEnemies: () => {
        if (window.game && window.game.currentScene && 
            window.game.currentScene.constructor.name === 'GameScene') {
            window.game.currentScene.enemies.forEach(enemy => enemy.takeDamage(999));
            console.log('Enemies cleared!');
        }
    }
};

console.log('Debug functions available: window.debugGame');
console.log('Controls: Arrow keys/WASD to move, Space/Z to shoot, Esc to pause');
console.log('F1: Toggle debug, F11: Fullscreen, M: Mute'); 