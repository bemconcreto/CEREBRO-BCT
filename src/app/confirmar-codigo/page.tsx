"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmarCodigoPage() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function confirmar() {
    setLoading(true);
    setErro("");

    const { data, error } = await supabase.auth.verifyOtp({
      email: (await supabase.auth.getUser()).data.user?.email!,
      token: codigo,
      type: "email",
    });

    if (error || !data.session) {
      setErro("Código inválido ou expirado");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div>
      <h1>Confirme o código</h1>
      <input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="Código de 6 dígitos"
      />
      {erro && <p>{erro}</p>}
      <button onClick={confirmar} disabled={loading}>
        Confirmar
      </button>
    </div>
  );
}