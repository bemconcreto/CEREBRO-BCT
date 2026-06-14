import { Badge } from "@/components/ui/badge";

export default function HoldingHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Holding (CNPJ)</h1>
      <p className="text-sm text-[#6B7280] mt-1">
        Bem Concreto Empreendimentos Imobiliários LTDA
      </p>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm text-[#6B7280]">CNPJ: 00.000.000/0001-00</span>
        <Badge className="bg-[#CBA35C] text-white">ATIVA</Badge>
      </div>
    </div>
  );
}
