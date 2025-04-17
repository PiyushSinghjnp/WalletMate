import { Card } from "@repo/ui/card"
import { ArrowUpRight, Clock } from "lucide-react";

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <ArrowUpRight className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No Recent Transactions</h3>
                <p className="text-slate-500 text-center">
                    Your transaction history will appear here once you add money to your account.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((t, index) => (
                <div key={index} className="bg-white rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800">Added Money</h4>
                                <p className="text-sm text-slate-500">Via {t.provider}</p>
                                <div className="flex items-center text-xs text-slate-400 mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(t.time).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-green-600">+₹{t.amount / 100}</p>
                            <p className="text-xs text-slate-500 capitalize">{t.status}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}