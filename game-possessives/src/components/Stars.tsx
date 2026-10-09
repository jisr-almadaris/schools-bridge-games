import { useMemo } from "react";

export default function Stars({ count = 40 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const emojis = ["⭐", "🌟", "✨", "🎉", "💫", "🎊"];
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2.5,
          dur: 2.5 + Math.random() * 2.5,
          size: 16 + Math.random() * 26,
          e: emojis[i % emojis.length],
        };
      }),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {items.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: "-8vh",
            fontSize: s.size,
            animation: `starFall ${s.dur}s linear ${s.delay}s infinite`,
          }}
        >
          {s.e}
        </span>
      ))}
    </div>
  );
}
