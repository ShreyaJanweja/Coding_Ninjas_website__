"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { childFade } from "@/lib/motion";

const sponsors = [
  {
    name: "Burger King",
    url: "https://www.burgerking.in",
    img: "/images/sponsors/bk.png",
  },
  {
    name: "JetBrains",
    url: "https://www.jetbrains.com",
    img: "/images/sponsors/jb.webp",
  },
  {
    name: "Coding Ninjas",
    url: "https://www.codingninjas.com/",
    img: "/images/sponsors/cn_sponser.png",
  },
  {
    name: "Devfolio",
    url: "https://devfolio.co",
    img: "/images/sponsors/dev.webp",
  },
  {
    name: "GitHub",
    url: "https://github.com/",
    img: "/images/sponsors/github.png",
  },
  {
    name: "Red Bull",
    url: "https://www.redbull.com/in-en",
    img: "/images/sponsors/rb.jpg",
  },
];

export const Sponsors = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [durationSeconds, setDurationSeconds] = useState<number>(20);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const itemsToShow = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  } as const;

  const [visibleItems, setVisibleItems] = useState<number>(itemsToShow.desktop);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(itemsToShow.mobile);
      else if (width < 1024) setVisibleItems(itemsToShow.tablet);
      else if (width < 1536) setVisibleItems(itemsToShow.desktop);
      else setVisibleItems(itemsToShow.wide);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const controls = useAnimation();

  const motionRef = useRef<HTMLDivElement | null>(null);
  const currentXRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  const duplicated = useMemo(() => [...sponsors, ...sponsors], []);

    const [itemWidthPx, setItemWidthPx] = useState<number>(0);
    const [containerWidthPx, setContainerWidthPx] = useState<number>(0);

    useEffect(() => {
      const compute = () => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        const wrapWidth = wrap.clientWidth;
        const itemW = wrapWidth / visibleItems;
        setItemWidthPx(itemW);
        setContainerWidthPx(itemW * duplicated.length);
      };

      compute();
      window.addEventListener("resize", compute);
      return () => window.removeEventListener("resize", compute);
    }, [visibleItems, duplicated.length]);

    const shiftPx = itemWidthPx * sponsors.length;

    const startAnimation = () => {
      if (!shiftPx) return;
      controls.set({ x: 0 });
      controls.start({
        x: -shiftPx,
        transition: { repeat: Infinity, repeatType: "loop", ease: "linear", duration: durationSeconds },
      });
    };

    const pauseAnimation = () => {
      const el = motionRef.current;
      if (el) {
        const style = getComputedStyle(el);
        const transform = style.transform;
        if (transform && transform !== "none") {
          const m = transform.match(/matrix\(([-0-9.,\s]+)\)/);
          if (m) {
            const parts = m[1].split(",").map((p) => parseFloat(p));
            const tx = parts[4] || 0;
            currentXRef.current = tx;
            pausedRef.current = true;
          }
        }
      }
      controls.stop();
    };

    const resumeAnimation = async () => {
      const cur = currentXRef.current || 0;
      let currentX = cur;
      if (shiftPx && currentX < -shiftPx) {
        currentX = ((currentX % -shiftPx) + -shiftPx) % -shiftPx;
      }
      const remaining = Math.max(0, Math.abs(-shiftPx - currentX));
      const remainingFraction = shiftPx ? remaining / shiftPx : 1;

      controls.set({ x: currentX });
      if (remaining > 0) {
        await controls.start({ x: -shiftPx, transition: { duration: durationSeconds * remainingFraction, ease: "linear" } });
      }
      pausedRef.current = false;
      startAnimation();
    };

  useEffect(() => {
    const shouldAnimate = isPlaying && !isHovered;
    if (shouldAnimate) {
      if (pausedRef.current) {
        // resume from paused position
        resumeAnimation();
      } else {
        startAnimation();
      }
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, visibleItems, durationSeconds, shiftPx]);

  return (
    <section className="container-grid space-y-12 py-16">
      <motion.div
        variants={childFade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center"
      >
        <SectionTitle
          eyebrow="Partnerships"
          title="OUR PAST SPONSORS"
          description="We're grateful to our partners who have supported our events and community initiatives."
          align="center"
        />
      </motion.div>

      <div
        className="relative w-full max-w-6xl mx-auto"
        role="region"
        aria-label="Sponsors carousel"
        ref={wrapperRef}
        onMouseEnter={() => { setIsHovered(true); pauseAnimation(); }}
        onMouseLeave={() => { setIsHovered(false); if (isPlaying) resumeAnimation(); }}
        onTouchStart={() => { setIsHovered(true); pauseAnimation(); }}
        onTouchEnd={() => { setIsHovered(false); if (isPlaying) resumeAnimation(); }}
      >
        <div className="overflow-hidden">
          <motion.div
            className="flex items-center"
            style={containerWidthPx ? { width: `${containerWidthPx}px` } : undefined}
            ref={motionRef}
            animate={controls}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragStart={() => { setIsHovered(true); pauseAnimation(); }}
            onDragEnd={() => { setIsHovered(false); if (isPlaying) resumeAnimation(); }}
            whileTap={{ cursor: "grabbing" }}
          >
            {duplicated.map((sponsor, index) => (
              <a
                key={`${sponsor.name}-${index}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-2"
                style={itemWidthPx ? { width: `${itemWidthPx}px`, maxWidth: 360 } : undefined}
              >
                <div className="relative w-full h-28 sm:h-32 md:h-40 lg:h-44 rounded-xl border border-border/40 bg-gradient-to-br from-surface/50 to-background/50 backdrop-blur-sm p-4 flex items-center justify-center overflow-hidden hover:border-primary/60 transition-all duration-300">
                  <Image src={sponsor.img} alt={sponsor.name} fill className="object-contain" sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px" />
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
};
