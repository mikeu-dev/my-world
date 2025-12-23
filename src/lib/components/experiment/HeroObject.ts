import * as THREE from 'three';
import gsap from 'gsap';
import { ExperienceManager } from './ExperienceManager';

export class HeroObject {
  mesh: THREE.Mesh;
  geometry: THREE.IcosahedronGeometry;
  material: THREE.ShaderMaterial;
  uniforms: { [uniform: string]: THREE.IUniform };

  constructor() {
    // High detail for smooth displacement
    // Optimized detail for smooth displacement without dropping frames
    this.geometry = new THREE.IcosahedronGeometry(1.5, 60);

    const params = ExperienceManager.getInstance().params;

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth : 1, typeof window !== 'undefined' ? window.innerHeight : 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },

      // Artistic Params
      uChaosLevel: { value: params.chaosLevel },
      uFlowSpeed: { value: params.flowSpeed },
      uDistortion: { value: params.distortion },
      uMorph: { value: params.morph },
      uRoughness: { value: params.roughness },

      // Colors
      uColorA: { value: params.colorA },
      uColorB: { value: params.colorB },
      uColorC: { value: params.colorC }, // Added third color
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: this.uniforms,
      side: THREE.DoubleSide,
      // transparent: true, // Transparent might be heavy with complex lighting, let's keep it opaque for "Organism" feel unless needed
      defines: {
        PI: Math.PI
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  // Private accumulator for smooth time progression
  private totalTime = 0;
  private lastFrameTime = 0;

  update(time: number) {
    const mgr = ExperienceManager.getInstance();

    // Sync Uniforms with Manager Params (which are tweened by GSAP)
    this.uniforms.uChaosLevel.value = mgr.params.chaosLevel;
    this.uniforms.uFlowSpeed.value = mgr.params.flowSpeed;
    this.uniforms.uDistortion.value = mgr.params.distortion;
    this.uniforms.uMorph.value = mgr.params.morph;
    this.uniforms.uRoughness.value = mgr.params.roughness;

    this.uniforms.uColorA.value.copy(mgr.params.colorA);
    this.uniforms.uColorB.value.copy(mgr.params.colorB);
    this.uniforms.uColorC.value.copy(mgr.params.colorC);

    // SMOOTH TIME LOGIC
    // Calculate delta time
    const delta = time - this.lastFrameTime;
    this.lastFrameTime = time;

    // Accumulate time based on current flow speed
    // This prevents "jumps" when flowSpeed changes
    if (delta > 0) {
      this.totalTime += delta * mgr.params.flowSpeed;
    }

    // Pass the ACCUMULATED time to the shader
    this.uniforms.uTime.value = this.totalTime;

    // Decrease rotation speed significantly to reduce dizziness
    this.mesh.rotation.y = this.totalTime * 0.02 * (1 + mgr.params.chaosLevel * 0.5);
    this.mesh.rotation.z = this.totalTime * 0.01 * (1 + mgr.params.chaosLevel * 0.5);
  }

  onMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    gsap.to(this.uniforms.uMouse.value, {
      x: x,
      y: y,
      duration: 1,
      ease: 'power2.out'
    });
  }

  onResize(width: number, height: number) {
    this.uniforms.uResolution.value.set(width, height);
  }

  onScroll(scrollY: number) {
    // Handled by ExperienceManager mostly, but we keep raw scroll here if needed
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

// -----------------------------------------------------------------------------
// SHADERS
// -----------------------------------------------------------------------------

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uChaosLevel;
uniform float uFlowSpeed;
uniform float uDistortion;
uniform float uMorph;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;
varying float vNoise;

// Simplex 3D Noise 
// https://github.com/stegu/webgl-noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    vUv = uv;
    vNormal = normal;

    // Use accumulated time directly (already multiplied by speed in JS)
    float t = uTime;

    // Base Noise (Low frequency, large shapes)
    float noise1 = snoise(position * 1.0 + t * 0.2);
    
    // Detail Noise (High frequency, texture)
    float noise2 = snoise(position * 4.0 - t * 0.5);

    // Chaos influence
    float chaosMod = 1.0 + uChaosLevel * 1.5; // Reduced multiplier
    
    // Combine noise
    float combinedNoise = noise1 * 0.7 + noise2 * 0.3;
    
    // Add "Breathing" / Pulse effect
    float breath = sin(t * 1.5) * 0.05 * (1.0 - uChaosLevel);

    // Calculate final displacement
    float displacement = combinedNoise * uDistortion * chaosMod + breath;
    
    // Mouse Interaction Wave
    float dist = distance(uv, uMouse * 0.5 + 0.5); 
    float mouseWave = smoothstep(0.5, 0.0, dist) * 0.1;
    displacement += mouseWave;

    vNoise = combinedNoise;
    vDisplacement = displacement;

    // Apply displacement along normal
    vec3 newPosition = position + normal * displacement;

    // Pass transformed position to fragment
    vPosition = newPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uRoughness;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDisplacement;
varying float vNoise;

void main() {
    // 1. Color Mixing
    // Mix A and B based on Noise/Displacement
    float mixVal = smoothstep(-0.5, 0.5, vNoise);
    vec3 color = mix(uColorA, uColorB, mixVal);
    
    // Add C (Highlight/Chaos color) based on peaks
    float peak = smoothstep(0.2, 0.8, vNoise);
    color = mix(color, uColorC, peak * 0.5);

    // 2. Lighting / Material Simulation
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel (Rim Light)
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.0 + uRoughness * 2.0); // Sharpness depends on roughness

    // Specular Highlight (Blinn-Phong approx)
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 32.0 * (1.0 - uRoughness));
    
    // Combine
    vec3 finalColor = color;
    finalColor += fresnel * uColorC * (1.0 - uRoughness); // Glowing edges
    finalColor += spec * 0.2;

    // 3. Post-Process / Tone
    gl_FragColor = vec4(finalColor, 1.0);
    
    // Colorspace fix
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;
