"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  highlight?: string;      // palabra(s) que van en color primario
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;          // delay base en ms
};

export default function AnimatedTitle({
  text,
  highlight = "",
  className = "",
  as: Tag = "h2",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const highlightWords = highlight.toLowerCase().split(" ").filter(Boolean);

  const words = text.split(" ").map((word, i) => {
    const isHighlight = highlightWords.some(h => word.toLowerCase().includes(h));
    return (
      <span
        key={i}
        className="inline-block overflow-hidden"
        style={{ verticalAlign: "bottom" }}
      >
        <span
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay + i * 80}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay + i * 80}ms`,
            color: isHighlight ? "var(--primary)" : undefined,
          }}
        >
          {word}
        </span>
        {i < text.split(" ").length - 1 && " "}
      </span>
    );
  });

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      {words}
    </Tag>
  );
}
