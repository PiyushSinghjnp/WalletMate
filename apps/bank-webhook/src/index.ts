// this is web hook handler which handles the bank webhook and updates the balance i.e when we 
// click the add money button req goes to the bank netbanking and after that bank send us the 
// transaction details which we will get from the req and update the balance

// we create a web book handler in differnet backend to avoid the issue what if the main server goes down 
import express from "express";
import db from "@repo/db/client";
import prisma from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    // TODO: Add check only if the payment is processing  then proceed further because processing will become success when the amount will get added . Success status ones will be already incresed so we check for processing ones
  

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    const getRecord = await prisma.onRampTransaction.findUnique({
        where:{
            token : paymentInformation.token
        }
    }) 
    if(getRecord?.status =="Success"){
        return res.status(409).json({
            message:"Transaction Already processed"
        })
    }
    // if the money from the bank have send and the money we have requested to add is not same then we can return amount mismatch error
    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);