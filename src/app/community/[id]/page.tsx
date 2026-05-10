"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Send } from "lucide-react";
import { getDebatePosts, checkToxicity } from "@/actions/community";

export default function DebateRoomPage({ params }: { params: { id: string } }) {
  const [homeTeam, awayTeam] = params.id.toUpperCase().split("-VS-");
  const [posts, setPosts] = useState<any[]>([]);
  const [newTake, setNewTake] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      const data = await getDebatePosts(params.id);
      setPosts(data);
    }
    loadPosts();
  }, [params.id]);

  const handlePostTake = async () => {
    if (!newTake.trim()) return;
    
    setIsSubmitting(true);
    setWarning(null);

    // AI Toxicity Check
    const toxicityResult = await checkToxicity(newTake);
    
    if (toxicityResult.isToxic) {
      setWarning(toxicityResult.warningMessage || "Your comment violates our community guidelines. Please keep it clean.");
      setIsSubmitting(false);
      return;
    }

    // Success - add to local state
    const newPost = {
      id: Date.now().toString(),
      user: { name: "You", team: "NEUTRAL", avatar: "😎" },
      content: newTake,
      upvotes: 0,
      downvotes: 0,
      time: "Just now",
      isHottest: false
    };

    setPosts([newPost, ...posts]);
    setNewTake("");
    setIsSubmitting(false);
  };

  const handleVote = (id: string, type: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          upvotes: type === 'up' ? post.upvotes + 1 : post.upvotes,
          downvotes: type === 'down' ? post.downvotes + 1 : post.downvotes
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen pb-32 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-black p-4 pt-8 sticky top-0 z-20 backdrop-blur-md">
        <Link href="/community" className="text-gray-400 text-sm mb-4 inline-block">
          <ArrowLeft className="w-5 h-5 inline mr-1" /> Back to Wars
        </Link>
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-2xl font-black">{homeTeam} vs {awayTeam}</h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold text-red-500">LIVE</span>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="flex-1 p-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className={`bg-card-bg border rounded-2xl p-4 transition-all animate-slide-up ${post.isHottest ? 'border-primary shadow-[0_0_15px_rgba(255,130,0,0.2)]' : 'border-border'}`}>
            {post.isHottest && (
              <div className="flex items-center gap-1 text-primary text-xs font-bold mb-3 bg-primary/10 w-fit px-2 py-1 rounded">
                <Flame className="w-3 h-3" /> HOTTEST TAKE TODAY
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{post.user.avatar}</span>
                <div>
                  <h4 className="font-bold text-sm text-white">{post.user.name}</h4>
                  <span className="text-[10px] text-gray-500">{post.time} • {post.user.team} Fan</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{post.content}</p>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-4">
                <button onClick={() => handleVote(post.id, 'up')} className="flex items-center gap-1 text-gray-400 hover:text-secondary transition-colors">
                  <ArrowUpCircle className="w-5 h-5" />
                  <span className="text-xs font-bold">{post.upvotes}</span>
                </button>
                <button onClick={() => handleVote(post.id, 'down')} className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                  <ArrowDownCircle className="w-5 h-5" />
                  <span className="text-xs font-bold">{post.downvotes}</span>
                </button>
              </div>
              <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">Reply</button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-[64px] left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-border z-30">
        <div className="max-w-md mx-auto">
          {warning && (
            <div className="mb-2 bg-red-500/10 border border-red-500/50 rounded-lg p-2 flex items-start gap-2 animate-slide-up">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400 font-medium">{warning}</p>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <textarea 
              value={newTake}
              onChange={(e) => setNewTake(e.target.value)}
              placeholder="Drop your hottest take..."
              className="flex-1 bg-card-bg border border-border rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-secondary resize-none h-[50px] max-h-[100px]"
            />
            <button 
              onClick={handlePostTake}
              disabled={isSubmitting || !newTake.trim()}
              className="bg-primary hover:bg-primary/90 text-black p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? <span className="animate-pulse">...</span> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
