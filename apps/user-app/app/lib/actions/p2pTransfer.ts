"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { use } from "react";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            success:false,
            message: "User not logged in"
        }
    }
    if (!to || !amount) {
      return {
          success: false,
          message: "Invalid input parameters"
      };
  }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });
    if (!toUser) {
      return {
          success:false,
          message: "User not found"
      }
  }

    if((from) === toUser.id){
      // console.log('hii');
      return { 
        success:false,
        message:"Can not send to self one"
      };
    }
  
    try{
    // we want either 4 of them all together or nothing so we use $transaction here
    await prisma.$transaction(async (tx) => {
        //-----> if we click the send money twice then it will click twice no matter balance is suffiecient or not so to avoid this we need to lock the row i.e. at one time only when in row balance update then only second transaction will occur
        // for the above problem we use "FOR UPDATE" to lock the row. As prisma dont support the raw sql format se we usee #queryRaw
        //-------> In mondoDb we dont have to lock the row  beacuse if one change or treansaction is happening and if another person or same person is trying to change or update it will revert the change or transaction
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`; 
        // first we check if the user has enough balance
        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
          }

          await tx.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await tx.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });
          // then we create the p2p transaction in the database
          await tx.p2pTransfer.create({
            data:{
                fromUserId: Number(from),
                toUserId: toUser.id,
                amount,
                timestamp: new Date()
            }
          })
    });
    return {
      success: true,
      message: "Money sent successfully!"
  };
  }
  catch (error) {
    console.error("Server error:", error);
    return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred"};
}
}