// this is web hook handler which handles the bank webhook and updates the balance i.e when we 
// click the add money button req goes to the bank netbanking and after that bank send us the 
// transaction details which we will get from the req and update the balance

// we create a web book handler in differnet backend to avoid the issue what if the main server goes down 
import express from "express";
import db from "@repo/db/client";
import prisma from "@repo/db/client";
import { z } from "zod";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// Webhook payload validation schema
const webhookPayloadSchema = z.object({
    token: z.string(),
    user_identifier: z.string(),
    amount: z.string(),
    status: z.enum(["Processing", "Success", "Failed"]),
    signature: z.string(), // HDFC Bank's signature
    timestamp: z.string()
});

type WebhookPayload = z.infer<typeof webhookPayloadSchema>;

// Verify HDFC Bank's signature
function verifySignature(payload: WebhookPayload, signature: string, timestamp: string): boolean {
    const secret = process.env.HDFC_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error("HDFC_WEBHOOK_SECRET not configured");
    }

    const data = `${payload.token}${payload.user_identifier}${payload.amount}${timestamp}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

app.post("/hdfcWebhook", async (req, res) => {
    try {
        // Validate webhook payload
        const validatedData = webhookPayloadSchema.parse(req.body);

        // Verify signature
        if (!verifySignature(validatedData, validatedData.signature, validatedData.timestamp)) {
            return res.status(401).json({
                message: "Invalid signature"
            });
        }

        // Get the original transaction record
        const getRecord = await prisma.onRampTransaction.findUnique({
            where: {
                token: validatedData.token
            }
        });

        if (!getRecord) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        // Check if transaction was already processed
        if (getRecord.status === "Success") {
            return res.status(409).json({
                message: "Transaction already processed"
            });
        }

        // Verify amount matches
        if (Number(validatedData.amount) !== getRecord.amount) {
            return res.status(400).json({
                message: "Amount mismatch"
            });
        }

        // Only process if status is "Processing"
        if (validatedData.status !== "Processing") {
            return res.status(400).json({
                message: "Invalid transaction status"
            });
        }

        // Process the transaction
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(validatedData.user_identifier)
                },
                data: {
                    amount: {
                        increment: Number(validatedData.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: validatedData.token
                },
                data: {
                    status: "Success"
                }
            })
        ]);

        res.json({
            message: "Payment processed successfully"
        });
    } catch (error: unknown) {
        console.error("Webhook error:", error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Invalid webhook payload",
                errors: error.errors
            });
        }
        res.status(500).json({
            message: "Error processing webhook"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Bank webhook server running on port ${PORT}`);
});