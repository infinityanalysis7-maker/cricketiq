"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Users, Brain, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Predict", href: "/predict", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
  { name: "IQ Test", href: "/iq", icon: Brain },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t md:border-t-0 md:border-b border-border pb-safe md:pb-0">
      <div className="flex justify-around md:justify-center md:gap-12 items-center h-16 max-w-6xl mx-auto px-4">
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center mr-auto">
          <h1 className="text-xl font-black italic tracking-tighter">
            <span className="text-white">CRICKET</span>
            <span className="text-primary">IQ</span>
          </h1>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col md:flex-row items-center justify-center w-full md:w-auto h-full space-y-1 md:space-y-0 md:space-x-2 transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <item.icon className={cn("w-6 h-6 md:w-5 md:h-5", isActive && "animate-pulse-glow rounded-full md:rounded-none")} />
              <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Desktop Right spacer */}
        <div className="hidden md:block ml-auto w-24"></div>
      </div>
    </nav>
  );
}
