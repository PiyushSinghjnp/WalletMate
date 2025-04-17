import { Card } from "@repo/ui/card";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Balance Summary</h3>
                    <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-slate-500 mb-1">Available</p>
                        <p className="text-xl font-bold text-slate-800">₹{amount / 100}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-slate-500 mb-1">Locked</p>
                        <p className="text-xl font-bold text-slate-800">₹{locked / 100}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-slate-500 mb-1">Total</p>
                        <p className="text-xl font-bold text-slate-800">₹{(amount + locked) / 100}</p>
                    </div>
                </div>
            </div>
            
            {/* Detailed Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Detailed Breakdown</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">Available Balance</p>
                                <p className="text-xs text-slate-500">Funds ready to use</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800">₹{amount / 100}</p>
                            <p className="text-xs text-green-600">Available</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                                <ArrowDownLeft className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">Locked Balance</p>
                                <p className="text-xs text-slate-500">Funds in pending transactions</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800">₹{locked / 100}</p>
                            <p className="text-xs text-amber-600">Locked</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <Wallet className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">Total Balance</p>
                                <p className="text-xs text-slate-500">All funds in your account</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800">₹{(amount + locked) / 100}</p>
                            <p className="text-xs text-indigo-600">Total</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}