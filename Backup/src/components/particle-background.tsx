'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { initParticlesEngine } from '@tsparticles/react';
import { loadAll } from '@tsparticles/all';

export function ParticleBackground() {
  const [isEnabled, setIsEnabled] = useState(true);

  // ✅ Initialize engine properly for v3
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadAll(engine);
    });
  }, []);

  // Accessibility preference: reduced motion disables the effect
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsEnabled(!motionQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsEnabled(!e.matches);
    };

    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, []);

  if (!isEnabled) return null;
  const particleOptions: any = {
    fullScreen: false,
    background: { color: { value: 'rgba(0, 0, 0, 0)' } },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
        resize: true,
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.5 } },
      },
    },
    particles: {
      color: { value: '#FFCA2C' },
      links: {
        color: '#FFCA2C',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        speed: 1,
      },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: {
        value: 0.5,
        random: true,
        animation: { enable: true, speed: 0.5, minimumValue: 0.1 },
      },
      shape: { type: 'circle' },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 2, minimumValue: 0.1 },
      },
    },
    detectRetina: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    responsive: [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: { value: 20 },
            links: { enable: false },
          },
        },
      },
    ],
  }

  return <Particles id="tsparticles" className="pointer-events-none fixed inset-0 -z-10" options={particleOptions} />;
}
