import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import "./LightPillar.css";

const LightPillar = ({
  topColor = "#5227FF",
  midColor = null,
  bottomColor = "#FF9FFC",
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = "",
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = "screen",
  pillarRotation = 116,
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const geometryRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);
  const targetColorsRef = useRef({
    top: new THREE.Color(topColor),
    mid: new THREE.Color(midColor ?? bottomColor),
    bottom: new THREE.Color(bottomColor),
  });
  const currentColorsRef = useRef({
    top: new THREE.Color(topColor),
    mid: new THREE.Color(midColor ?? bottomColor),
    bottom: new THREE.Color(bottomColor),
  });
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL support once
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebGLSupported(false);
      console.warn("WebGL is not supported in this browser");
    }
  }, []);

  // Update target colors and non-structural uniforms — no renderer rebuild
  useEffect(() => {
    targetColorsRef.current.top.set(topColor);
    targetColorsRef.current.bottom.set(bottomColor);
    targetColorsRef.current.mid.set(midColor ?? bottomColor);

    if (materialRef.current) {
      materialRef.current.uniforms.uIntensity.value = intensity;
      materialRef.current.uniforms.uGlowAmount.value = glowAmount;
      materialRef.current.uniforms.uPillarRotation.value = pillarRotation;
    }
  }, [topColor, midColor, bottomColor, intensity, glowAmount, pillarRotation]);

  // Main renderer setup — only rebuilds on structural changes
  useEffect(() => {
    if (!containerRef.current || !webGLSupported) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Sync color refs in case props changed before mount
    targetColorsRef.current.top.set(topColor);
    targetColorsRef.current.mid.set(midColor ?? bottomColor);
    targetColorsRef.current.bottom.set(bottomColor);
    currentColorsRef.current.top.set(topColor);
    currentColorsRef.current.mid.set(midColor ?? bottomColor);
    currentColorsRef.current.bottom.set(bottomColor);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        precision: "mediump",
        stencil: false,
        depth: false,
      });
    } catch (error) {
      console.error("Failed to create WebGL renderer:", error);
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const parseColor = (hex) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uMidColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uPillarRotation;
      varying vec2 vUv;

      const float PI = 3.141592653589793;
      const float EPSILON = 0.001;
      const float E = 2.71828182845904523536;
      const float HALF = 0.5;

      mat2 rot(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      float noise(vec2 coord) {
        float G = E;
        vec2 r = (G * sin(G * coord));
        return fract(r.x * r.y * (1.0 + coord.x));
      }

      vec3 applyWaveDeformation(vec3 pos, float timeOffset) {
        float frequency = 1.0;
        float amplitude = 1.0;
        vec3 deformed = pos;
        for (float i = 0.0; i < 4.0; i++) {
          deformed.xz *= rot(0.4);
          float phase = timeOffset * i * 2.0;
          vec3 oscillation = cos(deformed.zxy * frequency - phase);
          deformed += oscillation * amplitude;
          frequency *= 2.0;
          amplitude *= HALF;
        }
        return deformed;
      }

      float blendMin(float a, float b, float k) {
        float scaledK = k * 4.0;
        float h = max(scaledK - abs(a - b), 0.0);
        return min(a, b) - h * h * 0.25 / scaledK;
      }

      float blendMax(float a, float b, float k) {
        return -blendMin(-a, -b, k);
      }

      void main() {
        vec2 fragCoord = vUv * uResolution;
        vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;

        float rotAngle = uPillarRotation * PI / 180.0;
        uv *= rot(rotAngle);

        vec3 origin = vec3(0.0, 0.0, -10.0);
        vec3 direction = normalize(vec3(uv, 1.0));

        float maxDepth = 50.0;
        float depth = 0.1;

        mat2 rotX = rot(uTime * 0.3);
        if (uInteractive && length(uMouse) > 0.0) {
          rotX = rot(uMouse.x * PI * 2.0);
        }

        vec3 color = vec3(0.0);

        // Reduced to 70 iterations — good quality/perf balance
        for (float i = 0.0; i < 70.0; i++) {
          vec3 pos = origin + direction * depth;
          pos.xz *= rotX;

          vec3 deformed = pos;
          deformed.y *= uPillarHeight;
          deformed = applyWaveDeformation(deformed + vec3(0.0, uTime, 0.0), uTime);

          vec2 cosinePair = cos(deformed.xz);
          float fieldDistance = length(cosinePair) - 0.2;

          float radialBound = length(pos.xz) - uPillarWidth;
          fieldDistance = blendMax(radialBound, fieldDistance, 1.0);
          fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

          float t = smoothstep(15.0, -15.0, pos.y);

          vec3 gradient;
          if (t < 0.5) {
            gradient = mix(uBottomColor, uMidColor, t * 2.0);
          } else {
            gradient = mix(uMidColor, uTopColor, (t - 0.5) * 2.0);
          }

          color += gradient * pow(1.0 / fieldDistance, 1.0);

          if (fieldDistance < EPSILON || depth > maxDepth) break;
          depth += fieldDistance;
        }

        float widthNormalization = uPillarWidth / 3.0;
        color = tanh(color * uGlowAmount / widthNormalization);

        float rnd = noise(gl_FragCoord.xy);
        color -= rnd / 15.0 * uNoiseIntensity;

        gl_FragColor = vec4(color * uIntensity, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uMidColor: { value: parseColor(midColor ?? bottomColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uPillarRotation: { value: pillarRotation },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;
    scene.add(new THREE.Mesh(geometry, material));

    // Mouse interaction — throttled to ~60fps
    let mouseMoveTimeout = null;
    const handleMouseMove = (event) => {
      if (!interactive || mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        mouseMoveTimeout = null;
      }, 16);
      const rect = container.getBoundingClientRect();
      mouseRef.current.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
    };

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
    }

    // Animation loop
    let lastTime = performance.now();
    const targetFPS = window.innerWidth <= 768 ? 30 : 60;
    const frameTime = 1000 / targetFPS;
    const LERP_FACTOR = 0.12;

    const animate = (currentTime) => {
      if (
        !materialRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current
      )
        return;

      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameTime) {
        timeRef.current += 0.016 * rotationSpeed;
        materialRef.current.uniforms.uTime.value = timeRef.current;

        // Smooth color interpolation
        const cur = currentColorsRef.current;
        const tgt = targetColorsRef.current;
        cur.top.lerp(tgt.top, LERP_FACTOR);
        cur.mid.lerp(tgt.mid, LERP_FACTOR);
        cur.bottom.lerp(tgt.bottom, LERP_FACTOR);

        materialRef.current.uniforms.uTopColor.value.set(
          cur.top.r,
          cur.top.g,
          cur.top.b,
        );
        materialRef.current.uniforms.uMidColor.value.set(
          cur.mid.r,
          cur.mid.g,
          cur.mid.b,
        );
        materialRef.current.uniforms.uBottomColor.value.set(
          cur.bottom.r,
          cur.bottom.g,
          cur.bottom.b,
        );

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        lastTime = currentTime - (deltaTime % frameTime);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Resize handler — debounced
    let resizeTimeout = null;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (
          !rendererRef.current ||
          !materialRef.current ||
          !containerRef.current
        )
          return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        rendererRef.current.setSize(w, h);
        materialRef.current.uniforms.uResolution.value.set(w, h);
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout); // fix memory leak
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(mouseMoveTimeout); // fix memory leak
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      materialRef.current?.dispose();
      geometryRef.current?.dispose();

      rendererRef.current = null;
      materialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      geometryRef.current = null;
      rafRef.current = null;
    };
  }, [
    rotationSpeed,
    interactive,
    pillarWidth,
    pillarHeight,
    noiseIntensity,
    webGLSupported,
  ]);

  if (!webGLSupported) {
    return (
      <div
        className={`light-pillar-fallback ${className}`}
        style={{ mixBlendMode }}
      >
        WebGL not supported
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`light-pillar-container ${className}`}
      style={{ mixBlendMode }}
    />
  );
};

export default LightPillar;
