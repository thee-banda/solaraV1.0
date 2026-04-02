import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CalculationDetailedView } from "@/components/CalculationDetailedView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CalculationDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const calculation = await db.calculation.findUnique({
    where: { id },
  });

  if (!calculation) {
    notFound();
  }

  return <CalculationDetailedView key={id} calculation={calculation} />;
}
