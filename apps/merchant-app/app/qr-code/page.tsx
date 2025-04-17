"use client";

import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { useState } from "react";

export default function QRCodePage() {
  const [amount, setAmount] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="text-slate-500">Generate a QR code for receiving payments from customers</p>
      </div>

      {/* QR Code Generator */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter amount"
            />
          </div>

          <Button
            onClick={generateQRCode}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </Button>

          {qrCode && (
            <div className="mt-6 text-center">
              <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                <img
                  src={qrCode}
                  alt="Payment QR Code"
                  className="w-64 h-64"
                />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Scan this QR code to receive payment from customers
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}