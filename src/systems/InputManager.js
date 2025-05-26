// InputManager class

class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.touches = [];
        this.mousePosition = { x: 0, y: 0 };
        this.isMouseDown = false;
        
        // Touch controls state
        this.virtualJoystick = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            deltaX: 0,
            deltaY: 0
        };
        
        this.init();
    }

    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        
        // Prevent default behaviors
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleKeyDown(event) {
        // Prevent default for game keys
        if (this.isGameKey(event.code)) {
            event.preventDefault();
        }
        
        this.keys[event.code] = true;
    }

    handleKeyUp(event) {
        this.keys[event.code] = false;
    }

    handleMouseDown(event) {
        this.isMouseDown = true;
        this.updateMousePosition(event);
    }

    handleMouseUp(event) {
        this.isMouseDown = false;
    }

    handleMouseMove(event) {
        this.updateMousePosition(event);
    }

    handleTouchStart(event) {
        event.preventDefault();
        
        // Get canvas bounds for proper touch coordinate mapping
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        
        for (let touch of event.changedTouches) {
            // Convert to canvas coordinates
            const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
            
            this.touches.push({
                id: touch.identifier,
                x: x,
                y: y,
                startX: x,
                startY: y,
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        }
        
        // Initialize virtual joystick with first touch on left side
        if (this.touches.length > 0 && !this.virtualJoystick.active) {
            const firstTouch = this.touches[0];
            // Only create joystick if touch is on left half of screen
            if (firstTouch.x < canvas.width / 2) {
                this.virtualJoystick.active = true;
                this.virtualJoystick.startX = firstTouch.clientX;
                this.virtualJoystick.startY = firstTouch.clientY;
                this.virtualJoystick.currentX = firstTouch.clientX;
                this.virtualJoystick.currentY = firstTouch.clientY;
            }
        }
    }

    handleTouchEnd(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            const index = this.touches.findIndex(t => t.id === touch.identifier);
            if (index !== -1) {
                // Check if this was the joystick touch
                const touchData = this.touches[index];
                if (this.virtualJoystick.active && index === 0) {
                    this.virtualJoystick.active = false;
                    this.virtualJoystick.deltaX = 0;
                    this.virtualJoystick.deltaY = 0;
                }
                this.touches.splice(index, 1);
            }
        }
    }

    handleTouchMove(event) {
        event.preventDefault();
        
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        
        for (let touch of event.changedTouches) {
            const index = this.touches.findIndex(t => t.id === touch.identifier);
            if (index !== -1) {
                // Update canvas coordinates
                const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                
                this.touches[index].x = x;
                this.touches[index].y = y;
                this.touches[index].clientX = touch.clientX;
                this.touches[index].clientY = touch.clientY;
            }
        }
        
        // Update virtual joystick
        if (this.virtualJoystick.active && this.touches.length > 0) {
            const firstTouch = this.touches[0];
            this.virtualJoystick.currentX = firstTouch.clientX;
            this.virtualJoystick.currentY = firstTouch.clientY;
            
            // Calculate delta with dead zone
            const maxDelta = 50;
            const deadZone = 5;
            let deltaX = (firstTouch.clientX - this.virtualJoystick.startX);
            let deltaY = (firstTouch.clientY - this.virtualJoystick.startY);
            
            // Apply dead zone
            if (Math.abs(deltaX) < deadZone) deltaX = 0;
            if (Math.abs(deltaY) < deadZone) deltaY = 0;
            
            this.virtualJoystick.deltaX = clamp(deltaX / maxDelta, -1, 1);
            this.virtualJoystick.deltaY = clamp(deltaY / maxDelta, -1, 1);
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
            'Space', 'Enter', 'Escape',
            'KeyZ', 'KeyX', 'KeyC'
        ];
        return gameKeys.includes(code);
    }

    isKeyPressed(code) {
        return !!this.keys[code];
    }
    
    wasKeyPressed(code) {
        return !!this.previousKeys[code];
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
        
        // Touch input (virtual joystick)
        if (this.virtualJoystick.active) {
            x += this.virtualJoystick.deltaX;
            y += this.virtualJoystick.deltaY;
        }
        
        // Normalize if diagonal
        if (x !== 0 && y !== 0) {
            const normalized = normalize(x, y);
            x = normalized.x;
            y = normalized.y;
        }
        
        return { x, y };
    }

    isShooting() {
        // Keyboard/mouse shooting
        if (this.isKeyPressed('Space') || 
            this.isKeyPressed('KeyZ') || 
            this.isMouseDown) {
            return true;
        }
        
        // Touch shooting - any touch on right side of screen
        if (this.touches.length > 0) {
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                // Check if any touch is on the right half of the screen
                return this.touches.some(touch => touch.x > canvas.width / 2);
            }
        }
        
        return false;
    }

    isPaused() {
        return this.isKeyPressed('Escape') || this.isKeyPressed('KeyP');
    }

    reset() {
        this.keys = {};
        this.touches = [];
        this.isMouseDown = false;
        this.virtualJoystick.active = false;
        this.virtualJoystick.deltaX = 0;
        this.virtualJoystick.deltaY = 0;
    }

    drawTouchControls(ctx) {
        if (!this.virtualJoystick.active) return;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        // Draw joystick base
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            this.virtualJoystick.startX,
            this.virtualJoystick.startY,
            50,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        
        // Draw joystick knob
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(
            this.virtualJoystick.currentX,
            this.virtualJoystick.currentY,
            20,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw shoot indicator
        if (this.touches.length > 1) {
            const secondTouch = this.touches[1];
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(secondTouch.x, secondTouch.y, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('FIRE', secondTouch.x, secondTouch.y);
        }
        
        ctx.restore();
    }
} 