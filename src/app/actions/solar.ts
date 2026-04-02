"use server";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSolarData } from "@/lib/solar-api";

const solarSchema = z.object({
  monthlyBill: z.coerce.number().min(1, "ค่าไฟต้องมากกว่า 0 บาท"),
  unitPrice: z.coerce.number().optional().default(4.7),
  panelWattage: z.coerce.number().optional().default(550),
  efficiency: z.coerce.number().optional().default(85),
  costPerKW: z.coerce.number().optional().default(35000),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  calculationMode: z.enum(["SIMPLE", "EXPERT"]).optional().default("SIMPLE"),
  orientation: z.enum(["South", "EastWest", "North"]).optional().default("South"),
  tilt: z.coerce.number().optional().default(15),
  daytimeUsageRatio: z.coerce.number().optional().default(60),
  userId: z.string().optional().default("anonymous"),
});

export async function calculateSolar(prevState: any, formData: FormData) {
  try {
    const rawData = {
      monthlyBill: formData.get("monthlyBill"),
      unitPrice: formData.get("unitPrice") || undefined,
      panelWattage: formData.get("panelWattage") || undefined,
      efficiency: formData.get("efficiency") || undefined,
      costPerKW: formData.get("costPerKW") || undefined,
      lat: formData.get("lat") || undefined,
      lon: formData.get("lon") || undefined,
      calculationMode: formData.get("calculationMode") || undefined,
      orientation: formData.get("orientation") || undefined,
      tilt: formData.get("tilt") || undefined,
      daytimeUsageRatio: formData.get("daytimeUsageRatio") || undefined,
      userId: formData.get("userId") || undefined,
    };

    const validatedFields = solarSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors.monthlyBill?.[0] || "ข้อมูลไม่ถูกต้อง"
      };
    }

    const {
      monthlyBill,
      unitPrice,
      panelWattage,
      efficiency,
      costPerKW,
      lat,
      lon,
      calculationMode,
      orientation,
      tilt,
      daytimeUsageRatio,
      userId,
    } = validatedFields.data;

    let peakSunHours = 4.2;

    if (lat && lon) {
      const livePeakSunHours = await getSolarData(lat, lon);
      if (livePeakSunHours) {
        peakSunHours = livePeakSunHours;
      }
    }

    const PANEL_CAPACITY = panelWattage / 1000;
    const SYSTEM_EFFICIENCY = efficiency / 100;
    const CO2_FACTOR = 0.5;

    const unitsPerDay = monthlyBill / unitPrice / 30;
    const systemSizeKW = Number(((unitsPerDay / (peakSunHours * SYSTEM_EFFICIENCY)) * 1.1).toFixed(2));

    const panelCount = Math.ceil(systemSizeKW / PANEL_CAPACITY);
    const totalInvestment = Number((systemSizeKW * costPerKW).toFixed(0));
    const orientationMultiplier = orientation === "South" ? 1.0 : orientation === "EastWest" ? 0.85 : 0.6;

    // Base potential units from solar system
    const baseMonthlySolarUnits = systemSizeKW * peakSunHours * 30 * SYSTEM_EFFICIENCY * orientationMultiplier;
    const baseMonthlySavingsValue = baseMonthlySolarUnits * unitPrice;

    // Maximum savings possible is the daytime portion of the bill
    const daytimeBillCap = monthlyBill * (daytimeUsageRatio / 100);

    const monthlySavings = Number(Math.min(baseMonthlySavingsValue, daytimeBillCap).toFixed(0));

    const paybackYears = Number((totalInvestment / (monthlySavings * 12)).toFixed(1));
    const co2Reduction = Number((baseMonthlySolarUnits * CO2_FACTOR).toFixed(0));

    // For location label, use lat/lon if expert or quick search, otherwise default
    const locationLabel = lat && lon ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : "กรุงเทพฯ, ประเทศไทย";

    await db.calculation.create({
      data: {
        monthlyBill,
        systemSizeKW,
        panelCount,
        totalInvestment,
        monthlySavings,
        paybackYears,
        co2Reduction,
        location: locationLabel,
        calculationMode,
        unitPrice: calculationMode === "EXPERT" ? unitPrice : null,
        panelWattage: calculationMode === "EXPERT" ? panelWattage : null,
        efficiency: calculationMode === "EXPERT" ? efficiency : null,
        costPerKW: calculationMode === "EXPERT" ? costPerKW : null,
        orientation: calculationMode === "EXPERT" ? orientation : "South",
        tilt: calculationMode === "EXPERT" ? tilt : 15,
        daytimeUsageRatio: calculationMode === "EXPERT" ? daytimeUsageRatio : 60,
        userId,
      },
    });

    // Also sync to cookie for historical view (Segregated History)
    const cookieStore = await cookies();
    cookieStore.set("solara_user_id", userId, {
      maxAge: 31536000,
      httpOnly: true, // Only accessible by server for security
      path: '/'
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to calculate ROI with GeoData:", error);
    return { error: "ขออภัย เกิดข้อผิดพลาดในการคำนวณ" };
  }
}

export async function updateCalculationHistory(id: string, monthlyBill: number, panelCount: number, sellBackEnabled: boolean) {
  try {
    const calc = await db.calculation.findUnique({ where: { id } });
    if (!calc) throw new Error("Calculation not found");

    const panelWattage = calc.panelWattage || 550;
    const costPerKW = calc.costPerKW || 35000;
    const efficiency = calc.efficiency || 85;
    const unitPrice = calc.unitPrice || 4.7;
    const orientation = calc.orientation || "South";
    const peakSunHours = 4.2;

    const PANEL_CAPACITY = panelWattage / 1000;
    const SYSTEM_EFFICIENCY = efficiency / 100;
    const orientationMultiplier = orientation === "South" ? 1.0 : orientation === "EastWest" ? 0.85 : 0.6;
    const sellBackRate = 2.2;

    const systemSizeKW = panelCount * PANEL_CAPACITY;
    const totalInvestment = systemSizeKW * costPerKW;

    const energyGeneratedKWh = panelCount * PANEL_CAPACITY * peakSunHours * SYSTEM_EFFICIENCY * orientationMultiplier * 30;
    const billboardEquivalentUnits = monthlyBill / unitPrice;

    const selfConsumptionUnits = Math.min(energyGeneratedKWh, billboardEquivalentUnits);
    const selfConsumptionSaving = selfConsumptionUnits * unitPrice;
    const excessUnits = Math.max(0, energyGeneratedKWh - billboardEquivalentUnits);
    const sellBackIncome = sellBackEnabled ? (excessUnits * sellBackRate) : 0;

    const monthlySavings = selfConsumptionSaving + sellBackIncome;
    const paybackYears = totalInvestment / (monthlySavings * 12);

    await db.calculation.update({
      where: { id },
      data: {
        monthlyBill,
        panelCount,
        systemSizeKW,
        totalInvestment,
        monthlySavings,
        paybackYears: Number(paybackYears.toFixed(1)),
        isOptimized: true,
        sellBackEnabled
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Save Error:", error);
    return { error: "ไม่สามารถบันทึกการออกแบบได้" };
  }
}
