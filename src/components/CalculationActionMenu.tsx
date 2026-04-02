"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    MoreHorizontal,
    Copy,
    Download,
    Trash2,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteCalculationHistory, duplicateCalculationHistory } from "@/app/actions/solar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CalculationActionMenuProps {
    id: string;
    redirectOnDelete?: string;
}

export function CalculationActionMenu({ id, redirectOnDelete }: CalculationActionMenuProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: Event) => {
        e.preventDefault();
        if (isDeleting) return;

        setIsDeleting(true);
        const result = await deleteCalculationHistory(id);
        if (result.success) {
            toast.success("ลบประวัติการออกแบบเรียบร้อยแล้ว");
            if (redirectOnDelete) {
                router.push(redirectOnDelete);
            }
        } else {
            toast.error(result.error || "เกิดข้อผิดพลาด");
        }
        setIsDeleting(false);
    };

    const handleDuplicate = async (e: Event) => {
        e.preventDefault();
        if (isDuplicating) return;

        setIsDuplicating(true);
        const result = await duplicateCalculationHistory(id);
        if (result.success) {
            toast.success("ทำสำเนาแผนการติดตั้งเรียบร้อยแล้ว");
        } else {
            toast.error(result.error || "เกิดข้อผิดพลาด");
        }
        setIsDuplicating(false);
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className="p-2 bg-slate-900/50 text-slate-500 hover:text-white rounded-full transition-all outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="w-5 h-5 transition-transform active:scale-90" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="z-50 min-w-[200px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-[var(--radix-dropdown-menu-content-transform-origin)] animate-in fade-in zoom-in-95 duration-200"
                    sideOffset={8}
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenu.Item
                        onSelect={handleDuplicate}
                        disabled={isDuplicating}
                        className="flex items-center gap-3 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all cursor-pointer outline-none group"
                    >
                        {isDuplicating ? (
                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        ) : (
                            <Copy className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
                        )}
                        <span>ทำสำเนาแผนนี้</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 rounded-2xl cursor-not-allowed outline-none"
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Download className="w-4 h-4" />
                        <span>ส่งออกข้อมูล</span>
                        <div className="ml-auto bg-slate-800 text-[8px] px-1.5 py-0.5 rounded-md opacity-40">SOON</div>
                    </DropdownMenu.Item>

                    <div className="h-px bg-white/5 my-2 mx-2" />

                    <DropdownMenu.Item
                        onSelect={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-3 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all cursor-pointer outline-none group"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4 text-red-500/50 group-hover:text-red-400 transition-colors" />
                        )}
                        <span>ลบการออกแบบ</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
