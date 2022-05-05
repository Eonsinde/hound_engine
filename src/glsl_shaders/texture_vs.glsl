//
// This is the vertex shader 

//
attribute vec3 aVertexPosition;      // Vertex shader expects one vertex position
attribute vec2 aTextureCoordinate;   // This is the texture coordinate attribute

// texture coordinate that maps image to the square
varying vec2 vTexCoord;

// to transform the vertex position
uniform mat4 uModel;
uniform mat4 uView;

void main(void) { 
    // Convert the vec3 into vec4 for scan conversion and
    // transform by uModel and uView before
    // assign to gl_Position to pass the vertex to the fragment shader
    gl_Position = uView * uModel * vec4(aVertexPosition, 1.0); 
    
    // pass the texture coordinate to the fragment shader
    vTexCoord = aTextureCoordinate;
}