import React from 'react';
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
// import { redirect } from 'next/navigation'
import { authOptions } from "../../lib/auth";
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, History, Wallet } from 'lucide-react';

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const UserName = await prisma.user.findFirst({
        select:{
            name:true
        },
        where:{
            id:Number(userId)  
        }
    });
    
    const BalanceInfo = await prisma.balance.findFirst({
        select:{
            amount:true
        },
        where:{
            userId:Number(userId)
        }
    });
    
    const recentTransactions = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: Number(userId) },
                { toUserId: Number(userId) }
            ]
        },
        take: 5,
        orderBy: {
            timestamp: 'desc'
        },
        include: {
            fromUser: {
                select: { name: true }
            },
            toUser: {
                select: { name: true }
            }
        }
    });
    
    const Total_Balance = (BalanceInfo?.amount)?((BalanceInfo.amount)/100):""; 
    const Capitalize = (name:string)=>{
        return "Welcome "+ name.charAt(0).toUpperCase() + name.slice(1); 
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 p-6">
            <header className="py-4">
                <h1 className="text-3xl font-bold text-gray-800">{Capitalize(UserName?.name||"")}</h1>
                <p className="text-gray-600 mt-2">Manage your finances with ease</p>
            </header>
            
            <main className="mt-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-blue-100">Total Balance</p>
                            <h2 className="text-4xl font-bold mt-2">₹{Total_Balance}</h2>
                        </div>
                        <Wallet className="w-12 h-12 text-blue-200" />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link href="/transfer" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <ArrowUpRight className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Send Money</h3>
                                <p className="text-sm text-gray-600">Transfer to other users</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/p2p" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <ArrowDownLeft className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">P2P Transfer</h3>
                                <p className="text-sm text-gray-600">Quick peer transfers</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/transactions" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <History className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Transactions</h3>
                                <p className="text-sm text-gray-600">View your history</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-full ${transaction.fromUserId === Number(userId) ? 'bg-red-100' : 'bg-green-100'}`}>
                                        {transaction.fromUserId === Number(userId) ? 
                                            <ArrowUpRight className="w-5 h-5 text-red-600" /> : 
                                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {transaction.fromUserId === Number(userId) ? 
                                                `To: ${transaction.toUser.name}` : 
                                                `From: ${transaction.fromUser.name}`
                                            }
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(transaction.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${transaction.fromUserId === Number(userId) ? 'text-red-600' : 'text-green-600'}`}>
                                    {transaction.fromUserId === Number(userId) ? '-' : '+'}₹{transaction.amount/100}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}