"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDailyIQTest } from "@/actions/iq";
import { Brain, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IQTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const data = await getDailyIQTest();
      setQuestions(data);
      setLoading(false);
    }
    loadQuestions();
  }, []);

  useEffect(() => {
    if (loading || isAnswered || questions.length === 0) return;

    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, isAnswered, questions]);

  const handleTimeUp = () => {
    setIsAnswered(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      // Test finished
      localStorage.setItem("iq_score", score.toString());
      router.push(`/iq/result?score=${score + (selectedOption === questions[currentIndex].correctAnswerIndex ? 10 : 0)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Brain className="w-16 h-16 text-primary animate-pulse-glow rounded-full mb-4" />
        <h2 className="text-xl font-bold">Generating Today's Test...</h2>
        <p className="text-gray-400 text-sm mt-2">Consulting the cricket gods</p>
      </div>
    );
  }

  if (questions.length === 0) return <div>Failed to load test.</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen pb-24 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6 pt-4">
        <div className="text-sm font-bold text-gray-400">
          QUESTION {currentIndex + 1} <span className="opacity-50">/ {questions.length}</span>
        </div>
        <div className={cn(
          "flex items-center gap-2 bg-card-bg px-3 py-1.5 rounded-full border border-border",
          timeLeft <= 5 ? "text-red-500 border-red-500/50 animate-pulse" : "text-secondary"
        )}>
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold">{timeLeft}s</span>
        </div>
      </div>

      <div className="bg-card-bg border border-border rounded-2xl p-6 mb-6 relative overflow-hidden shadow-xl animate-slide-up" key={currentIndex}>
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 15) * 100}%` }} />
        <h2 className="text-xl font-bold leading-snug">{currentQ.question}</h2>
      </div>

      <div className="space-y-3 flex-1">
        {currentQ.options.map((option: string, index: number) => {
          let stateClass = "bg-card-bg border-border hover:border-primary/50 text-white";
          
          if (isAnswered) {
            if (index === currentQ.correctAnswerIndex) {
              stateClass = "bg-green-500/20 border-green-500 text-green-400";
            } else if (index === selectedOption) {
              stateClass = "bg-red-500/20 border-red-500 text-red-400";
            } else {
              stateClass = "bg-card-bg border-border opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectOption(index)}
              disabled={isAnswered}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg",
                stateClass
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 animate-slide-up">
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mb-4">
            <h3 className="text-secondary font-bold text-sm mb-1">Explanation</h3>
            <p className="text-sm text-gray-300">{currentQ.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-primary text-black font-black py-4 rounded-xl text-lg flex justify-center items-center gap-2"
          >
            {currentIndex < questions.length - 1 ? "NEXT QUESTION" : "SEE RESULTS"} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
