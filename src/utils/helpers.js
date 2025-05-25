// Helper Functions

// Math utilities
function lerp(start, end, t) {
    return start + (end - start) * t;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// Vector utilities
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function normalize(x, y) {
    const length = Math.sqrt(x * x + y * y);
    if (length === 0) return { x: 0, y: 0 };
    return { x: x / length, y: y / length };
}

function vectorFromAngle(angle) {
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
}

// Collision detection
function rectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function circleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

function pointInRect(px, py, rect) {
    return px >= rect.x &&
           px <= rect.x + rect.width &&
           py >= rect.y &&
           py <= rect.y + rect.height;
}

// Easing functions
function easeInQuad(t) {
    return t * t;
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeInCubic(t) {
    return t * t * t;
}

function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

// Array utilities
function removeFromArray(array, element) {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Game-specific utilities
function createStarfield(width, height, count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: randomRange(0, width),
            y: randomRange(0, height),
            size: randomRange(0.5, 2),
            speed: randomRange(0.5, 2),
            brightness: randomRange(0.3, 1)
        });
    }
    return stars;
}

function formatScore(score) {
    return score.toString().padStart(8, '0');
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Drawing utilities
function drawRotated(ctx, x, y, angle, drawFn) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    drawFn(ctx);
    ctx.restore();
}

function drawText(ctx, text, x, y, options = {}) {
    const {
        font = UI.FONT.MEDIUM,
        color = '#ffffff',
        align = 'left',
        baseline = 'top',
        shadow = false,
        shadowColor = '#000000',
        shadowBlur = 5
    } = options;

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    if (shadow) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
    }

    ctx.fillText(text, x, y);

    if (shadow) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
}

// Pattern generation
function generateEnemyPattern(type, startX, startY) {
    const patterns = {
        straight: (t) => ({ x: startX - t * 2, y: startY }),
        sine: (t) => ({ x: startX - t * 2, y: startY + Math.sin(t * 0.05) * 100 }),
        circle: (t) => ({ 
            x: startX + Math.cos(t * 0.05) * 100, 
            y: startY + Math.sin(t * 0.05) * 100 
        }),
        zigzag: (t) => ({ 
            x: startX - t * 2, 
            y: startY + (Math.floor(t / 50) % 2 === 0 ? 50 : -50) 
        })
    };
    
    return patterns[type] || patterns.straight;
}

// Color manipulation
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function fadeColor(color, alpha) {
    const rgb = hexToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
} 