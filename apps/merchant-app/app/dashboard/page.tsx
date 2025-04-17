import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "@repo/db/client";
import { Card } from "@repo/ui/card";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

async function getMerchantBalance(merchantId: string) {
  const balance = await prisma.merchantBalance.findFirst({
    where: {
      merchantId: Number(merchantId)
    }
  });
  return balance?.amount || 0;
}

async function getMerchantTransactions(merchantId: string) {
  const transactions = await prisma.merchantTransaction.findMany({
    where: {
      merchantId: Number(merchantId)
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });
  return transactions;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const balance = await getMerchantBalance(session?.user?.id || "");
  const transactions = await getMerchantTransactions(session?.user?.id || "");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Balance Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500">Available Balance</p>
            <h2 className="text-3xl font-bold">₹{balance / 100}</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'CREDIT' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount / 100}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 