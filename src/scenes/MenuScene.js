// MenuScene class

class MenuScene extends Scene {
    constructor(game) {
        super(game);
        
        this.selectedOption = 0;
        this.menuOptions = ['START GAME', 'OPTIONS', 'CREDITS'];
        this.stars = [];
        this.titleAnimation = {
            scale: 1,
            rotation: 0,
            glowIntensity: 1
        };
        
        // Demo mode
        this.demoMode = false;
        this.demoTimer = 0;
        this.demoStartDelay = 10000; // Start demo after 10 seconds of inactivity
    }

    init() {
        super.init();
        
        // Create starfield
        this.stars = createStarfield(GAME_WIDTH, GAME_HEIGHT, 100);
        
        // Set up menu handlers
        this.setupMenuHandlers();
        
        // Start menu music
        if (window.soundManager) {
            window.soundManager.playMusic('menuMusic');
        }
    }

    setupMenuHandlers() {
        // Button click handlers
        const startButton = document.getElementById('startButton');
        const optionsButton = document.getElementById('optionsButton');
        const creditsButton = document.getElementById('creditsButton');
        
        startButton.addEventListener('click', () => this.startGame());
        optionsButton.addEventListener('click', () => this.showOptions());
        creditsButton.addEventListener('click', () => this.showCredits());
        
        // Keyboard navigation
        this.keyHandlers = {
            ArrowUp: () => this.navigateMenu(-1),
            ArrowDown: () => this.navigateMenu(1),
            Enter: () => this.selectOption(),
            Space: () => this.selectOption()
        };
    }

    onEnter() {
        // Show menu screen
        document.getElementById('menu-screen').classList.add('active');
        document.getElementById('game-over-screen').classList.remove('active');
        
        // Reset demo timer
        this.demoTimer = 0;
        this.demoMode = false;
        
        // Start menu music
        if (window.soundManager) {
            window.soundManager.playMusic('menuMusic');
        }
    }

    onExit() {
        // Hide menu screen
        document.getElementById('menu-screen').classList.remove('active');
        
        // Stop menu music
        if (window.soundManager) {
            window.soundManager.stopMusic();
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Update starfield
        this.updateStarfield(deltaTime);
        
        // Update title animation
        this.updateTitleAnimation(deltaTime);
        
        // Update demo timer
        if (!this.demoMode) {
            this.demoTimer += deltaTime;
            if (this.demoTimer >= this.demoStartDelay) {
                this.startDemoMode();
            }
        }
    }

    updateStarfield(deltaTime) {
        this.stars.forEach(star => {
            star.x -= star.speed * (deltaTime / 16);
            
            if (star.x < 0) {
                star.x = GAME_WIDTH;
                star.y = randomRange(0, GAME_HEIGHT);
            }
        });
    }

    updateTitleAnimation(deltaTime) {
        // Pulsing glow effect
        this.titleAnimation.glowIntensity = 0.7 + Math.sin(Date.now() * 0.002) * 0.3;
        
        // Subtle rotation
        this.titleAnimation.rotation = Math.sin(Date.now() * 0.0005) * 0.02;
        
        // Scale bounce
        this.titleAnimation.scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
    }

    render() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render starfield
        this.renderStarfield();
        
        // Render additional background elements
        this.renderBackgroundElements();
        
        // The UI elements are handled by HTML/CSS
    }

    renderStarfield() {
        this.stars.forEach(star => {
            this.ctx.fillStyle = fadeColor(COLORS.STAR_1, star.brightness);
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    renderBackgroundElements() {
        // Draw grid lines for retro effect
        this.ctx.strokeStyle = fadeColor('#00ffff', 0.1);
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Draw decorative elements
        this.drawDecorativeShip();
    }

    drawDecorativeShip() {
        // Draw a static player ship in the background
        const shipX = this.canvas.width * 0.8;
        const shipY = this.canvas.height * 0.3;
        const scale = 2;
        
        this.ctx.save();
        this.ctx.translate(shipX, shipY);
        this.ctx.scale(scale, scale);
        this.ctx.globalAlpha = 0.3;
        
        // Ship body
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.moveTo(24, 0);
        this.ctx.lineTo(-24, -16);
        this.ctx.lineTo(-12, 0);
        this.ctx.lineTo(-24, 16);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    handleInput(inputManager) {
        // Reset demo timer on any input
        if (inputManager.isAnyKeyPressed(...Object.keys(this.keyHandlers))) {
            this.demoTimer = 0;
        }
        
        // Handle menu navigation
        Object.keys(this.keyHandlers).forEach(key => {
            if (inputManager.isKeyPressed(key)) {
                this.keyHandlers[key]();
                inputManager.keys[key] = false; // Prevent key repeat
            }
        });
    }

    navigateMenu(direction) {
        this.selectedOption = (this.selectedOption + direction + this.menuOptions.length) % this.menuOptions.length;
        
        // Update visual selection
        const buttons = document.querySelectorAll('.menu-button');
        buttons.forEach((button, index) => {
            if (index === this.selectedOption) {
                button.focus();
            }
        });
        
        // Play sound
        if (window.soundManager) {
            window.soundManager.play('menuMove');
        }
    }

    selectOption() {
        switch (this.selectedOption) {
            case 0:
                this.startGame();
                break;
            case 1:
                this.showOptions();
                break;
            case 2:
                this.showCredits();
                break;
        }
    }

    startGame() {
        // Play sound
        if (window.soundManager) {
            window.soundManager.play('menuSelect');
        }
        
        // Transition to game scene
        this.game.changeScene('game');
    }

    showOptions() {
        // TODO: Implement options menu
        console.log('Options menu not implemented yet');
        this.createFloatingText(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            'OPTIONS COMING SOON',
            '#ffff00',
            2000
        );
    }

    showCredits() {
        // TODO: Implement credits screen
        console.log('Credits not implemented yet');
        this.createFloatingText(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            'THUNDER FORCE IV REPLICA\nBY CLAUDE',
            '#00ffff',
            3000
        );
    }

    startDemoMode() {
        this.demoMode = true;
        console.log('Starting demo mode...');
        
        // Start game in demo mode
        this.game.changeScene('game', { demoMode: true });
    }
} 