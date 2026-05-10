"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
    }

    // Handle Install Prompt Logic
    let visits = parseInt(localStorage.getItem("cricketiq_visits") || "0");
    visits += 1;
    localStorage.setItem("cricketiq_visits", visits.toString());

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt if visited 3 times and hasn't dismissed it recently
      const dismissedAt = localStorage.getItem("cricketiq_pwa_dismissed");
      const isDismissedRecently = dismissedAt && (Date.now() - parseInt(dismissedAt)) < 1000 * 60 * 60 * 24; // 1 day
      
      if (visits >= 3 && !isDismissedRecently) {
        setShowPrompt(true);
      }
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("cricketiq_pwa_dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-primary text-black p-4 rounded-2xl shadow-2xl z-50 animate-slide-up flex flex-col">
      <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 text-black/50 hover:text-black">
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-start gap-4 mb-4 mt-2">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0">
          <span className="text-primary font-black text-xl">CQ</span>
        </div>
        <div>
          <h3 className="font-black text-lg leading-tight">Install CricketIQ</h3>
          <p className="text-sm font-medium mt-1 opacity-80">Get the full app experience. Faster loading & offline access.</p>
        </div>
      </div>
      
      <button 
        onClick={handleInstall}
        className="w-full bg-black text-primary font-black py-3 rounded-xl flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> ADD TO HOME SCREEN
      </button>
    </div>
  );
}
