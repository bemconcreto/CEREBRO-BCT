import ImoveisHeader from "./components/ImoveisHeader";
import ImoveisResumo from "./components/ImoveisResumo";
import ImoveisGestao from "./ImoveisGestao";

export default function ImoveisPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* TÍTULO E DESCRIÇÃO */}
      <ImoveisHeader />

      {/* RESUMO (CARDS) */}
      <ImoveisResumo />

      {/* GESTÃO / CRUD */}
      <ImoveisGestao />
    </div>
  );
}