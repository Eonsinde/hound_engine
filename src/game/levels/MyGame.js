/* File: MyGame.js
 *
 * This is game developer's game
 * 
 */
"use strict";

// Engine stuff
import engine from "../../engine/index.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        // textures: 
        this.kFontImage = "assets/consolas-72.png";
        this.kMinionSprite = "assets/minion_sprite.png";  // Portal and Collector are embedded here

        // The camera to view the scene
        this.mCamera = null;

        // the hero and the support objects
        this.mHero = null;
        this.mPortal = null;
        this.mCollector = null;
        this.mFontImage = null;
        this.mMinion = null;
        this.mRightMinion = null;
    }

    load() {
        // loads the textures
        engine.texture.load(this.kFontImage);
        engine.texture.load(this.kMinionSprite);
    }

    unload() {
        engine.texture.unload(this.kFontImage);
        engine.texture.unload(this.kMinionSprite);
    }

    init() {
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Create the support objects
        this.mPortal = new engine.SpriteRenderable(this.kMinionSprite);
        this.mPortal.setColor([1, 0, 0, 0.2]);  // tints red
        this.mPortal.getTransform().setPosition(25, 60);
        this.mPortal.getTransform().setSize(3, 3);
        this.mPortal.setElementPixelPositions(130, 310, 0, 180);

        this.mCollector = new engine.SpriteRenderable(this.kMinionSprite);
        this.mCollector.setColor([0, 0, 0, 0]);  // No tinting
        this.mCollector.getTransform().setPosition(15, 60);
        this.mCollector.getTransform().setSize(3, 3);
        this.mCollector.setElementUVCoordinate(0.308, 0.483, 0, 0.352);

        // Create the font and minion images using sprite
        this.mFontImage = new engine.SpriteRenderable(this.kFontImage);
        this.mFontImage.setColor([1, 1, 1, 0]);
        this.mFontImage.getTransform().setPosition(13, 62);
        this.mFontImage.getTransform().setSize(4, 4);

        this.mMinion = new engine.SpriteRenderable(this.kMinionSprite);
        this.mMinion.setColor([1, 1, 1, 0]);
        this.mMinion.getTransform().setPosition(26, 56);
        this.mMinion.getTransform().setSize(5, 2.5);


        // Create the hero object with texture from the lower-left corner 
        this.mHero = new engine.SpriteRenderable(this.kMinionSprite);
        this.mHero.setColor([1, 1, 1, 0]);
        this.mHero.getTransform().setPosition(20, 60);
        this.mHero.getTransform().setSize(2, 3);
        this.mHero.setElementPixelPositions(0, 120, 0, 180);

        // The right minion
        this.mRightMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
        this.mRightMinion.setColor([1, 1, 1, 0]);
        this.mRightMinion.getTransform().setPosition(26, 56.5);
        this.mRightMinion.getTransform().setSize(4, 3.2);
        this.mRightMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
        this.mRightMinion.setAnimationSpeed(50);
        // show each element for mAnimSpeed updates
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update(deltaTime) {
        // let's only allow the movement of hero, 
        let deltaX = 0.05;
        let xform = this.mHero.getTransform();

        // Support hero movements
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                xform.setXPos(20);
            }
        }

        // continuously change texture tinting
        let c = this.mPortal.getColor();
        let ca = c[3] + deltaX;
        if (ca > 1) {
            ca = 0;
        }
        c[3] = ca;

        // New update code for changing the sub-texture regions being shown"
        let deltaT = 0.001;

        // The font image:
        // zoom into the texture by updating texture coordinate
        // For font: zoom to the upper left corner by changing bottom right
        let texCoord = this.mFontImage.getElementUVCoordinateArray();
        // The 8 elements:
        //      mTexRight,  mTexTop,          // x,y of top-right
        //      mTexLeft,   mTexTop,
        //      mTexRight,  mTexBottom,
        //      mTexLeft,   mTexBottom
        let b = texCoord[engine.eTexCoordArrayIndex.eBottom] + deltaT;
        let r = texCoord[engine.eTexCoordArrayIndex.eRight] - deltaT;
        if (b > 1.0) {
            b = 0;
        }
        if (r < 0) {
            r = 1.0;
        }
        this.mFontImage.setElementUVCoordinate(
            texCoord[engine.eTexCoordArrayIndex.eLeft],
            r,
            b,
            texCoord[engine.eTexCoordArrayIndex.eTop]
        );
        //

        // The minion image:
        // For minion: zoom to the bottom right corner by changing top left
        texCoord = this.mMinion.getElementUVCoordinateArray();
        // The 8 elements:
        //      mTexRight,  mTexTop,          // x,y of top-right
        //      mTexLeft,   mTexTop,
        //      mTexRight,  mTexBottom,
        //      mTexLeft,   mTexBottom
        let t = texCoord[engine.eTexCoordArrayIndex.eTop] - deltaT;
        let l = texCoord[engine.eTexCoordArrayIndex.eLeft] + deltaT;

        if (l > 0.5) {
            l = 0;
        }
        if (t < 0.5) {
            t = 1.0;
        }

        this.mMinion.setElementUVCoordinate(
            l,
            texCoord[engine.eTexCoordArrayIndex.eRight],
            texCoord[engine.eTexCoordArrayIndex.eBottom],
            t
        );

        // animated spritesheet 
        this.mRightMinion.updateAnimation();
        
        // Animate left on the sprite sheet
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            this.mRightMinion.setAnimationType(engine.eAnimationType.eLeft);
        }

        // decrease the duration of showing each sprite element, thereby speeding up the animation
        if (engine.input.isKeyClicked(engine.input.keys.Four)) {
            this.mRightMinion.incAnimationSpeed(-2);
        }

        // increase the duration of showing each sprite element, thereby slowing down the animation
        if (engine.input.isKeyClicked(engine.input.keys.Five)) {
            this.mRightMinion.incAnimationSpeed(2);
        }
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Draw everything
        this.mPortal.draw(this.mCamera);
        this.mCollector.draw(this.mCamera);
        this.mHero.draw(this.mCamera);
        this.mFontImage.draw(this.mCamera);
        this.mMinion.draw(this.mCamera);
        this.mRightMinion.draw(this.mCamera);
    }
}

export default MyGame;

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}