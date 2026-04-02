import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CalculationDetailedView } from "@/components/CalculationDetailedView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CalculationDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/");
  }

  const calculation = await db.calculation.findUnique({
    where: { id },
  });

  if (!calculation) {
    redirect("/");
  }

  return <CalculationDetailedView key={id} calculation={calculation} />;
}
