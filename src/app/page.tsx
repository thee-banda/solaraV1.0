import { Calculation } from "@/generated/prisma";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { SolarForm } from "@/components/SolarForm";
import {
  Zap,
  Calendar,
  TrendingUp,
  MapPin,
  Search,
  Wallet,
  Leaf,
  Sun,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("solara_user_id")?.value;

  const calculations: Calculation[] = await db.calculation.findMany({
    where: userId ? { userId } : { id: 'none' }, // Only show history if we have an ID, or skip 'anonymous' bulk history
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const lastCalculation = calculations[0];

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 selection:bg-amber-500/30 overflow-x-hidden font-sans">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(251,191,36,0.1)] mb-12 animate-fade-in hover:border-amber-500/40 transition-colors duration-500">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-500/80">ระบบคำนวณ ROI โซลาร์ระดับโปร</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-tight">
            SOLARA<span className="text-amber-500">.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-400 font-bold leading-relaxed mb-16 px-4">
            ระบบพยากรณ์ความคุ้มค่าอัจฉริยะสำหรับคนไทย <br />อ้างอิงตามค่าไฟของการไฟฟ้าส่วนภูมิภาคปัจจุบันอยู่ที่ 4.7 บาท/หน่วย
          </p>

          <SolarForm />
        </div>
      </div>

      {/* Latest Result Overview */}
      {lastCalculation && (
        <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="mb-10 text-center">
            <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.4em] mb-4">ผลการวิเคราะห์ล่าสุด</h2>
            <div className="h-1 w-20 bg-amber-500 rounded-full mx-auto opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 hover:border-amber-500/40 transition-all group overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Wallet className="w-7 h-7" />
                </div>
                <div className="text-[10px] font-black tracking-widest text-white/40 uppercase">งบลงทุนที่แนะนำ</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 tabular-nums">
                ฿{lastCalculation.totalInvestment.toLocaleString()}
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">สำหรับการติดตั้ง {lastCalculation.systemSizeKW} kW</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 hover:border-amber-500/40 transition-all group overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Calendar className="w-7 h-7" />
                </div>
                <div className="text-[10px] font-black tracking-widest text-white/40 uppercase">ระยะเวลาคืนทุน</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 tabular-nums">
                {lastCalculation.paybackYears} <span className="text-xl text-slate-500">ปี</span>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">การันตีความคุ้มค่าระยะยาว</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 hover:border-emerald-500/40 transition-all group overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="text-[10px] font-black tracking-widest text-white/40 uppercase">ประหยัดเฉลี่ยต่อเดือน</div>
              </div>
              <div className="text-4xl font-black text-emerald-400 mb-2 tabular-nums">
                +฿{lastCalculation.monthlySavings.toLocaleString()}
              </div>
              <p className="text-sm font-bold text-emerald-500/50 uppercase tracking-tighter">ติดตั้งประมาณ {lastCalculation.panelCount} แผง</p>
            </div>

            <div className="bg-emerald-500/[0.05] backdrop-blur-3xl p-8 rounded-[40px] border border-emerald-500/20 hover:border-emerald-500 transition-all group overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Leaf className="w-7 h-7 fill-white/20" />
                </div>
                <div className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">รักษาสิ่งแวดล้อม</div>
              </div>
              <div className="text-4xl font-black text-white mb-2 tabular-nums">
                {lastCalculation.co2Reduction.toLocaleString()} <span className="text-xl text-emerald-500/60">kg</span>
              </div>
              <p className="text-sm font-bold text-emerald-500/50 uppercase tracking-tighter">ลดการปล่อยก๊าซคาร์บอนต่อเดือน</p>
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">
              <LayoutGrid className="w-4 h-4" />
              ประวัติการใช้งานของคุณ
            </div>
            <h2 className="text-5xl font-black tracking-tight">ประวัติการวิเคราะห์</h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/3 px-6 py-3 rounded-full border border-white/5">
            <Search className="w-4 h-4 text-emerald-500" />
            ประวัติของคุณจะถูกเก็บไว้เฉพาะในเบราว์เซอร์นี้เท่านั้น (Session-based History)
          </div>
        </div>

        {calculations.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] rounded-[48px] border border-white/5 flex flex-col items-center">
            <div className="w-24 h-24 bg-white/[0.05] rounded-3xl flex items-center justify-center mb-10 text-slate-700">
              <Sun className="w-12 h-12" />
            </div>
            <p className="text-2xl font-black text-slate-500/50">ยังไม่มีประวัติการคำนวณ</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {calculations.map((calc) => (
              <Link
                key={calc.id}
                href={`/calculation/${calc.id}`}
                className="group bg-white/[0.02] p-6 sm:p-8 rounded-[32px] sm:rounded-[48px] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-300 block relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
                  {/* Primary Info & Identity */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="w-16 h-16 bg-white/[0.05] rounded-[24px] flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform duration-500 relative shrink-0">
                      <Zap className="w-8 h-8 fill-amber-500/20" />
                      <div className="absolute -top-2 -left-2 flex flex-col gap-1.5 items-start">
                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${calc.calculationMode === "EXPERT"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/20"
                          }`}>
                          {calc.calculationMode === "EXPERT" ? "EXPERT" : "QUICK"}
                        </div>
                        {calc.isOptimized && (
                          <div className="bg-amber-400/20 text-amber-500 border border-amber-400/30 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Sun className="w-2 h-2 fill-amber-500" /> Optimized
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {calc.location || "กรุงเทพฯ, ประเทศไทย"}
                      </div>
                      <div className="text-3xl font-black text-white flex items-baseline gap-2">
                        <span className="text-lg text-slate-500">฿</span>
                        {calc.monthlyBill.toLocaleString()}
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">/ เดือน</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Dashboard */}
                  <div className="grid grid-cols-2 lg:flex lg:gap-14 gap-10 md:px-10 md:border-x border-white/5 flex-1">
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">จุดคืนทุน</div>
                      <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">{calc.paybackYears} <span className="text-xs font-bold text-slate-600 uppercase">ปี</span></div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">กำลังผลิต</div>
                      <div className="text-xl font-bold text-white/90">{calc.systemSizeKW} <span className="text-xs font-bold text-slate-600 uppercase">kW</span></div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">แผงที่ใช้</div>
                      <div className="text-xl font-bold text-white/90">{calc.panelCount} <span className="text-xs font-bold text-slate-600 uppercase">แผง</span></div>
                    </div>

                    <div className="space-y-2 lg:min-w-[140px]">
                      <div className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">ประหยัดได้/เดือน</div>
                      <div className="text-xl font-black text-emerald-500 flex items-baseline gap-1">
                        <span className="text-xs font-medium">฿</span>
                        {calc.monthlySavings.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Context */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-4 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                    <div className="text-[10px] font-bold text-slate-600 whitespace-nowrap bg-white/5 px-4 py-2 rounded-full border border-white/5">
                      {new Date(calc.createdAt).toLocaleDateString("th-TH", { month: 'short', day: 'numeric', year: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-6 py-3 rounded-xl border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
                      ดูบทวิเคราะห์ <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-32 text-center relative z-10 border-t border-white/5 font-black uppercase tracking-[0.4em] text-[10px] text-slate-600">
        &copy; {new Date().getFullYear()} Solara Global. Powered by Crystal Engine.
      </footer>
    </main>
  );
}