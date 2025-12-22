import HoldingHeader from "./components/HoldingHeader";
import HoldingInfoCards from "./components/HoldingInfoCards";
import HoldingFinanceCards from "./components/HoldingFinanceCards";
import HoldingPools from "./components/HoldingPools";
import HoldingCompliance from "./components/HoldingCompliance";
import HoldingTimeline from "./components/HoldingTimeline";

export default function HoldingPage() {
  return (
    <div className="space-y-10">
      <HoldingHeader />
      <HoldingInfoCards />
      <HoldingFinanceCards />
      <HoldingPools />
      <HoldingCompliance />
      <HoldingTimeline />
    </div>
  );
}