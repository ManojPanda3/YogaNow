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
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
          alt="Serene yoga pose"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center p-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Mindful Movement, <br /> Consciously Crafted.
          </h1>
          <Link
            href="#our-story"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-300 ease-in-out"
          >
            <ArrowDownCircle className="w-5 h-5 mr-2" />
            Discover Our Story
          </Link>
        </div>
      </header>

      <main>
        {/* Our Story Section */}
        <section id="our-story" className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Yoganow was born from a simple desire: to create beautiful, high-performance yoga gear that honors both the practice and the planet. We are passionate about crafting products that not only support your journey on the mat but also reflect a commitment to sustainability and mindful living.
          </p>
        </section>

        {/* Our Philosophy Section (Using a reusable component) */}
        <section className="bg-muted/40 py-20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <PhilosophyCard
              icon={<Award className="w-12 h-12 mb-4 text-primary" />}
              title="Quality & Performance"
              description="We use only the finest, most durable materials to ensure your gear performs as beautifully as it looks, practice after practice."
            />
            <PhilosophyCard
              icon={<Leaf className="w-12 h-12 mb-4 text-primary" />}
              title="Sustainability"
              description="Our commitment to the earth is woven into everything we do, from eco-friendly materials to ethical production processes."
            />
            <PhilosophyCard
              icon={<Palette className="w-12 h-12 mb-4 text-primary" />}
              title="Mindful Design"
              description="Every Yoganow product is thoughtfully designed to inspire and elevate your practice, blending functionality with serene aesthetics."
            />
          </div>
        </section>

        {/* Commitment to Quality Section */}
        <section className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12 bg-card rounded-lg shadow-lg">
          <div className="md:w-1/2 w-full">
            <Image
              src="https://images.unsplash.com/photo-1591291621364-118944b03d0d"
              alt="High-quality, eco-friendly yoga mat"
              width={600}
              height={400}
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-1/2 w-full p-4">
            <h2 className="text-3xl font-bold mb-4">A Commitment to Quality</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              From our signature non-slip yoga mats crafted from natural tree rubber to our buttery-soft apparel made with recycled fibers, every item is a testament to our dedication to quality. We believe your yoga gear should be a seamless extension of your practice—supportive, comfortable, and beautiful.
            </p>
          </div>
        </section>

        {/* Meet the Founder Section */}
        <section className="py-20 bg-muted/40">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Image
              src="https://images.unsplash.com/photo-1589571894922-40d3a56a5e1e"
              alt="Founder of Yoganow"
              width={150}
              height={150}
              className="rounded-full mx-auto mb-6 shadow-lg"
            />
            <h3 className="text-2xl font-semibold mb-2">Meet Our Founder, [Founder's Name]</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              [Founder's Name] started Yoganow with the vision of creating a brand that truly embodies the spirit of yoga. A dedicated yogi and advocate for sustainable living, [Founder's Name]’s passion for quality and mindfulness is at the heart of every product we create.
            </p>
          </div>
        </section>

        {/* Join Our Community Section */}
        <section className="text-center py-20 bg-card rounded-lg shadow-lg mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with us on social media and subscribe to our newsletter for inspiration, updates, and more.
          </p>
          <div className="flex justify-center gap-6">
            <SocialLink href="#" icon={<Instagram className="w-6 h-6" />} label="Instagram" />
            <SocialLink href="#" icon={<Facebook className="w-6 h-6" />} label="Facebook" />
            <SocialLink href="#" icon={<Heart className="w-6 h-6" />} label="Pinterest" />
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Reusable Sub-Components for Clean Code ---

function PhilosophyCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative text-center p-8 rounded-2xl transition-all duration-300 ease-in-out hover:bg-card hover:transform hover:-translate-y-1.5 hover:shadow-lg overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        {icon}
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Use a standard `<a>` tag for external links
function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2">
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}
