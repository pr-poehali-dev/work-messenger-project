interface Props {
  status: "online" | "away" | "offline";
  size?: "sm" | "md";
}

const COLOR = {
  online: "hsl(142, 70%, 45%)",
  away: "hsl(38, 92%, 50%)",
  offline: "hsl(220, 15%, 45%)",
};

export default function StatusDot({ status, size = "md" }: Props) {
  const dim = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  const pos = size === "sm" ? "bottom-0 right-0" : "bottom-0.5 right-0.5";
  return (
    <span
      className={`absolute ${pos} ${dim} rounded-full border-2`}
      style={{
        background: COLOR[status],
        borderColor: "hsl(222, 45%, 13%)",
      }}
    />
  );
}
