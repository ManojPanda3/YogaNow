import Link from "next/link";
import { Leaf, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    // Changed to a dark background with light, slightly transparent text for a softer look.
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Section */}
        <div className="flex flex-col">
          <Link href="/" className="mb-4 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            {/* Inverted the brand name color for visibility */}
            <span className="text-xl font-bold text-background">YogaNow</span>
          </Link>
          <p className="text-sm">
            Mindfully crafted essentials for your yoga journey.
          </p>
          <div className="mt-4 flex space-x-4">
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 transition-colors hover:text-primary" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 transition-colors hover:text-primary" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          {/* Inverted the heading color */}
          <h3 className="mb-4 text-sm font-semibold uppercase text-background">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          {/* Inverted the heading color */}
          <h3 className="mb-4 text-sm font-semibold uppercase text-background">
            Legal
          </h3>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          {/* Inverted the heading color */}
          <h3 className="mb-4 text-sm font-semibold uppercase text-background">
            Join Our Newsletter
          </h3>
          <p className="mb-4 text-sm">
            Get updates on new arrivals and special offers.
          </p>
          {/* The form components will adapt automatically with your theme */}
          <form className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Email" aria-label="Email for newsletter" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10">
        <div className="container mx-auto flex items-center justify-center px-4 py-4">
          <p className="text-sm">
            © {new Date().getFullYear()} YogaNow. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
