"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return (
        <div 
            className={`relative flex items-center p-3 my-1 rounded-lg transition-all duration-200 cursor-pointer
                ${selected 
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`} 
            onClick={() => {
                router.push(href);
            }}
        >
            {selected && (
                <div 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-full"
                />
            )}
            
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3
                ${selected 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" 
                    : "bg-slate-100 text-slate-500"
                }`}
            >
                {icon}
            </div>
            
            <div className={`font-medium ${selected ? "text-indigo-600" : "text-slate-600"}`}>
                {title}
            </div>
        </div>
    )
}