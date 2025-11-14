"use client";

import { useEffect, useRef, useState } from "react";

type Ring = {
  radiusRatio: number;
  thickness: number;
  rotation: number;
  speed: number;
  direction: 1 | -1;
};

type CodeGlyph = {
  angle: number;
  speed: number;
  char: string;
  alpha: number;
  life: number;
  maxLife: number;
};

type FlowFragment = {
  angle: number;
  radiusRatio: number;
  speed: number;
  char: string;
  alpha: number;
  life: number;
  maxLife: number;
};

type Pulse = {
  active: boolean;
  progress: number;
  duration: number;
  cooldown: number;
  timer: number;
};

export const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const ringsRef = useRef<Ring[]>([]);
  const glyphsRef = useRef<CodeGlyph[]>([]);
  const flowsRef = useRef<FlowFragment[]>([]);
  const pulseRef = useRef<Pulse>({
    active: false,
    progress: 0,
    duration: 1600,
    cooldown: 0,
    timer: 0,
  });

  const mouseRef = useRef({ x: 0, y: 0 });
  const idleRef = useRef(false);
  const lastInteractionRef = useRef(performance.now());
  const lowPowerRef = useRef<boolean>(
    typeof navigator !== "undefined" &&
      "connection" in navigator &&
      // @ts-expect-error - saveData is experimental
      Boolean(navigator.connection?.saveData),
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      initRings();
      initGlyphs();
      initFlows();
      initPulse();
    };

    const initRings = () => {
      ringsRef.current = [
        { radiusRatio: 0.3, thickness: 28, rotation: 0, speed: 0.0035, direction: 1 },
        { radiusRatio: 0.5, thickness: 36, rotation: 0, speed: 0.0025, direction: -1 },
        { radiusRatio: 0.78, thickness: 18, rotation: 0, speed: 0.0015, direction: 1 },
      ];
    };

    const glyphChars = ["0", "1", "{", "}", "/", "\\", ".", ";", ":", "_", "|"];

    const initGlyphs = () => {
      const count = 80;
      const glyphs: CodeGlyph[] = [];
      for (let i = 0; i < count; i++) {
        glyphs.push({
          angle: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.004,
          char: glyphChars[Math.floor(Math.random() * glyphChars.length)],
          alpha: 0.05 + Math.random() * 0.05,
          life: 0,
          maxLife: 2000 + Math.random() * 2000,
        });
      }
      glyphsRef.current = glyphs;
    };

    const flowChars = ["·", "/", "-", "'", ":", "0", "1"];

    const initFlows = () => {
      const count = 90;
      const flows: FlowFragment[] = [];
      for (let i = 0; i < count; i++) {
        flows.push({
          angle: Math.random() * Math.PI * 2,
          radiusRatio: 0.35 + Math.random() * 0.4,
          speed: 0.004 + Math.random() * 0.006,
          char: flowChars[Math.floor(Math.random() * flowChars.length)],
          alpha: 0.08 + Math.random() * 0.08,
          life: Math.random() * 800,
          maxLife: 500 + Math.random() * 800,
        });
      }
      flowsRef.current = flows;
    };

    const initPulse = () => {
      pulseRef.current = {
        active: false,
        progress: 0,
        duration: 1600,
        cooldown: 3000 + Math.random() * 2000,
        timer: 0,
      };
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      lastInteractionRef.current = performance.now();
      idleRef.current = false;
    };

    const handleVisibility = () => {
      lowPowerRef.current = document.visibilityState !== "visible";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibility);

    let lastTime = performance.now();

    const draw = (time: number) => {
      const delta = Math.min(time - lastTime, 60);
      lastTime = time;
      const speedFactor = (lowPowerRef.current ? 0.4 : 1) * (delta / 16.67);

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(centerX, centerY);

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      const idleTime = time - lastInteractionRef.current;
      if (idleTime > 6000) idleRef.current = true;
      if (idleTime < 4000) idleRef.current = false;
      const intensity = idleRef.current ? 0.8 : 1;

      drawAura(ctx, centerX, centerY, baseRadius, time, intensity);
      drawRings(ctx, centerX, centerY, baseRadius, speedFactor, intensity);
      drawGlyphs(ctx, centerX, centerY, baseRadius, speedFactor, intensity);
      drawOuterGates(ctx, centerX, centerY, baseRadius, intensity);
      drawFlows(ctx, centerX, centerY, baseRadius, speedFactor, intensity);
      drawPulse(ctx, centerX, centerY, baseRadius, speedFactor, intensity);

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion]);

  const drawAura = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    time: number,
    intensity: number,
  ) => {
    const auraGradient = ctx.createRadialGradient(
      cx + Math.sin(time * 0.0002) * 10,
      cy + Math.cos(time * 0.00015) * 10,
      radius * 0.1,
      cx,
      cy,
      radius * 1.2,
    );
    auraGradient.addColorStop(0, `rgba(255, 109, 0, ${0.04 * intensity})`);
    auraGradient.addColorStop(0.4, `rgba(255, 255, 255, ${0.02 * intensity})`);
    auraGradient.addColorStop(1, "rgba(10, 10, 10, 0)");
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawRings = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    speedFactor: number,
    intensity: number,
  ) => {
    const rings = ringsRef.current;
    const parallax = {
      x: (mouseRef.current.x - cx) * -0.004,
      y: (mouseRef.current.y - cy) * -0.004,
    };

    rings.forEach((ring, index) => {
      ring.rotation += ring.speed * ring.direction * speedFactor * intensity;
      const actualRadius = ring.radiusRatio * radius;
      ctx.save();
      ctx.translate(cx + parallax.x, cy + parallax.y);
      ctx.rotate(ring.rotation);
      ctx.lineWidth = ring.thickness;
      ctx.globalAlpha = 0.15 * intensity;
      const gradient = ctx.createLinearGradient(
        -actualRadius,
        0,
        actualRadius,
        0,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.5, index === 0 ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 109, 0, 0.25)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, actualRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  };

  const drawGlyphs = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    speedFactor: number,
    intensity: number,
  ) => {
    const glyphs = glyphsRef.current;
    const ring = ringsRef.current[1];
    if (!ring) return;
    const actualRadius = ring.radiusRatio * radius;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ring.rotation);
    ctx.font = "10px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    glyphs.forEach((glyph) => {
      glyph.angle += glyph.speed * speedFactor * -ring.direction;
      glyph.life += 16 * speedFactor;
      if (glyph.life >= glyph.maxLife) {
        glyph.life = 0;
        glyph.char = glyph.char === "0" ? "1" : glyph.char;
      }
      const alpha = Math.min(glyph.alpha, 0.12) * intensity;
      const x = Math.cos(glyph.angle) * actualRadius;
      const y = Math.sin(glyph.angle) * actualRadius;
      ctx.save();
      ctx.rotate(glyph.angle);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillText(glyph.char, x, y);
      ctx.restore();
    });
    ctx.restore();
  };

  const drawOuterGates = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    intensity: number,
  ) => {
    const ring = ringsRef.current[2];
    if (!ring) return;
    const segments = 24;
    const actualRadius = ring.radiusRatio * radius;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ring.rotation);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * intensity})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * actualRadius;
      const y = Math.sin(angle) * actualRadius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -ring.thickness * 0.4);
      ctx.lineTo(0, ring.thickness * 0.4);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  };

  const drawFlows = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    speedFactor: number,
    intensity: number,
  ) => {
    const flows = flowsRef.current;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.font = "8px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    flows.forEach((flow) => {
      flow.angle += flow.speed * speedFactor;
      flow.life += 16 * speedFactor;
      if (flow.life >= flow.maxLife) {
        flow.angle = Math.random() * Math.PI * 2;
        flow.radiusRatio = 0.3 + Math.random() * 0.5;
        flow.char = flow.char === "0" ? "1" : flow.char;
        flow.life = 0;
        flow.maxLife = 500 + Math.random() * 800;
        flow.alpha = 0.06 + Math.random() * 0.06;
      }
      const actualRadius = flow.radiusRatio * radius;
      const x = Math.cos(flow.angle) * actualRadius;
      const y = Math.sin(flow.angle) * actualRadius;
      const alpha = flow.alpha * (1 - flow.life / flow.maxLife) * intensity;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillText(flow.char, x, y);
    });
    ctx.restore();
  };

  const drawPulse = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    speedFactor: number,
    intensity: number,
  ) => {
    const pulse = pulseRef.current;
    pulse.timer -= 16 * speedFactor;
    if (!pulse.active && pulse.timer <= 0) {
      pulse.active = true;
      pulse.progress = 0;
      pulse.duration = 1400 + Math.random() * 600;
      pulse.timer = 4000 + Math.random() * 2000;
    }

    if (pulse.active) {
      pulse.progress += (16 * speedFactor) / pulse.duration;
      if (pulse.progress >= 1) {
        pulse.active = false;
      } else {
        const pulseRadius = radius * (0.35 + pulse.progress * 0.65);
        const alpha = (0.12 - pulse.progress * 0.12) * intensity;
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.strokeStyle = `rgba(255, 109, 0, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  if (prefersReducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-[1] pointer-events-none"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04), transparent 45%), radial-gradient(circle at 20% 20%, rgba(255,109,0,0.08), transparent 30%)",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ willChange: "contents" }}
      />
    </div>
  );
};
