import * as THREE from 'three'

export const waterVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRipples[30]; // x, y, radius, amplitude (max 10 ripples)
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  #define PI 3.14159265359
  
  // Gerstner wave function
  vec3 gerstnerWave(vec2 position, float time, vec2 direction, float amplitude, float wavelength, float speed) {
    float k = 2.0 * PI / wavelength;
    float phase = speed * k;
    float d = dot(position, normalize(direction));
    float f = k * d - phase * time;
    
    float x = amplitude * sin(f) * normalize(direction).x;
    float y = amplitude * sin(f) * normalize(direction).y;
    float z = amplitude * cos(f);
    
    return vec3(x, y, z);
  }
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Base ambient waves
    vec3 wave1 = gerstnerWave(uv * 10.0, uTime * 0.5, vec2(1.0, 0.3), 0.03, 2.0, 1.0);
    vec3 wave2 = gerstnerWave(uv * 15.0, uTime * 0.5, vec2(-0.7, 0.7), 0.02, 1.5, 0.8);
    vec3 wave3 = gerstnerWave(uv * 20.0, uTime * 0.5, vec2(0.5, -0.8), 0.015, 1.0, 1.2);
    
    pos += wave1 + wave2 + wave3;
    
    // Mouse interaction wave
    float mouseDist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.3, 0.0, mouseDist);
    float mouseWave = sin(mouseDist * 20.0 - uTime * 5.0) * mouseInfluence * 0.15;
    pos.z += mouseWave;
    
    // Interactive ripples
    float totalElevation = 0.0;
    
    for (int i = 0; i < 10; i++) {
      int idx = i * 3;
      vec2 rippleCenter = vec2(uRipples[idx], uRipples[idx + 1]);
      float rippleRadius = uRipples[idx + 2];
      
      if (rippleRadius > 0.0) {
        float dist = distance(uv, rippleCenter);
        float rippleStrength = smoothstep(rippleRadius + 0.1, rippleRadius - 0.1, dist);
        float wave = sin(dist * 30.0 - uTime * 3.0 - rippleRadius * 10.0) * rippleStrength;
        float damping = exp(-rippleRadius * 2.0); // Ripples fade over time
        
        totalElevation += wave * 0.1 * damping;
      }
    }
    
    pos.z += totalElevation;
    vElevation = pos.z;
    
    // Calculate normal for lighting
    vec3 neighborX = pos + vec3(0.01, 0.0, 0.0);
    vec3 neighborY = pos + vec3(0.0, 0.01, 0.0);
    neighborX.z = pos.z; // Simplified normal calculation
    neighborY.z = pos.z;
    
    vNormal = normalize(cross(neighborX - pos, neighborY - pos));
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const waterFragmentShader = `
  uniform float uTime;
  uniform vec3 uLightPosition;
  uniform vec3 uDeepColor;
  uniform vec3 uSurfaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;
  uniform sampler2D uReflectionTexture;
  uniform float uReflectionStrength;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Fresnel effect
  float fresnel(vec3 viewDirection, vec3 normal, float power) {
    return pow(1.0 - dot(viewDirection, normal), power);
  }
  
  void main() {
    // Water color based on elevation
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 waterColor = mix(uDeepColor, uSurfaceColor, mixStrength);
    
    // Lighting
    vec3 lightDir = normalize(uLightPosition - vPosition);
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    
    // Specular highlights
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 reflectDir = reflect(-lightDir, vNormal);
    float specular = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    
    // Fresnel effect for rim lighting
    float fresnelFactor = fresnel(viewDir, vNormal, 2.0);
    
    // Caustics simulation
    float caustics = sin(vUv.x * 40.0 + uTime) * sin(vUv.y * 40.0 + uTime * 0.8);
    caustics = smoothstep(0.0, 1.0, caustics) * 0.15;
    
    // Combine all effects
    vec3 finalColor = waterColor;
    finalColor += vec3(diffuse * 0.3);
    finalColor += vec3(specular * 0.8);
    finalColor += vec3(fresnelFactor * 0.2);
    finalColor += vec3(caustics);
    
    // Reflection (if texture provided)
    if (uReflectionStrength > 0.0) {
      vec2 reflectionUv = vUv + vNormal.xy * 0.05;
      vec3 reflection = texture2D(uReflectionTexture, reflectionUv).rgb;
      finalColor = mix(finalColor, reflection, uReflectionStrength * 0.3);
    }
    
    // Transparency based on depth
    float alpha = 0.85 + fresnelFactor * 0.15;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export const particleVertexShader = `
  uniform float uTime;
  uniform float uSize;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  attribute float aSpeed;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec3 pos = position;
    
    // Circular motion
    float angle = uTime * aSpeed + aRandomness.x * 6.28;
    pos.x += sin(angle) * aRandomness.y * 0.1;
    pos.y += cos(angle) * aRandomness.z * 0.1;
    
    // Floating motion
    pos.z += sin(uTime * aSpeed * 2.0 + aRandomness.x * 10.0) * 0.02;
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
    
    vColor = color;
    vAlpha = 1.0 - smoothstep(0.0, 1.0, length(pos.xy) / 2.0);
  }
`

export const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Circular particle shape
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vAlpha;
    
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`