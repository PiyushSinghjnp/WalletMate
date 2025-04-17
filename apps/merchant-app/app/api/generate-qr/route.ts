import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import QRCode from "qrcode";
import { Prisma } from "@prisma/client"; // Import Prisma types for error handling

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id; // Extract user ID from session

  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let amount: number;
  try {
    // Parse amount from request body
    const body = await request.json();
    amount = Number(body.amount);

    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount provided" }, { status: 400 });
    }
  } catch (e) {
    console.error("Failed to parse request body:", e);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // Convert session userId (string) to a number for the database
    const merchantId = Number(userId);
    if (isNaN(merchantId)) {
       console.error("Invalid user ID format in session:", userId);
       // Avoid exposing internal details in the error response
       return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Create a payment request record in the database
    const paymentRequest = await prisma.merchantPaymentRequest.create({
      data: {
        merchantId: merchantId,
        // Store amount in the smallest currency unit (e.g., paise) and ensure it's an integer
        amount: Math.round(amount * 100),
        status: "Pending" // Ensure 'Pending' is a valid status in your schema
      }
    });

    // Construct the payment URL using NEXTAUTH_URL or a default for development
    // Make sure the port matches your merchant app's port (e.g., 3001 if user app is 3000)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
    const paymentUrl = `${baseUrl}/pay/${paymentRequest.id}`; // Assuming you have a /pay/[paymentId] route

    // Generate the QR code image data URL
    const qrCode = await QRCode.toDataURL(paymentUrl);

    // Return the QR code data URL and the payment request ID
    return NextResponse.json({ qrCode, paymentRequestId: paymentRequest.id });

  } catch (error) {
     console.error("Error processing payment request:", error);

     // Handle specific Prisma errors if needed
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
       // Example: Foreign key constraint error (e.g., merchantId doesn't exist)
       if (error.code === 'P2003') {
         return NextResponse.json({ error: "Invalid merchant reference" }, { status: 400 });
       }
       // Add more specific Prisma error checks if necessary
     }

     // Return a generic error for other issues
     return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}