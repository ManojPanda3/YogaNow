// app/about/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Award, Leaf, Palette, ArrowDownCircle, Instagram, Facebook, Heart } from 'lucide-react';

// --- SEO Optimization using Next.js Metadata API ---
export const metadata: Metadata = {
  title: "About Yoganow | High-Quality Yoga Mats, Apparel & Accessories",
  description: "Discover the story behind Yoganow. Learn about our commitment to crafting high-quality, sustainable yoga mats, apparel, and accessories to support your mindful practice.",
  keywords: ["high-quality yoga mats", "eco-friendly yoga clothes", "sustainable yoga accessories", "Yoganow story", "premium yoga gear"],
};

// --- Page Component ---
export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <header className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Optimized Image: `next/image` handles lazy loading, format conversion (WebP), and resizing.
            'fill' makes it cover the parent, 'priority' loads it first for better LCP. */}
        <Image
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
          alt="Serene yoga pose"
          fill
          className="object-cover opacity-80 animate-fade-in"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-center p-[10%] animate-fade-in">
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-8 animate-slide-up shadow-lg">
            Mindful Movement, <br /> Consciously Crafted.
          </h1>
          {/* Optimized Link: `next/link` pre-fetches the route for instant navigation. */}
          <Link
            href="#our-story"
            className="bg-white text-gray-900 py-4 px-8 rounded-full font-semibold transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-xl animate-slide-up-delayed flex items-center"
          >
            <ArrowDownCircle className="w-5 h-5 mr-2" />
            Discover Our Story
          </Link>
        </div>
      </header>

      <main>
        {/* Our Story Section */}
        <section id="our-story" className="max-w-4xl mx-auto px-8 py-32 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600/30" />
          <h2 className="text-4xl font-bold text-center mb-4">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            Yoganow was born from a simple desire: to create beautiful, high-performance yoga gear that honors both the practice and the planet. We are passionate about crafting products that not only support your journey on the mat but also reflect a commitment to sustainability and mindful living.
          </p>
        </section>

        {/* Our Philosophy Section (Using a reusable component) */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <PhilosophyCard
              icon={<Award className="w-12 h-12 mb-4 text-gray-700" />}
              imageSrc="https://images.unsplash.com/photo-1593810450967-f3c2aeb71d0f"
              imageAlt="Yoga mat close-up"
              title="Quality & Performance"
              description="We use only the finest, most durable materials to ensure your gear performs as beautifully as it looks, practice after practice."
            />
            <PhilosophyCard
              icon={<Leaf className="w-12 h-12 mb-4 text-gray-700" />}
              imageSrc="https://images.unsplash.com/photo-1526779259212-939e64788e3c"
              imageAlt="Eco-friendly materials"
              title="Sustainability"
              description="Our commitment to the earth is woven into everything we do, from eco-friendly materials to ethical production processes."
            />
            <PhilosophyCard
              icon={<Palette className="w-12 h-12 mb-4 text-gray-700" />}
              imageSrc="https://images.unsplash.com/photo-1545205597-3d9d02c29597"
              imageAlt="Yoga product design"
              title="Mindful Design"
              description="Every Yoganow product is thoughtfully designed to inspire and elevate your practice, blending functionality with serene aesthetics."
            />
          </div>
        </section>

        {/* Commitment to Quality Section */}
        <section className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 w-full animate-float">
            <Image
              src="https://images.unsplash.com/photo-1591291621364-118944b03d0d"
              alt="High-quality, eco-friendly yoga mat"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 w-full">
            <h2 className="text-3xl font-bold mb-4">A Commitment to Quality</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              From our signature non-slip yoga mats crafted from natural tree rubber to our buttery-soft apparel made with recycled fibers, every item is a testament to our dedication to quality. We believe your yoga gear should be a seamless extension of your practice—supportive, comfortable, and beautiful.
            </p>
          </div>
        </section>

        {/* Meet the Founder Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Image
              src="https://images.unsplash.com/photo-1589571894922-40d3a56a5e1e"
              alt="Founder of Yoganow"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-6"
            />
            <h3 className="text-2xl font-semibold mb-2">Meet Our Founder, [Founder's Name]</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              [Founder's Name] started Yoganow with the vision of creating a brand that truly embodies the spirit of yoga. A dedicated yogi and advocate for sustainable living, [Founder's Name]’s passion for quality and mindfulness is at the heart of every product we create.
            </p>
          </div>
        </section>

        {/* Join Our Community Section (Using a reusable component) */}
        <section className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Connect with us on social media and subscribe to our newsletter for inspiration, updates, and more.
          </p>
          <div className="flex justify-center gap-6">
            <SocialLink href="#" icon={<Instagram />} label="Instagram" />
            <SocialLink href="#" icon={<Facebook />} label="Facebook" />
            <SocialLink href="#" icon={<Heart />} label="Pinterest" />
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Reusable Sub-Components for Clean Code ---

function PhilosophyCard({ icon, imageSrc, imageAlt, title, description }: { icon: React.ReactNode; imageSrc: string; imageAlt: string; title: string; description: string }) {
  return (
    <div className="relative text-center p-8 rounded-2xl transition-all duration-300 ease-in-out hover:bg-white hover:transform hover:-translate-y-1.5 hover:shadow-lg animate-fade-in overflow-hidden">
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover opacity-10 -z-10" />
      <div className="relative z-10 flex flex-col items-center">
        {icon}
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Use a standard `<a>` tag for external links
function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}
