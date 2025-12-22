import Card from "../Card";

export default function HoldingInfoCards() {
  return (
    <section>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Dados da Empresa
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        <Card title="Razão Social" value="Bem Concreto Empreendimentos" />
        <Card title="CNPJ" value="00.000.000/0001-00" highlight />
        <Card title="Status" value="ATIVA" />

        <Card title="Fundação" value="12/03/2023" />
        <Card title="Natureza Jurídica" value="LTDA" />
        <Card title="Holding Principal" value="Sim" />
      </div>
    </section>
  );
}