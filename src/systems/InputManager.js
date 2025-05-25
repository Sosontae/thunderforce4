// InputManager class

class InputManager {
    constructor() {
        this.keys = {};
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
        
        for (let touch of event.changedTouches) {
            this.touches.push({
                id: touch.identifier,
                x: touch.clientX,
                y: touch.clientY,
                startX: touch.clientX,
                startY: touch.clientY
            });
        }
        
        // Initialize virtual joystick with first touch
        if (this.touches.length > 0 && !this.virtualJoystick.active) {
            const firstTouch = this.touches[0];
            this.virtualJoystick.active = true;
            this.virtualJoystick.startX = firstTouch.x;
            this.virtualJoystick.startY = firstTouch.y;
            this.virtualJoystick.currentX = firstTouch.x;
            this.virtualJoystick.currentY = firstTouch.y;
        }
    }

    handleTouchEnd(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            const index = this.touches.findIndex(t => t.id === touch.identifier);
            if (index !== -1) {
                this.touches.splice(index, 1);
            }
        }
        
        // Deactivate virtual joystick when no touches
        if (this.touches.length === 0) {
            this.virtualJoystick.active = false;
            this.virtualJoystick.deltaX = 0;
            this.virtualJoystick.deltaY = 0;
        }
    }

    handleTouchMove(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            const index = this.touches.findIndex(t => t.id === touch.identifier);
            if (index !== -1) {
                this.touches[index].x = touch.clientX;
                this.touches[index].y = touch.clientY;
            }
        }
        
        // Update virtual joystick
        if (this.virtualJoystick.active && this.touches.length > 0) {
            const firstTouch = this.touches[0];
            this.virtualJoystick.currentX = firstTouch.x;
            this.virtualJoystick.currentY = firstTouch.y;
            
            // Calculate delta
            const maxDelta = 50;
            this.virtualJoystick.deltaX = clamp(
                (firstTouch.x - this.virtualJoystick.startX) / maxDelta,
                -1, 1
            );
            this.virtualJoystick.deltaY = clamp(
                (firstTouch.y - this.virtualJoystick.startY) / maxDelta,
                -1, 1
            );
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

    isAnyKeyPressed(...codes) {
        return codes.some(code => this.isKeyPressed(code));
    }

    isAllKeysPressed(...codes) {
        return codes.every(code => this.isKeyPressed(code));
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
        return this.isKeyPressed('Space') || 
               this.isKeyPressed('KeyZ') || 
               this.isMouseDown ||
               (this.touches.length > 1); // Two-finger touch for shooting
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