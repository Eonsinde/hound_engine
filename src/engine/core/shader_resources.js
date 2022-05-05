/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";
 
// Simple Shader
let kSimpleVSPath = "src/glsl_shaders/simple_vs.glsl";  
let kSimpleFSPath = "src/glsl_shaders/simple_fs.glsl"; 
let mConstColorShader = null;

// Texture Shader
let kTextureVSPath = "src/glsl_shaders/texture_vs.glsl"; 
let kTextureFSPath = "src/glsl_shaders/texture_fs.glsl"; 
let mTextureShader = null;
let mSpriteShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVSPath, kSimpleFSPath);
    mTextureShader = new TextureShader(kTextureVSPath, kTextureFSPath);
    mSpriteShader = new SpriteShader(kTextureVSPath, kTextureFSPath);
}

function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();

    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
}

function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                text.load(kSimpleFSPath),
                text.load(kSimpleVSPath),
                text.load(kTextureFSPath),
                text.load(kTextureVSPath)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }
function getTextureShader() { return mTextureShader; }
function getSpriteShader() { return mSpriteShader; }

export {    init, cleanUp, 
            getConstColorShader, getTextureShader, 
            getSpriteShader
        }