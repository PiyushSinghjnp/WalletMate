import prisma from "@repo/db/client";
import { SendMoneyCard } from "../../../components/sendMoneyCard";
import { P2PTransaction } from "../../../components/p2pTransactionCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { ArrowLeftRight, Users, Wallet, Zap, TrendingUp, Clock } from 'lucide-react';

export async function getp2pTransactions(){
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const transactions = await prisma.p2pTransfer.findMany({
        where:{
        OR:[
            {
            fromUserId : Number(userId)
            },
            {
            toUserId : Number(userId)
            }
        ]
            
        },
        include: {
            fromUser: {
                select: {
                    name: true,
                    number: true
                }
            },
            toUser: {
                select: {
                    name: true,
                    number: true
                }
            }
        }
    })
    
    // if userid matches fromUserId then it is sent else if toUserId then it is received according to that we have added the type and send to the card
    const mappedTransactions = transactions.map(t => {
        if (t.fromUserId == session?.user?.id) {
          return {
              amount: t.amount,
              time: new Date(t.timestamp),
              type: "DEBIT",
              userId: t.fromUserId,
              recipientName: t.toUser.name || "Unknown User",
              recipientNumber: t.toUser.number
          }
        } else if (t.toUserId == session?.user?.id) {
          return {
              amount: t.amount,
              time: new Date(t.timestamp),
              type: "CREDIT",
              userId: t.toUserId,
              senderName: t.fromUser.name || "Unknown User",
              senderNumber: t.fromUser.number
          }
        }
        return null;
    }).filter((t): t is NonNullable<typeof t> => t !== null);
    
    return mappedTransactions;
}

export default async function (){
    const transactions = await getp2pTransactions();
    
    // Calculate transaction statistics
    const totalTransactions = transactions.length;
    const totalSent = transactions.filter(t => t.type === "DEBIT").reduce((sum, t) => sum + t.amount, 0);
    const totalReceived = transactions.filter(t => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0);
    const recentTransactions = transactions.slice(0, 3);
    
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    P2P Transfer
                </h1>
                <p className="text-gray-600 mt-2">Send money instantly to friends and family</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Transfers</p>
                            <p className="text-2xl font-bold text-indigo-600">{totalTransactions}</p>
                        </div>
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Sent</p>
                            <p className="text-2xl font-bold text-red-600">₹{(totalSent / 100).toFixed(2)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <Zap className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Received</p>
                            <p className="text-2xl font-bold text-green-600">₹{(totalReceived / 100).toFixed(2)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Money Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Send Money</h2>
                                <p className="text-indigo-100 text-sm">Transfer to friends and family</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <SendMoneyCard />
                    </div>
                </div>
                
                {/* Transaction History */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Transaction History</h2>
                                <p className="text-purple-100 text-sm">Your recent P2P transfers</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <P2PTransaction transactions={transactions} />
                    </div>
                </div>
            </div>
            
            {/* Recent Activity Section */}
            {recentTransactions.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-indigo-600" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full ${transaction.type === "DEBIT" ? 'bg-red-100' : 'bg-green-100'}`}>
                                        {transaction.type === "DEBIT" ? (
                                            <Zap className="w-5 h-5 text-red-600" />
                                        ) : (
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {transaction.type === "DEBIT" 
                                                ? `Sent to ${transaction.recipientName || 'Unknown User'}` 
                                                : `Received from ${transaction.senderName || 'Unknown User'}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {transaction.time.toLocaleDateString()} • {transaction.type === "DEBIT" 
                                                ? transaction.recipientNumber 
                                                : transaction.senderNumber}
                                        </p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${transaction.type === "DEBIT" ? 'text-red-600' : 'text-green-600'}`}>
                                    {transaction.type === "CREDIT" ? "+" : "-"} ₹{(transaction.amount / 100).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}