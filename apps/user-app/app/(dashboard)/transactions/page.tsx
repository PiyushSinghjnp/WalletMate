import React from 'react';
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import {getOnRampTransactions} from "../transfer/page";
import { P2PTransaction } from "../../../components/p2pTransactionCard";
import { getp2pTransactions } from "../p2p/page";
import { Building2, Users, ArrowLeftRight, Calendar, User } from 'lucide-react';

type P2PTransactionType = {
    amount: number;
    time: Date;
    type: string;
    userId: number;
    recipientName?: string;
    recipientNumber?: string;
    senderName?: string;
    senderNumber?: string;
}

export default async function() {
    const transactionList = await getOnRampTransactions();
    const p2pTransactionList = await getp2pTransactions();
    
    // Filter out undefined values from p2pTransactionList
    const filteredP2PTransactions = p2pTransactionList.filter((transaction): transaction is NonNullable<typeof transaction> => 
        transaction !== null && 
        transaction !== undefined
    );
    
    return (
        <div className="w-full bg-gray-50 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
                <p className="text-gray-600 mt-2">View all your financial activities in one place</p>
            </header>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* Bank Transactions Section */}
                <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Bank Transactions</h2>
                                <p className="text-blue-100 text-sm">Direct transfers from your bank</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <OnRampTransactions transactions={transactionList} />
                    </div>
                </div>

                {/* P2P Transactions Section */}
                <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">P2P Transactions</h2>
                                <p className="text-purple-100 text-sm">Peer-to-peer transfers</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <P2PTransaction transactions={filteredP2PTransactions} />
                    </div>
                </div>
            </div>

            {/* Transaction Summary */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Transaction Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Transactions</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {transactionList.length + filteredP2PTransactions.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">P2P Transfers</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {filteredP2PTransactions.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Bank Transfers</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {transactionList.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent P2P Activity */}
                {filteredP2PTransactions.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent P2P Activity</h3>
                        <div className="space-y-3">
                            {filteredP2PTransactions.slice(0, 3).map((transaction, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${transaction.type === "DEBIT" ? 'bg-red-100' : 'bg-green-100'}`}>
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {transaction.type === "DEBIT" ? 
                                                    `Sent to ${transaction.recipientName || 'Unknown User'}` : 
                                                    `Received from ${transaction.senderName || 'Unknown User'}`
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {transaction.time.toLocaleDateString()} • {transaction.type === "DEBIT" ? transaction.recipientNumber : transaction.senderNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`font-semibold ${transaction.type === "DEBIT" ? 'text-red-600' : 'text-green-600'}`}>
                                        {transaction.type === "CREDIT" ? "+" : "-"} ₹{transaction.amount / 100}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}