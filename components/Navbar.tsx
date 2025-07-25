"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import usePathname
import { Leaf, Waves, Menu, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const PromoLink = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="row-span-3">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group relative flex h-full w-full select-none flex-col justify-end overflow-hidden rounded-md p-6 text-white no-underline outline-none transition-all duration-300 ease-in-out hover:scale-[1.02] focus:shadow-md",
            className
          )}
          {...props}
        >
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120"
            alt="Promotional image of a person doing yoga"
            fill
            className={cn(
              "object-cover transition-all duration-300",
              "group-focus-within:blur-sm group-focus-within:brightness-75"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 transition-all group-focus-within:from-black/80" />
          <div className="relative z-10">
            <div className="mb-2 mt-4 text-lg font-bold text-white/90">
              YogaNow
            </div>
            <p className="text-sm leading-tight text-white/90">
              Beautifully designed cloths and accessories for your practice.
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
PromoLink.displayName = "PromoLink";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary hover:backdrop-blur-sm focus:backdrop-blur-sm",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            <div className="text-primary transition-colors group-hover:text-primary group-focus:text-primary">
              {icon}
            </div>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground transition-colors group-hover:text-foreground/90 group-focus:text-foreground/90">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About Us" },
  { href: "/#faq", label: "FAQ" },
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // 2. Get the current path and determine if it's the homepage
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isTransparent = (isHomePage || isAboutPage) && !scrolled;

  const navLinkAndTriggerClasses = (isTrigger = false) =>
    cn(
      "font-bold transition-all duration-200",
      !isTrigger && navigationMenuTriggerStyle(),
      "bg-transparent",
      isTransparent
        ? "text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10"
        : "text-foreground hover:text-primary focus:text-primary hover:bg-primary/10 focus:bg-primary/10 hover:backdrop-blur-sm focus:backdrop-blur-sm"
    );

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isTransparent
          ? "border-transparent"
          : "border-b bg-background/80 backdrop-blur-lg"
      )}
    >
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf
              className={cn(
                "h-6 w-6 transition-colors",
                isTransparent ? "text-white" : "text-primary"
              )}
            />
            <span
              className={cn(
                "hidden font-bold transition-colors sm:inline-block",
                isTransparent ? "text-white" : "text-foreground"
              )}
            >
              YogaNow
            </span>
          </Link>
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/" className={navLinkAndTriggerClasses()}>
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={navLinkAndTriggerClasses(true)}>
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 text-foreground md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-transparent">
                      <PromoLink href="/" />
                      <ListItem
                        href="/products/cloths"
                        title="Yoga Cloths"
                        icon={<Leaf className="h-4 w-4" />}
                      >
                        Sustainable and breathable cloths made from organic
                        cottons.
                      </ListItem>
                      <ListItem
                        href="/products/yogamats"
                        title="Yoga Mats"
                        icon={<Waves className="h-4 w-4" />}
                      >
                        Eco-friendly, non-slip mats for a grounded and secure
                        practice.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={navLinkAndTriggerClasses()}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    className={navLinkAndTriggerClasses()}
                  >
                    About Us
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/#faq"
                    className={navLinkAndTriggerClasses()}
                  >
                    FAQ
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User
                className={cn(
                  "h-5 w-5 transition-colors",
                  isTransparent ? "text-white" : "text-foreground"
                )}
              />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isTransparent ? "text-white" : "text-foreground"
                )}
              />
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu
                className={cn(
                  "h-5 w-5 transition-colors",
                  isTransparent ? "text-white" : "text-foreground"
                )}
              />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-14 left-0 z-40 w-full origin-top transform bg-background/95 backdrop-blur transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "scale-y-100" : "scale-y-0"
        )}
      >
        <nav className="flex flex-col gap-2 p-4" onClick={() => setIsMobileMenuOpen(false)}>
          {mobileNavLinks.map(({ href, label }) => (
            <Link key={label} href={href}>
              <Button variant="link" className="w-full justify-start text-foreground text-md">
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
