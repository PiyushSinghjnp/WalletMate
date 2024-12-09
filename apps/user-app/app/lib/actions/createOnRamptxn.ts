"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export  async function createOnRampTransaction(amount:number,provider:string) {

    const session = await getServerSession(authOptions) ;
    const token = Math.random().toString(); // this token is send by the user to the bank which tell about the user(unique) transactions
    const userId = session?.user?.id;
    if(!userId){
        return {
            message:"User not logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data: {
            userId: (userId),
            amount:amount,
            status:"Processing",
            startTime:new Date(),
            provider,
            token: token
        }

    })

}