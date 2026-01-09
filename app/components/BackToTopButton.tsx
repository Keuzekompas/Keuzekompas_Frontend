"use client";

import { useState, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-50 p-3 rounded-full bg-(--color-brand) text-white shadow-lg transition-all duration-300 hover:bg-(--color-brand-hover) hover:scale-110 focus:outline-none ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
};

export default BackToTopButton;
