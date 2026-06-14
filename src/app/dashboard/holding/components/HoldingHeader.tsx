export default function HoldingHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold">Holding (CNPJ)</h1>
      <p className="text-neutral-700">
        Bem Concreto Empreendimentos Imobiliários LTDA
      </p>

      <div className="flex gap-3 text-sm">
        <span>CNPJ: 00.000.000/0001-00</span>
        <span className="px-2 py-0.5 rounded-full bg-[#CBA35C] text-white">
          ATIVA
        </span>
      </div>
    </div>
  );
}