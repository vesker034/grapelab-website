"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { renderMarkdown } from "@/lib/markdown";

interface BlogPostData {
  title: string;
  date: string;
  subtitle: string;
  imageUrl?: string;
  content: string; // Markdown content
}

interface BlogPostSectionProps {
  data: BlogPostData;
}

// Component to animate individual HTML elements
const AnimatedContent = ({ htmlContent }: { htmlContent: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];

    // Set initial hidden state before observing
    children.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(60px)";
      el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    // Each element animates in individually when it enters the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    children.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

const BlogPostSection = ({ data }: BlogPostSectionProps) => {
  // Convert Markdown to HTML on server
  const htmlContent = renderMarkdown(data.content);

  // Animation variants for header
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Title and Date */}
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={fadeInUp}
          >
            <h1 className="text-[32px] font-semibold text-headings">
              {data.title}
            </h1>
            <span className="text-muted text-sm whitespace-nowrap ml-4">
              {data.date}
            </span>
          </motion.div>

          {/* Main Image */}
          {data.imageUrl && (<motion.div
            className="w-full h-[400px] lg:h-[500px] bg-gray-600 rounded-[24px] mb-12 overflow-hidden"
            variants={scaleIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundImage: `url(${data.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></motion.div>)}

          {/* Subtitle */}
          <motion.h2
            className="text-[24px] font-semibold text-headings-draft mb-8"
            variants={fadeInUp}
          >
            {data.subtitle}
          </motion.h2>
        </motion.div>

        {/* Markdown Content with Animations */}
        <AnimatedContent htmlContent={htmlContent} />
      </div>
    </div>
  );
};

export default BlogPostSection;
