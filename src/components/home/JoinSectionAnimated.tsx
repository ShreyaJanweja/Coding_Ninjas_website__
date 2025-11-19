"use client";

import { useState, useEffect } from "react";
import { CTAButton } from "../ui/CTAButton";

const cards = [
  {
    icon: "⚙️",
    title: "AI Studio",
    description:
      "Research and deploy ML systems with a focus on responsible AI and human-centered outcomes.",
  },
  {
    icon: "💡",
    title: "Product Engineering",
    description:
      "Ship full-stack apps using Next.js, edge functions, and polished motion design.",
  },
  {
    icon: "🚀",
    title: "Immersive Media",
    description:
      "Experiment with WebXR, creative coding, and interactive storytelling.",
  },
  {
    icon: "🔥",
    title: "Robotics & IoT",
    description:
      "Prototype hardware, automation, and intelligent systems with real-world partners.",
  },
];

export const JoinSectionAnimated = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="join" className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6">
      <div className="container-grid">
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111111] to-[#0d0d0d] p-6 sm:p-8 md:p-12 lg:p-16 transition-all duration-500 cursor-pointer border-2 border-primary/80 hover:shadow-[0_0_20px_rgba(255,123,0,0.4)] hover:-translate-y-2 w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            transform: isHovered ? "scale(0.99)" : "scale(1)",
          }}
        >
          {/* Two column layout - stacks on mobile, side-by-side on lg */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start">
            {/* Left: Text Section */}
            <div className="flex-1 z-10 w-full md:w-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2 sm:mb-3">
                Join
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3 sm:mb-4 lg:mb-6 leading-tight">
                Grow with the Coding Ninjas
              </h2>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-4 sm:mb-6 lg:mb-8 max-w-md md:max-w-lg">
                We welcome builders across all disciplines. Tap into mentorship, labs, and squads aligned to missions that matter.
              </p>
              <CTAButton href="/contact" trackingId="join-contact">
                Apply or Partner
              </CTAButton>
            </div>

            {/* Right: Rotating Cards */}
            <div className="flex-1 relative min-h-[280px] sm:min-h-[320px] md:min-h-[280px] lg:min-h-[260px] w-full md:w-auto z-10">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`absolute top-0 left-0 w-full h-full bg-[#141414] border rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 transition-all duration-700 flex flex-col justify-center ${
                    index === activeIndex
                      ? "opacity-100 translate-y-0 border-primary shadow-[0_0_20px_rgba(255,123,0,0.3)]"
                      : "opacity-0 translate-y-8 border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-primary/10 border-2 border-primary text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 md:mb-5">
                    {card.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-foreground mb-2 sm:mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-foreground/70 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
