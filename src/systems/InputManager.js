// InputManager class

class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mousePressed = false;
        this.touches = [];
        this.isMobile = false;
        
        // Touch control zones
        this.touchZones = {
            movement: { x: 0, y: 0, width: 0, height: 0 },
            shooting: { x: 0, y: 0, width: 0, height: 0 }
        };
        
        // Virtual joystick for mobile
        this.virtualJoystick = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            maxRadius: 50
        };
        
        // Auto-fire for mobile
        this.autoFire = false;
        
        this.init();
    }

    init() {
        // Detect mobile
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0);
        
        // Setup touch zones
        this.updateTouchZones();
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events with passive: false for better responsiveness
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        canvas.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Window resize
        window.addEventListener('resize', () => this.updateTouchZones());
    }
    
    updateTouchZones() {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        
        // Left half for movement, right half for shooting
        this.touchZones.movement = {
            x: rect.left,
            y: rect.top,
            width: rect.width / 2,
            height: rect.height
        };
        
        this.touchZones.shooting = {
            x: rect.left + rect.width / 2,
            y: rect.top,
            width: rect.width / 2,
            height: rect.height
        };
    }

    handleKeyDown(event) {
        if (this.isGameKey(event.code)) {
            event.preventDefault();
            this.keys[event.code] = true;
        }
    }

    handleKeyUp(event) {
        this.keys[event.code] = false;
    }

    handleMouseDown(event) {
        this.mousePressed = true;
        this.updateMousePosition(event);
    }

    handleMouseUp(event) {
        this.mousePressed = false;
    }

    handleMouseMove(event) {
        this.updateMousePosition(event);
    }

    handleTouchStart(event) {
        event.preventDefault();
        
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            
            // Check which zone the touch is in
            if (touchX < rect.left + rect.width / 2) {
                // Movement zone - activate virtual joystick
                this.virtualJoystick.active = true;
                this.virtualJoystick.startX = touchX;
                this.virtualJoystick.startY = touchY;
                this.virtualJoystick.currentX = touchX;
                this.virtualJoystick.currentY = touchY;
            } else {
                // Shooting zone - start auto-fire
                this.autoFire = true;
                this.keys['Space'] = true;
            }
            
            this.touches.push({
                id: touch.identifier,
                x: touchX,
                y: touchY,
                startX: touchX,
                startY: touchY,
                zone: touchX < rect.left + rect.width / 2 ? 'movement' : 'shooting'
            });
        }
    }

    handleTouchEnd(event) {
        event.preventDefault();
        
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            
            // Remove from touches array
            this.touches = this.touches.filter(t => t.id !== touch.identifier);
            
            // Check if this was the movement touch
            const wasMovementTouch = this.touches.filter(t => t.zone === 'movement').length === 0;
            if (wasMovementTouch) {
                this.virtualJoystick.active = false;
                // Clear movement keys
                this.keys['ArrowLeft'] = false;
                this.keys['ArrowRight'] = false;
                this.keys['ArrowUp'] = false;
                this.keys['ArrowDown'] = false;
            }
            
            // Check if this was the shooting touch
            const wasShootingTouch = this.touches.filter(t => t.zone === 'shooting').length === 0;
            if (wasShootingTouch) {
                this.autoFire = false;
                this.keys['Space'] = false;
            }
        }
    }

    handleTouchMove(event) {
        event.preventDefault();
        
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const touchData = this.touches.find(t => t.id === touch.identifier);
            
            if (touchData) {
                touchData.x = touch.clientX;
                touchData.y = touch.clientY;
                
                // Update virtual joystick if this is the movement touch
                if (touchData.zone === 'movement' && this.virtualJoystick.active) {
                    this.virtualJoystick.currentX = touch.clientX;
                    this.virtualJoystick.currentY = touch.clientY;
                    
                    // Calculate joystick offset
                    const dx = this.virtualJoystick.currentX - this.virtualJoystick.startX;
                    const dy = this.virtualJoystick.currentY - this.virtualJoystick.startY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Limit to max radius
                    if (distance > this.virtualJoystick.maxRadius) {
                        const angle = Math.atan2(dy, dx);
                        this.virtualJoystick.currentX = this.virtualJoystick.startX + Math.cos(angle) * this.virtualJoystick.maxRadius;
                        this.virtualJoystick.currentY = this.virtualJoystick.startY + Math.sin(angle) * this.virtualJoystick.maxRadius;
                    }
                    
                    // Update movement keys based on joystick position
                    const threshold = this.virtualJoystick.maxRadius * 0.3;
                    this.keys['ArrowLeft'] = dx < -threshold;
                    this.keys['ArrowRight'] = dx > threshold;
                    this.keys['ArrowUp'] = dy < -threshold;
                    this.keys['ArrowDown'] = dy > threshold;
                }
            }
        }
    }

    updateMousePosition(event) {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        this.mousePosition.x = event.clientX - rect.left;
        this.mousePosition.y = event.clientY - rect.top;
    }

    isGameKey(code) {
        const gameKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'KeyW', 'KeyA', 'KeyS', 'KeyD',
            'Space', 'KeyZ', 'KeyX', 'KeyC',
            'Escape', 'Enter', 'KeyP'
        ];
        return gameKeys.includes(code);
    }

    isKeyPressed(code) {
        return this.keys[code] || false;
    }

    wasKeyPressed(code) {
        return this.previousKeys[code] || false;
    }

    isKeyJustPressed(code) {
        return this.isKeyPressed(code) && !this.wasKeyPressed(code);
    }

    isAnyKeyPressed(...codes) {
        return codes.some(code => this.isKeyPressed(code));
    }

    isAllKeysPressed(...codes) {
        return codes.every(code => this.isKeyPressed(code));
    }

    updatePreviousKeys() {
        this.previousKeys = { ...this.keys };
    }

    getMovementVector() {
        let x = 0;
        let y = 0;
        
        // Keyboard input
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) x -= 1;
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) x += 1;
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) y -= 1;
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) y += 1;
        
        // Virtual joystick input (already handled through key simulation)
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const magnitude = Math.sqrt(x * x + y * y);
            x /= magnitude;
            y /= magnitude;
        }
        
        return { x, y };
    }

    isShooting() {
        return this.isKeyPressed('Space') || 
               this.isKeyPressed('KeyZ') || 
               this.mousePressed ||
               this.autoFire;
    }

    isPaused() {
        return this.isKeyJustPressed('Escape') || this.isKeyJustPressed('KeyP');
    }

    reset() {
        this.keys = {};
        this.previousKeys = {};
        this.mousePressed = false;
        this.touches = [];
        this.virtualJoystick.active = false;
        this.autoFire = false;
    }

    drawTouchControls(ctx) {
        if (!this.isMobile || this.touches.length === 0) return;
        
        ctx.save();
        
        // Draw virtual joystick if active
        if (this.virtualJoystick.active) {
            // Outer circle
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.virtualJoystick.startX, this.virtualJoystick.startY, 
                   this.virtualJoystick.maxRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner circle (thumb)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.virtualJoystick.currentX, this.virtualJoystick.currentY, 
                   20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw shooting indicator
        const shootingTouch = this.touches.find(t => t.zone === 'shooting');
        if (shootingTouch) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(shootingTouch.x, shootingTouch.y, 40, 0, Math.PI * 2);
            ctx.fill();
            
            // Pulsing effect
            const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
            ctx.strokeStyle = `rgba(255, 0, 0, ${pulse})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        ctx.restore();
    }
} 