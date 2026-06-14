import Card from "../Card";

const eventos = [
  {
    titulo: "Criação da Holding",
    descricao: "Constituição do CNPJ Bem Concreto Holding.",
    data: "2024",
  },
  {
    titulo: "Primeiro Imóvel Integrado",
    descricao: "Entrada do imóvel Vitta Premium Mogi como lastro.",
    data: "2024",
  },
  {
    titulo: "Primeira Emissão BCT",
    descricao: "Emissão inicial de 10.000.000 BCT.",
    data: "2025",
  },
  {
    titulo: "Marco de Faturamento",
    descricao: "Ultrapassado R$ 1.000.000 em vendas.",
    data: "2025",
  },
  {
    titulo: "Próxima Emissão Planejada",
    descricao: "Expansão da pool com novos imóveis.",
    data: "Em breve",
  },
];

export default function HoldingTimeline() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#101820] mb-4">Linha do Tempo da Holding</h2>

      <div className="grid grid-cols-1 gap-3">
        {eventos.map((evento, index) => (
          <Card
            key={index}
            title={`${evento.data} — ${evento.titulo}`}
            value={evento.descricao}
          />
        ))}
      </div>
    </section>
  );
}