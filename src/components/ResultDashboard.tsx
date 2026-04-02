"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Activity,
    MapPin,
    RefreshCcw,
    ZapIcon,
    Info,
    Download,
    Copy,
    Trash2,
    Loader2,
    X
} from "lucide-react";
import { useState } from "react";
import { deleteCalculationHistory, duplicateCalculationHistory } from "@/app/actions/solar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResultDashboardProps {
    calculation: any;
    stats: any;
    isManual: boolean;
    isExpert: boolean;
    resetSimulator: () => void;
    recommendedCount: number;
    sellBackEnabled: boolean;
    simMonthlyBill: number;
    unitPrice: number;
}

export function ResultDashboard({
    calculation,
    stats,
    isManual,
    isExpert,
    resetSimulator,
    recommendedCount,
    sellBackEnabled,
    simMonthlyBill,
    unitPrice
}: ResultDashboardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        const result = await deleteCalculationHistory(calculation.id);
        if (result.success) {
            toast.success("ลบประวัติการออกแบบเรียบร้อยแล้ว");
            router.push("/");
        } else {
            toast.error(result.error || "เกิดข้อผิดพลาด");
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleDuplicate = async () => {
        if (isDuplicating) return;
        setIsDuplicating(true);
        const result = await duplicateCalculationHistory(calculation.id);
        if (result.success) {
            toast.success("ทำสำเนาแผนการติดตั้งเรียบร้อยแล้ว");
        } else {
            toast.error(result.error || "เกิดข้อผิดพลาด");
        }
        setIsDuplicating(false);
    };

    const handleExport = () => {
        toast.info("ฟีเจอร์นี้กำลังพัฒนา...");
    };

    return (
        <div className="lg:col-span-12 relative transition-all duration-500">
            <div className={`relative bg-white/3 backdrop-blur-3xl p-8 sm:p-12 rounded-[48px] border transition-all duration-500 ${isManual ? 'border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)]' : 'border-white/10'
                } flex flex-col gap-10 group overflow-hidden`}>

                {/* Professional Top Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/5">
                    <h3 className="text-xl font-black text-white/90 tracking-tight">การออกแบบของคุณ</h3>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExport}
                            className="px-4 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5"
                        >
                            <Download size={14} />
                            <span>ส่งออกข้อมูล</span>
                        </button>

                        <button
                            onClick={handleDuplicate}
                            disabled={isDuplicating}
                            className="px-4 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5 disabled:opacity-50"
                        >
                            {isDuplicating ? <Loader2 size={14} className="animate-spin text-amber-500" /> : <Copy size={14} />}
                            <span>ทำสำเนาแผน</span>
                        </button>

                        <div className="relative flex items-center ml-2 border-l border-white/10 pl-4">
                            <AnimatePresence mode="wait">
                                {!showDeleteConfirm ? (
                                    <motion.button
                                        key="del-btn"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="px-4 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash2 size={14} />
                                        <span>ลบการออกแบบ</span>
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="confirm-box"
                                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                        className="flex items-center gap-2 bg-slate-900 border border-red-500/30 p-1.5 rounded-full shadow-2xl"
                                    >
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="p-1.5 rounded-full text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all flex items-center gap-2"
                                        >
                                            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : null}
                                            ยืนยันลบ
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
                            {isExpert ? <ShieldCheck className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                            {isManual ? "Interactive System Override" : isExpert ? "Professional Precision Analysis" : "Smart Recommendation Summary"}
                        </div>
                        <h1 className="text-6xl sm:text-7xl font-black tracking-tighter leading-tight">
                            {isManual ? "จำลองระบบใหม่" : "สรุปผลความคุ้มค่า"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <MapPin className="w-4 h-4 text-emerald-500" /> {calculation.location}
                            </div>
                            {isManual && (
                                <button
                                    onClick={resetSimulator}
                                    className="text-[10px] font-black text-amber-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                                >
                                    <RefreshCcw className="w-4 h-4" /> รีเซ็ตค่าแนะนำ
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 sm:gap-14 bg-white/5 p-8 sm:p-10 rounded-[40px] border border-white/5">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">จุดคุ้มทุน (ปี)</div>
                            <motion.div
                                key={stats.paybackYears}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-5xl sm:text-6xl font-black text-white"
                            >
                                {stats.paybackYears}
                            </motion.div>
                        </div>
                        <div className="h-20 w-px bg-white/10 hidden sm:block" />
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                                    {stats.isUpselling ? "ติดตั้ง (รวมกำไรขายคืน)" : `แนะนำการติดตั้งที่จำนวน ${recommendedCount} แผง`}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                    {stats.isUpselling ? "(เริ่มมีรายได้ส่วนเพิ่ม)" : "(โดยไม่มีไฟฟ้าส่วนเกินไหลทิ้ง)"}
                                </div>
                            </div>
                            <motion.div
                                key={stats.monthlySavings}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className={`text-5xl sm:text-7xl font-black tabular-nums transition-colors duration-500 ${stats.isSellingBack
                                    ? 'text-emerald-400'
                                    : stats.isOverproducing
                                        ? 'text-amber-500'
                                        : 'text-emerald-400'
                                    }`}
                            >
                                ฿{stats.monthlySavings.toLocaleString()}
                            </motion.div>

                            {stats.isOverproducing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    {sellBackEnabled ? (
                                        <>
                                            <div className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-tight">
                                                ผลิตเกินใช้งาน {Math.round(stats.excessUnits).toLocaleString()} หน่วย/เดือน
                                            </div>
                                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                                <ZapIcon className="w-3 h-3" /> เริ่มสร้างรายได้จากการขายไฟ
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-tight">
                                                สูญเสียพลังงานส่วนเกิน {Math.round(stats.excessUnits).toLocaleString()} หน่วย/เดือน
                                            </div>
                                            <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                                <Info className="w-3 h-3" /> แนะนำโหมด Sell-back
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
