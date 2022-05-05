/* 
 * File: simple_shader.js
 * 
 * Defines the SimpleShader class
 * 
 */
"use strict";

import * as text from "../resources/text.js";
import * as glSys from "../core/gl.js";
import * as buffer from "../core/buffers.js";

class SimpleShader {

    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mProgram = null; 
        this.mVertexPositionRef = null; 
        this.mPixelColorRef = null;    
        this.mModelMatrixRef = null; 
        this.mViewMatrixRef = null; 

        let gl = glSys.getGL();

        // load and compile vertex and fragment shaders
        this.mVertexShader = compileShader(vertexShaderPath, gl.VERTEX_SHADER);
        this.mFragmentShader = compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

        // create and link the shaders into a program.
        this.mProgram = gl.createProgram();
        gl.attachShader(this.mProgram, this.mVertexShader);
        gl.attachShader(this.mProgram, this.mFragmentShader);
        gl.linkProgram(this.mProgram);

        // check for error
        if (!gl.getProgramParameter(this.mProgram, gl.LINK_STATUS)) {
            throw new Error("Shader linking failed with [" + vertexShaderPath + " " + fragmentShaderPath +"].");
            return null;
        }

        // Gets a reference to the aVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.getAttribLocation(this.mProgram, "aVertexPosition");

        // Gets references to the uniform variables
        this.mPixelColorRef = gl.getUniformLocation(this.mProgram, "uPixelColor");
        this.mModelMatrixRef = gl.getUniformLocation(this.mProgram, "uModel");
        this.mViewMatrixRef = gl.getUniformLocation(this.mProgram, "uView");
    }

    // Activate the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        let gl = glSys.getGL();
        gl.useProgram(this.mProgram);
        
        // bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.getVertexBuffer());
        gl.vertexAttribPointer(this.mVertexPositionRef,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.mVertexPositionRef);
        
        // load uniforms
        gl.uniform4fv(this.mPixelColorRef, pixelColor);
        gl.uniformMatrix4fv(this.mModelMatrixRef, false, trsMatrix);
        gl.uniformMatrix4fv(this.mViewMatrixRef, false, cameraMatrix);
    }

    cleanUp() {
        let gl = glSys.getGL();
        gl.detachShader(this.mProgram, this.mVertexShader);
        gl.detachShader(this.mProgram, this.mFragmentShader);
        gl.deleteShader(this.mVertexShader);
        gl.deleteShader(this.mFragmentShader);
        gl.deleteProgram(this.mProgram);
    }
}


//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function compileShader(filePath, shaderType) {
    let shaderSource = null, compiledShader = null;
    let gl = glSys.getGL();

    // access the shader textfile
    shaderSource = text.get(filePath);

    if (shaderSource === null) {
        throw new Error("WARNING:" + filePath + " not loaded!");
        return null;
    }

    compiledShader = gl.createShader(shaderType);
    // compile shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // handle errors
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error("Shader ["+ filePath +"] compiling error: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}

export default SimpleShader;