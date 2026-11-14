'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

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
    sm: { width: 160, height: 160 },
    md: { width: 240, height: 240 },
    lg: { width: 360, height: 360 },
    xl: { width: 460, height: 460 }
  }[size];

  // Mouse tracking with smooth damping
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
      const camera = new THREE.PerspectiveCamera(36, dimensions.width / dimensions.height, 0.1, 100);
      camera.position.set(0, 0, 4.4);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(dimensions.width, dimensions.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      // 2. High-End Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
      scene.add(ambientLight);

      // Key light: Bright crisp white light from top-right
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
      keyLight.position.set(3.5, 4.5, 3.5);
      scene.add(keyLight);

      // Fill light: Soft cool white fill from lower-left
      const fillLight = new THREE.DirectionalLight(0xe4e4e7, 2.2);
      fillLight.position.set(-3.5, -1.5, 2.5);
      scene.add(fillLight);

      // Rim light: Intense specular rim from behind-top
      const rimLight = new THREE.DirectionalLight(0xffffff, 4.5);
      rimLight.position.set(0, 4.5, -3.5);
      scene.add(rimLight);

      // Bottom glow bounce
      const bounceLight = new THREE.DirectionalLight(0x71717a, 1.2);
      bounceLight.position.set(0, -4, 2);
      scene.add(bounceLight);

      // 3. Ultra-Premium Materials
      // Titanium Ceramic White (Apple / Futuristic Mecha Aesthetic)
      const titaniumArmorMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5f5f7,
        roughness: 0.18,
        metalness: 0.88,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.95
      });

      // Obsidian Stealth Carbon Core
      const stealthCarbonMat = new THREE.MeshPhysicalMaterial({
        color: 0x111114,
        roughness: 0.3,
        metalness: 0.94,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25
      });

      // Liquid Chrome Mirror Trim
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0.98
      });

      // Dark Gloss Visor Screen
      const visorGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x050508,
        roughness: 0.05,
        metalness: 0.92,
        transmission: 0.15,
        transparent: true,
        opacity: 0.96,
        clearcoat: 1.0
      });

      // Dynamic Visor HUD & Neon Accents
      const neonGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });

      // Reactor Core / Audio Visualizer
      const reactorGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });

      // Holographic Audio Rings
      const soundWaveMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });

      // Gyro Holographic Orbit Rings
      const gyroRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
      });

      // 4. Robot Hierarchy Setup
      const robotMasterGroup = new THREE.Group();
      scene.add(robotMasterGroup);

      // --- TORSO & SHOULDERS BUST ---
      const bustGroup = new THREE.Group();
      robotMasterGroup.add(bustGroup);

      // Main Chest Carapace (Beveled aerodynamic armor)
      const chestGeo = new THREE.CylinderGeometry(0.58, 0.44, 0.72, 8);
      const chestMesh = new THREE.Mesh(chestGeo, stealthCarbonMat);
      chestMesh.position.set(0, -0.78, 0);
      chestMesh.rotation.y = Math.PI / 8;
      bustGroup.add(chestMesh);

      // Titanium Chest Breastplate
      const chestPlateGeo = new THREE.BoxGeometry(0.74, 0.42, 0.14);
      const chestPlateMesh = new THREE.Mesh(chestPlateGeo, titaniumArmorMat);
      chestPlateMesh.position.set(0, -0.74, 0.34);
      bustGroup.add(chestPlateMesh);

      // Center Arc Reactor (Glow Core)
      const reactorCoreGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 32);
      const reactorCoreMesh = new THREE.Mesh(reactorCoreGeo, reactorGlowMat);
      reactorCoreMesh.rotation.x = Math.PI / 2;
      reactorCoreMesh.position.set(0, -0.74, 0.42);
      bustGroup.add(reactorCoreMesh);

      // Outer Chrome Reactor Bezel Ring
      const reactorRingGeo = new THREE.TorusGeometry(0.18, 0.024, 16, 36);
      const reactorRingMesh = new THREE.Mesh(reactorRingGeo, chromeMat);
      reactorRingMesh.position.set(0, -0.74, 0.42);
      bustGroup.add(reactorRingMesh);

      // Left Shoulder Pauldron
      const shoulderGeo = new THREE.SphereGeometry(0.32, 24, 18);
      shoulderGeo.scale(1.2, 0.7, 0.9);
      const shoulderLeft = new THREE.Mesh(shoulderGeo, titaniumArmorMat);
      shoulderLeft.position.set(-0.78, -0.68, 0.05);
      shoulderLeft.rotation.z = Math.PI / 7;
      bustGroup.add(shoulderLeft);

      // Right Shoulder Pauldron
      const shoulderRight = new THREE.Mesh(shoulderGeo, titaniumArmorMat);
      shoulderRight.position.set(0.78, -0.68, 0.05);
      shoulderRight.rotation.z = -Math.PI / 7;
      bustGroup.add(shoulderRight);

      // Articulated Cervical Neck Spine
      const neckGeo = new THREE.CylinderGeometry(0.22, 0.27, 0.32, 24);
      const neckMesh = new THREE.Mesh(neckGeo, stealthCarbonMat);
      neckMesh.position.set(0, -0.34, 0);
      bustGroup.add(neckMesh);

      // Neck Chrome Ring
      const neckRingGeo = new THREE.TorusGeometry(0.26, 0.025, 16, 28);
      const neckRingMesh = new THREE.Mesh(neckRingGeo, chromeMat);
      neckRingMesh.rotation.x = Math.PI / 2;
      neckRingMesh.position.set(0, -0.34, 0);
      bustGroup.add(neckRingMesh);

      // Left & Right Hydraulic Neck Pistons
      const pistonPillarGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.32, 16);
      const pistonLeft = new THREE.Mesh(pistonPillarGeo, chromeMat);
      pistonLeft.position.set(-0.28, -0.34, 0.1);
      pistonLeft.rotation.z = 0.15;
      bustGroup.add(pistonLeft);

      const pistonRight = new THREE.Mesh(pistonPillarGeo, chromeMat);
      pistonRight.position.set(0.28, -0.34, 0.1);
      pistonRight.rotation.z = -0.15;
      bustGroup.add(pistonRight);

      // --- HEAD ASSEMBLY ---
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.18, 0);
      robotMasterGroup.add(headGroup);

      // Sculpted Aerodynamic Cranium (Sphere with custom scaling)
      const craniumGeo = new THREE.SphereGeometry(0.64, 36, 28);
      craniumGeo.scale(1, 1.08, 1.12);
      const craniumMesh = new THREE.Mesh(craniumGeo, titaniumArmorMat);
      headGroup.add(craniumMesh);

      // Rear Occipital Cowling (Dark stealth carbon back)
      const rearGeo = new THREE.BoxGeometry(0.88, 0.72, 0.82);
      const rearMesh = new THREE.Mesh(rearGeo, stealthCarbonMat);
      rearMesh.position.set(0, -0.12, -0.22);
      headGroup.add(rearMesh);

      // Aerodynamic Dorsal Crest Fin
      const finGeo = new THREE.BoxGeometry(0.06, 0.28, 0.45);
      const finMesh = new THREE.Mesh(finGeo, stealthCarbonMat);
      finMesh.position.set(0, 0.72, -0.05);
      headGroup.add(finMesh);

      // Glowing Neon Fiber-Optic Fin Edge
      const finEdgeGeo = new THREE.BoxGeometry(0.04, 0.04, 0.46);
      const finEdgeMesh = new THREE.Mesh(finEdgeGeo, neonGlowMat);
      finEdgeMesh.position.set(0, 0.86, -0.05);
      headGroup.add(finEdgeMesh);

      // Curved Dark Panoramic Visor
      const visorGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.32, 36, 1, false, -Math.PI / 2.6, Math.PI / 1.3);
      const visorMesh = new THREE.Mesh(visorGeo, visorGlassMat);
      visorMesh.position.set(0, 0.08, 0.35);
      headGroup.add(visorMesh);

      // Visor Frame Bezel Chrome Trim
      const visorBezelGeo = new THREE.TorusGeometry(0.53, 0.02, 16, 36, Math.PI / 1.3);
      const visorBezelMesh = new THREE.Mesh(visorBezelGeo, chromeMat);
      visorBezelMesh.rotation.y = Math.PI / 2;
      visorBezelMesh.rotation.x = -Math.PI / 2.6;
      visorBezelMesh.position.set(0, 0.24, 0.35);
      headGroup.add(visorBezelMesh);

      // --- VISOR HUD: DIGITAL EYE & SCANNING MATRIX ---
      const hudEyeGroup = new THREE.Group();
      hudEyeGroup.position.set(0, 0.09, 0.62);
      headGroup.add(hudEyeGroup);

      // Central Cyber Eye Strip
      const eyeStripGeo = new THREE.BoxGeometry(0.58, 0.06, 0.02);
      const eyeStripMesh = new THREE.Mesh(eyeStripGeo, neonGlowMat);
      hudEyeGroup.add(eyeStripMesh);

      // Left Eye Pupil / Reticle
      const pupilGeo = new THREE.BoxGeometry(0.12, 0.09, 0.025);
      const eyeLeftPupil = new THREE.Mesh(pupilGeo, neonGlowMat);
      eyeLeftPupil.position.set(-0.17, 0, 0.01);
      hudEyeGroup.add(eyeLeftPupil);

      // Right Eye Pupil / Reticle
      const eyeRightPupil = new THREE.Mesh(pupilGeo, neonGlowMat);
      eyeRightPupil.position.set(0.17, 0, 0.01);
      hudEyeGroup.add(eyeRightPupil);

      // Cyber Ear Audio Turbines (Left & Right)
      const earGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.16, 28);
      const earLeftMesh = new THREE.Mesh(earGeo, stealthCarbonMat);
      earLeftMesh.rotation.z = Math.PI / 2;
      earLeftMesh.position.set(-0.7, 0.06, 0);
      headGroup.add(earLeftMesh);

      const earRingGeo = new THREE.TorusGeometry(0.19, 0.025, 16, 28);
      const earRingLeft = new THREE.Mesh(earRingGeo, chromeMat);
      earRingLeft.rotation.y = Math.PI / 2;
      earRingLeft.position.set(-0.78, 0.06, 0);
      headGroup.add(earRingLeft);

      // Ear Neon Ring (Pulses when hearing/speaking)
      const earGlowRingGeo = new THREE.TorusGeometry(0.13, 0.015, 16, 28);
      const earGlowLeft = new THREE.Mesh(earGlowRingGeo, neonGlowMat);
      earGlowLeft.rotation.y = Math.PI / 2;
      earGlowLeft.position.set(-0.79, 0.06, 0);
      headGroup.add(earGlowLeft);

      const earRightMesh = new THREE.Mesh(earGeo, stealthCarbonMat);
      earRightMesh.rotation.z = Math.PI / 2;
      earRightMesh.position.set(0.7, 0.06, 0);
      headGroup.add(earRightMesh);

      const earRingRight = new THREE.Mesh(earRingGeo, chromeMat);
      earRingRight.rotation.y = Math.PI / 2;
      earRingRight.position.set(0.78, 0.06, 0);
      headGroup.add(earRingRight);

      const earGlowRight = new THREE.Mesh(earGlowRingGeo, neonGlowMat);
      earGlowRight.rotation.y = Math.PI / 2;
      earGlowRight.position.set(0.79, 0.06, 0);
      headGroup.add(earGlowRight);

      // --- 5. ARTICULATED TALKING MOUTH & EQUALIZER ---
      const mouthChamberGroup = new THREE.Group();
      mouthChamberGroup.position.set(0, -0.17, 0.52);
      headGroup.add(mouthChamberGroup);

      // Mouth Cavity
      const mouthCavityGeo = new THREE.BoxGeometry(0.44, 0.14, 0.14);
      const mouthCavityMesh = new THREE.Mesh(mouthCavityGeo, stealthCarbonMat);
      mouthChamberGroup.add(mouthCavityMesh);

      // Articulated Jaw Plate (Physically drops open when talking)
      const jawGeo = new THREE.BoxGeometry(0.48, 0.18, 0.28);
      const jawMesh = new THREE.Mesh(jawGeo, titaniumArmorMat);
      jawMesh.position.set(0, -0.13, 0.08);
      mouthChamberGroup.add(jawMesh);

      // Chin Chrome Accent Plate
      const chinAccentGeo = new THREE.BoxGeometry(0.26, 0.05, 0.05);
      const chinAccentMesh = new THREE.Mesh(chinAccentGeo, chromeMat);
      chinAccentMesh.position.set(0, -0.2, 0.21);
      jawMesh.add(chinAccentMesh);

      // 5 Vocal Equalizer Frequency Bars
      const equalizerBars: THREE.Mesh[] = [];
      const numBars = 5;
      const barWidth = 0.048;
      const barSpacing = 0.074;
      const startX = -((numBars - 1) * barSpacing) / 2;

      for (let i = 0; i < numBars; i++) {
        const barGeo = new THREE.BoxGeometry(barWidth, 0.09, 0.02);
        barGeo.translate(0, 0.045, 0); // Scale up from base
        const barMesh = new THREE.Mesh(barGeo, neonGlowMat);
        barMesh.position.set(startX + i * barSpacing, -0.06, 0.08);
        mouthChamberGroup.add(barMesh);
        equalizerBars.push(barMesh);
      }

      // --- 6. HOLOGRAPHIC 3D SOUNDWAVES (Expands from mouth) ---
      const soundRingGeo = new THREE.RingGeometry(0.52, 0.56, 48);
      const soundRing1 = new THREE.Mesh(soundRingGeo, soundWaveMat);
      soundRing1.position.set(0, -0.14, 0.56);
      soundRing1.visible = false;
      headGroup.add(soundRing1);

      const soundRing2 = new THREE.Mesh(soundRingGeo, soundWaveMat);
      soundRing2.position.set(0, -0.14, 0.56);
      soundRing2.visible = false;
      headGroup.add(soundRing2);

      // --- 7. FUTURISTIC HOLOGRAPHIC GYRO ORBITS (Around the bust) ---
      const gyroGroup = new THREE.Group();
      robotMasterGroup.add(gyroGroup);

      // Gyro Ring 1 (Tilted orbit)
      const gyro1Geo = new THREE.TorusGeometry(1.22, 0.016, 16, 64);
      const gyro1Mesh = new THREE.Mesh(gyro1Geo, gyroRingMat);
      gyro1Mesh.rotation.x = Math.PI / 3;
      gyroGroup.add(gyro1Mesh);

      // Gyro Ring 2 (Opposite tilted orbit)
      const gyro2Geo = new THREE.TorusGeometry(1.36, 0.014, 16, 64);
      const gyro2Mesh = new THREE.Mesh(gyro2Geo, gyroRingMat);
      gyro2Mesh.rotation.y = Math.PI / 4;
      gyro2Mesh.rotation.x = -Math.PI / 4;
      gyroGroup.add(gyro2Mesh);

      // Ground Holographic Disc Pedestal
      const groundDiscGeo = new THREE.RingGeometry(0.72, 1.15, 64);
      const groundDiscMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide
      });
      const groundDisc = new THREE.Mesh(groundDiscGeo, groundDiscMat);
      groundDisc.rotation.x = Math.PI / 2;
      groundDisc.position.set(0, -1.32, 0);
      robotMasterGroup.add(groundDisc);

      // Ground Inner Rotating Reticle
      const groundInnerGeo = new THREE.RingGeometry(0.45, 0.52, 32);
      const groundInnerMesh = new THREE.Mesh(groundInnerGeo, gyroRingMat);
      groundInnerMesh.rotation.x = Math.PI / 2;
      groundInnerMesh.position.set(0, -1.31, 0);
      robotMasterGroup.add(groundInnerMesh);

      // Orbiting Cyber Spark Motes
      const particleCount = 36;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 2.6;
        particlePositions[i + 1] = (Math.random() - 0.5) * 2.4;
        particlePositions[i + 2] = (Math.random() - 0.5) * 1.8;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.038,
        transparent: true,
        opacity: 0.75
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      robotMasterGroup.add(particleSystem);

      // --- 8. ANIMATION RENDER LOOP (60 FPS Physics & Voice Sync) ---
      const clock = new THREE.Clock();
      let lastTime = 0;
      let frameCounter = 0;
      let fpsTimer = 0;

      const baseJawY = -0.13;

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

        // Smooth mouse damping (lerp)
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.07;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.07;

        // 1. Natural Organic Levitation Hover
        const hoverBob = Math.sin(elapsedTime * 2.2) * 0.07;
        robotMasterGroup.position.y = hoverBob;

        // 2. Head & Torso Rotation Following Mouse Cursor + Organic Drift
        const targetHeadRotY = mouseRef.current.x * 0.48;
        const targetHeadRotX = -mouseRef.current.y * 0.35;
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadRotY, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadRotX, 0.08);

        // Body torso follows head smoothly
        bustGroup.rotation.y = THREE.MathUtils.lerp(bustGroup.rotation.y, targetHeadRotY * 0.35, 0.05);

        // 3. Gyroscope Orbits Counter-Rotation
        gyro1Mesh.rotation.z = elapsedTime * 0.45;
        gyro2Mesh.rotation.y = -elapsedTime * 0.35;

        // Ground Pedestal Rotation
        groundDisc.rotation.z = elapsedTime * 0.28;
        groundInnerMesh.rotation.z = -elapsedTime * 0.55;

        // 4. Orbiting Particles rotation
        particleSystem.rotation.y = elapsedTime * 0.16;

        // 5. Reactor Core Breathing Pulse
        const reactorIntensity = 0.55 + Math.sin(elapsedTime * 3.2) * 0.4;
        reactorGlowMat.opacity = reactorIntensity;

        // --- 6. VOICE BEHAVIORS & REAL-TIME SPEECH ARTICULATION ---
        if (speaking) {
          // A) TALKING JAW ARTICULATION
          const syllableWave = 
            Math.sin(elapsedTime * 20.0) * 0.55 + 
            Math.sin(elapsedTime * 30.0) * 0.3 + 
            Math.cos(elapsedTime * 12.0) * 0.22;

          const openAmount = Math.max(0, syllableWave);

          // Jaw physically drops down and opens
          jawMesh.position.y = baseJawY - openAmount * 0.16;
          jawMesh.rotation.x = openAmount * 0.16;

          // Conversational head nods
          headGroup.rotation.x += Math.sin(elapsedTime * 8.0) * 0.035;
          headGroup.rotation.z = Math.sin(elapsedTime * 5.0) * 0.025;

          // B) INSIDE MOUTH EQUALIZER BARS
          equalizerBars.forEach((bar, idx) => {
            const barFreq = Math.abs(
              Math.sin(elapsedTime * 24.0 + idx * 1.3) * 0.7 + 
              Math.cos(elapsedTime * 34.0 - idx * 0.9) * 0.3
            );
            const scaleY = Math.max(0.2, barFreq * 2.4);
            bar.scale.y = scaleY;
          });
          neonGlowMat.opacity = 0.98;

          // C) EXPANDING HOLOGRAPHIC SOUNDWAVE RINGS
          soundRing1.visible = true;
          soundRing2.visible = true;

          const waveProgress1 = (elapsedTime * 2.0) % 1;
          soundRing1.scale.set(1 + waveProgress1 * 1.3, 1 + waveProgress1 * 1.3, 1);
          soundRing1.position.z = 0.56 + waveProgress1 * 0.45;
          (soundRing1.material as THREE.MeshBasicMaterial).opacity = (1 - waveProgress1) * 0.65;

          const waveProgress2 = ((elapsedTime * 2.0) + 0.5) % 1;
          soundRing2.scale.set(1 + waveProgress2 * 1.3, 1 + waveProgress2 * 1.3, 1);
          soundRing2.position.z = 0.56 + waveProgress2 * 0.45;
          (soundRing2.material as THREE.MeshBasicMaterial).opacity = (1 - waveProgress2) * 0.65;

          // Eye Visor Audio Pulse
          eyeStripMesh.scale.x = 1 + Math.sin(elapsedTime * 16) * 0.1;
          earGlowLeft.scale.setScalar(1 + Math.sin(elapsedTime * 18) * 0.12);
          earGlowRight.scale.setScalar(1 + Math.sin(elapsedTime * 18) * 0.12);

        } else if (listening) {
          // Attentive listening state: Curious head tilt, bright alert visor
          jawMesh.position.y = baseJawY;
          jawMesh.rotation.x = 0;
          headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.07, 0.08);

          // Equalizer calm baseline
          equalizerBars.forEach((bar) => {
            bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, 0.25, 0.1);
          });
          neonGlowMat.opacity = 0.85 + Math.sin(elapsedTime * 6) * 0.15;

          soundRing1.visible = false;
          soundRing2.visible = false;

        } else if (thinking) {
          // Neural processing: Eye pupils scanning across visor
          jawMesh.position.y = baseJawY;
          jawMesh.rotation.x = 0;

          const scanX = Math.sin(elapsedTime * 7.5) * 0.14;
          eyeLeftPupil.position.x = -0.17 + scanX;
          eyeRightPupil.position.x = 0.17 + scanX;

          equalizerBars.forEach((bar, idx) => {
            bar.scale.y = 0.3 + Math.sin(elapsedTime * 9 + idx) * 0.22;
          });
          neonGlowMat.opacity = 0.6;

          soundRing1.visible = false;
          soundRing2.visible = false;

        } else {
          // Idle state: Smooth hover, organic periodic blinking
          jawMesh.position.y = baseJawY;
          jawMesh.rotation.x = 0;
          headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.05);

          // Natural Eye Blink Cycle (every ~3.8 seconds)
          const blinkCycle = elapsedTime % 3.8;
          const isBlinking = blinkCycle < 0.13;
          const eyeScaleY = isBlinking ? 0.06 : 1.0;
          eyeLeftPupil.scale.y = eyeScaleY;
          eyeRightPupil.scale.y = eyeScaleY;
          eyeStripMesh.scale.y = eyeScaleY;

          equalizerBars.forEach((bar) => {
            bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, 0.15, 0.08);
          });
          neonGlowMat.opacity = 0.75;

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
            ? 'bg-white/20 scale-125' 
            : isListening 
              ? 'bg-cyan-500/20 scale-115' 
              : isThinking 
                ? 'bg-amber-400/20 scale-110' 
                : 'bg-white/5 scale-100'
        }`} 
      />

      {/* Outer Cyber Reticle Ring */}
      <div 
        className={`absolute inset-1 rounded-full border border-dashed transition-all duration-500 pointer-events-none ${
          isSpeaking 
            ? 'border-white/40 animate-[spin_18s_linear_infinite]' 
            : isListening 
              ? 'border-cyan-400/50 animate-[spin_12s_linear_infinite]' 
              : 'border-white/10'
        }`} 
      />

      {/* Inner Accent Ring */}
      <div 
        className={`absolute inset-4 rounded-full border border-white/10 transition-all duration-700 pointer-events-none ${
          isSpeaking ? 'border-white/30 scale-105' : 'scale-100'
        }`} 
      />

      {/* Three.js 3D WebGL Canvas */}
      {!webglError ? (
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="relative z-10 block w-full h-full drop-shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        // Fallback Animated Vector Robot
        <div className="relative z-10 w-48 h-48 rounded-full bg-neutral-900/90 border border-white/20 flex flex-col items-center justify-center p-4">
          <div className={`w-28 h-24 rounded-2xl bg-neutral-800 border-2 ${isSpeaking ? 'border-white animate-pulse' : 'border-white/30'} flex flex-col items-center justify-center gap-2 relative`}>
            <div className={`w-18 h-3.5 rounded-full ${isSpeaking ? 'bg-white shadow-[0_0_12px_#ffffff]' : isListening ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
            <div className={`w-10 h-2.5 rounded ${isSpeaking ? 'bg-white animate-[bounce_0.3s_infinite]' : 'bg-neutral-700'}`} />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 mt-2 font-bold">ZENTRION-CORE-3D</span>
        </div>
      )}

      {/* Floating State Badge / Mic Control Overlay */}
      {showTelemetry && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-wider text-white shadow-2xl whitespace-nowrap">
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
