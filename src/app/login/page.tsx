"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin() {
    setLoading(true);
    setErro("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error || !data.session) {
      setErro("E-mail ou senha inválidos");
      setLoading(false);
      return;
    }

    // ✅ LOGIN DIRETO — SEM OTP
    window.location.href = "/dashboard";
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Cérebro BCT</h1>
        <p style={styles.subtitle}>
          Sistema central de gestão da Bem Concreto
        </p>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
        />

        {erro && <p style={styles.error}>{erro}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <span style={styles.footer}>
          © {new Date().getFullYear()} Bem Concreto
        </span>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #F4F6F8 0%, #E9ECEF 100%)",
  },
  card: {
    width: 380,
    padding: 32,
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 12px 30px rgba(0,0,0,.08)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 18,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#C0392B",
    fontSize: 13,
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "#999",
  },
};