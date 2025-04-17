import { Card } from "@repo/ui/card"
import { ArrowUpRight, ArrowDownLeft, User, Clock, Calendar } from 'lucide-react';

// transaction will contain the transaction details in p2p section we will send a transaction object to this component
export const P2PTransaction = async({
    transactions
}: {
    transactions: {
        amount: number,
        time: Date,
        type: string,
        userId: number,
        recipientName?: string,
        recipientNumber?: string,
        senderName?: string,
        senderNumber?: string
    }[]
}) => {
 
    if (!transactions.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No Recent Transactions</h3>
                <p className="text-gray-500 text-sm">Your P2P transfer history will appear here</p>
            </div>
        )
    }
    
    return (
        <div className="space-y-4">
            {transactions.map((t, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-full ${t.type === "DEBIT" ? 'bg-red-100' : 'bg-green-100'}`}>
                            {t.type === "DEBIT" ? 
                                <ArrowUpRight className="w-5 h-5 text-red-600" /> : 
                                <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            }
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">
                                {t.type === "DEBIT" ? 
                                    `Sent to ${t.recipientName || 'Unknown User'}` : 
                                    `Received from ${t.senderName || 'Unknown User'}`
                                }
                            </div>
                            <div className="flex items-center text-slate-600 text-xs mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {t.time.toLocaleDateString()} 
                                <span className="mx-1">•</span>
                                {t.type === "DEBIT" ? t.recipientNumber : t.senderNumber}
                            </div>
                        </div>
                    </div>
                    <div className={`font-semibold ${t.type === "DEBIT" ? 'text-red-600' : 'text-green-600'}`}>
                        {t.type === "CREDIT" ? "+" : "-"} ₹{(t.amount / 100).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    )
}