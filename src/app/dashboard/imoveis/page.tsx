import ImoveisHeader from "./components/ImoveisHeader";
import ImoveisResumo from "./components/ImoveisResumo";
import ImoveisGestao from "./ImoveisGestao";

export default function ImoveisPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* TÍTULO E DESCRIÇÃO */}
      <ImoveisHeader />

      {/* RESUMO (CARDS) */}
      <ImoveisResumo />

      {/* GESTÃO / CRUD */}
      <ImoveisGestao />
    </div>
  );
}