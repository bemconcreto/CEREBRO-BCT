import Link from "next/link";

const linkStyle: React.CSSProperties = {
  color: "#FFFFFF",
  textDecoration: "none",
  fontSize: 15,
  cursor: "pointer",
};

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 150,
        background: "#1E1E1E",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <h1
        style={{
          color: "#C9A24D",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 40,
        }}
      >
        CÉREBRO-BCT
      </h1>

      {/* MENU */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Link href="/dashboard" style={linkStyle}>Visão Geral</Link>
        <Link href="/dashboard/holding" style={linkStyle}>Holding</Link>
        <Link href="/dashboard/imoveis" style={linkStyle}>Imóveis</Link>
        <Link href="/dashboard/emissoes" style={linkStyle}>Emissões</Link>
        <Link href="/dashboard/usuarios" style={linkStyle}>Usuários</Link>
        <Link href="/dashboard/consultores" style={linkStyle}>Consultores</Link>
        <Link href="/dashboard/vendas" style={linkStyle}>Vendas</Link>
      </nav>
    </aside>
  );
}