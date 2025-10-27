"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideRenderer } from "@/components/SlideRenderer";
import { NavigationSettings, NavigationConfig, defaultConfig } from "@/components/NavigationSettings";
import slidesData from "@/data/slides.json";
import { PresentationData } from "@/types/slides";

const data: PresentationData = slidesData as PresentationData;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [navConfig, setNavConfig] = useState<NavigationConfig>(defaultConfig);
  const totalSlides = data.presentation.totalSlides;

  // Load config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('navigation-config');
    if (savedConfig) {
      try {
        setNavConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to parse saved config:', e);
      }
    }
  }, []);

  // Save config to localStorage
  const handleConfigChange = (newConfig: NavigationConfig) => {
    setNavConfig(newConfig);
    localStorage.setItem('navigation-config', JSON.stringify(newConfig));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Render bottom navigation buttons based on config
  const renderBottomNavButton = (type: 'prev' | 'indicators' | 'next') => {
    if (!navConfig.bottomNav.visible[type]) return null;

    switch (type) {
      case 'prev':
        return (
          <motion.div key="prev" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={prevSlide}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </motion.div>
        );

      case 'indicators':
        return (
          <div key="indicators" className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/60 w-2"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  width: index === currentSlide ? "32px" : "8px",
                  backgroundColor:
                    index === currentSlide
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(255, 255, 255, 0.4)",
                }}
                transition={{ duration: 0.3 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        );

      case 'next':
        return (
          <motion.div key="next" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={nextSlide}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
              disabled={currentSlide === totalSlides - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Render top navigation buttons based on config
  const renderTopNavButton = (type: 'share' | 'counter') => {
    if (!navConfig.topNav.visible[type]) return null;

    switch (type) {
      case 'share':
        return (
          <motion.div key="share" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleShare}
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
              title={copied ? "Link copied!" : "Share presentation"}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        );

      case 'counter':
        return (
          <motion.div
            key="counter"
            className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/30"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentSlide + 1} / {totalSlides}
            </motion.span>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Get position classes for containers
  const getBottomNavPosition = () => {
    switch (navConfig.bottomNav.position) {
      case 'left':
        return 'left-8';
      case 'right':
        return 'right-8';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  const getTopNavPosition = () => {
    switch (navConfig.topNav.position) {
      case 'left':
        return 'left-8';
      case 'right':
      default:
        return 'right-8';
    }
  };

  const getKeyboardHintPosition = () => {
    switch (navConfig.keyboardHint.position) {
      case 'top-left':
        return 'top-8 left-8';
      case 'top-right':
        return 'top-8 right-8';
      case 'bottom-left':
        return 'bottom-8 left-8';
      case 'bottom-right':
        return 'bottom-8 right-8';
      default:
        return 'top-8 left-8';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <SlideRenderer slide={data.slides[currentSlide]} />
      </AnimatePresence>

      {/* Bottom Navigation Controls */}
      <motion.div
        className={`fixed bottom-8 ${getBottomNavPosition()} z-50 flex items-center justify-center gap-4`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {navConfig.bottomNav.order.map((item) => renderBottomNavButton(item))}
      </motion.div>

      {/* Top Navigation Controls */}
      <motion.div
        className={`fixed top-8 ${getTopNavPosition()} z-50 flex items-center gap-3`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {navConfig.topNav.order.map((item) => renderTopNavButton(item))}

        {/* Settings Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <NavigationSettings config={navConfig} onConfigChange={handleConfigChange} />
        </motion.div>
      </motion.div>

      {/* Keyboard Hint */}
      {navConfig.keyboardHint.visible && (
        <motion.div
          className={`fixed ${getKeyboardHintPosition()} z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/70 text-sm border border-white/30`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.05, opacity: 1 }}
        >
          Use ← → arrows or spacebar to navigate
        </motion.div>
      )}
    </div>
  );
}
