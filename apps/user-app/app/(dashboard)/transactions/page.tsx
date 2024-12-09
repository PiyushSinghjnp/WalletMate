import React from 'react';
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import {getOnRampTransactions} from "../transfer/page";
import { P2PTransaction } from "../../../components/p2pTransactionCard";
import { getp2pTransactions } from "../p2p/page";

export default  async function() {
    const transactionList = await getOnRampTransactions();
    const p2pTransactionList = await getp2pTransactions();
    return (
        <div className="w-full flex justify-between px-8"> 
            <div className="w-[40%] pt-2 "> 
                <h2 className="font-bold">Transactions Through Bank</h2> 
                <OnRampTransactions transactions={transactionList} />
            </div>
            <div className="w-[40%] ml-8 pt-2">
                <h2 className="font-bold">Transaction through P2P</h2> 
                <P2PTransaction transactions={p2pTransactionList} />
            </div>
        </div>
    );
}