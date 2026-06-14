import { Card as UiCard, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  value: string;
  highlight?: boolean;
};

export default function Card({ title, value, highlight }: CardProps) {
  return (
    <UiCard className={cn(highlight && "border-[#CBA35C] border-2")}>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1.5">{title}</p>
        <p className="text-lg font-semibold text-[#101820]">{value}</p>
      </CardContent>
    </UiCard>
  );
}
