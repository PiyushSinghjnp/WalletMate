import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { ArrowRight, Wallet, History, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

async function getBalance() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session.user.id)
        }
    });

    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

export async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return [];
    }

    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session.user.id)
        }
    });
    
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl mb-8">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative px-6 py-12 sm:px-12 sm:py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-8 md:mb-0 md:mr-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Manage Your Money
                            </h1>
                            <p className="text-indigo-100 text-lg max-w-md">
                                Add funds to your WalletMate account, track your balance, and view your transaction history all in one place.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                                <Wallet className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                            <Wallet className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Available Balance</p>
                            <p className="text-2xl font-bold text-slate-800">₹{balance.amount / 100}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Locked Balance</p>
                            <p className="text-2xl font-bold text-slate-800">₹{balance.locked / 100}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <History className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Total Balance</p>
                            <p className="text-2xl font-bold text-slate-800">₹{(balance.amount + balance.locked) / 100}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Money Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Add Money</h2>
                        </div>
                        <div className="p-6">
                            <AddMoney />
                        </div>
                    </div>
                </div>

                {/* Balance and Transactions Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 mb-8">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Account Overview</h2>
                        </div>
                        <div className="p-6">
                            <BalanceCard amount={balance.amount} locked={balance.locked} />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                        </div>
                        <div className="p-6">
                            <OnRampTransactions transactions={transactions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}