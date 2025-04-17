"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from 'lucide-react';

export function SendMoneyCard() {
    const router = useRouter();
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // i want to showt the message only for five seconds after that remove the message
    const handleMessage = async(msg:string)=>{
        setMessage(msg);
        setTimeout(() =>{
            setMessage("");
        },5000)
    }

    const handleSend = async () => {
        try {
            if(!number || !amount){
                handleMessage("Please fill all fields");
                return;
            }
            
            setIsLoading(true);
            setMessage("Processing...");
            
            const result = await p2pTransfer(number, Number(amount) * 100);
            console.log(result);
            
            // Check for a successful response or failure
            if(!result){
                handleMessage("No response from server");
                setIsLoading(false);
                return;
            }
            
            if (result.success === false) {
                handleMessage(result.message);
            } else {
                handleMessage("Transfer successful!");
            }
            
            // if transaction is successfull then clear the fields
            if(result.success){
                setNumber("");
                setAmount("");
                router.refresh(); // refresh the server component, good practise to use it 
            }
            
            setIsLoading(false);
        } catch (error) {
            console.error("Error during transfer:", error);
            handleMessage("An error occurred while processing the transaction.");
            setIsLoading(false);
        }
    }
    
    const MessageDisplay = () => {
        return(
            message && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                    message === "Processing..." 
                        ? "bg-blue-50 text-blue-600" 
                        : message.includes("successful") 
                            ? "bg-green-50 text-green-600" 
                            : "bg-red-50 text-red-600"
                }`}>
                    {message}
                </div>
            )
        )
    }

    return (
        <div className="w-full">
            <div className="space-y-4">
                <div className="relative">
                    <TextInput
                        placeholder={"Enter recipient's number"}
                        label="Recipient Number"
                        onChange={(value) => {
                            setNumber(value)
                        }}
                    />
                </div>
                
                <div className="relative">
                    <TextInput
                        placeholder={"Enter amount to send"}
                        label="Amount (₹)"
                        onChange={(value) => {
                            setAmount(value)
                        }}
                    />
                </div>
                
                <div className="pt-4">
                    <Button 
                        onClick={handleSend}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Money</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
                
                <MessageDisplay />
            </div>
        </div>
    );
}