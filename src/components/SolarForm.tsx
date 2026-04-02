"use client";

import { useActionState, useState, useEffect, useMemo } from "react";
import { calculateSolar } from "@/app/actions/solar";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import {
  Sun,
  ChevronRight,
  Settings,
  Zap,
  Ruler,
  Percent,
  CircleDollarSign,
  Info,
  MapPin,
  LocateFixed,
  Map as MapIcon,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Loader2,
  Satellite,
  Compass,
  Clock,
  ChevronUp,
  Sparkles,
  ZapIcon,
  Package,
  Home,
  Activity,
  ChevronDown,
  Cpu,
  Layers,
  Wand2,
  HelpCircle
} from "lucide-react";

// Lazy-load Map Component for performance optimization
const SolaraMap = dynamic(() => import("@/components/SolaraMap"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-white/3 rounded-[32px] animate-pulse flex items-center justify-center text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Initializing Core Map Systems...</div>
});

const DEFAULT_VALUES = {
  unitPrice: 4.7,
  efficiency: 85,
  panelWattage: 550,
  costPerKW: 35000,
  orientation: "South",
  tilt: 15,
  daytimeRatio: 60
};

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative flex items-center group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl text-[10px] leading-relaxed font-bold text-slate-300 z-50 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function SolarForm() {
  const [state, action, isPending] = useActionState(
    calculateSolar,
    null as { error?: string, success?: boolean } | null
  );

  const [mode, setMode] = useState<"quick" | "expert">("quick");
  const [billValue, setBillValue] = useState(5000);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [daytimeRatio, setDaytimeRatio] = useState(60);
  const [unitPrice, setUnitPrice] = useState(4.7);
  const [efficiency, setEfficiency] = useState(85);
  const [orientation, setOrientation] = useState("South");
  const [tilt, setTilt] = useState(15);
  const [panelWattage, setPanelWattage] = useState(550);
  const [costPerKW, setCostPerKW] = useState(35000);
  const [isPulsing, setIsPulsing] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string | null>("hardware");

  useEffect(() => {
    let storedId = localStorage.getItem("solara_user_id");
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem("solara_user_id", storedId);
    }
    setUserId(storedId);

    // Sync to cookie so the server knows who we are for history segregation
    document.cookie = `solara_user_id=${storedId}; max-age=31536000; path=/`;
  }, []);

  const isModified = useMemo(() => {
    return (
      unitPrice !== DEFAULT_VALUES.unitPrice ||
      efficiency !== DEFAULT_VALUES.efficiency ||
      panelWattage !== DEFAULT_VALUES.panelWattage ||
      costPerKW !== DEFAULT_VALUES.costPerKW ||
      orientation !== DEFAULT_VALUES.orientation ||
      tilt !== DEFAULT_VALUES.tilt ||
      daytimeRatio !== DEFAULT_VALUES.daytimeRatio
    );
  }, [unitPrice, efficiency, panelWattage, costPerKW, orientation, tilt, daytimeRatio]);

  const detectLocation = () => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      alert("ขออภัย เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });

        // Reverse Geocoding to get Address
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=th`);
          const data = await res.json();
          setAddress(data.display_name);
        } catch (e) {
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setIsDetecting(false);
      },
      (error) => {
        console.error("Location error:", error);
        alert("ไม่สามารถระบุตำแหน่งของคุณได้ กรุณาลองกรอกด้วยตนเอง");
        setIsDetecting(false);
      }
    );
  };

  const resetLocation = () => {
    setCoords(null);
    setAddress(null);
    setIsMapOpen(false);
  };

  const applyRecommendedValues = () => {
    setUnitPrice(4.7);
    setEfficiency(85);
    setPanelWattage(550);
    setCostPerKW(35000);
    setDaytimeRatio(60);
    setOrientation("South");
    setTilt(15);

    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);
  };

  return (
    <section className="w-full max-w-2xl mx-auto bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/20 dark:border-slate-800 transition-all hover:shadow-amber-500/5 duration-700 overflow-hidden">
      <div className="p-10 sm:p-14">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-[22px] rotate-3 relative group">
              <Sun className="w-8 h-8 text-amber-600 fill-amber-500/20 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-2">
                คำนวณปันผลแสงแดด
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Precision ROI Engine 2.0</p>
            </div>
          </div>
        </div>

        {/* Segmented Mode Control */}
        <div className="relative flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-10 w-full">
          <motion.div
            layoutId="pill-background"
            className="absolute inset-y-1 bg-white dark:bg-amber-500 rounded-xl shadow-sm z-0"
            initial={false}
            animate={{
              x: mode === "quick" ? 0 : "100%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setMode("quick")}
            className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${mode === "quick" ? "text-slate-900 dark:text-slate-900" : "text-slate-400"
              }`}
          >
            แนะนำทันที
          </button>
          <button
            onClick={() => setMode("expert")}
            className={`relative z-10 flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-300 ${mode === "expert" ? "text-slate-900 dark:text-slate-900" : "text-slate-400"
              }`}
          >
            คำนวณแบบละเอียด
          </button>
        </div>

        <form action={action} className="space-y-10">
          <input type="hidden" name="calculationMode" value={mode === "quick" ? "SIMPLE" : "EXPERT"} />
          <input type="hidden" name="userId" value={userId} />

          <div className="space-y-6">
            <div className="flex justify-between items-end px-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                ค่าไฟฟ้าโดยเฉลี่ย (บาท)
              </label>
              <div className="flex items-baseline gap-1 relative group">
                <span className="text-3xl font-black text-amber-500/50">฿</span>
                <input
                  type="number"
                  value={billValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 50000) setBillValue(50000);
                    else setBillValue(val);
                  }}
                  onBlur={() => {
                    if (billValue < 1000) setBillValue(1000);
                  }}
                  className="w-32 bg-transparent text-4xl font-black text-amber-500 tabular-nums border-none focus:ring-0 appearance-none p-0 focus:outline-none focus:border-b-2 focus:border-amber-500/50 transition-all text-right"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="range"
                name="monthlyBill"
                min="1000"
                max="50000"
                step="100"
                value={billValue}
                onChange={(e) => setBillValue(Number(e.target.value))}
                className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <span>1,000 บาท</span>
                <span className="text-amber-500/50">บิลค่าไฟโดยประมาณต่อเดือนของคุณ</span>
                <span>50,000 บาท</span>
              </div>
            </div>
          </div>

          {/* Core Intelligence: Mode-Aware Location Section (Available in ALL modes) */}
          <div className="space-y-4 border-t border-white/5 pt-10">
            <div className="flex items-center justify-between gap-4 mb-2 pr-1">
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                <MapPin className="w-4 h-4" />
                ระบุตำแหน่งติดตั้ง
              </div>
            </div>

            {!address && !isMapOpen ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className="flex items-center justify-center gap-3 bg-white/3 border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 p-6 rounded-[28px] transition-all group"
                >
                  {isDetecting ? (
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                  ) : (
                    <MapPin className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="text-left">
                    <div className="text-sm font-black text-white">{isDetecting ? "กำลังระบุ..." : "ระบุอัตโนมัติ"}</div>
                  </div>
                </button>
                <button
                  type="button"
                  disabled={true}
                  className="flex items-center justify-center gap-3 bg-white/3 border border-white/10 p-6 rounded-[28px] transition-all group opacity-50 cursor-not-allowed grayscale"
                >
                  <MapIcon className="w-6 h-6 text-emerald-500" />
                  <div className="text-left">
                    <div className="text-sm font-black text-white">ปักหมุดบนแผนที่ (เร็วๆ นี้)</div>
                  </div>
                </button>
              </div>
            ) : address && !isMapOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[28px] flex items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center text-slate-900 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Verified Irradiance Point</div>
                    <p className="text-sm font-bold text-white leading-snug truncate" title={address || undefined}>{address}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetLocation}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors shrink-0"
                >
                  <RefreshCcw className="w-3 h-3" /> รีเซ็ต
                </button>
              </motion.div>
            ) : null}

            {isMapOpen && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <SolaraMap
                  lat={coords?.lat || 13.7563}
                  lon={coords?.lon || 100.5018}
                  onPositionChange={(lat, lon, addr) => {
                    setCoords({ lat, lon });
                    setAddress(addr);
                  }}
                />
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <MapPin className="w-3 h-3" /> เลือกตำแหน่งจากหมุด
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(false)}
                    className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 transition-all"
                  >
                    ยืนยันพิกัดนี้
                  </button>
                </div>
              </div>
            )}
          </div>

          <input type="hidden" name="lat" value={coords?.lat || ""} />
          <input type="hidden" name="lon" value={coords?.lon || ""} />

          {/* NASA Intelligence Section */}
          <div className="-mx-10 sm:-mx-14 bg-slate-900/40 backdrop-blur-md border-y border-white/5 py-6 px-10 sm:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
            <div className="flex flex-col space-y-2 z-10 w-full md:w-1/2">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Data Source: NASA POWER
                </span>
              </div>
              <div className="text-white/60 text-xs font-medium max-w-sm">
                Synchronizing NASA Surface Meteorology for <strong className="text-amber-500 font-bold">{address ? "Current Location" : "Bangkok, TH"}</strong>...
              </div>
              <div className="pt-2 text-white font-mono text-xs tracking-tight">
                Avg. Solar Insolation: 
                <span className="text-emerald-400 font-bold ml-2">5.2 kWh/m²/day</span>
              </div>
            </div>

            <div className="h-[60px] w-full md:w-1/2 opacity-70 mix-blend-screen pointer-events-none z-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { val: 4.5 }, { val: 4.8 }, { val: 5.2 }, { val: 5.5 }, 
                  { val: 5.0 }, { val: 4.8 }, { val: 4.6 }, { val: 4.5 }, 
                  { val: 4.7 }, { val: 4.5 }, { val: 4.3 }
                ]}>
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <Line 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={true} 
                    animationDuration={2500} 
                    filter="url(#glow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "expert" && (
              <motion.div
                key="expert-settings"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className="pt-10 border-t border-white/5 space-y-10">
                  <div className="flex items-center justify-between gap-4 pr-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                      <Settings className="w-4 h-4" />
                      การตั้งค่าขั้นสูง
                    </div>
                    <button
                      type="button"
                      onClick={applyRecommendedValues}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300 ${isModified
                        ? "bg-amber-500 text-slate-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105"
                        : "bg-transparent text-slate-500 border-slate-700 hover:border-slate-500"
                        }`}
                    >
                      <Wand2 className={`w-3 h-3 ${isModified ? "animate-pulse" : ""}`} />
                      ใช้ค่าแนะนำ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Collapsible Section 1: Hardware & Investment */}
                    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => setActiveSection(activeSection === "hardware" ? null : "hardware")}
                        className="w-full p-6 flex items-center justify-between gap-4 text-left group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Cpu className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Hardware & Investment</div>
                            <div className="text-white font-bold text-xs mt-1">
                              กำหนดสเปคแผงและงบประมาณติดตั้ง
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${activeSection === "hardware" ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeSection === "hardware" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  <ZapIcon className="w-3 h-3 text-amber-500" />
                                  ขนาดแผง (Wattage)
                                </label>
                                <input
                                  type="number"
                                  name="panelWattage"
                                  value={panelWattage}
                                  onChange={(e) => setPanelWattage(Number(e.target.value))}
                                  step="10"
                                  className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${isPulsing ? 'ring-2 ring-amber-500/50' : ''}`}
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  <Percent className="w-3 h-3 text-amber-500" />
                                  ประสิทธิภาพ (%)
                                </label>
                                <input
                                  type="number"
                                  name="efficiency"
                                  value={efficiency}
                                  onChange={(e) => setEfficiency(Number(e.target.value))}
                                  step="1"
                                  className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${isPulsing ? 'ring-2 ring-amber-500/50' : ''}`}
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="flex items-center justify-between gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  <div className="flex items-center gap-2">
                                    <CircleDollarSign className="w-3 h-3 text-amber-500" />
                                    งบลงทุน/kW (บาท)
                                  </div>
                                  <Tooltip text="ราคาเหมาติดตั้งเฉลี่ยต่อ 1 กิโลวัตต์ รวมอุปกรณ์ ค่าแรง และการดำเนินการขออนุญาต (มาตรฐานตลาดปี 2569 อยู่ที่ 30,000 - 45,000 บาท)">
                                    <HelpCircle className="w-3 h-3 text-slate-600 hover:text-amber-500 transition-colors" />
                                  </Tooltip>
                                </label>
                                <input
                                  type="number"
                                  name="costPerKW"
                                  value={costPerKW}
                                  onChange={(e) => setCostPerKW(Number(e.target.value))}
                                  step="500"
                                  className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${isPulsing ? 'ring-2 ring-amber-500/50' : ''}`}
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  <Zap className="w-3 h-3 text-amber-500" />
                                  ค่าไฟต่อหน่วย (Unit)
                                </label>
                                <input
                                  type="number"
                                  name="unitPrice"
                                  value={unitPrice}
                                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                                  step="0.1"
                                  className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${isPulsing ? 'ring-2 ring-amber-500/50' : ''}`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Collapsible Section 2: Roof Physics */}
                    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => setActiveSection(activeSection === "roof" ? null : "roof")}
                        className="w-full p-6 flex items-center justify-between gap-4 text-left group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Roof Physics</div>
                            <div className="text-white font-bold text-xs mt-1">
                              ตั้งค่าทิศทางและองศาของหลังคา
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${activeSection === "roof" ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeSection === "roof" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  <Compass className="w-3 h-3 text-amber-500" />
                                  ทิศทางหลังคา
                                </label>
                                <select
                                  name="orientation"
                                  value={orientation}
                                  onChange={(e) => setOrientation(e.target.value)}
                                  className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none transition-all ${isPulsing ? 'ring-2 ring-amber-500/50' : ''}`}
                                >
                                  <option value="South" className="bg-slate-900">ทิศใต้ (100% Efficiency)</option>
                                  <option value="EastWest" className="bg-slate-900">ทิศตะวันออก/ตก (85%)</option>
                                  <option value="North" className="bg-slate-900">ทิศเหนือ (60%)</option>
                                </select>
                              </div>
                              <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                  <ChevronUp className="w-3 h-3 text-amber-500" />
                                  องศาหลังคา (deg)
                                </label>
                                <input
                                  type="number"
                                  name="tilt"
                                  value={tilt}
                                  onChange={(e) => setTilt(Number(e.target.value))}
                                  step="1"
                                  className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${isPulsing ? 'ring-2 ring-amber-500/50' : ''}`}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Collapsible Section 3: Consumption Pattern */}
                    <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => setActiveSection(activeSection === "pattern" ? null : "pattern")}
                        className="w-full p-6 flex items-center justify-between gap-4 text-left group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Consumption Pattern</div>
                            <div className="text-white font-bold text-xs mt-1">
                              วิเคราะห์พฤติกรรมการใช้ไฟของคุณ
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${activeSection === "pattern" ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {activeSection === "pattern" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 overflow-hidden"
                          >
                            <div className="space-y-6 pt-4 border-t border-white/5">
                              <label className="flex justify-between items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                <span className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  สัดส่วนการใช้ไฟกลางวัน
                                </span>
                                <span className="text-amber-500 font-black">{daytimeRatio}%</span>
                              </label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  name="daytimeUsageRatio"
                                  min="10"
                                  max="100"
                                  step="5"
                                  value={daytimeRatio}
                                  onChange={(e) => setDaytimeRatio(Number(e.target.value))}
                                  className="flex-1 h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="text-[10px] font-black text-amber-500/50 border border-amber-500/20 bg-amber-500/5 px-2 py-1 rounded-md">
                                  {daytimeRatio < 50 ? "LOW" : daytimeRatio < 80 ? "IDEAL" : "HIGH"}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative group"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-black py-5 px-10 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden">
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-white dark:text-slate-900 animate-spin" />
                    <span className="tracking-widest uppercase">ประมวลผลความคุ้มค่า...</span>
                  </div>
                ) : (
                  <>
                    <span className="tracking-widest uppercase">วิเคราะห์ ROI แบบเจาะลึก</span>
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </div>
          <p className="text-center text-[10px] font-black text-slate-400 flex items-center justify-center gap-2 uppercase tracking-widest">
            <Info className="w-3 h-3 text-amber-500" />
            เชื่อมต่อข้อมูล NASA POWER API สำหรับ Irradiance แบบ Real-world
          </p>
        </form>

        {state?.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-sm text-red-600 dark:text-red-400 font-bold">
              {state.error}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
