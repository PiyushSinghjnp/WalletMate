import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import crypto from "crypto";

// Verify webhook signature
function verifySignature(payload: any, signature: string, timestamp: string): boolean {
  const secret = process.env.MERCHANT_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("MERCHANT_WEBHOOK_SECRET not configured");
  }

  const data = `${payload.merchantId}${payload.amount}${payload.paymentId}${timestamp}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { merchantId, amount, paymentId, signature, timestamp } = body;

    // Verify webhook signature
    if (!verifySignature(body, signature, timestamp)) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    // Find the transaction
    const transaction = await prisma.merchantTransaction.findUnique({
      where: { paymentId },
      include: { merchant: true }
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    // Verify amount matches
    if (transaction.amount !== amount) {
      return new NextResponse("Amount mismatch", { status: 400 });
    }

    // Update transaction and balance in a single transaction
    await prisma.$transaction([
      // Update transaction status
      prisma.merchantTransaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS" }
      }),
      // Update merchant balance
      prisma.merchantBalance.upsert({
        where: { merchantId: transaction.merchantId },
        create: {
          merchantId: transaction.merchantId,
          amount: transaction.amount
        },
        update: {
          amount: {
            increment: transaction.amount
          }
        }
      })
    ]);

    return NextResponse.json({ message: "Payment processed successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 