/*
 * File: vertex_buffer.js
 *  
 * defines the module that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gl context
 * 
 */
"use strict";

import * as glSys from "./gl.js";

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;
function getVertexBuffer() { return mGLVertexBuffer; }

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];


// reference to the texture coordinates for the square vertices in the gl context
let mGLTextureCoordBuffer = null;
function getTexBuffer() { return mGLTextureCoordBuffer; }

// Second: define the corresponding texture coordinates
let mTextureCoordinates = [
    1.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
];

function cleanUp() {
    let gl = glSys.getGL(); 
    if (mGLVertexBuffer !== null) {
        gl.deleteBuffer(mGLVertexBuffer);
        mGLVertexBuffer = null;   
    }

    if (mGLTextureCoordBuffer !== null) {
        gl.deleteBuffer(mGLTextureCoordBuffer);
        mGLTextureCoordBuffer = null;
    }
}

function init() {
    let gl = glSys.getGL();

    // Create buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);

    // create buffer for texture coordinates
    mGLTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);   
}

export {init, cleanUp, 
        getVertexBuffer, getTexBuffer}

