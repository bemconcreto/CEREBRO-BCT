import Card from "../Card";

export default function HoldingInfoCards() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#101820] mb-4">Dados da Empresa</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
