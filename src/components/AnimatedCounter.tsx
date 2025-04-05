
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter = ({ endValue, duration = 2, suffix = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const currentCount = Math.floor(progress * endValue);
        
        setCount(currentCount);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endValue);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, endValue, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="text-4xl md:text-5xl font-bold text-gradient mb-2">
      {count}{suffix}
    </div>
  );
};

export default AnimatedCounter;
