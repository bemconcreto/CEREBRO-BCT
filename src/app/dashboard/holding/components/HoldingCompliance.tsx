import Card from "../Card";

export default function HoldingCompliance() {
  return (
    <section>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Governança & Compliance
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        <Card
          title="Status do CNPJ"
          value="Ativo"
          status="success"
        />

        <Card
          title="Reserva Protegida"
          value="20% travado"
          status="success"
        />

        <Card
          title="Risco Operacional"
          value="Baixo"
          status="success"
        />
      </div>
    </section>
  );
}