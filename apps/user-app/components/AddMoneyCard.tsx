"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";
import { Building2, ArrowRight } from "lucide-react";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [amount, setAmount] = useState(0);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);

    return (
        <div className="space-y-6">
            {/* Amount Input */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enter Amount
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">₹</span>
                    </div>
                    <TextInput
                        label="Amount"
                        placeholder="0.00"
                        onChange={(value) => setAmount(Number(value))}
                    />
                </div>
            </div>

            {/* Bank Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Bank
                </label>
                <div className="relative">
                    <Select
                        onSelect={(value) => {
                            setProvider(value);
                            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                        }}
                        options={SUPPORTED_BANKS.map(x => ({
                            key: x.name,
                            value: x.name
                        }))}
                    />
                </div>
            </div>

            {/* Bank Cards */}
            <div className="grid grid-cols-2 gap-4">
                {SUPPORTED_BANKS.map((bank, index) => (
                    <div
                        key={bank.name}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            provider === bank.name
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => {
                            setProvider(bank.name);
                            setRedirectUrl(bank.redirectUrl);
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                provider === bank.name ? 'bg-indigo-100' : 'bg-slate-100'
                            }`}>
                                <Building2 className={`w-5 h-5 ${
                                    provider === bank.name ? 'text-indigo-600' : 'text-slate-600'
                                }`} />
                            </div>
                            <div>
                                <p className={`font-medium ${
                                    provider === bank.name ? 'text-indigo-700' : 'text-slate-700'
                                }`}>
                                    {bank.name}
                                </p>
                                <p className="text-xs text-slate-500">Net Banking</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <div className="pt-4">
                <Button
                    onClick={async () => {
                        await createOnRampTransaction(amount * 100, provider);
                        window.location.href = redirectUrl || "";
                    }}
                >
                    <span>Proceed to Add Money</span>
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

