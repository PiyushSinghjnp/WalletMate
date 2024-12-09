"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";

export function SendMoneyCard() {
    const router = useRouter();
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message,setMessage] = useState("");



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
                handleMessage("Please fill the fields");
            }
            setMessage("Processing...");
            const result = await p2pTransfer(number, Number(amount) * 100);
            console.log(result);
            // Check for a successful response or failure
            if(!result){
                handleMessage("No response from server");
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
        } catch (error) {
            console.error("Error during transfer:", error);
            handleMessage("An error occurred while processing the transaction.");
        }
    }
    const MessageDisplay=()=>{
        return(
        message && (
            <div className={`mt-4 text-center ${
                message === "Processing..." 
                    ? "text-blue-500" 
                    : message.includes("successful") 
                        ? "text-green-500" 
                        : "text-red-500"
            }`}>
                {message}
            </div>
        )
    )
    }

    return (
        <div className="">
            <Center>
                <Card title="Send">
                    <div className="w-full">
                        <TextInput
                            placeholder={"Number"}
                            label="Number"
                            onChange={(value) => {
                                setNumber(value)
                            }} 
                        />
                        <TextInput
                            placeholder={"Amount"}
                            label="Amount"
                            onChange={(value) => {
                                setAmount(value)
                            }} 
                        />
                        <div className="pt-4 flex justify-center">
                            <Button onClick={handleSend}>Send</Button>
                        </div>
                        <MessageDisplay />
                    </div>
                </Card>
            </Center>
        </div>
    );
}