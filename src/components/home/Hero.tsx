"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "../ui/CTAButton";
import { motionDefaults } from "@/lib/motion";
import { useMediaQuery } from "@/lib/hooks";
import NinjaRunnerGame from "../games/NinjaRunnerGame";
import { Press_Start_2P } from "next/font/google";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const Hero = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isCTAHovered, setIsCTAHovered] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const gameHeight = isMobile ? 160 : 220;
  const titleTop = `calc(((100% - (${gameHeight}px + 32px)) / 4) - 10px)`; // center between top and game top

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/highscore?game=NinjaRunner`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!mounted) return;
        setHighScore(typeof data.score === "number" ? data.score : 0);
      } catch {
        if (!mounted) return;
        setHighScore(0);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="relative pt-12 md:pt-20">
      <div className="container-grid grid items-center gap-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-20">
        <motion.div
          variants={motionDefaults}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-8"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1 text-xs uppercase tracking-[0.4em] text-foreground/60">
              Coding Ninjas
            </span>
            <h1 className="text-4xl font-heading font-semibold md:text-6xl">
              Crafting future-ready experiences, communities, and makers.
            </h1>
            <p className="max-w-xl text-base text-foreground/70 md:text-lg">
              Coding Ninjas Chitkara is a multi-disciplinary guild of builders
              shipping production-grade projects, running impact-first events,
              and mentoring the next wave of innovators across India.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <CTAButton
              href="/#join"
              trackingId="hero-join"
              onMouseEnter={() => setIsCTAHovered(true)}
              onMouseLeave={() => setIsCTAHovered(false)}
            >
              Join the Club
            </CTAButton>
            <CTAButton
              href="/about"
              variant="secondary"
              trackingId="hero-about"
            >
              Explore the story
            </CTAButton>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em] text-foreground/50">
            <span>Weekly Club sessions</span>
            <span>Production-ready squads</span>
            <span>Global mentorship</span>
          </div>
        </motion.div>
        <motion.div
          className="group relative aspect-[4/5] w-full overflow-hidden rounded-[3rem] border border-border/60 bg-gradient-to-br from-background via-surface to-background/70 shadow-soft"
          animate={{
            rotateX: isCTAHovered ? -6 : 0,
            rotateY: isCTAHovered ? 9 : 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          whileHover="hover"
        >
          {/* Retro title overlay centered between card top and canvas top */}
          <div
            className="pointer-events-none absolute inset-x-0 z-20 flex items-center justify-center"
            style={{ top: titleTop }}
          >
            <motion.div
              className={`${pressStart.className} select-none text-base uppercase tracking-[0.3em] text-amber-200 md:text-2xl`}
              initial={{ y: 0, opacity: 0.95 }}
              animate={{ y: [0, -1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              variants={{
                hover: {
                  scale: 1.06,
                  transition: { type: "spring", stiffness: 200, damping: 14 },
                },
              }}
              style={{
                textShadow:
                  "0 0 6px rgba(255,223,137,0.6), 0 0 14px rgba(255,196,66,0.35)",
                filter: "drop-shadow(0 0 4px rgba(255,196,66,0.35))",
              }}
            >
              Ninja Runner
            </motion.div>
            {/* High score under the title */}
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 z-20 mt-2 flex items-center justify-center"
            style={{ top: `calc(${titleTop} + 38px)` }}
          >
            <div className="rounded-full border border-amber-300/40 bg-amber-50/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-200 backdrop-blur-sm">
              High Score: {highScore ?? "--"}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <NinjaRunnerGame
              width={isMobile ? 320 : 480}
              height={isMobile ? 160 : 220}
              showCaption={false}
              spriteSrc="/images/NinjaRunner/spritesheet.png"
            />
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-border/60 bg-background/80 p-4 text-sm text-foreground/70 backdrop-blur-xl">
            <p className="font-semibold text-foreground">Coding Ninjas Pods</p>
            <p className="mt-1">
              AI, Full Stack, Game Dev, Robotics — collaborate with squads built
              to ship and learn faster together.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
