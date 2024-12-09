import { Card } from "@repo/ui/card"
// transaction will contain the transaction details in p2p section we will send a transaction object to this component
export const  P2PTransaction = async({
    transactions
}: {
    transactions: {
        amount: number,
        time: Date,
        type:string,
        userId:number
    }[]
}) => {
 
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                    {t.type=="DEBIT"? "Sent INR":"Received INR"}
                        {/* Received INR */}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    {/* + Rs {t.amount / 100} */}
                    {
                        t.type == "CREDIT"?"+ Rs "+(t.amount / 100):"- Rs "+(t.amount / 100)
                    }
                </div>

            </div>)}
        </div>
    </Card>
}