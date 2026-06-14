import Card from "../Card";

export default function HoldingCompliance() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#101820] mb-4">Governança & Compliance</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Status do CNPJ"
          value="Ativo"
        />

        <Card
          title="Reserva Protegida"
          value="20% travado"
        />

        <Card
          title="Risco Operacional"
          value="Baixo"
        />
      </div>
    </section>
  );
}