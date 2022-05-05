/*
 * File: loop.js
 *  
 * interfaces with HTML5 to implement looping functionality, supports start/end loop
 * 
 */
"use strict";

import * as map from "./resource_map.js";
import * as input from "./input.js";

const kFPS = 60; // 60 frames per second
const kMPF = 1000 / kFPS; // (milliseconds per frame)seconds per frame converted to milliseconds

// Variables for timing gameloop.
let mPrevTime;
let mLagTime;

// The current loop state (running or should stop)
let mLoopRunning = false;
let mCurrentScene = null;
let mFrameID = -1;

// This function loops over draw/update once
function loopOnce() {
    if (mLoopRunning) {
        mFrameID = requestAnimationFrame(loopOnce);

        // draw current scene
        mCurrentScene.draw();    

        // compute delta time
        let currentTime = performance.now();
        let deltaTime = currentTime - mPrevTime;
        mPrevTime = currentTime;
        mLagTime += deltaTime;

        // Update only every kMPF (1/60 of a second)
        // If lag larger then update frames, update until caught up.
        while ((mLagTime >= kMPF) && mLoopRunning) {
            input.update();
            mCurrentScene.update(deltaTime);      
            mLagTime -= kMPF;
        }
    } 
}

async function start(scene) {
    if (mLoopRunning) {
        throw new Error("loop already running")
    }
    mCurrentScene = scene;
    mCurrentScene.load();
    
    // Wait for any async requests before game-load
    await map.waitOnPromises();
    
    mCurrentScene.init();    
    mPrevTime = performance.now();
    mLagTime = 0.0;
    mLoopRunning = true;
    mFrameID = requestAnimationFrame(loopOnce);
}

function stop() {
    mLoopRunning = false;
    // make sure no more animation frames
    cancelAnimationFrame(mFrameID);
}

function cleanUp() {
    if (mLoopRunning) {
        stop();

        // unload all resources
        mCurrentScene.unload();
        mCurrentScene = null;
    }
}

export {start, stop, cleanUp}