'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, Mic, Volume2, Eye } from 'lucide-react';

interface Robot3DAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  isMuted?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  showTelemetry?: boolean;
}

export default function Robot3DAvatar({
  isSpeaking,
  isListening,
  isThinking,
  isMuted = false,
  size = 'lg',
  className = '',
  onClick,
  showTelemetry = true
}: Robot3DAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglError, setWebglError] = useState(false);
  const [fps, setFps] = useState(60);

  // Sync state refs so the requestAnimationFrame loop always reads live values without re-mounting
  const isSpeakingRef = useRef(isSpeaking);
  const isListeningRef = useRef(isListening);
  const isThinkingRef = useRef(isThinking);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Size configurations
  const dimensions = {
    sm: { width: 140, height: 140 },
    md: { width: 220, height: 220 },
    lg: { width: 320, height: 320 },
    xl: { width: 420, height: 420 }
  }[size];

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animFrameId: number;

    try {
      // 1. Scene & Camera Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, dimensions.width / dimensions.height, 0.1, 100);
      camera.position.set(0, 0, 4.3);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(dimensions.width, dimensions.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      // 2. High-Tech Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      // Key light: Bright crisp white from top-right
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
      keyLight.position.set(3, 4, 3);
      scene.add(keyLight);

      // Fill light: Soft cool fill from bottom-left
      const fillLight = new THREE.DirectionalLight(0xd4d4d8, 1.6);
      fillLight.position.set(-3, -1, 2);
      scene.add(fillLight);

      // Rim light: Intense specular rim from behind-top
      const rimLight = new THREE.DirectionalLight(0xffffff, 4.0);
      rimLight.position.set(0, 4, -3);
      scene.add(rimLight);

      // 3. Materials
      // Titanium White Armor Shell
      const titaniumWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xededed,
        roughness: 0.22,
        metalness: 0.85,
        envMapIntensity: 1.0
      });

      // Stealth Obsidian Carbon Core
      const stealthCarbonMat = new THREE.MeshStandardMaterial({
        color: 0x141416,
        roughness: 0.35,
        metalness: 0.92
      });

      // Chrome Mirror Trim
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.98
      });

      // Dark Glass Visor Screen
      const visorGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x050508,
        roughness: 0.08,
        metalness: 0.9,
        transmission: 0.2,
        transparent: true,
        opacity: 0.95
      });

      // Dynamic Visor Glow Material
      const visorGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });

      // Mouth Equalizer Frequency Bars Material
      const mouthGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });

      // Core Reactor LED Material
      const reactorGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85
      });

      // Holographic Audio Rings Material
      const soundWaveMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      // 4. Robot Hierarchy Setup
      const robotMasterGroup = new THREE.Group();
      scene.add(robotMasterGroup);

      // --- Torso / Chest Assembly ---
      const torsoGroup = new THREE.Group();
      robotMasterGroup.add(torsoGroup);

      // Main Chest Carapace (beveled trapezoid shape)
      const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.65, 6);
      const chestMesh = new THREE.Mesh(chestGeo, stealthCarbonMat);
      chestMesh.position.set(0, -0.75, 0);
      chestMesh.rotation.y = Math.PI / 6;
      torsoGroup.add(chestMesh);

      // Front Armor Plate (Titanium White)
      const chestPlateGeo = new THREE.BoxGeometry(0.68, 0.38, 0.12);
      const chestPlateMesh = new THREE.Mesh(chestPlateGeo, titaniumWhiteMat);
      chestPlateMesh.position.set(0, -0.72, 0.32);
      torsoGroup.add(chestPlateMesh);

      // Center Reactor Core (Pulsing Heart)
      const reactorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32);
      const reactorMesh = new THREE.Mesh(reactorGeo, reactorGlowMat);
      reactorMesh.rotation.x = Math.PI / 2;
      reactorMesh.position.set(0, -0.72, 0.39);
      torsoGroup.add(reactorMesh);

      // Reactor Ring
      const reactorRingGeo = new THREE.TorusGeometry(0.15, 0.02, 16, 32);
      const reactorRingMesh = new THREE.Mesh(reactorRingGeo, chromeMat);
      reactorRingMesh.position.set(0, -0.72, 0.39);
      torsoGroup.add(reactorRingMesh);

      // Collar / Neck Hydraulics
      const neckGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.28, 24);
      const neckMesh = new THREE.Mesh(neckGeo, stealthCarbonMat);
      neckMesh.position.set(0, -0.34, 0);
      torsoGroup.add(neckMesh);

      const neckRingGeo = new THREE.TorusGeometry(0.24, 0.025, 16, 24);
      const neckRingMesh = new THREE.Mesh(neckRingGeo, chromeMat);
      neckRingMesh.rotation.x = Math.PI / 2;
      neckRingMesh.position.set(0, -0.34, 0);
      torsoGroup.add(neckRingMesh);

      // --- Head Assembly ---
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.18, 0);
      robotMasterGroup.add(headGroup);

      // Skull Cranium (Curved titanium top)
      const craniumGeo = new THREE.SphereGeometry(0.62, 32, 24);
      craniumGeo.scale(1, 1.05, 1.08);
      const craniumMesh = new THREE.Mesh(craniumGeo, titaniumWhiteMat);
      headGroup.add(craniumMesh);

      // Rear/Jaw stealth underside
      const rearGeo = new THREE.BoxGeometry(0.85, 0.65, 0.75);
      const rearMesh = new THREE.Mesh(rearGeo, stealthCarbonMat);
      rearMesh.position.set(0, -0.15, -0.18);
      headGroup.add(rearMesh);

      // Visor Screen Base (Curved dark screen across front)
      const visorGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.28, 32, 1, false, -Math.PI / 2.6, Math.PI / 1.3);
      const visorMesh = new THREE.Mesh(visorGeo, visorGlassMat);
      visorMesh.position.set(0, 0.08, 0.32);
      headGroup.add(visorMesh);

      // Visor Glowing Cyber Eye Eyes/Strip
      const eyeStripGeo = new THREE.BoxGeometry(0.55, 0.065, 0.02);
      const eyeStripMesh = new THREE.Mesh(eyeStripGeo, visorGlowMat);
      eyeStripMesh.position.set(0, 0.09, 0.58);
      headGroup.add(eyeStripMesh);

      // Dual Eye Pupils for expressive focus
      const eyeLeftGeo = new THREE.BoxGeometry(0.11, 0.08, 0.025);
      const eyeLeftMesh = new THREE.Mesh(eyeLeftGeo, visorGlowMat);
      eyeLeftMesh.position.set(-0.16, 0.09, 0.59);
      headGroup.add(eyeLeftMesh);

      const eyeRightGeo = new THREE.BoxGeometry(0.11, 0.08, 0.025);
      const eyeRightMesh = new THREE.Mesh(eyeRightGeo, visorGlowMat);
      eyeRightMesh.position.set(0.16, 0.09, 0.59);
      headGroup.add(eyeRightMesh);

      // Ear Audio Sensor Pods (Left & Right)
      const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 24);
      const earLeftMesh = new THREE.Mesh(earGeo, stealthCarbonMat);
      earLeftMesh.rotation.z = Math.PI / 2;
      earLeftMesh.position.set(-0.66, 0.06, 0);
      headGroup.add(earLeftMesh);

      const earLeftRingGeo = new THREE.TorusGeometry(0.17, 0.02, 16, 24);
      const earLeftRingMesh = new THREE.Mesh(earLeftRingGeo, chromeMat);
      earLeftRingMesh.rotation.y = Math.PI / 2;
      earLeftRingMesh.position.set(-0.74, 0.06, 0);
      headGroup.add(earLeftRingMesh);

      const earRightMesh = new THREE.Mesh(earGeo, stealthCarbonMat);
      earRightMesh.rotation.z = Math.PI / 2;
      earRightMesh.position.set(0.66, 0.06, 0);
      headGroup.add(earRightMesh);

      const earRightRingMesh = new THREE.Mesh(earLeftRingGeo, chromeMat);
      earRightRingMesh.rotation.y = Math.PI / 2;
      earRightRingMesh.position.set(0.74, 0.06, 0);
      headGroup.add(earRightRingMesh);

      // Top Antenna / Neural Crest
      const antennaBaseGeo = new THREE.BoxGeometry(0.08, 0.18, 0.28);
      const antennaBaseMesh = new THREE.Mesh(antennaBaseGeo, stealthCarbonMat);
      antennaBaseMesh.position.set(0, 0.68, 0.05);
      headGroup.add(antennaBaseMesh);

      const crestTipGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.22, 16);
      const crestTipMesh = new THREE.Mesh(crestTipGeo, chromeMat);
      crestTipMesh.position.set(0, 0.82, 0.05);
      headGroup.add(crestTipMesh);

      // --- 5. THE ARTICULATED TALKING MOUTH & SOUND EQUALIZER ---
      const mouthChamberGroup = new THREE.Group();
      mouthChamberGroup.position.set(0, -0.16, 0.48);
      headGroup.add(mouthChamberGroup);

      // Mouth Chamber Cavity (Dark recessed interior)
      const mouthCavityGeo = new THREE.BoxGeometry(0.42, 0.14, 0.12);
      const mouthCavityMesh = new THREE.Mesh(mouthCavityGeo, stealthCarbonMat);
      mouthChamberGroup.add(mouthCavityMesh);

      // Articulated Lower Jaw Carapace (drops and articulates when speaking)
      const jawGeo = new THREE.BoxGeometry(0.46, 0.16, 0.25);
      const jawMesh = new THREE.Mesh(jawGeo, titaniumWhiteMat);
      jawMesh.position.set(0, -0.12, 0.06);
      mouthChamberGroup.add(jawMesh);

      // Jaw Chin Accent
      const chinAccentGeo = new THREE.BoxGeometry(0.24, 0.04, 0.04);
      const chinAccentMesh = new THREE.Mesh(chinAccentGeo, chromeMat);
      chinAccentMesh.position.set(0, -0.18, 0.18);
      jawMesh.add(chinAccentMesh);

      // Inside Mouth Holographic Soundwave Equalizer Bars (5 audio spectrum columns)
      const equalizerBars: THREE.Mesh[] = [];
      const numBars = 5;
      const barWidth = 0.045;
      const barSpacing = 0.07;
      const startX = -((numBars - 1) * barSpacing) / 2;

      for (let i = 0; i < numBars; i++) {
        const barGeo = new THREE.BoxGeometry(barWidth, 0.08, 0.02);
        // Translate geometry origin to bottom so it scales upwards naturally
        barGeo.translate(0, 0.04, 0);
        const barMesh = new THREE.Mesh(barGeo, mouthGlowMat);
        barMesh.position.set(startX + i * barSpacing, -0.06, 0.07);
        mouthChamberGroup.add(barMesh);
        equalizerBars.push(barMesh);
      }

      // --- 6. HOLOGRAPHIC SOUNDWAVE RIPPLES (Expands when speaking) ---
      const soundRingGeo = new THREE.RingGeometry(0.5, 0.54, 48);
      const soundRing1 = new THREE.Mesh(soundRingGeo, soundWaveMat);
      soundRing1.position.set(0, -0.12, 0.52);
      soundRing1.visible = false;
      headGroup.add(soundRing1);

      const soundRing2 = new THREE.Mesh(soundRingGeo, soundWaveMat);
      soundRing2.position.set(0, -0.12, 0.52);
      soundRing2.visible = false;
      headGroup.add(soundRing2);

      // Floating Holographic Ground Disc
      const groundDiscGeo = new THREE.RingGeometry(0.65, 0.95, 48);
      const groundDiscMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });
      const groundDisc = new THREE.Mesh(groundDiscGeo, groundDiscMat);
      groundDisc.rotation.x = Math.PI / 2;
      groundDisc.position.set(0, -1.25, 0);
      robotMasterGroup.add(groundDisc);

      // Orbiting Telemetry Particles (Floating cyber motes)
      const particleCount = 28;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 2.2;
        particlePositions[i + 1] = (Math.random() - 0.5) * 2.2;
        particlePositions[i + 2] = (Math.random() - 0.5) * 1.5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.03,
        transparent: true,
        opacity: 0.65
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      robotMasterGroup.add(particleSystem);

      // 7. ANIMATION RENDER LOOP (60 FPS Physics & Voice Sync)
      const clock = new THREE.Clock();
      let lastTime = 0;
      let frameCounter = 0;
      let fpsTimer = 0;

      const baseJawY = -0.12;

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        const delta = elapsedTime - lastTime;
        lastTime = elapsedTime;

        // FPS calculation
        frameCounter++;
        fpsTimer += delta;
        if (fpsTimer >= 1.0) {
          setFps(frameCounter);
          frameCounter = 0;
          fpsTimer = 0;
        }

        const speaking = isSpeakingRef.current;
        const listening = isListeningRef.current;
        const thinking = isThinkingRef.current;
        const muted = isMutedRef.current;

        // Smooth mouse damping (lerp)
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

        // 1. Natural Levitation / Breathing Hover
        const hoverBob = Math.sin(elapsedTime * 2.2) * 0.06;
        robotMasterGroup.position.y = hoverBob;

        // 2. Head & Torso Rotation Following Mouse Cursor + Organic Drift
        const targetHeadRotY = mouseRef.current.x * 0.45;
        const targetHeadRotX = -mouseRef.current.y * 0.32;
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadRotY, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadRotX, 0.08);

        // Body follows head slightly
        robotMasterGroup.rotation.y = THREE.MathUtils.lerp(robotMasterGroup.rotation.y, targetHeadRotY * 0.4, 0.05);

        // 3. Ground Disc rotation
        groundDisc.rotation.z = elapsedTime * 0.35;

        // 4. Orbiting Particles rotation
        particleSystem.rotation.y = elapsedTime * 0.15;

        // 5. Reactor Core Breathing Pulse
        const reactorIntensity = 0.5 + Math.sin(elapsedTime * 3) * 0.35;
        reactorGlowMat.opacity = reactorIntensity;

        // --- 6. VOICE BEHAVIORS & REAL-TIME SPEECH ARTICULATION ---
        if (speaking) {
          // A) TALKING JAW ARTICULATION
          // Multi-frequency harmonic wave simulates human phonetic syllabic cadence
          const syllableWave = 
            Math.sin(elapsedTime * 19.0) * 0.55 + 
            Math.sin(elapsedTime * 29.0) * 0.28 + 
            Math.cos(elapsedTime * 11.5) * 0.22;

          const openAmount = Math.max(0, syllableWave);

          // Jaw physically drops down and rotates open
          jawMesh.position.y = baseJawY - openAmount * 0.14;
          jawMesh.rotation.x = openAmount * 0.14;

          // Natural conversational head nods while talking
          headGroup.rotation.x += Math.sin(elapsedTime * 7.5) * 0.035;
          headGroup.rotation.z = Math.sin(elapsedTime * 4.5) * 0.025;

          // B) INSIDE MOUTH EQUALIZER FREQUENCY BARS
          // Each bar dynamically pulses like a high-tech vocal visualizer
          equalizerBars.forEach((bar, idx) => {
            const barFreq = Math.abs(
              Math.sin(elapsedTime * 22.0 + idx * 1.3) * 0.7 + 
              Math.cos(elapsedTime * 31.0 - idx * 0.8) * 0.3
            );
            const scaleY = Math.max(0.2, barFreq * 2.2);
            bar.scale.y = scaleY;
          });
          mouthGlowMat.opacity = 0.95;

          // C) EXPANDING HOLOGRAPHIC SOUNDWAVES
          soundRing1.visible = true;
          soundRing2.visible = true;

          const waveProgress1 = (elapsedTime * 1.8) % 1;
          soundRing1.scale.set(1 + waveProgress1 * 1.2, 1 + waveProgress1 * 1.2, 1);
          soundRing1.position.z = 0.55 + waveProgress1 * 0.4;
          (soundRing1.material as THREE.MeshBasicMaterial).opacity = (1 - waveProgress1) * 0.6;

          const waveProgress2 = ((elapsedTime * 1.8) + 0.5) % 1;
          soundRing2.scale.set(1 + waveProgress2 * 1.2, 1 + waveProgress2 * 1.2, 1);
          soundRing2.position.z = 0.55 + waveProgress2 * 0.4;
          (soundRing2.material as THREE.MeshBasicMaterial).opacity = (1 - waveProgress2) * 0.6;

          // Eye Visor glow audio-reactive pulse
          visorGlowMat.opacity = 0.7 + Math.sin(elapsedTime * 16) * 0.3;
          eyeStripMesh.scale.x = 1 + Math.sin(elapsedTime * 14) * 0.08;

        } else if (listening) {
          // Attentive listening state: Head tilts curiously, eye visor steady bright
          jawMesh.position.y = baseJawY;
          jawMesh.rotation.x = 0;
          headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.06, 0.08);

          // Equalizer bars calm flat line
          equalizerBars.forEach((bar) => {
            bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, 0.25, 0.1);
          });
          mouthGlowMat.opacity = 0.4;

          // Visor radar listening pulse
          visorGlowMat.opacity = 0.85 + Math.sin(elapsedTime * 6) * 0.15;
          soundRing1.visible = false;
          soundRing2.visible = false;

        } else if (thinking) {
          // Neural processing state: Scanning eyes, head floating gently
          jawMesh.position.y = baseJawY;
          jawMesh.rotation.x = 0;

          // Scanning sweep on visor pupils
          const scanX = Math.sin(elapsedTime * 7.0) * 0.12;
          eyeLeftMesh.position.x = -0.16 + scanX;
          eyeRightMesh.position.x = 0.16 + scanX;

          equalizerBars.forEach((bar, idx) => {
            bar.scale.y = 0.3 + Math.sin(elapsedTime * 8 + idx) * 0.2;
          });
          mouthGlowMat.opacity = 0.5;

          soundRing1.visible = false;
          soundRing2.visible = false;

        } else {
          // Idle state: Calm hovering, closed mouth, natural eye blinks
          jawMesh.position.y = baseJawY;
          jawMesh.rotation.x = 0;
          headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.05);

          // Periodic Eye Blinking (every ~4 seconds)
          const blinkCycle = elapsedTime % 4.0;
          const isBlinking = blinkCycle < 0.14;
          const eyeScaleY = isBlinking ? 0.05 : 1.0;
          eyeLeftMesh.scale.y = eyeScaleY;
          eyeRightMesh.scale.y = eyeScaleY;
          eyeStripMesh.scale.y = eyeScaleY;

          equalizerBars.forEach((bar) => {
            bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, 0.15, 0.08);
          });
          mouthGlowMat.opacity = 0.25;

          visorGlowMat.opacity = 0.7;
          soundRing1.visible = false;
          soundRing2.visible = false;
        }

        // Render Frame
        renderer?.render(scene, camera);
      };

      animate();

      // Cleanup
      return () => {
        cancelAnimationFrame(animFrameId);
        renderer?.dispose();
        scene.clear();
      };
    } catch (err) {
      console.error('[Robot3DAvatar] WebGL initialization failed:', err);
      setWebglError(true);
    }
  }, [dimensions.width, dimensions.height]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className} ${onClick ? 'cursor-pointer group' : ''}`}
      style={{ width: dimensions.width, height: dimensions.height }}
      title={onClick ? 'Kattints a beszédfelismerés ki/be kapcsolásához' : undefined}
    >
      {/* Ambient Radial Spotlight behind the robot */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none blur-3xl ${
          isSpeaking 
            ? 'bg-white/15 scale-125' 
            : isListening 
              ? 'bg-cyan-500/15 scale-115' 
              : isThinking 
                ? 'bg-amber-400/15 scale-110' 
                : 'bg-white/5 scale-100'
        }`} 
      />

      {/* Outer Cyber Reticle Ring */}
      <div 
        className={`absolute inset-1 rounded-full border border-dashed transition-all duration-500 pointer-events-none ${
          isSpeaking 
            ? 'border-white/30 animate-[spin_18s_linear_infinite]' 
            : isListening 
              ? 'border-cyan-400/40 animate-[spin_12s_linear_infinite]' 
              : 'border-white/10'
        }`} 
      />

      {/* Three.js 3D WebGL Canvas */}
      {!webglError ? (
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="relative z-10 block w-full h-full drop-shadow-[0_12px_36px_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        // Fallback Animated Vector Robot in case WebGL is unavailable
        <div className="relative z-10 w-44 h-44 rounded-full bg-neutral-900/90 border border-white/20 flex flex-col items-center justify-center p-4">
          <div className={`w-24 h-20 rounded-2xl bg-neutral-800 border-2 ${isSpeaking ? 'border-white animate-pulse' : 'border-white/30'} flex flex-col items-center justify-center gap-2 relative`}>
            {/* Glowing Visor */}
            <div className={`w-16 h-3 rounded-full ${isSpeaking ? 'bg-white shadow-[0_0_12px_#ffffff]' : isListening ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
            {/* Animated Mouth */}
            <div className={`w-8 h-2 rounded ${isSpeaking ? 'bg-white animate-[bounce_0.3s_infinite]' : 'bg-neutral-700'}`} />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-2">ZENTRION-CORE-3D</span>
        </div>
      )}

      {/* Floating State Badge / Mic Control Overlay */}
      {showTelemetry && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/90 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-wider text-white shadow-xl whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              isSpeaking ? 'bg-white opacity-75' : isListening ? 'bg-cyan-400 opacity-75' : isThinking ? 'bg-amber-400 opacity-75' : 'bg-neutral-500 opacity-50'
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isSpeaking ? 'bg-white' : isListening ? 'bg-cyan-400' : isThinking ? 'bg-amber-400' : 'bg-neutral-400'
            }`} />
          </span>
          <span>
            {isSpeaking 
              ? 'BESZÉL [AUDIO TRANSMIT]' 
              : isListening 
                ? 'HALLGAT [LISTENING]' 
                : isThinking 
                  ? 'FELDOLGOZÁS...' 
                  : 'KÉSZENLÉT [STANDBY]'}
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">{fps} FPS</span>
        </div>
      )}
    </div>
  );
}
