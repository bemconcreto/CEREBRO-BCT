type CardProps = {
  title: string;
  value: string;
  highlight?: boolean;
};

export default function Card({ title, value, highlight }: CardProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        border: highlight ? "2px solid #C9A24D" : "1px solid #E5E5E5",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>
        {title}
      </p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#1E1E1E",
        }}
      >
        {value}
      </p>
    </div>
  );
}