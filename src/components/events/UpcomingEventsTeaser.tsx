"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { upcomingEvents } from "@/data/club";
import { staggerChildren, childFade } from "@/lib/motion";

export const UpcomingEventsTeaser = () => {
  if (upcomingEvents.length === 0) return null;

  return (
    <section className="container-grid space-y-12">
      <SectionTitle
        eyebrow="Upcoming"
        title="What's Happening Next"
        description="Mark your calendar for these upcoming workshops, showcases, and impact sprints."
      />
      <motion.div
        variants={staggerChildren(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 md:grid-cols-2"
      >
        {upcomingEvents.map((event) => (
          <motion.div
            key={event.name}
            variants={childFade}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="group relative h-full bg-background/80 border-border/60 hover:border-primary/60 transition-all duration-300 hover:shadow-soft overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Coming Soon
                </span>
              </div>
              <div className="space-y-4 pt-2">
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                  {new Date(event.startDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {/* —{" "}
                  {new Date(event.endDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })} */}
                </p>
                <h3 className="text-xl font-heading text-foreground transition-colors group-hover:text-primary md:text-2xl">
                  {event.name}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {event.description}
                </p>
                <p className="text-xs text-foreground/50">
                  {event.location.name} · {event.location.address}
                </p>
                <a
                  // href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-primary transition-all hover:translate-x-1 hover:text-primary/80"
                >
                  Learn more →
                </a>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
