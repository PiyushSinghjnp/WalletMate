import React from 'react';
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
// import { redirect } from 'next/navigation'
import { authOptions } from "../../lib/auth";
export default async function Dashboard() {

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    console.log("type of id "+typeof userId);
    console.log("user_id"+userId);
    const UserName = await prisma.user.findFirst({
        select:{
            name:true
        },
        where:{
            id:Number(userId)  
        }
    }
    )
    
    const BalanceInfo = await prisma.balance.findFirst({
        select:{
            amount:true
        },
        where:{
            userId:Number(userId)
        }
    })
    
    const Total_Balance = (BalanceInfo?.amount)?((BalanceInfo.amount)/100):""; 
    const Capitalize = (name:string)=>{
        return "Welcome "+ name.charAt(0).toUpperCase() + name.slice(1); 
    }
    return (
        <div className="min-h-screen w-full bg-gray-100 p-6">
            <header className="py-4">
                <h1 className="text-2xl font-bold text-gray-800">{Capitalize(UserName?.name||"")}</h1>
            </header>
            <main className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full">
                        <h2 className="text-xl font-semibold text-gray-700">Your's Total Balance</h2>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{"Rs."+Total_Balance || null}</p>
                    </div>
     
                </div>
            </main>
        </div>
    );
}