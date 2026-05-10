"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Brain, Share2, Trophy, ArrowLeft, Users, Download } from "lucide-react";
import { useEffect, useState, Suspense, useRef } from "react";
import * as htmlToImage from "html-to-image";

function ResultContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam) : 0;
  
  const [displayScore, setDisplayScore] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(score / steps);
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, backgroundColor: '#000000' });
      const link = document.createElement("a");
      link.download = `CricketIQ_Score_${score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  let badge = "Novice";
  let badgeColor = "text-gray-400";
  let percentile = 12;

  if (score >= 90) { badge = "Legend"; badgeColor = "text-yellow-400"; percentile = 1; }
  else if (score >= 80) { badge = "Expert"; badgeColor = "text-orange-400"; percentile = 5; }
  else if (score >= 60) { badge = "Enthusiast"; badgeColor = "text-primary"; percentile = 20; }
  else if (score >= 40) { badge = "Fan"; badgeColor = "text-blue-400"; percentile = 50; }

  return (
    <div className="min-h-screen pb-24 p-4 flex flex-col items-center justify-center text-center animate-slide-up">
      <Link href="/iq" className="absolute top-6 left-4 text-gray-400">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Shareable Card Wrapper */}
      <div ref={cardRef} className="w-full bg-black p-4 rounded-3xl mb-6 relative">
        <div className="relative mb-8 mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[60px] rounded-full z-0" />
          <Brain className="w-20 h-20 text-primary mx-auto mb-6 relative z-10 animate-pulse-glow rounded-full" />
          <h1 className="text-gray-400 font-bold uppercase tracking-widest relative z-10 mb-2">Your Cricket IQ</h1>
          <div className="text-8xl font-black text-white relative z-10 drop-shadow-[0_0_20px_rgba(255,130,0,0.5)]">
            {displayScore}
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-3xl p-8 w-full relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/10 blur-3xl rounded-full" />
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="text-center">
              <Trophy className={`w-8 h-8 mx-auto mb-2 ${badgeColor}`} />
              <div className="text-sm text-gray-400 mb-1">Rank</div>
              <div className={`text-xl font-black ${badgeColor}`}>{badge}</div>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-sm text-gray-400 mb-1">Percentile</div>
              <div className="text-xl font-black text-white">Top {percentile}%</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-gray-300 font-medium">
              {score >= 80 ? "You are a true cricket encyclopedia! 🏏🔥" : 
               score >= 50 ? "Solid effort! You know your cricket well. 👏" : 
               "Need to watch more IPL! Time to brush up your stats. 📺"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleDownload}
            className="w-full bg-secondary text-black font-black py-4 rounded-xl text-lg flex justify-center items-center gap-2 transition-transform active:scale-95"
          >
            <Download className="w-5 h-5" /> SAVE
          </button>
          
          <button 
            onClick={() => {
              const text = `I just scored ${score}/100 on the CricketIQ Test and got the ${badge} badge! Am I a bigger fan than you? Test your IQ: https://cricketiq.in/iq`;
              if (navigator.share) {
                navigator.share({ title: 'My Cricket IQ', text });
              } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
              }
            }}
            className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-black py-4 rounded-xl text-lg flex justify-center items-center gap-2 transition-transform active:scale-95"
          >
            <Share2 className="w-5 h-5" /> SHARE
          </button>
        </div>
        
        <Link href="/iq" className="block">
          <button className="w-full bg-card-bg border border-border text-white font-bold py-4 rounded-xl text-lg hover:border-primary/50 transition-colors">
            VIEW LEADERBOARD
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function IQResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Brain className="w-16 h-16 text-primary animate-pulse-glow rounded-full mb-4" />
        <h2 className="text-xl font-bold">Calculating Results...</h2>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
