"use client";

import React from "react";
import SpotlightCard from "./SpotlightCard";
import { Github, Linkedin } from "lucide-react";

function normalizeUrl(url) {
  if (!url) return url;
  const u = url.trim();
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(u) || u.startsWith("mailto:"))
    return u;
  return "https://" + u.replace(/^\/+/, "");
}

export default function CreditsPage() {
  const contributors = [
    {
      name: "Bhavyan",
      items: ["Home Page", "Contact Page", "Join club component"],
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },

    {
      name: "Rohitash",
      items: [
        "Home page: Fundamental Pathway",
        "Events page: stack component & images",
        "Home page: Sponsors carousel",
      ],
      github: "https://github.com/Rohit12-web",
      linkedin: "https://www.linkedin.com/in/rohitash3386",
    },

    {
      name: "Aryan Garg",
      items: ["Events Page: Floating Ninja", "Home Page: Grow with CN"],
      github: "https://github.com/Aryangarg1804",
      linkedin:
        "https://www.linkedin.com/in/aryan18042007?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },

    {
      name: "Arshia Sharma",
      items: ["Home Page: Meet Our Team component", "Credits page"],
      github: "https://github.com/arshia-sharma",
      linkedin: "https://linkedin.com/in/arshia-sharma",
    },

    {
      name: "Samel Dhingra",
      items: ["Events Page: Floating Ninja", "Home Page: Grow with CN"],
      github: "https://github.com/samel22",
      linkedin: "https://www.linkedin.com/in/samel-dhingra-1a7a48244/",
    },

    {
      name: "Aryan Singh",
      items: ["Home Page: Ninja Game component"],
      github: "https://github.com/Snepard",
      linkedin:
        "https://www.linkedin.com/in/aryan-singh-992b6a328?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    },

    {
      name: "Aryan Balodi",
      items: ["Home Page: Ninja Game component", "The Code component"],
      github: "https://github.com/Aryanbalodi123",
      linkedin:
        "https://www.linkedin.com/in/aryan-balodi-522a6334b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },

    {
      name: "Khushboo Jain",
      items: ["About Us page"],
      github: "https://github.com/KhushbooJain0618",
      linkedin: "https://www.linkedin.com/in/khushboo-jain-7003a3301/",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white relative">
      <div className="max-w-6xl mt-24 mx-auto px-6 relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-6 tracking-tight">
          Credits
        </h1>
        <p className="text-center text-white/70 mb-10">
          Thanks to everyone who contributed to the Coding Ninjas Club website.
        </p>

        <div className="bg-white/6 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="p-8 md:p-12">
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributors.map((c) => (
                <SpotlightCard
                  key={c.name}
                  className="relative rounded-xl bg-white/4 border border-white/8 p-0 hover:scale-[1.01] transition-transform"
                  spotlightColor="rgba(255, 255, 255, 0.12)"
                >
                  <article
                    className="rounded-xl p-8 bg-gradient-to-br from-white/3 to-white/2 relative"
                    aria-labelledby={`contrib-${c.name.replace(/\s+/g, "-")}`}
                  >
                    <div className="relative size-32">
                      <div className="absolute top-0 right-0 size-16 flex gap-2 items-center">
                        {c.github && (
                          <a
                            href={c.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/70 hover:text-white transition relative z-10"
                          >
                            <Github size={22} />
                          </a>
                        )}

                        {c.linkedin && (
                          <a
                            href={c.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/70 hover:text-white transition relative z-10"
                          >
                            <Linkedin size={22} />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3
                      id={`contrib-${c.name.replace(/\s+/g, "-")}`}
                      className="relative font-semibold text-lg mb-3"
                    >
                      {c.name}
                    </h3>

                    <ul className="mt-3 list-inside list-disc text-sm text-white/80 space-y-1 pl-5 marker:text-indigo-400">
                      {c.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </article>
                </SpotlightCard>
              ))}
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-white/60"></div>
            </div>
          </div>
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#0b1020"
          d="M0,40 C360,140 1080,0 1440,80 L1440 120 L0 120 Z"
        />
      </svg>
    </div>
  );
}
