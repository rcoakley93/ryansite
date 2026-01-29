import { useEffect, useRef, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

export default function TextScramble({ text, className = '', trigger = true }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef(0);
  const queueRef = useRef<{ from: string; to: string; start: number; end: number }[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const length = text.length;
    queueRef.current = [];
    
    for (let i = 0; i < length; i++) {
      queueRef.current.push({
        from: CHARS[Math.floor(Math.random() * CHARS.length)],
        to: text[i],
        start: Math.floor(Math.random() * 20),
        end: Math.floor(Math.random() * 20) + 20,
      });
    }

    let frame = 0;
    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0; i < queueRef.current.length; i++) {
        const { from, to, start, end } = queueRef.current[i];
        let char = from;

        if (frame >= end) {
          complete++;
          char = to;
        } else if (frame >= start) {
          if (Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
          } else {
            char = to;
          }
        }

        output += char;
      }

      setDisplayText(output);

      if (complete === queueRef.current.length) {
        return;
      }

      frame++;
      frameRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, trigger]);

  return <span className={className}>{displayText}</span>;
}
