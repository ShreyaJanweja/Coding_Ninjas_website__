"use client";

import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
  vx: number;
  vy: number;
}

const SHURIKEN_SIZE = 24;

const ShurikenSVG = ({ className }: { className?: string }) => (
  <svg
    width={SHURIKEN_SIZE}
    height={SHURIKEN_SIZE}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="shuriken-glow-filter">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M12 2L15 10L23 12L15 14L12 22L9 14L1 12L9 10L12 2Z"
      fill="white"
      stroke="#ff6d00"
      strokeWidth="0.8"
      strokeOpacity="0.7"
      filter="url(#shuriken-glow-filter)"
    />
    <circle cx="12" cy="12" r="3.5" fill="rgba(255, 109, 0, 0.5)" />
  </svg>
);

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cursorXRef = useRef(0);
  const cursorYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const rotationRef = useRef(0);
const trailPointsRef = useRef<TrailPoint[]>([]);
const animationFrameRef = useRef<number | null>(null);
  const lastMouseXRef = useRef(0);
  const lastMouseYRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) ||
        !window.matchMedia("(pointer: fine)").matches ||
        window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reduced = mediaQuery.matches;
      setPrefersReducedMotion(reduced);
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return {
        cleanup: () => mediaQuery.removeEventListener("change", handleChange),
        reduced,
      };
    };

    const isMobileDevice = checkMobile();
    const { cleanup: cleanupReducedMotion, reduced: prefersReduced } =
      checkReducedMotion();

    if (isMobileDevice || prefersReduced) {
      return () => {
        cleanupReducedMotion();
      };
    }

    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      targetXRef.current = e.clientX;
      targetYRef.current = e.clientY;

      lastMouseXRef.current = e.clientX;
      lastMouseYRef.current = e.clientY;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.closest('[role="button"]') !== null ||
        target.closest('[data-cursor-hover]') !== null ||
        target.closest(".cursor-pointer") !== null ||
        target.closest("[class*='CTA']") !== null ||
        target.closest("[class*='Card']") !== null ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(isInteractive);
    };

    const resizeTrailCanvas = () => {
      const canvas = trailCanvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeTrailCanvas();
    window.addEventListener("resize", resizeTrailCanvas);

    const animate = () => {
      if (!cursorRef.current || !cursorInnerRef.current) return;

      const canvas = trailCanvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: true });

      const interpolationFactor = 0.15;
      cursorXRef.current +=
        (targetXRef.current - cursorXRef.current) * interpolationFactor;
      cursorYRef.current +=
        (targetYRef.current - cursorYRef.current) * interpolationFactor;

      const rotationSpeed = isHovering ? 2 : 0.4 + Math.random() * 0.4;
      if (!prefersReducedMotion) {
        rotationRef.current += rotationSpeed;
        if (rotationRef.current >= 360) rotationRef.current = 0;
      }

      cursorRef.current.style.transform = `translate(${cursorXRef.current}px, ${cursorYRef.current}px) translate(-50%, -50%)`;
      cursorInnerRef.current.style.transform = `rotate(${rotationRef.current}deg)`;

      const dx = cursorXRef.current - lastMouseXRef.current;
      const dy = cursorYRef.current - lastMouseYRef.current;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      if (velocity > 0.1) {
        const trailSize = isHovering ? 10 : 6 + Math.random() * 4;
        const upwardDrift = 0.2 + Math.random() * 0.15;
        const horizontalStretch = Math.abs(dx) * 0.1;

        trailPointsRef.current.push({
          x: cursorXRef.current,
          y: cursorYRef.current,
          alpha: 1,
          size: trailSize,
          vx: dx * 0.05,
          vy: -upwardDrift,
        });

        if (trailPointsRef.current.length > (isHovering ? 20 : 15)) {
          trailPointsRef.current.shift();
        }
      }

      lastMouseXRef.current = cursorXRef.current;
      lastMouseYRef.current = cursorYRef.current;

      if (ctx && canvas) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        ctx.clearRect(0, 0, width, height);

        trailPointsRef.current = trailPointsRef.current.filter((point) => {
          point.alpha -= isHovering ? 0.06 : 0.04;
          point.size -= 0.25;
          point.x += point.vx;
          point.y += point.vy;

          if (point.alpha <= 0 || point.size <= 0) {
            return false;
          }

          const stretchX = 1 + Math.abs(point.vx) * 0.3;
          const stretchY = 1 - Math.abs(point.vy) * 0.2;

          ctx.save();
          ctx.globalAlpha = point.alpha * 0.9;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(216, 216, 216, 0.5)";
          ctx.fillStyle = "#d8d8d8";

          ctx.beginPath();
          ctx.ellipse(
            point.x,
            point.y,
            point.size * stretchX,
            point.size * stretchY,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          ctx.shadowBlur = 2;
          ctx.globalAlpha = point.alpha * 0.5;
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.beginPath();
          ctx.ellipse(
            point.x,
            point.y,
            point.size * 0.6 * stretchX,
            point.size * 0.6 * stretchY,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          ctx.restore();

          return true;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("resize", resizeTrailCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanupReducedMotion();
    };
  }, [isVisible, isHovering, prefersReducedMotion]);

  if (isMobile || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <canvas
        ref={trailCanvasRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          willChange: "contents",
        }}
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.15s ease-out",
          willChange: "transform",
        }}
      >
        <div
          ref={cursorInnerRef}
          className="flex items-center justify-center"
          style={{
            transformOrigin: "center",
            willChange: "transform",
          }}
        >
          <div
            className={`transition-all duration-200 ${
              isHovering ? "scale-[1.3]" : "scale-100"
            }`}
            style={{
              filter: isHovering
                ? "drop-shadow(0 0 12px rgba(255, 109, 0, 1)) drop-shadow(0 0 6px rgba(255, 109, 0, 0.8))"
                : "drop-shadow(0 0 4px rgba(255, 109, 0, 0.5))",
            }}
          >
            <ShurikenSVG />
          </div>
        </div>
      </div>
    </>
  );
};
