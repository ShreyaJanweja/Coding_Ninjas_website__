"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Instagram, X, Code, BookOpen, Puzzle, Cpu, Zap,Rocket , UsersRound, ShieldCheck , Atom, Sparkles, Binary, Terminal, Brain, Users, Calendar, ArrowDown, Sword, Target, Shield, Eye, GitBranch, Cloud, Database, Server, Wifi, WifiOff, Satellite } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { achievements } from "@/data/club";


const achievementIcons = [Rocket, UsersRound, ShieldCheck, Atom];


export default function AboutUsPage() {
  const [selectedDirector, setSelectedDirector] = useState<any>(null);
  const [selectedLeader, setSelectedLeader] = useState<any>(null);
  const [selectedPillar, setSelectedPillar] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [connectionStatus, setConnectionStatus] = useState<"secure" | "encrypted" | "stealth">("secure");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const statusInterval = setInterval(() => {
      setConnectionStatus(prev => {
        const statuses: Array<"secure" | "encrypted" | "stealth"> = ["secure", "encrypted", "stealth"];
        const currentIndex = statuses.indexOf(prev);
        return statuses[(currentIndex + 1) % statuses.length];
      });
    }, 3000);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(statusInterval);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const parallaxX = mousePosition.x * 0.01;
  const parallaxY = mousePosition.y * 0.01;

  return (
    <main className="min-h-screen text-white font-sans overflow-x-hidden relative">
      {/* NINJA TECH TERMINAL OVERLAY */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 text-xs font-mono">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="hidden xs:inline">SYSTEM: ONLINE</span>
          </motion.div>
          
          <motion.div
            key={connectionStatus}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            {connectionStatus === "secure" && <Shield className="w-3 h-3 text-green-400" />}
            {connectionStatus === "encrypted" && <GitBranch className="w-3 h-3 text-blue-400" />}
            {connectionStatus === "stealth" && <Eye className="w-3 h-3 text-purple-400" />}
            <span className="uppercase tracking-widest hidden sm:inline">{connectionStatus}</span>
          </motion.div>
        </div>
      </div>

      {/* Premium Hero Section */}
<section
  id="hero"
  className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20"
>
  <div className="text-center max-w-7xl mx-auto relative w-full">
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12 sm:mb-16"
      >
        <NinjaMantra />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity },
          scale: { duration: 6, repeat: Infinity },
        }}
        className="inline-block mb-16 sm:mb-20"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-[#FF6C0C] rounded-3xl rotate-45 relative overflow-hidden backdrop-blur-lg mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6C0C]/20 to-transparent" />
            <Sword className="absolute inset-0 m-auto w-12 h-12 sm:w-16 sm:h-16 text-[#FF6C0C] rotate-[-45deg]" />
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 m-auto w-40 h-40 sm:w-48 sm:h-48"
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#FF6C0C] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FF8C3C] rounded-full transform -translate-x-1/2 translate-y-1/2" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mb-12 sm:mb-16"
      >
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 sm:mb-12 leading-none tracking-tight">
          <motion.span
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent block"
          >
            CODING
          </motion.span>

          <motion.span
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 1.2, ease: "easeOut" }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-[#FF6C0C] via-[#FF8C3C] to-[#FF6C0C] bg-clip-text text-transparent block mt-2 sm:mt-4"
          >
            NINJAS
          </motion.span>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 1.8, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-transparent via-[#FF6C0C] to-transparent mx-auto max-w-2xl sm:max-w-4xl mb-12 sm:mb-16"
        />

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl sm:max-w-5xl mx-auto font-light tracking-wide mb-16 sm:mb-20 leading-relaxed px-4"
        >
          Where <span className="text-[#FF6C0C] font-semibold">innovation</span>{" "}
          meets excellence, crafting the future through{" "}
          <span className="text-[#FF6C0C] font-semibold">code</span> and
          strategic execution
        </motion.p>

        {/* ⭐ ACHIEVEMENTS DATA IN HERO BOXES ⭐ */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-2xl sm:max-w-4xl mx-auto px-4"
        >
          {achievements.map((item, index) => {
            const Icon = achievementIcons[index];

            return (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                whileHover={{ scale: 1.12, y: -10 }}
                className="text-center p-4 sm:p-6 md:p-8 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#FF6C0C] transition-all duration-500 backdrop-blur-lg group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.25 }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center mb-3"
                >
                  <Icon className="w-10 h-10 text-[#FF6C0C]" />
                </motion.div>

                <p className="text-4xl font-heading font-semibold text-[#FF6C0C] mb-1">
                  <CountUp end={item.value} duration={2.4} enableScrollSpy>
                    {({ countUpRef }) => (
                      <>
                        <span ref={countUpRef} /> {item.suffix}
                      </>
                    )}
                  </CountUp>
                </p>

                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  {item.metric}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* Enhanced Foundation Section */}
      <section id="pillars" className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.15 }}
    viewport={{ once: true }}
    className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FF6C0C_0%,_transparent_70%)] blur-3xl pointer-events-none"
  />

  <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 20, delay: 0.2 }}
              className="inline-flex items-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-[#FF6C0C] backdrop-blur-xl mb-6 sm:mb-8"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FF6C0C]" />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF6C0C] tracking-widest">
                ARCHITECTS OF VISION
              </span>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FF6C0C]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mt-8 sm:mt-10 mb-4 sm:mb-6"
            >
              The{" "}
              <span className="bg-gradient-to-r from-[#FF6C0C] to-[#FF8C3C] bg-clip-text text-transparent">
                Sensei
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4"
            >
              Visionary leaders who shape our path to technological excellence and innovation
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 px-0"> {/* Increased gap */}
      {pillars.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: index * 0.25, duration: 0.8, type: "spring" }}
          className="flex justify-center px-4 sm:px-5 lg:px-6"> {/* Increased side padding to match gap */}
          <EnhancedPillarCard
            member={member}
            index={index}
            onClick={() => setSelectedPillar(member)}
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>



      {/* Enhanced Leadership Section */}
      <section id="leadership" className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-[#FF6C0C] backdrop-blur-xl mb-6 sm:mb-8"
            >
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FF6C0C]" />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF6C0C] tracking-widest">STRATEGIC COMMAND</span>
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FF6C0C]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mt-8 sm:mt-10 mb-4 sm:mb-6"
            >
              Shinobi <span className="bg-gradient-to-r from-[#FF6C0C] to-[#FF8C3C] bg-clip-text text-transparent">Leaders</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4"
            >
              The brilliant minds driving innovation, strategy, and operational excellence
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 px-0"> {/* Increased gap */}
      {leadershipTeam.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.7, type: "spring" }}
          className="flex justify-center px-4 sm:px-5 lg:px-6"> {/* Increased side padding to match gap */}
          <EnhancedLeadershipCard 
            member={member} 
            index={index} 
            onClick={() => setSelectedLeader(member)}
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Enhanced Directors Section */}
      <section id="directors" className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-[#FF6C0C] backdrop-blur-xl mb-6 sm:mb-8"
            >
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FF6C0C]" />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF6C0C] tracking-widest">OPERATIONAL NEXUS</span>
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#FF6C0C]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mt-8 sm:mt-10 mb-4 sm:mb-6"
            >
              Field <span className="bg-gradient-to-r from-[#FF6C0C] to-[#FF8C3C] bg-clip-text text-transparent">Operatives</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4"
            >
              The operational backbone ensuring seamless execution across all initiatives
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 px-0"> {/* Increased gap */}
      {directors.map((director, index) => (
        <motion.div
          key={director.name}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="flex justify-center px-4 sm:px-5 lg:px-6"> {/* Increased side padding to match gap */}
          <EnhancedDirectorCard 
            director={director} 
            onClick={() => setSelectedDirector(director)}
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* NINJA PHILOSOPHY SECTION */}
      <section id="philosophy" className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6"
            >
              The <span className="bg-gradient-to-r from-[#FF6C0C] to-[#FF8C3C] bg-clip-text text-transparent">Code</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4"
            >
              Our guiding principles that define the Ninja way of coding
            </motion.p>
          </motion.div>

          <NinjaPhilosophyGrid />
        </div>
      </section>

      <AnimatePresence>
        {selectedDirector && (
          <EnhancedDirectorPopup 
            director={selectedDirector}
            onClose={() => setSelectedDirector(null)}
          />
        )}
        
        {selectedLeader && (
          <EnhancedLeaderPopup 
            leader={selectedLeader}
            onClose={() => setSelectedLeader(null)}
          />
        )}
        
        {selectedPillar && (
          <EnhancedPillarPopup 
            pillar={selectedPillar}
            onClose={() => setSelectedPillar(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* NINJA PHILOSOPHY GRID COMPONENT */
function NinjaPhilosophyGrid() {
  const philosophies = [
    {
      title: "ASPIRE",
      description: "Aim for excellence in every line of code. Dream big, code bigger.",
      Icon: Target,
    },
    {
      title: "LEARN",
      description: "Continuous growth through challenges. Every bug is a lesson.",
      Icon: BookOpen,
    },
    {
      title: "SOLVE",
      description: "Transform complex problems into elegant solutions with precision.",
      Icon: Puzzle,
    },
    {
      title: "INNOVATE",
      description: "Push boundaries and create what doesn't exist. Be the future.",
      Icon: Rocket,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-2 sm:px-4">
      {philosophies.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.6 }}
          className="group"
          style={{ perspective: "1000px" }}
        >
          {/* INNER CARD */}
          <div
            className="
              relative h-56 sm:h-64 w-full transition-all duration-700 
              [transform-style:preserve-3d]
              group-hover:[transform:rotateY(180deg)]
            "
          >
            {/* FRONT */}
          {/* FRONT SIDE */}
<div
  className="
    absolute inset-0 
    rounded-3xl 
    backdrop-blur-xl 
    border border-orange-500/10 
    shadow-[0_8px_30px_rgba(0,0,0,0.35)]
    flex flex-col items-center justify-center text-center 
    p-6
  "
  style={{
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "rotateY(0deg)",
  }}
>
  {/* Icon Wrapper */}
  <div
    className="
      flex items-center justify-center
      w-16 h-16 rounded-2xl
      bg-gradient-to-br from-orange-500/20 to-orange-600/10
      border border-orange-400/20
      shadow-[0_0_20px_rgba(255,120,0,0.15)]
      mb-4
    "
  >
    <item.Icon className="w-10 h-10 text-orange-400 drop-shadow-[0_2px_8px_rgba(255,120,0,0.35)]" />
  </div>

  {/* Title */}
  <h3 className="text-xl font-semibold tracking-wide text-orange-300">
    {item.title}
  </h3>

  {/* Divider */}
  <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent my-3"></div>

 
</div>

            {/* BACK */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#FF6C0C]/30 via-black to-[#FF6C0C]/10 
              border-2 border-[#FF6C0C]/50 rounded-3xl p-8 text-center flex items-center justify-center 
              shadow-2xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-gray-100 text-base leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* NINJA MANTRA COMPONENT */
function NinjaMantra() {
  const words = ["ASPIRE", "LEARN", "SOLVE", "INNOVATE"];
  
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap px-4">
      {words.map((word, index) => (
        <motion.div
          key={word}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
          whileHover={{ scale: 1.1, y: -5 }}
          className="flex items-center gap-1 sm:gap-2"
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FF6C0C] rounded-full" />
          <span className="text-[#FF6C0C] font-bold text-sm sm:text-lg tracking-widest">{word}</span>
          {index < words.length - 1 && (
            <motion.div
              animate={{ rotate: 45 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="w-1 h-1 bg-[#FF6C0C] rounded-full"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Updated EnhancedPillarCard with Responsive Design
function EnhancedPillarCard({ member, index, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -10 }}
      className="relative group cursor-pointer h-full min-h-[500px] sm:min-h-[550px] md:min-h-[600px] bg-gradient-to-br from-black to-gray-900 border-2 border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden border-[#FF6C0C]/30 hover:border-[#FF6C0C] transition-all duration-700 flex flex-col shadow-2xl shadow-black/50 w-full mx-auto" // Removed mx-1 sm:mx-2, added mx-auto
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <motion.div
        animate={{ scale: isHovered ? 1.08 : 1 }}
        className="relative h-60 sm:h-64 md:h-72 flex-shrink-0 overflow-hidden"
      >
        <Image
          src={member.img}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-1000"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          priority={index === 0}
          style={{ objectPosition: "center center" }}
        />

        <motion.div
          animate={{ opacity: isHovered ? 0.3 : 0.1 }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/40 transition-opacity duration-500"
        />

        <motion.div
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6C0C]/20 to-transparent transform skew-x-12"
        />
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
        <div className="flex-1 space-y-3 sm:space-y-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl font-bold text-white leading-tight"
          >
            {member.name}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-[#FF6C0C] rounded-full"
          >
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {member.role}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-4"
          >
            {member.bio}
          </motion.p>
        </div>

        {/* LinkedIn Button */}
        <motion.a
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={member.linkedin}
          className="flex items-center justify-center gap-2 sm:gap-3 w-full py-2 sm:py-3 md:py-4 mt-4 sm:mt-6 bg-gradient-to-r from-[#FF6C0C] to-[#FF8C3C] hover:from-[#FF8C3C] hover:to-[#FF6C0C] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-[#FF6C0C]/20"
          onClick={(e) => e.stopPropagation()}
        >
          <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
          Connect on LinkedIn
        </motion.a>
      </div>
    </motion.div>
  );
}

// Updated EnhancedLeadershipCard with Responsive Design
function EnhancedLeadershipCard({ member, index, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -15 }}
      className="relative cursor-pointer group w-full min-h-[450px] sm:min-h-[500px] bg-gradient-to-br from-black to-gray-900 border-2 border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[#FF6C0C] transition-all duration-700 flex flex-col shadow-2xl shadow-black/50 w-full mx-auto" // Removed mx-1 sm:mx-2, added mx-auto
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <motion.div
        animate={{ scale: isHovered ? 1.12 : 1 }}
        className="relative h-56 sm:h-60 md:h-64 flex-shrink-0 overflow-hidden"
      >
        <Image
          src={member.img}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-1000"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          priority={index === 0}
          style={{ objectPosition: "center center" }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-t from-black to-transparent" />
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 md:p-6">
        <div className="flex-1 space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{member.name}</h3>
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-[#FF6C0C] rounded-full">
            <span className="text-xs font-bold text-white uppercase tracking-widest">{member.role}</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {member.bio}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
          <motion.a 
            whileHover={{ scale: 1.05, y: -2 }}
            href={member.linkedin} 
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-[#FF6C0C] hover:bg-[#FF8C3C] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
            Connect
          </motion.a>
          {member.insta && (
            <motion.a 
              whileHover={{ scale: 1.1, rotate: 360 }}
              href={member.insta} 
              className="flex items-center justify-center px-2 sm:px-3 py-2 sm:py-3 border-2 border-[#FF6C0C] hover:bg-[#FF6C0C] text-[#FF6C0C] hover:text-white rounded-lg sm:rounded-xl transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Updated EnhancedDirectorCard with Responsive Design
function EnhancedDirectorCard({ director, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -8 }}
      className="relative cursor-pointer w-full min-h-[400px] sm:min-h-[450px] bg-gradient-to-br from-black to-gray-900 border-2 border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 hover:border-[#FF6C0C] transition-all duration-700 shadow-xl shadow-black/50 w-full mx-auto flex flex-col" // Removed mx-1 sm:mx-2, added mx-auto
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Square Image */}
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        className="relative w-full h-56 sm:h-60 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 flex-shrink-0"
      >
        <Image
          src={director.img}
          alt={director.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          style={{ objectPosition: "center center" }}
        />
      </motion.div>

      <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
        <div className="flex-1 space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{director.name}</h3>
          <p className="text-[#FF6C0C] text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">
            {director.role}
          </p>
        </div>
        
        <div className="flex gap-2 sm:gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 bg-gradient-to-r from-[#FF6C0C] to-[#FF8C3C] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-[#FF6C0C]/20"
          >
            <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
            Profile
          </motion.button>
          {director.insta && (
            <motion.a 
              whileHover={{ scale: 1.1, rotate: 360 }}
              href={director.insta}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center px-2 sm:px-3 py-2 sm:py-3 border-2 border-[#FF6C0C] hover:bg-[#FF6C0C] text-[#FF6C0C] hover:text-white rounded-lg sm:rounded-xl transition-all duration-300"
            >
              <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ... (Popup components remain the same with responsive updates if needed)

/* Enhanced Director Popup with Instagram */
function EnhancedDirectorPopup({ director, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="bg-gradient-to-br from-black to-gray-900 border-2 border-[#FF6C0C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-[#FF6C0C] hover:bg-opacity-20 rounded-xl transition-colors duration-150 z-10 group"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6C0C] group-hover:text-white transition-colors duration-150" />
        </motion.button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-[#FF6C0C] mb-4 sm:mb-6 relative"
          >
            <Image
              src={director.img}
              alt={director.name}
              fill
              className="object-cover"
              sizes="400px"
              style={{ objectPosition: "center center" }}
            />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4"
          >
            {director.name}
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-1 sm:py-2 bg-[#FF6C0C] rounded-full mb-4 sm:mb-6"
          >
            <span className="text-sm sm:text-base font-bold text-white uppercase tracking-widest">{director.role}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10"
          >
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {director.bio}
            </p>
          </motion.div>

          <div className="flex gap-2 sm:gap-3 justify-center">
            <motion.a 
              href={director.linkedin}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[#FF6C0C] hover:bg-[#FF8C3C] text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg shadow-[#FF6C0C]/30"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              LinkedIn
            </motion.a>
            {director.insta && (
              <motion.a 
                href={director.insta}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border-2 border-[#FF6C0C] hover:bg-[#FF6C0C] text-[#FF6C0C] hover:text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                Instagram
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ... (EnhancedLeaderPopup and EnhancedPillarPopup components with similar responsive updates)

/* Enhanced Leader Popup */
function EnhancedLeaderPopup({ leader, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="bg-gradient-to-br from-black to-gray-900 border-2 border-[#FF6C0C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-[#FF6C0C] hover:bg-opacity-20 rounded-xl transition-colors duration-150 z-10 group"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6C0C] group-hover:text-white transition-colors duration-150" />
        </motion.button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-[#FF6C0C] mb-4 sm:mb-6 relative"
          >
            <Image
              src={leader.img}
              alt={leader.name}
              fill
              className="object-cover"
              sizes="400px"
            />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4"
          >
            {leader.name}
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-1 sm:py-2 bg-[#FF6C0C] rounded-full mb-4 sm:mb-6"
          >
            <span className="text-sm sm:text-base font-bold text-white uppercase tracking-widest">{leader.role}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10"
          >
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {leader.bio}
            </p>
          </motion.div>

          <div className="flex gap-2 sm:gap-3 justify-center">
            <motion.a 
              href={leader.linkedin}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[#FF6C0C] hover:bg-[#FF8C3C] text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg shadow-[#FF6C0C]/30"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              LinkedIn
            </motion.a>
            {leader.insta && (
              <motion.a 
                href={leader.insta}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 border-2 border-[#FF6C0C] hover:bg-[#FF6C0C] text-[#FF6C0C] hover:text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                Instagram
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Enhanced Pillar Popup */
function EnhancedPillarPopup({ pillar, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="bg-gradient-to-br from-black to-gray-900 border-2 border-[#FF6C0C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-[#FF6C0C] hover:bg-opacity-20 rounded-xl transition-colors duration-150 z-10 group"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6C0C] group-hover:text-white transition-colors duration-150" />
        </motion.button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-[#FF6C0C] mb-4 sm:mb-6 relative"
          >
            <Image
              src={pillar.img}
              alt={pillar.name}
              fill
              className="object-cover"
              sizes="400px"
            />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4"
          >
            {pillar.name}
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-1 sm:py-2 bg-[#FF6C0C] rounded-full mb-4 sm:mb-6"
          >
            <span className="text-sm sm:text-base font-bold text-white uppercase tracking-widest">{pillar.role}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10"
          >
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {pillar.bio}
            </p>
          </motion.div>

          <div className="flex gap-2 sm:gap-3 justify-center">
            <motion.a 
              href={pillar.linkedin}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[#FF6C0C] hover:bg-[#FF8C3C] text-white font-bold rounded-xl transition-all duration-300 text-sm sm:text-base shadow-lg shadow-[#FF6C0C]/30"
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              LinkedIn
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Data arrays remain the same...
const pillars = [
  { 
    name: "Dr. Rishu Chhabra", 
    role: "University Level Designated Officer", 
    img: "/team/rishu.png", 
    linkedin: "#",
    bio: "As the University Level Designated Officer, Dr. Rishu Chhabra provides strategic leadership and academic oversight for all technical initiatives. With over 15 years of experience in computer science education, she mentors students in cutting-edge technologies while fostering industry-academia collaborations. Her visionary approach integrates practical learning with theoretical foundations, creating an ecosystem where innovation thrives. Dr. Chhabra's dedication to excellence has transformed the coding culture across campus, making technology education accessible and impactful for every student."
  },
  { 
    name: "Dr. Chetna Sharma", 
    role: "Lead, Coding Ninjas CUIET", 
    img: "/team/chetna.png", 
    linkedin: "#",
    bio: "Dr. Chetna Sharma leads Coding Ninjas CUIET with unparalleled passion and commitment to technological advancement. Her innovative teaching methodologies and student-centric approach have revolutionized how coding education is delivered. With expertise in multiple programming paradigms and software development practices, she guides students through complex technical challenges while nurturing their creative potential. Dr. Sharma's leadership has established a vibrant community where students transform into skilled developers, ready to tackle real-world problems with confidence and technical excellence."
  },
  { 
    name: "Ms. Gagandeep Kaur", 
    role: "Associate Lead, Coding Ninjas CUIET", 
    img: "/team/gagandeep.png", 
    linkedin: "#",
    bio: "Ms. Gagandeep Kaur serves as the Associate Lead, bringing dynamic operational management and strategic execution to Coding Ninjas CUIET. Her exceptional organizational skills and student engagement strategies ensure seamless coordination of all technical events and workshops. With a focus on practical skill development, she designs learning pathways that bridge academic knowledge with industry requirements. Ms. Kaur's innovative approaches to technical education have significantly enhanced student participation and learning outcomes across all programming domains and technology stacks."
  },
];

const leadershipTeam = [
  { 
    name: "Ansh Chahal", 
    role: "Chairman", 
    img: "/team/ansh.png", 
    linkedin: "#", 
    insta: "#", 
    bio: "As Chairman, Ansh Chahal provides visionary leadership and strategic direction for Coding Ninjas CUIET. His exceptional management skills and innovative thinking have been instrumental in scaling the club's operations and impact across campus. With a deep understanding of technology trends and student needs, he fosters an environment of collaboration and continuous learning. Ansh's ability to identify talent and nurture leadership qualities has built a strong foundation for sustainable growth, making the club a premier destination for aspiring developers and tech enthusiasts."
  },
  { 
    name: "Aditya Pathania", 
    role: "Chief Executive Officer", 
    img: "/team/aditya1.png", 
    linkedin: "#", 
    insta: "#", 
    bio: "Aditya Pathania, as Chief Executive Officer, drives the operational excellence and strategic vision of Coding Ninjas CUIET. His exceptional leadership ensures seamless execution of all technical initiatives and learning programs. With a keen eye for innovation and process optimization, he has implemented efficient workflows that enhance member experience and learning outcomes. Aditya's commitment to technological advancement and community building has positioned the club as a hub for cutting-edge development practices and collaborative problem-solving among students."
  },
  { 
    name: "Anishka", 
    role: "Operations and HR Director", 
    img: "/team/anishka2.png", 
    linkedin: "#", 
    insta: "#", 
    bio: "Anishka, as Operations and HR Director, cultivates a thriving organizational culture while ensuring operational efficiency across all departments. Her innovative HR practices and talent management strategies have built a cohesive team of passionate developers and tech enthusiasts. With exceptional interpersonal skills and systematic approach to workflow optimization, she creates an inclusive environment where every member can grow and contribute effectively. Anishka's dedication to team development and process improvement has been crucial in maintaining the club's dynamic and productive atmosphere."
  },
  { 
    name: "Astha", 
    role: "Chief Operating Officer", 
    img: "/team/astha.png", 
    linkedin: "#", 
    insta: "#", 
    bio: "Astha, serving as Chief Operating Officer, orchestrates the seamless execution of all technical operations and strategic initiatives. Her exceptional organizational skills and attention to detail ensure that every workshop, hackathon, and learning session runs with precision and impact. With a talent for resource management and process optimization, she has streamlined club operations while maintaining the highest quality standards. Astha's ability to coordinate multiple projects simultaneously while fostering team collaboration has been instrumental in the club's consistent delivery of exceptional technical education."
  },
  { 
    name: "Monal", 
    role: "Chief Marketing Officer", 
    img: "/team/monal.png", 
    linkedin: "#", 
    insta: "#", 
    bio: "Monal, as Chief Marketing Officer, crafts compelling narratives and strategic communication that amplify Coding Ninjas CUIET's presence across digital platforms. Her innovative marketing campaigns and brand development strategies have significantly increased club visibility and member engagement. With expertise in digital marketing trends and audience analytics, she creates targeted content that resonates with the tech community. Monal's creative approach to brand storytelling and community outreach has established the club as a prominent voice in the campus technology ecosystem."
  },
  { 
    name: "Jagjot", 
    role: "Visual Media Lead", 
    img: "/team/jagjot.png", 
    linkedin: "#", 
    insta: "#", 
    bio: "Jagjot, as Visual Media Lead, transforms technical concepts into stunning visual experiences that define Coding Ninjas CUIET's creative identity. His exceptional design skills and artistic vision create compelling visual narratives that communicate complex technical ideas with clarity and impact. With expertise in graphic design, video production, and digital media, he develops engaging content that captures the club's innovative spirit. Jagjot's creative direction has established a distinctive visual language that resonates with the tech community while maintaining professional excellence."
  }
];

const directors = [
  { name: "Archita", role: "HR Manager", img: "/team/archita1.png", linkedin: "#", insta: "#", bio: "As HR Manager, Archita oversees talent management and organizational development, ensuring smooth team coordination and member engagement through effective human resource strategies and interpersonal communication." },
  { name: "Jaskirat", role: "Secretary", img: "/team/jaskirat1.png", linkedin: "#", insta: "#", bio: "Jaskirat serves as Secretary, maintaining organizational records and facilitating inter-departmental communication while ensuring efficient documentation and administrative support for all club activities and initiatives." },
  { name: "Manya", role: "Joint Secretary", img: "/team/manya1.png", linkedin: "#", insta: "#", bio: "Manya, as Joint Secretary, supports secretarial functions and coordinates departmental activities while assisting in maintaining organizational efficiency and smooth operational workflow across all teams." },
  { name: "Mohit", role: "Community Coordinator", img: "/team/mohit.png", linkedin: "#", insta: "#", bio: "Mohit builds and nurtures the coding community as Community Coordinator, fostering engagement and collaboration among members while organizing interactive sessions and networking opportunities." },
  { name: "Akshat Anand", role: "Events Director", img: "/team/akshat1.png", linkedin: "#", insta: "#", bio: "Akshat Anand plans and executes technical events as Events Director, coordinating hackathons and workshops while ensuring seamless organization and participant engagement in all activities." },
  { name: "Himani Batra", role: "Events Director", img: "/team/himani1.png", linkedin: "#", insta: "#", bio: "Himani Batra manages event coordination and participant experience as Events Director, creating engaging technical competitions and learning sessions that foster skill development." },
  { name: "Bhavyan", role: "Technical Advisor", img: "/team/bhavyan.png", linkedin: "#", insta: "#", bio: "Bhavyan provides technical guidance and mentorship as Technical Advisor, offering expertise in programming concepts and development practices to enhance member learning outcomes." },
  { name: "Ashita", role: "Outreach Director", img: "/team/ashita1.png", linkedin: "#", insta: "#", bio: "Ashita leads outreach initiatives as Outreach Director, building partnerships with external organizations and expanding the club's network within the broader tech community." },
  { name: "Harshil Mahajan", role: "Outreach Director", img: "/team/harshilM1.png", linkedin: "#", insta: "#", bio: "Harshil Mahajan develops strategic partnerships as Outreach Director, establishing valuable connections with industry professionals and tech companies for collaborative opportunities." },
  { name: "Ankit", role: "Outreach Director", img: "/team/ankit2.png", linkedin: "#", insta: "#", bio: "Ankit expands community engagement as Outreach Director, coordinating with external stakeholders and organizing collaborative events that bridge academia and industry." },
  { name: "Roshnee Loona", role: "Content Director", img: "/team/roshnee.png", linkedin: "#", insta: "#", bio: "Roshnee Loona oversees content creation as Content Director, developing educational materials and technical documentation that support member learning and skill development." },
  { name: "Sarthak Dey", role: "Documentation Director", img: "/team/sarthak.png", linkedin: "#", insta: "#", bio: "Sarthak Dey manages organizational documentation as Documentation Director, maintaining records and creating comprehensive reports that track club activities and achievements." },
  { name: "Abhinav", role: "Media Director", img: "/team/abhinav.png", linkedin: "#", insta: "#", bio: "Abhinav coordinates media production as Media Director, overseeing content creation and distribution across various platforms to enhance club visibility and engagement." },
  { name: "Sehaj", role: "Media Director", img: "/team/sehaj.png", linkedin: "#", insta: "#", bio: "Sehaj manages digital media operations as Media Director, creating engaging content and maintaining consistent brand presence across all communication channels." },
  { name: "Apran", role: "Social Media Director", img: "/team/apran1.png", linkedin: "#", insta: "#", bio: "Apran leads social media strategy as Social Media Director, developing engaging content and managing online presence to build community interaction and awareness." },
  { name: "Sukhpreet Singh", role: "Graphics Director", img: "/team/sukhpreet1.png", linkedin: "#", insta: "#", bio: "Sukhpreet Singh creates visual assets as Graphics Director, designing compelling graphics and visual content that enhance club branding and communication materials." },
  { name: "Kashak", role: "Logistics Director", img: "/team/kashak1.png", linkedin: "#", insta: "#", bio: "Kashak manages operational logistics as Logistics Director, coordinating resources and facilities to ensure smooth execution of all club events and activities." },
  { name: "Harshil", role: "Marketing Director", img: "/team/harshil2.png", linkedin: "#", insta: "#", bio: "Harshil develops marketing strategies as Marketing Director, creating campaigns that promote club initiatives and attract participation from the student community." },
];
