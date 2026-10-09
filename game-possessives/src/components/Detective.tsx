interface Props {
  walking?: boolean;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// The detective character shown inside a warm "spotlight" circle so the
// image blends nicely on the dark scenes. Bobs while walking.
export default function Detective({
  walking = false,
  size = 150,
  className = "",
  style,
}: Props) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={style}>
      <div
        className={`relative rounded-full ring-4 ring-amber-300/90 shadow-[0_10px_40px_rgba(251,191,36,0.45)] ${
          walking ? "anim-walk" : "anim-idle"
        }`}
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 50% 42%, #fff8ec 0%, #ffedd0 55%, #f6d79b 100%)",
        }}
      >
        <img
          src="/schools-bridge-games/game-possessives/images/detective.png"
          alt="المحققة"
          className="absolute inset-0 h-full w-full rounded-full object-cover object-top"
          style={{ mixBlendMode: "multiply" }}
          draggable={false}
        />
      </div>
      {/* shadow */}
      <div
        className="mt-1 rounded-[50%] bg-black/35 blur-[3px]"
        style={{ width: size * 0.62, height: size * 0.12 }}
      />
    </div>
  );
}
