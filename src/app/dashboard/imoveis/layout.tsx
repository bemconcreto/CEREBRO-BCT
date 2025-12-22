export default function ImoveisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginLeft: 150, // largura do sidebar
        padding: "32px",
        background: "#F6F4EF",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}