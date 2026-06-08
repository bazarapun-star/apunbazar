interface Props {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function InfiniteMarquee({ items, speed = 30, direction = "left", className = "" }: Props) {
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-flex gap-8"
        style={{
          animation: `${direction === "right" ? "marqueeRev" : "marquee"} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-sm font-medium px-4">
            <span style={{ color: "#d4a017" }}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
