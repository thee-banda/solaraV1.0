"use client";

import { Calculation } from "@/generated/prisma";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    ReferenceLine,
    AreaChart,
    Area
} from "recharts";
import {
    ArrowLeft,
    TrendingUp,
    Zap,
    Leaf,
    Calendar,
    HardDrive,
    Ruler,
    CarFront,
    Trees,
    MapPin,
    ChevronRight,
    TrendingDown,
    Info,
    ShieldCheck,
    Activity,
    Cpu,
    Minus,
    Plus,
    RefreshCcw,
    Sparkles,
    ZapIcon,
    Settings2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateCalculationHistory } from "@/app/actions/solar";
import { toast } from "sonner";
import { CalculationActionMenu } from "./CalculationActionMenu";
import { ResultDashboard } from "./ResultDashboard";

interface CalculationDetailedViewProps {
    calculation: Calculation;
}

export function CalculationDetailedView({ calculation }: CalculationDetailedViewProps) {
    const [isManual, setIsManual] = useState(false);
    const [simMonthlyBill, setSimMonthlyBill] = useState(calculation.monthlyBill);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSavedRef, setHasSavedRef] = useState(false);
    const router = useRouter();

    // 1. Conservative Recommendation Logic (Zero Waste Baseline)
    const unitPrice = calculation.unitPrice || 4.7;
    const panelWattage = calculation.panelWattage || 550;
    const efficiency = calculation.efficiency || 85;
    const costPerKW = calculation.costPerKW || 35000;
    const orientation = calculation.orientation || "South";

    const recommendedCount = useMemo(() => {
        // Fallback for legacy DB records: if the user hasn't touched the bill and the record 
        // is in its initial 'Recommended' state from the backend, use the DB's panelCount 
        // to prevent mismatch with old algorithm generations.
        if (!calculation.isOptimized && simMonthlyBill === calculation.monthlyBill) {
            return calculation.panelCount;
        }

        const PANEL_CAPACITY = panelWattage / 1000;
        const SYSTEM_EFFICIENCY = efficiency / 100;
        const peakSunHours = 4.2;
        const orientationMultiplier = orientation === "South" ? 1.0 : orientation === "EastWest" ? 0.85 : 0.6;

        // Target the ENTIRE monthly bill to ensure high initial coverage
        const totalUnitsTarget = simMonthlyBill / unitPrice;
        const totalDailyUnitsTarget = totalUnitsTarget / 30;
        const unitsPerPanelPerDay = PANEL_CAPACITY * peakSunHours * SYSTEM_EFFICIENCY * orientationMultiplier;

        // Humble Minus One (Full Coverage Baseline)
        const recommendedPanels = Math.ceil(totalDailyUnitsTarget / unitsPerPanelPerDay);
        return Math.max(1, recommendedPanels - 1);
    }, [simMonthlyBill, panelWattage, efficiency, orientation, unitPrice, calculation.isOptimized, calculation.monthlyBill, calculation.panelCount]);

    const [simPanelCount, setSimPanelCount] = useState(calculation.panelCount);
    const [sellBackEnabled, setSellBackEnabled] = useState(calculation.sellBackEnabled || false);

    // Simulation Engine 
    const stats = useMemo(() => {
        const PANEL_CAPACITY = panelWattage / 1000;
        const SYSTEM_EFFICIENCY = efficiency / 100;
        const peakSunHours = 4.2;
        const orientationMultiplier = orientation === "South" ? 1.0 : orientation === "EastWest" ? 0.85 : 0.6;
        const sellBackRate = 2.2;
        const daytimeUsageRatio = calculation.daytimeUsageRatio || 60;

        const currentSystemSizeKW = Number((simPanelCount * PANEL_CAPACITY).toFixed(2));
        const currentTotalInvestment = Number((currentSystemSizeKW * costPerKW).toFixed(0));

        // Reactive Energy Generation Logic
        const energyGeneratedKWh = currentSystemSizeKW * peakSunHours * 30 * SYSTEM_EFFICIENCY * orientationMultiplier;
        
        // Cap consumption by total equivalent units (No daytime restriction to match 100% bill tracking)
        const billboardEquivalentUnits = (simMonthlyBill / unitPrice);
        
        const selfConsumptionUnits = Math.min(energyGeneratedKWh, billboardEquivalentUnits);
        const selfConsumptionSaving = selfConsumptionUnits * unitPrice;
        
        const excessUnits = Math.max(0, energyGeneratedKWh - selfConsumptionUnits);
        const sellBackIncome = sellBackEnabled ? (excessUnits * sellBackRate) : 0;

        const currentMonthlySavings = Number((selfConsumptionSaving + sellBackIncome).toFixed(0));
        const currentPaybackYears = currentMonthlySavings > 0 ? (currentTotalInvestment / (currentMonthlySavings * 12)).toFixed(1) : "0.0";
        
        const isSellingBack = sellBackEnabled && excessUnits > 0;
        const isOverproducing = excessUnits > 0;
        const isUpselling = simPanelCount > recommendedCount;

        // ROI Projection
        const roiData = [];
        let cumulativeSavings = 0;
        const yearlySavingsBase = currentMonthlySavings * 12;
        const INVERTER_FIXED_COST_PER_KW = 8000;
        const inverterReplacementCost = currentSystemSizeKW * INVERTER_FIXED_COST_PER_KW;

        for (let year = 0; year <= 25; year++) {
            if (year === 12) cumulativeSavings -= inverterReplacementCost;
            roiData.push({
                year: `ปีที่ ${year}`,
                savings: Math.round(cumulativeSavings),
                investment: currentTotalInvestment
            });
            const degradationMultiplier = Math.max(0.8, 1 - (0.005 * (year + 1)));
            const inflationMultiplier = Math.pow(1.03, year);
            cumulativeSavings += yearlySavingsBase * degradationMultiplier * inflationMultiplier;
        }

        // Seasonality
        const monthlyFactors = [0.95, 1.05, 1.25, 1.3, 1.1, 0.95, 0.9, 0.85, 0.8, 0.85, 1.1, 0.95];
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const generationData = months.map((month, i) => ({
            name: month,
            units: Math.round(energyGeneratedKWh * monthlyFactors[i])
        }));

        return {
            systemSizeKW: currentSystemSizeKW.toFixed(2),
            energyGeneratedKWh,
            totalInvestment: Math.round(currentTotalInvestment),
            monthlySavings: Math.round(currentMonthlySavings),
            paybackYears: currentPaybackYears,
            roiData,
            generationData,
            isSellingBack,
            isOverproducing,
            isUpselling,
            excessUnits,
            co2Reduction: Math.round(energyGeneratedKWh * 0.5)
        };
    }, [simPanelCount, simMonthlyBill, sellBackEnabled, panelWattage, efficiency, costPerKW, orientation, unitPrice, recommendedCount]);

    const resetSimulator = () => {
        setSimMonthlyBill(calculation.monthlyBill);
        setSimPanelCount(recommendedCount);
        setSellBackEnabled(false);
        setIsManual(false);
        setHasSavedRef(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateCalculationHistory(
            calculation.id,
            simMonthlyBill,
            simPanelCount,
            sellBackEnabled
        );

        if (result.success) {
            toast.success("บันทึกแผนการติดตั้งของคุณเรียบร้อยแล้ว!", {
                description: "การตั้งค่านี้ถูกเก็บไว้ในประวัติการคำนวณของคุณแล้ว",
                duration: 4000,
            });
            setHasSavedRef(true);
            setIsManual(false); // Hide the global simulator banner but keep local state
            router.refresh();
        } else {
            toast.error(result.error);
        }
        setIsSaving(false);
    };

    const isExpert = calculation.calculationMode === "EXPERT";

    return (
        <main className="min-h-screen bg-[#020617] text-white selection:bg-amber-500/30 overflow-x-hidden font-sans pb-32">
            {/* Simulation Glow Effect */}
            <AnimatePresence>
                {isManual && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-0 border-8 border-amber-500/10"
                    />
                )}
            </AnimatePresence>

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px]" />
            </div>

            <nav className="relative z-10 px-8 py-10 max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest leading-none">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> กลับสู่หน้าหลัก
                </Link>
                <div className="flex items-center gap-3">
                    <div className="text-xl font-black italic">SOLARA<span className="text-amber-500">.</span> SIMULATOR</div>
                    {isManual && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        >
                            <Sparkles className="w-3 h-3" /> Simulator Active
                        </motion.div>
                    )}
                </div>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                <ResultDashboard
                    calculation={calculation}
                    stats={stats}
                    isManual={isManual}
                    isExpert={isExpert}
                    resetSimulator={resetSimulator}
                    recommendedCount={recommendedCount}
                    sellBackEnabled={sellBackEnabled}
                    simMonthlyBill={simMonthlyBill}
                    unitPrice={unitPrice}
                />

                {/* Sidebar Controls: Adjust System */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-amber-500 uppercase tracking-[.2em] flex items-center gap-2">
                                <Settings2 className="w-4 h-4" /> ปรับแต่งระบบ (SIM)
                            </h3>
                            <button
                                onClick={() => setIsManual(!isManual)}
                                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${isManual ? 'bg-amber-500 text-slate-950 border-amber-500' : 'text-slate-500 border-white/10'}`}
                            >
                                Manual Mode
                            </button>
                        </div>

                        <div className="space-y-10">
                            {/* Sell-back Toggle Switch */}
                            <motion.div
                                animate={stats.isUpselling && !sellBackEnabled ? { scale: [1, 1.02, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`p-6 rounded-3xl border transition-all duration-500 ${sellBackEnabled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/3 border-white/5'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className={`text-[10px] font-black uppercase tracking-widest leading-none transition-colors ${sellBackEnabled ? 'text-emerald-500' : 'text-amber-500'}`}>Sell-back Mode</div>
                                        <div className="text-xs font-bold text-slate-400">ขายไฟคืนภาคประชาชน</div>
                                    </div>
                                    <button
                                        onClick={() => { setSellBackEnabled(!sellBackEnabled); setIsManual(true); }}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${sellBackEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <motion.div
                                            animate={{ x: sellBackEnabled ? 26 : 2 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                                        />
                                    </button>
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed mt-2">
                                    คำนวณรายได้จากการขายไฟส่วนเกินคืนการไฟฟ้า (฿2.2/หน่วย)
                                </p>

                                <AnimatePresence>
                                    {stats.isUpselling && !sellBackEnabled && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-white/5"
                                        >
                                            <div className="flex gap-3 bg-amber-500/5 border border-amber-500/10 p-3 rounded-2xl">
                                                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-wide">Smart Tip</p>
                                                    <p className="text-[10px] font-medium text-slate-400 leading-normal">
                                                        คุณกำลังติดตั้งเกินความต้องการพื้นฐาน ต้องการเปิดโหมดขายไฟคืน เพื่อความคุ้มค่าสูงสุดหรือไม่?
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Bill Override Slider */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">ค่าไฟปัจจุบันของคุณ (Local)</label>
                                    <span className="text-xs font-black text-white">฿{simMonthlyBill.toLocaleString()}</span>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="range"
                                        min="500"
                                        max="50000"
                                        step="500"
                                        value={simMonthlyBill}
                                        onChange={(e) => { setSimMonthlyBill(Number(e.target.value)); setIsManual(true); }}
                                        className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between mt-2 text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                                        <span>500</span>
                                        <span>Adjust consumption to test ROI</span>
                                        <span>50k+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Counter */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">จำนวนแผงติดตั้ง</label>
                                <motion.div
                                    animate={stats.isSellingBack ? { x: [-0.5, 0.5, -0.5, 0.5, 0] } : {}}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="flex items-center justify-between gap-4 bg-white/3 p-4 rounded-3xl border border-white/5"
                                >
                                    <button
                                        onClick={() => { setSimPanelCount(Math.max(1, simPanelCount - 1)); setIsManual(true); }}
                                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all font-black"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <div className="text-center">
                                        <span className="text-4xl font-black block leading-none">{simPanelCount}</span>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">แผง</span>
                                    </div>
                                    <button
                                        onClick={() => { setSimPanelCount(simPanelCount + 1); setIsManual(true); }}
                                        className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-all font-black"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            </div>

                            {/* Dynamic Metrics Sidebar */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/3 p-5 rounded-3xl border border-white/5">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ขนาดระบบ</div>
                                    <div className="text-xl font-black">{stats.systemSizeKW} kW</div>
                                </div>
                                <div className="bg-white/3 p-5 rounded-3xl border border-white/5">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">เงินลงทุนรวม</div>
                                    <div className="text-xl font-black text-amber-500">฿{(stats.totalInvestment / 1000).toFixed(1)}k</div>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 p-6 rounded-[32px] border border-emerald-500/10">
                                <div className="flex items-center gap-3 mb-2 text-emerald-500">
                                    <Leaf className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">เป็นมิตรต่อโลก</span>
                                </div>
                                <div className="text-lg font-black">{stats.co2Reduction.toLocaleString()} kg CO2 / เดือน</div>
                            </div>

                            {/* Save Design Trigger */}
                            <AnimatePresence>
                                {(isManual || (calculation.panelCount !== simPanelCount || calculation.monthlyBill !== simMonthlyBill || sellBackEnabled !== calculation.sellBackEnabled)) && !hasSavedRef && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="pt-4"
                                    >
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] shadow-indigo-600/20"
                                        >
                                            {isSaving ? (
                                                <RefreshCcw className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <HardDrive className="w-5 h-5" />
                                            )}
                                            {isSaving ? "กำลังบันทึก..." : "💾 บันทึกการออกแบบนี้"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="bg-blue-500/5 backdrop-blur-md p-8 rounded-[40px] border border-blue-500/10 space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Tech Specs Used</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-500 uppercase">Panel Rate</span>
                                <span className="text-white">{panelWattage}W</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-500 uppercase">Cost / kW</span>
                                <span className="text-white">฿{costPerKW.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-500 uppercase">Orientation</span>
                                <span className="text-white">{orientation === 'South' ? 'ใต้' : orientation === 'EastWest' ? 'ออก/ตก' : 'เหนือ'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROI Chart area */}
                <div className="lg:col-span-8 bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[48px] border border-white/10 space-y-8 flex flex-col h-[520px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-amber-500" /> กราฟประมาณการกำไรสะสม (25 ปี)
                        </h2>
                        <div className="hidden sm:block text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                            Forecast: +3% Energy Inflation Included
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.roiData} margin={{ top: 20, right: 30, left: 30, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '24px', padding: '16px', fontWeight: 900 }}
                                    itemStyle={{ color: '#f59e0b', fontSize: '14px' }}
                                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '8px' }}
                                />
                                <ReferenceLine y={stats.totalInvestment} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'จุดลงทุนรวม', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10, fontWeight: 900 }} />
                                <Area type="monotone" dataKey="savings" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorSavings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Seasonality Bar Chart */}
                <div className="lg:col-span-12 bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[48px] border border-white/10 space-y-10 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-black flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-emerald-500" /> การผลิตไฟรายเดือน (หน่วย/เดือน)
                        </h2>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">
                            <Info className="w-3 h-3" /> อ้างอิงตามสถิติสภาพอากาศในไทย
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.generationData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} dy={10} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '20px', padding: '12px', fontWeight: 900 }}
                                    itemStyle={{ color: '#10b981', fontSize: '12px' }}
                                    labelStyle={{ color: '#64748b', fontSize: '9px', marginBottom: '4px' }}
                                />
                                <Bar dataKey="units" radius={[8, 8, 8, 8]} barSize={40}>
                                    {stats.generationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index >= 2 && index <= 4 ? '#f59e0b' : '#10b981'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>
    );
}
