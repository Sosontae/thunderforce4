// Base GameObject class

class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.active = true;
        this.visible = true;
        this.rotation = 0;
        this.scale = 1;
        this.alpha = 1;
        this.color = '#ffffff';
        this.createdAt = Date.now();
    }

    update(deltaTime) {
        if (!this.active) return;
        
        // Update position based on velocity
        this.x += this.vx * (deltaTime / 16);
        this.y += this.vy * (deltaTime / 16);
    }

    render(ctx) {
        if (!this.visible || this.alpha <= 0) return;

        ctx.save();
        
        // Apply transformations
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        // Draw the object (to be overridden by subclasses)
        this.draw(ctx);
        
        ctx.restore();
    }

    draw(ctx) {
        // Default draw method - draws a rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }

    // Collision bounds
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width * this.scale,
            height: this.height * this.scale
        };
    }

    // Check if object is within game bounds
    isInBounds(padding = 100) {
        return this.x > -padding && 
               this.x < GAME_WIDTH + padding &&
               this.y > -padding && 
               this.y < GAME_HEIGHT + padding;
    }

    // Check collision with another object
    collidesWith(other) {
        const myBounds = this.getBounds();
        const otherBounds = other.getBounds();
        return rectCollision(myBounds, otherBounds);
    }

    // Distance to another object
    distanceTo(other) {
        return distance(this.x, this.y, other.x, other.y);
    }

    // Angle to another object
    angleTo(other) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }

    // Move towards a point
    moveTowards(targetX, targetY, speed) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    // Apply force
    applyForce(forceX, forceY) {
        this.vx += forceX;
        this.vy += forceY;
    }

    // Destroy the object
    destroy() {
        this.active = false;
        this.visible = false;
    }

    // Get age in milliseconds
    getAge() {
        return Date.now() - this.createdAt;
    }

    // Fade in/out
    fadeIn(duration = 1000) {
        const startAlpha = this.alpha;
        const startTime = Date.now();
        
        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.alpha = lerp(startAlpha, 1, progress);
            
            if (progress < 1 && this.active) {
                requestAnimationFrame(fade);
            }
        };
        
        fade();
    }

    fadeOut(duration = 1000, destroyOnComplete = true) {
        const startAlpha = this.alpha;
        const startTime = Date.now();
        
        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.alpha = lerp(startAlpha, 0, progress);
            
            if (progress < 1 && this.active) {
                requestAnimationFrame(fade);
            } else if (destroyOnComplete) {
                this.destroy();
            }
        };
        
        fade();
    }

    // Screen shake effect
    shake(intensity = 5, duration = 200) {
        const originalX = this.x;
        const originalY = this.y;
        const startTime = Date.now();
        
        const shakeUpdate = () => {
            const elapsed = Date.now() - startTime;
            const progress = 1 - (elapsed / duration);
            
            if (progress > 0 && this.active) {
                this.x = originalX + randomRange(-intensity, intensity) * progress;
                this.y = originalY + randomRange(-intensity, intensity) * progress;
                requestAnimationFrame(shakeUpdate);
            } else {
                this.x = originalX;
                this.y = originalY;
            }
        };
        
        shakeUpdate();
    }

    // Pulse effect
    pulse(minScale = 0.8, maxScale = 1.2, duration = 1000) {
        const startTime = Date.now();
        
        const pulseUpdate = () => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            const t = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
            this.scale = lerp(minScale, maxScale, t);
            
            if (this.active) {
                requestAnimationFrame(pulseUpdate);
            }
        };
        
        pulseUpdate();
    }
} 