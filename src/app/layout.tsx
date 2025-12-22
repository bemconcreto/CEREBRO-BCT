import "./globals.css";

export const metadata = {
  title: "CÉREBRO-BCT",
  description: "Painel administrativo Bem Concreto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}