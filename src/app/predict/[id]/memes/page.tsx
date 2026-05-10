"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Download, Share2 } from "lucide-react";

export default function MemeGeneratorPage({ params }: { params: { id: string } }) {
  const [caption, setCaption] = useState("When the required rate crosses 15 but Thala is still taking singles");

  return (
    <div className="min-h-screen pb-24 p-4 animate-slide-up pt-8">
      <Link href={`/predict/${params.id}`} className="text-gray-400 text-sm mb-6 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Match
      </Link>
      
      <div className="mb-6">
        <h1 className="text-2xl font-black">AI MEME GENERATOR</h1>
        <p className="text-gray-400 text-sm mt-1">Generate viral memes for this match in seconds.</p>
      </div>

      <div className="bg-card-bg border border-border rounded-2xl p-4 mb-6 relative overflow-hidden">
        {/* Mock Meme Editor */}
        <div className="bg-black aspect-square rounded-xl flex flex-col justify-center items-center p-6 text-center border border-white/10 mb-4 relative overflow-hidden">
          {/* Placeholder Background Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000')] bg-cover bg-center opacity-30" />
          
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000] relative z-10 leading-snug">
            {caption || "ADD YOUR CAPTION"}
          </h2>
        </div>

        <div className="space-y-4 relative z-10">
          <div>
            <label className="text-xs text-gray-400 font-bold mb-2 block">MEME CAPTION</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-black border border-border rounded-xl p-3 text-white text-sm focus:border-primary focus:outline-none resize-none h-[80px]"
              placeholder="Enter your caption here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-white/20 transition-colors text-sm">
              <ImageIcon className="w-4 h-4" /> Change Image
            </button>
            <button className="bg-primary text-black font-black py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors text-sm">
              <SparkleIcon className="w-4 h-4" /> AI Caption
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-secondary text-black font-black py-4 rounded-2xl flex justify-center items-center gap-2 transition-transform active:scale-95">
          <Download className="w-5 h-5" /> SAVE
        </button>
        <button className="bg-[#25D366] text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 transition-transform active:scale-95">
          <Share2 className="w-5 h-5" /> SHARE
        </button>
      </div>
    </div>
  );
}

function SparkleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  );
}
