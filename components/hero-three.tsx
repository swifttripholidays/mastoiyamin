'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function HeroThree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const coreGeometry = new THREE.IcosahedronGeometry(1.45, 3);
    const core = new THREE.Mesh(
      coreGeometry,
      new THREE.MeshPhysicalMaterial({
        color: 0x6d1733,
        metalness: 0.72,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        transmission: 0.08,
      }),
    );
    sculpture.add(core);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeometry, 18),
      new THREE.LineBasicMaterial({ color: 0xd6b77b, transparent: true, opacity: 0.54 }),
    );
    sculpture.add(edges);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xead8ba,
      metalness: 0.88,
      roughness: 0.24,
    });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.035, 16, 180), ringMaterial);
    ringA.rotation.set(1.2, 0.25, 0.3);
    sculpture.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.022, 16, 180), ringMaterial);
    ringB.rotation.set(0.3, 1.18, -0.45);
    sculpture.add(ringB);

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(210 * 3);
    for (let index = 0; index < positions.length; index += 3) {
      const radius = 2.5 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 3.8;
      positions[index] = Math.cos(angle) * radius;
      positions[index + 1] = elevation;
      positions[index + 2] = Math.sin(angle) * radius;
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({ color: 0xf0dfc1, size: 0.025, transparent: true, opacity: 0.52 }),
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xf2e5d0, 1.3));
    const maroonLight = new THREE.PointLight(0xb93662, 38, 16);
    maroonLight.position.set(-3, 2.5, 4);
    scene.add(maroonLight);
    const creamLight = new THREE.PointLight(0xffe1ac, 46, 18);
    creamLight.position.set(3.5, -1, 4.5);
    scene.add(creamLight);

    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    const pointer = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', pointer, { passive: true });

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const clock = new THREE.Clock();
    const render = () => {
      const time = clock.getElapsedTime();
      sculpture.rotation.y += (pointerX * 0.62 + time * 0.13 - sculpture.rotation.y) * 0.025;
      sculpture.rotation.x += (-pointerY * 0.44 + Math.sin(time * 0.52) * 0.12 - sculpture.rotation.x) * 0.025;
      core.scale.setScalar(1 + Math.sin(time * 1.15) * 0.025);
      ringA.rotation.z += 0.0025;
      ringB.rotation.x -= 0.0018;
      stars.rotation.y = time * 0.018;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', pointer);
      coreGeometry.dispose();
      (core.material as THREE.Material).dispose();
      edges.geometry.dispose();
      (edges.material as THREE.Material).dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      ringMaterial.dispose();
      pointsGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-three-canvas" aria-hidden="true" />;
}
