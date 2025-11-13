"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * NinjaRunnerGame
 * - 2D endless runner with Geometry Dash–style gravity flip
 * - Canvas-based rendering; self-contained logic using React hooks + TypeScript
 *
 * Usage:
 *   <NinjaRunnerGame width={480} height={220} />
 *
 * Sprite sheet:
 *   Provide a horizontal sprite strip in public as "/images/ninja-sprites.png".
 *   All frames must have the same width/height. The component will auto-calc frame size
 *   based on provided known columns (spriteFrameCount). If the image isn't found, the
 *   player will render as a simple rectangle as a fallback.
 */

// -----------------------------
// Types
// -----------------------------

type Lane = "floor" | "ceiling";

type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  isUpsideDown: boolean;
  velocityY: number; // kept for extensibility; not used for instant flip
};

type Coin = {
  x: number;
  y: number;
  size: number;
  lane: Lane;
  collected?: boolean;
  rotDir?: 1 | -1; // rotation direction
  baseAngle?: number; // initial random angle offset
};
type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  lane: Lane;
  scored?: boolean; // has this obstacle already been counted toward score?
  imgIndex?: number; // which obstacle image to use (0..2)
};

// -----------------------------
// Component props
// -----------------------------

type NinjaRunnerGameProps = {
  width?: number; // CSS pixels (logical)
  height?: number; // CSS pixels (logical)
  className?: string;
  style?: React.CSSProperties;
  spriteSrc?: string; // override sprite sheet path, defaults to SPRITE_SRC
  showCaption?: boolean; // show help caption under canvas
  topPlatformSrc?: string; // image path for top platform pattern
  bottomPlatformSrc?: string; // image path for bottom platform pattern
};

// -----------------------------
// Constants
// -----------------------------

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 220;

const TRACK_THICKNESS = 24; // increased thickness of floor/ceiling track
const H_PADDING = 16; // left padding for player spawn

const OB_SPEED = 220; // px/s
const OB_MIN_GAP = 0.8; // seconds between spawns (min)
const OB_MAX_GAP = 1.8; // seconds between spawns (max)
// removed legacy unused width constants
const OB_HEIGHT = 34; // px obstacle base height in each lane (scaled per device)

const PLAYER_WIDTH = 96; // base desktop player width
const PLAYER_HEIGHT = 72; // base desktop player height

// removed unused legacy SCORE_RATE constant

// Sprite config
const SPRITE_SRC = "/images/NinjaRunner/spritesheet.png"; // default path; can be overridden via prop
const TOP_PLATFORM_SRC = "/images/ninjarunner/top.png";
const BOTTOM_PLATFORM_SRC = "/images/ninjarunner/bottom.png";
const SPRITE_FRAME_COUNT = 6; // number of frames horizontally in the sheet
const SPRITE_FPS = 10; // animation frames per second

// Coin spawn configuration
const COIN_SIZE = 28; // base desktop coin size (px)
const COIN_LINE_MIN = 3; // min coins in a line
const COIN_LINE_MAX = 6; // max coins in a line
const COIN_GAP = 10; // horizontal gap between coins in a line (px)
const COIN_ROT_SPEED = Math.PI * 2; // radians/sec (1 full rotation per second)

// Obstacle images
const OBSTACLE_IMG_PATHS = [
  "/images/ninjarunner/obs1.png",
  "/images/ninjarunner/obs2.png",
  "/images/ninjarunner/obs3.png",
];
// Per-image height multipliers to control visual size while preserving aspect ratio
// Make obs1 (index 0) a taller pillar by increasing its height.
const OBSTACLE_HEIGHT_MULTIPLIER: number[] = [2.0, 1.0, 1.0];

// Flip animation
const FLIP_DURATION = 0.3; // seconds for smooth transition

// Easing: easeInOutCubic
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Overlays are rendered via DOM for glass UI; keep canvas free here

// Clamp utility
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// Quotes displayed on losing the game
const NINJA_QUOTES: string[] = [
  "True mastery is an endless journey, not a final destination.",
  "Embrace the shadows, but always strike toward the light.",
  "The disciplined mind is a fortress no enemy can breach.",
  "Silence your fears to hear the whispers of opportunity.",
  "A patient warrior views obstacles as mere stepping stones.",
  "Precision in action begins with clarity in thought.",
  "Do not just face your challenges; become the shadow that overcomes them.",
  "Agility of body is useless without an indomitable spirit.",
  "The sharpest blade is the will that never dulls.",
  "Your greatest victories are forged in the quiet dedication of your training.",
];

// UI colors
const HUD_SCORE_TEXT_COLOR = "#38bdf8"; // cyan accent to match player
const OVERLAY_QUOTE_COLOR = "#fbbf24"; // amber for Ninja Master + quote

// AABB collision check
function aabbIntersect(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export default function NinjaRunnerGame({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
  style,
  spriteSrc = SPRITE_SRC,
  showCaption = true,
  topPlatformSrc = TOP_PLATFORM_SRC,
  bottomPlatformSrc = BOTTOM_PLATFORM_SRC,
}: NinjaRunnerGameProps) {
  // Responsive scale based on canvas logical width (mobile → smaller entities)
  const computeScale = (w: number) => {
    if (w <= 360) return 0.7;
    if (w <= 420) return 0.8;
    if (w <= 480) return 0.9;
    return 1;
  };
  const initialScale = typeof window !== "undefined" ? computeScale(width) : 1;
  const scaleRef = useRef<number>(initialScale);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // React state for UI overlay
  const [, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [loseQuote, setLoseQuote] = useState<string | null>(null);
  const scoreRef = useRef<number>(0);
  const postedScoreRef = useRef<boolean>(false);

  // Persistent refs for game data (not causing rerenders)
  const playerRef = useRef<Player>({
    x: H_PADDING,
    y: height - TRACK_THICKNESS - Math.round(PLAYER_HEIGHT * initialScale),
    width: Math.round(PLAYER_WIDTH * initialScale),
    height: Math.round(PLAYER_HEIGHT * initialScale),
    isUpsideDown: false,
    velocityY: 0,
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const lastTimeRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number>(randRange(OB_MIN_GAP, OB_MAX_GAP));
  const coinSpawnTimerRef = useRef<number>(randRange(0.9, 1.6));

  // Device pixel ratio handling
  const dprRef = useRef<number>(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
  );

  // Sprite state
  const spriteImgRef = useRef<HTMLImageElement | null>(null);
  const spriteReadyRef = useRef<boolean>(false);
  const spriteFrameRef = useRef<number>(0);
  const spriteAccumRef = useRef<number>(0); // time accumulator for anim
  const spriteFrameWRef = useRef<number>(PLAYER_WIDTH);
  const spriteFrameHRef = useRef<number>(PLAYER_HEIGHT);

  // Flip animation state
  const flippingRef = useRef<boolean>(false);
  const flipStartYRef = useRef<number>(0);
  const flipTargetYRef = useRef<number>(0);
  const flipElapsedRef = useRef<number>(0);

  // Platform images and patterns
  const topImgRef = useRef<HTMLImageElement | null>(null);
  const bottomImgRef = useRef<HTMLImageElement | null>(null);
  const coinImgRef = useRef<HTMLImageElement | null>(null);
  const topReadyRef = useRef<boolean>(false);
  const bottomReadyRef = useRef<boolean>(false);
  const coinReadyRef = useRef<boolean>(false);
  const obstacleImgsRef = useRef<Array<HTMLImageElement | null>>([
    null,
    null,
    null,
  ]);
  const obstacleReadyRef = useRef<boolean[]>([false, false, false]);
  const obstacleAspectRef = useRef<number[]>([1, 1, 1]); // width/height ratios
  // Scrolling state for platforms
  const platformScrollRef = useRef<number>(0);
  const coinAngleRef = useRef<number>(0);

  // Ensure player y matches lane instantly on (re)calc
  const updatePlayerLaneY = (p: Player, logicalHeight: number) => {
    if (p.isUpsideDown) {
      // attach to ceiling
      p.y = TRACK_THICKNESS; // just below ceiling line
    } else {
      // attach to floor
      p.y = logicalHeight - TRACK_THICKNESS - p.height;
    }
  };

  const getLaneY = (
    isUpsideDown: boolean,
    p: Player,
    logicalHeight: number,
  ) => {
    return isUpsideDown
      ? TRACK_THICKNESS
      : logicalHeight - TRACK_THICKNESS - p.height;
  };

  // Helper: random in [a,b]
  function randRange(a: number, b: number) {
    return a + Math.random() * (b - a);
  }

  // Helper: pick a random item from an array
  function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Spawn an obstacle in a random lane
  const spawnObstacle = (logicalWidth: number, logicalHeight: number) => {
    // Choose a ready obstacle image index; if none ready, delay
    const readyIdxs = obstacleReadyRef.current
      .map((ok, i) => (ok ? i : -1))
      .filter((i) => i >= 0);
    if (readyIdxs.length === 0) {
      spawnTimerRef.current += 0.2;
      return;
    }
    const pickIdx = readyIdxs[Math.floor(Math.random() * readyIdxs.length)];
    const aspect = obstacleAspectRef.current[pickIdx] || 1;
    const s = scaleRef.current;
    const baseH = Math.round(OB_HEIGHT * s);
    const heightPx = Math.max(
      baseH,
      Math.round(baseH * (OBSTACLE_HEIGHT_MULTIPLIER[pickIdx] ?? 1)),
    );
    const width = Math.max(8, Math.round(heightPx * aspect));

    // For obs3 (index 2), allow up to 4 adjacent; for obs2 (index 1), up to 2 adjacent
    const packCount =
      pickIdx === 2
        ? Math.max(1, Math.min(4, Math.floor(randRange(1, 5)))) // 1..4
        : pickIdx === 1
          ? Math.max(1, Math.min(2, Math.floor(randRange(1, 3)))) // 1..2
          : 1;
    const gap = 0; // tight adjacency

    const tryCreate = (lane: Lane): Obstacle[] | null => {
      const y =
        lane === "floor"
          ? logicalHeight - TRACK_THICKNESS - heightPx
          : TRACK_THICKNESS; // attached to ceiling line
      const startX = logicalWidth + 2; // spawn just off-screen to the right
      // Build proposed pack
      const proposed: Obstacle[] = [];
      for (let i = 0; i < packCount; i++) {
        const x = startX + i * (width + gap);
        proposed.push({
          x,
          y,
          width,
          height: heightPx,
          lane,
          scored: false,
          imgIndex: pickIdx,
        });
      }
      // Avoid overlapping existing coins at spawn for any in pack
      const cs = coinsRef.current;
      for (let k = 0; k < proposed.length; k++) {
        const box = proposed[k];
        for (let i = 0; i < cs.length; i++) {
          const c = cs[i];
          const coinBox = { x: c.x, y: c.y, width: c.size, height: c.size };
          if (aabbIntersect(box, coinBox)) {
            return null;
          }
        }
      }
      return proposed;
    };

    const firstLane: Lane = Math.random() < 0.5 ? "floor" : "ceiling";
    const altLane: Lane = firstLane === "floor" ? "ceiling" : "floor";
    const a = tryCreate(firstLane);
    if (a) {
      obstaclesRef.current.push(...a);
      return;
    }
    const b = tryCreate(altLane);
    if (b) {
      obstaclesRef.current.push(...b);
      return;
    }
    // delay spawn slightly if both lanes blocked
    spawnTimerRef.current += 0.2;
  };

  // Input handlers
  useEffect(() => {
    const onFlip = (e?: KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        // Only respond to Space (or Spacebar on older browsers) and not when meta keys are used
        const isSpace =
          e.code === "Space" || e.key === " " || e.key === "Spacebar";
        if (!isSpace) return;
        e.preventDefault();
      }
      if (isGameOver) {
        // Restart on input when game over
        resetGame();
        setIsPaused(false);
        return;
      }
      if (isPaused) {
        // Start from paused state on first interaction
        setIsPaused(false);
        return;
      }
      // Begin smooth flip animation
      const p = playerRef.current;
      const nextUpsideDown = !p.isUpsideDown;
      // Toggle orientation immediately for visual feedback
      p.isUpsideDown = nextUpsideDown;
      p.velocityY = 0;
      // Setup animation toward the target lane
      flippingRef.current = true;
      flipStartYRef.current = p.y;
      flipTargetYRef.current = getLaneY(nextUpsideDown, p, height);
      flipElapsedRef.current = 0;
    };

    const canvas = canvasRef.current;
    const handleClick = (ev: MouseEvent) => {
      ev.preventDefault();
      onFlip();
    };

    // Use a typed keydown handler to avoid any casts
    const handleKeyDown = (ev: KeyboardEvent) => onFlip(ev);
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    canvas?.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas?.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver, isPaused, height]);

  // Layout/resize and DPR setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    // Update responsive scale when width changes
    const s = computeScale(width);
    scaleRef.current = s;
    // Adjust player size and snap to lane based on new scale
    const p = playerRef.current;
    p.width = Math.round(PLAYER_WIDTH * s);
    p.height = Math.round(PLAYER_HEIGHT * s);
    updatePlayerLaneY(p, height);

    // Set physical canvas size based on DPR to keep crisp rendering
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // On resize, re-attach player to track only if not flipping
    if (!flippingRef.current) {
      updatePlayerLaneY(playerRef.current, height);
    } else {
      // Recompute target for ongoing flip with new height
      flipTargetYRef.current = getLaneY(
        playerRef.current.isUpsideDown,
        playerRef.current,
        height,
      );
    }
  }, [width, height]);

  // Load sprite image (optional)
  useEffect(() => {
    const img = new Image();
    spriteReadyRef.current = false;
    img.onload = () => {
      spriteImgRef.current = img;
      spriteReadyRef.current = true;
      // Derive frame size from image width/height and known frame count
      spriteFrameWRef.current = Math.floor(img.width / SPRITE_FRAME_COUNT);
      spriteFrameHRef.current = img.height; // single row
    };
    img.onerror = () => {
      spriteReadyRef.current = false; // fallback to rect
    };
    img.src = spriteSrc;
    return () => {
      // nothing specific
    };
  }, [spriteSrc]);

  // Load platform images
  useEffect(() => {
    topReadyRef.current = false;
    bottomReadyRef.current = false;

    const topImg = new Image();
    const bottomImg = new Image();
    topImg.onload = () => {
      topImgRef.current = topImg;
      topReadyRef.current = true;
    };
    bottomImg.onload = () => {
      bottomImgRef.current = bottomImg;
      bottomReadyRef.current = true;
    };
    topImg.onerror = () => {
      topReadyRef.current = false;
    };
    bottomImg.onerror = () => {
      bottomReadyRef.current = false;
    };
    topImg.src = topPlatformSrc;
    bottomImg.src = bottomPlatformSrc;

    return () => {
      // no cleanup needed for images
    };
  }, [topPlatformSrc, bottomPlatformSrc]);

  // Load coin image (shuriken coins)
  useEffect(() => {
    coinReadyRef.current = false;
    const img = new Image();
    img.onload = () => {
      coinImgRef.current = img;
      coinReadyRef.current = true;
    };
    img.onerror = () => {
      coinReadyRef.current = false;
    };
    img.src = "/images/ninjarunner/shuriken.png";
    return () => {
      /* no-op */
    };
  }, []);

  // Load obstacle images (obs1, obs2, obs3)
  useEffect(() => {
    const imgs: Array<HTMLImageElement | null> = [null, null, null];
    const ready: boolean[] = [false, false, false];
    const aspects: number[] = [1, 1, 1];

    OBSTACLE_IMG_PATHS.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        imgs[i] = img;
        ready[i] = true;
        aspects[i] =
          img.width > 0 && img.height > 0 ? img.width / img.height : 1;
        obstacleImgsRef.current = imgs;
        obstacleReadyRef.current = ready;
        obstacleAspectRef.current = aspects;
      };
      img.onerror = () => {
        imgs[i] = null;
        ready[i] = false;
        aspects[i] = 1;
        obstacleImgsRef.current = imgs;
        obstacleReadyRef.current = ready;
        obstacleAspectRef.current = aspects;
      };
      img.src = src;
    });
  }, []);

  // Spawn a coin in a random lane, positioned near player's mid-section for that lane
  const spawnCoin = (logicalWidth: number, logicalHeight: number) => {
    const createLine = (lane: Lane) => {
      const count = Math.floor(randRange(COIN_LINE_MIN, COIN_LINE_MAX + 1));
      const size = Math.round(COIN_SIZE * scaleRef.current);
      const spacing = size + COIN_GAP;
      const baseX = logicalWidth + 2;
      const playerMidOffset = playerRef.current.height / 2 - size / 2;
      const y =
        lane === "floor"
          ? logicalHeight -
            TRACK_THICKNESS -
            playerRef.current.height +
            playerMidOffset
          : TRACK_THICKNESS + playerMidOffset;
      // Build proposed coin boxes
      const proposed: {
        x: number;
        y: number;
        size: number;
        lane: Lane;
        rotDir: 1 | -1;
        baseAngle: number;
      }[] = [];
      for (let i = 0; i < count; i++) {
        const rotDir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
        const baseAngle = Math.random() * Math.PI * 2;
        proposed.push({
          x: baseX + i * spacing,
          y,
          size,
          lane,
          rotDir,
          baseAngle,
        });
      }
      // Ensure they don't overlap obstacles
      const obs = obstaclesRef.current;
      for (let i = 0; i < proposed.length; i++) {
        const pb = proposed[i];
        const coinBox = { x: pb.x, y: pb.y, width: pb.size, height: pb.size };
        for (let j = 0; j < obs.length; j++) {
          const o = obs[j];
          const obox = { x: o.x, y: o.y, width: o.width, height: o.height };
          if (aabbIntersect(coinBox, obox)) {
            return null; // overlap on this lane
          }
        }
      }
      return proposed;
    };

    const firstLane: Lane = Math.random() < 0.5 ? "floor" : "ceiling";
    const altLane: Lane = firstLane === "floor" ? "ceiling" : "floor";
    const a = createLine(firstLane);
    const chosen = a ?? createLine(altLane);
    if (!chosen) {
      // both lanes blocked; delay and skip
      coinSpawnTimerRef.current += 0.2;
      return;
    }
    chosen.forEach((pb) => coinsRef.current.push({ ...pb, collected: false }));
  };

  // Core game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const loop = (t: number) => {
      if (!running) return;

      const prev = lastTimeRef.current ?? t;
      let dt = (t - prev) / 1000; // seconds
      // Cap dt to avoid huge jumps when tab regains focus
      dt = clamp(dt, 0, 0.05);
      lastTimeRef.current = t;

      if (!isGameOver && !isPaused) {
        update(dt, width, height);
        draw(ctx, width, height);
      } else {
        // Draw even when paused or game over (to show overlays)
        draw(ctx, width, height);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver, isPaused, width, height]);

  // Submit score when game over (only once per round)
  useEffect(() => {
    if (!isGameOver || postedScoreRef.current) return;
    postedScoreRef.current = true;
    const submit = async () => {
      const score = scoreRef.current;
      try {
        await fetch(`/api/highscore?game=NinjaRunner`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        });
      } catch {
        // ignore errors silently for UI
      }
    };
    submit();
  }, [isGameOver]);

  // Update simulation
  const update = (dt: number, logicalWidth: number, logicalHeight: number) => {
    // Scoring now based on coin collection

    // Advance sprite animation
    spriteAccumRef.current += dt;
    const frameAdvance = Math.floor(spriteAccumRef.current * SPRITE_FPS);
    if (frameAdvance > 0) {
      spriteFrameRef.current =
        (spriteFrameRef.current + frameAdvance) % SPRITE_FRAME_COUNT;
      spriteAccumRef.current -= frameAdvance / SPRITE_FPS;
    }

    // Advance coin rotation angle accumulator
    coinAngleRef.current =
      (coinAngleRef.current + COIN_ROT_SPEED * dt) % (Math.PI * 2);

    // Flip animation progression
    if (flippingRef.current) {
      flipElapsedRef.current += dt;
      const t = clamp(flipElapsedRef.current / FLIP_DURATION, 0, 1);
      const e = easeInOutCubic(t);
      const startY = flipStartYRef.current;
      const endY = flipTargetYRef.current;
      playerRef.current.y = startY + (endY - startY) * e;
      if (t >= 1) {
        // Snap to target and end flip
        playerRef.current.y = endY;
        flippingRef.current = false;
      }
    }

    // Move obstacles
    const obs = obstaclesRef.current;
    for (let i = obs.length - 1; i >= 0; i--) {
      const o = obs[i];
      o.x -= OB_SPEED * dt;
      if (o.x + o.width < -10) {
        obs.splice(i, 1); // remove off-screen
      }
    }

    // Scroll platforms to the left in sync with obstacles
    platformScrollRef.current += OB_SPEED * dt;

    // Coins: move left, collect on AABB with player
    const cs = coinsRef.current;
    const p = playerRef.current;
    const playerBox = { x: p.x, y: p.y, width: p.width, height: p.height };
    for (let i = cs.length - 1; i >= 0; i--) {
      const c = cs[i];
      c.x -= OB_SPEED * dt;
      const coinBox = { x: c.x, y: c.y, width: c.size, height: c.size };
      if (!c.collected && aabbIntersect(playerBox, coinBox)) {
        c.collected = true;
        cs.splice(i, 1);
        setScore((s) => {
          const next = s + 1;
          scoreRef.current = next;
          return next;
        });
        continue;
      }
      if (c.x + c.size < -10) {
        cs.splice(i, 1);
      }
    }

    // Spawn timer
    // Spawn obstacle timer
    spawnTimerRef.current -= dt;
    if (spawnTimerRef.current <= 0) {
      spawnObstacle(logicalWidth, logicalHeight);
      spawnTimerRef.current = randRange(OB_MIN_GAP, OB_MAX_GAP);
    }

    // Spawn coin timer
    coinSpawnTimerRef.current -= dt;
    if (coinSpawnTimerRef.current <= 0) {
      spawnCoin(logicalWidth, logicalHeight);
      coinSpawnTimerRef.current = randRange(0.9, 1.6);
    }

    // Collisions
    // reuse playerBox from above

    for (let i = 0; i < obs.length; i++) {
      const o = obs[i];
      if (aabbIntersect(playerBox, o)) {
        setLoseQuote(pickRandom(NINJA_QUOTES));
        setIsGameOver(true);
        break;
      }
    }
  };

  // Draw frame
  const draw = (
    ctx: CanvasRenderingContext2D,
    logicalWidth: number,
    logicalHeight: number,
  ) => {
    const dpr = dprRef.current;
    ctx.save();
    ctx.scale(dpr, dpr); // work in logical pixels

    // Clear
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    // Background (very light orange)
    ctx.fillStyle = "#f5bc71"; // light orange
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Tracks (ceiling/floor) using tiled images with scrolling; fallback to solid color
    const drawTiled = (
      img: HTMLImageElement,
      xOffset: number,
      y: number,
      trackH: number,
    ) => {
      const scale = trackH / img.height;
      const tileW = img.width * scale;
      if (tileW <= 0) return;
      // Offset ensures seamless leftward scroll
      const startX = -((xOffset % tileW) + tileW) % tileW;
      for (let x = startX; x < logicalWidth; x += tileW) {
        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, tileW, trackH);
      }
    };

    if (topReadyRef.current && topImgRef.current) {
      // Slight overscan (-1, +2) to eliminate any visible gap above the top platform due to transparency/antialiasing
      drawTiled(
        topImgRef.current,
        platformScrollRef.current,
        -1,
        TRACK_THICKNESS + 2,
      );
    } else {
      ctx.fillStyle = "#1f2a44";
      ctx.fillRect(0, 0, logicalWidth, TRACK_THICKNESS);
    }

    if (bottomReadyRef.current && bottomImgRef.current) {
      drawTiled(
        bottomImgRef.current,
        platformScrollRef.current,
        logicalHeight - TRACK_THICKNESS,
        TRACK_THICKNESS,
      );
    } else {
      ctx.fillStyle = "#1f2a44";
      ctx.fillRect(
        0,
        logicalHeight - TRACK_THICKNESS,
        logicalWidth,
        TRACK_THICKNESS,
      );
    }

    // Obstacles (image-based with preserved aspect ratio; fallback to rect)
    const obs = obstaclesRef.current;
    obs.forEach((o) => {
      const idx = o.imgIndex ?? -1;
      const ready =
        idx >= 0 &&
        obstacleReadyRef.current[idx] &&
        obstacleImgsRef.current[idx];
      if (ready) {
        const img = obstacleImgsRef.current[idx]!;
        if (o.lane === "ceiling") {
          // Flip vertically for top-lane obstacles
          const cx = o.x + o.width / 2;
          const cy = o.y + o.height / 2;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(1, -1);
          ctx.drawImage(img, -o.width / 2, -o.height / 2, o.width, o.height);
          ctx.restore();
        } else {
          ctx.drawImage(img, o.x, o.y, o.width, o.height);
        }
      } else {
        ctx.fillStyle = "#ff5b5b";
        ctx.fillRect(o.x, o.y, o.width, o.height);
      }
    });

    // Coins (shurikens)
    const cs = coinsRef.current;
    if (coinReadyRef.current && coinImgRef.current) {
      const img = coinImgRef.current;
      cs.forEach((c) => {
        const angle =
          coinAngleRef.current * (c.rotDir ?? 1) + (c.baseAngle ?? 0);
        const cx = c.x + c.size / 2;
        const cy = c.y + c.size / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        // Black shadow behind shuriken
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(img, -c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();
      });
    } else {
      // Fallback circle coins
      ctx.fillStyle = "#fbbf24";
      cs.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x + c.size / 2, c.y + c.size / 2, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Player (sprite if available else a rect)
    const p = playerRef.current;
    if (spriteReadyRef.current && spriteImgRef.current) {
      const img = spriteImgRef.current;
      const fw = spriteFrameWRef.current;
      const fh = spriteFrameHRef.current;
      const frame = clamp(spriteFrameRef.current, 0, SPRITE_FRAME_COUNT - 1);

      // Draw with vertical flip if upside-down
      ctx.save();
      if (p.isUpsideDown) {
        // Flip Y about the player's center baseline
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        ctx.translate(cx, cy);
        ctx.scale(1, -1);
        ctx.translate(-cx, -cy);
      }

      // Draw image scaled to player bounds
      ctx.drawImage(
        img,
        frame * fw, // sx
        0, // sy
        fw, // sw
        fh, // sh
        p.x, // dx
        p.y, // dy
        p.width, // dw
        p.height, // dh
      );
      ctx.restore();
    } else {
      // Fallback rectangle
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }

    // HUD: score and status
    ctx.font =
      "bold 13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textBaseline = "top";
    const scoreText = `Score: ${scoreRef.current}`;
    const textWidth = ctx.measureText(scoreText).width;
    const padX = 8;
    const padY = 5;
    const boxX = 6;
    const boxY = 6;
    const boxW = Math.ceil(textWidth + padX * 2);
    const boxH = 22; // fits 13px bold nicely with top baseline
    // Draw black glass background (rounded rect with subtle light stroke)
    const r = 8;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(boxX + r, boxY);
    ctx.lineTo(boxX + boxW - r, boxY);
    ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + r);
    ctx.lineTo(boxX + boxW, boxY + boxH - r);
    ctx.quadraticCurveTo(
      boxX + boxW,
      boxY + boxH,
      boxX + boxW - r,
      boxY + boxH,
    );
    ctx.lineTo(boxX + r, boxY + boxH);
    ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - r);
    ctx.lineTo(boxX, boxY + r);
    ctx.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    // Draw score text atop
    ctx.fillStyle = HUD_SCORE_TEXT_COLOR;
    ctx.fillText(scoreText, boxX + padX, boxY + padY);

    // Canvas no longer draws pause/game-over overlays; rendered via DOM

    ctx.restore();
  };

  // Reset to initial state
  const resetGame = () => {
    obstaclesRef.current = [];
    coinsRef.current = [];
    lastTimeRef.current = null;
    spawnTimerRef.current = randRange(OB_MIN_GAP, OB_MAX_GAP);
    coinSpawnTimerRef.current = randRange(0.9, 1.6);
    setScore(0);
    scoreRef.current = 0;
    setIsGameOver(false);
    setLoseQuote(null);
    postedScoreRef.current = false;
    flippingRef.current = false;
    flipElapsedRef.current = 0;
    const s = scaleRef.current;
    const w = Math.round(PLAYER_WIDTH * s);
    const h = Math.round(PLAYER_HEIGHT * s);
    playerRef.current = {
      x: H_PADDING,
      y: height - TRACK_THICKNESS - h,
      width: w,
      height: h,
      isUpsideDown: false,
      velocityY: 0,
    };
  };

  return (
    <div className={className} style={{ display: "inline-block", ...style }}>
      <div style={{ position: "relative", width, height }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Ninja Runner gravity-flip mini game"
          style={{
            display: "block",
            borderRadius: 8,
            background: "#e6933c",
            cursor: "pointer",
          }}
        />

        {(isPaused || isGameOver) && (
          <div
            aria-hidden
            style={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "rgba(2,6,23,0.35)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 2,
            }}
          >
            <div
              style={{
                pointerEvents: "none",
                maxWidth: 360,
                width: "82%",
                padding: 16,
                borderRadius: 12,
                background: "rgba(15,23,42,0.65)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  color: "#e2e8f0",
                  fontWeight: 700,
                  fontSize: 18,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {isGameOver ? (
                  <>
                    <span style={{ color: OVERLAY_QUOTE_COLOR }}>
                      Ninja Master:{" "}
                    </span>
                    <span
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 16,
                        color: OVERLAY_QUOTE_COLOR,
                      }}
                    >
                      {loseQuote ? "\u201C" + loseQuote + "\u201D" : ""}
                    </span>
                  </>
                ) : (
                  "Play Game"
                )}
              </div>
              {isGameOver && (
                <div
                  style={{
                    color: HUD_SCORE_TEXT_COLOR,
                    fontSize: 14,
                    textAlign: "center",
                    marginBottom: 6,
                  }}
                >
                  {`Score: ${scoreRef.current}`}
                </div>
              )}
              <div
                style={{ color: "#cbd5e1", fontSize: 14, textAlign: "center" }}
              >
                {isGameOver
                  ? "Click to play again!!"
                  : "Click anywhere to start"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional: small caption/help for a11y outside canvas */}
      {showCaption && (
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
          Click or press Space to flip gravity. Avoid red blocks.
        </div>
      )}
    </div>
  );
}
