import prisma from "@repo/db/client";
import { SendMoneyCard } from "../../../components/sendMoneyCard";
import { P2PTransaction } from "../../../components/p2pTransactionCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { timeStamp } from "console";

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
            
        }
    })
    // console.log(transactions);
    // if userid matches fromUserId then it is sent else if toUserId then it is received according to that we have added the type and send to the card
    return transactions.map(t => {
        if (t.fromUserId == session?.user?.id) {
          return (
            {
              amount: t.amount,
              time: new Date(t.timestamp),

              type: "DEBIT",
              userId: t.fromUserId,
            }
          )
        } else if (t.toUserId == session?.user?.id) {
          return (
            {
              amount: t.amount,
              time: new Date(t.timestamp),
              type: "CREDIT",
              userId: t.toUserId
            }
          )
        }
      })
    
}



export default async function (){
    const transactions = await getp2pTransactions();
    return <div className="w-screen">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div >
            <SendMoneyCard />
        </div>
        <div >
            <P2PTransaction transactions={transactions} />
        </div>
    </div>
</div>
}