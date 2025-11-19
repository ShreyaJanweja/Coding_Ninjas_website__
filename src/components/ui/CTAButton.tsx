"use client";

import type { Route } from "next";
import Link from "next/link";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type CTAButtonProps = {
  className?: string;
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  trackingId?: string;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

const variants = {
  primary:
    "bg-primary text-black hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  secondary:
    "bg-surface text-foreground border border-border hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ghost:
    "text-foreground/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

const MotionLink = motion.create(Link);
const MotionAnchor = motion.create("a");

export const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      trackingId,
      onClick,
      href,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();
    const sharedClasses = cn(
      "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none",
      "hover:text-inherit active:text-inherit focus:text-inherit",
      variants[variant],
      className,
    );

    const handleClick = (
      event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      if (trackingId) {
        trackEvent({
          action: "cta_click",
          category: "engagement",
          label: trackingId,
        });
      }

      if (onClick) {
        onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    const isExternal =
      href?.startsWith("http") ||
      href?.startsWith("mailto:") ||
      href?.startsWith("tel:");
    const isHashLink = href?.includes("#");

    // If it's an internal navigation link (not external, not hash), use button instead of link
    // This hides the URL preview in the browser status bar
    if (href && !isExternal && !isHashLink) {
      return (
        <motion.button
          className={sharedClasses}
          whileHover={{ scale: variant === "ghost" ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
            router.push(href as Route);
          }}
          ref={ref}
          {...props}
        >
          {children}
        </motion.button>
      );
    }

    if (href) {
      if (isExternal || isHashLink) {
        // External links and hash links still use anchor tags
        return (
          <MotionAnchor
            href={href}
            className={sharedClasses}
            whileHover={{ scale: variant === "ghost" ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            target={isExternal && href?.startsWith("http") ? "_blank" : undefined}
            rel={
              isExternal && href?.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            onClick={handleClick}
            title={typeof children === "string" ? children : ""}
          >
            {children}
          </MotionAnchor>
        );
      }
    }

    return (
      <motion.button
        whileHover={{ scale: variant === "ghost" ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={sharedClasses}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

CTAButton.displayName = "CTAButton";
