# Sprite Debug Guide for Thunder Force IV

## Summary of Changes Made

1. **Downloaded Free Sprites**
   - Player ship sprites in `assets/sprites/player/`
   - Enemy sprites in `assets/sprites/enemies/`
   - Effects, weapons, and powerup sprites organized in folders

2. **Updated Code**
   - `SpriteManager.js` - Updated sprite paths to match actual downloaded files
   - `AssetLoader.js` - Added sprite loading via SpriteManager
   - `index.html` - Added SpriteManager.js script tag
   - `Player.js` - Updated draw method to use sprites
   - `Enemy.js` - Updated draw method to use sprites  
   - `PowerUp.js` - Updated draw method to use sprites

## How to Debug

### 1. Open Browser Console
- Press F12 in your browser
- Go to Console tab
- Look for any error messages

### 2. Test Sprite Loading
Open `test-sprites.html` in your browser to see if sprites load correctly.

### 3. Common Issues and Solutions

#### Issue: "Failed to load sprite: [name] from [path]"
**Solution**: Check that the file exists at that path:
- `assets/sprites/player/player_ship.png`
- `assets/sprites/enemies/enemy-small.png`
- etc.

#### Issue: Sprites load but don't appear in game
**Solution**: Check browser console for errors in draw methods

#### Issue: Still seeing geometric shapes instead of sprites
**Solution**: 
1. Clear browser cache (Ctrl+Shift+R)
2. Check that `window.spriteManager.loaded` is true
3. Verify sprite names match between SpriteManager and entity draw methods

### 4. Manual Test in Console
Open the game and in browser console type:
```javascript
// Check if sprite manager exists
console.log(window.spriteManager);

// Check if sprites are loaded
console.log(window.spriteManager.loaded);

// List all loaded sprites
console.log(Object.keys(window.spriteManager.sprites));

// Check specific sprite
console.log(window.spriteManager.getSprite('player.ship'));
```

## Quick Fix Checklist

- [ ] Browser cache cleared
- [ ] No errors in browser console
- [ ] test-sprites.html shows sprites
- [ ] SpriteManager.loaded is true
- [ ] Sprite paths are correct
- [ ] Entity draw methods use correct sprite names

## If Sprites Still Don't Work

The game has fallback programmatic drawing, so it will still work without sprites. To force sprite usage, you can modify the entity draw methods to remove the fallback code once sprites are confirmed working. 