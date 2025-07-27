"use client"

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const HeroPage = () => {
  // Animation variants for the container to orchestrate children animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Each child will animate 0.3s after the previous one
      },
    },
  };

  // Animation variants for the text and button elements
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative flex h-[calc(100vh-56px)] w-full items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Woman meditating peacefully on a dock by a lake at sunrise"
        fill
        className="object-cover"
        priority // Load the hero image first
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center text-white px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Discover Your Inner Sanctuary
        </motion.h1>

        <motion.p
          className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl"
          variants={itemVariants}
        >
          Experience the perfect blend of comfort, style, and sustainability with
          our premium yoga collection. Designed for your journey, on and off the
          mat.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <Link href="/products" passHref>
            <Button size="lg" className="font-semibold cursor-pointer">
              Shop Now
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button size="lg" variant="secondary" className="font-semibold cursor-pointer">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
export default HeroPage
