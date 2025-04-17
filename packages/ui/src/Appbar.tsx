import { Button } from "./button";
import { Wallet, LogOut, ChevronDown, User } from "lucide-react";
import { useState } from "react";

interface AppbarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    },
    // TODO: can u figure out what the type should be here?
    onSignin: any,
    onSignout: any,
    isLoading?: boolean
}

export const Appbar = ({
    user,
    onSignin,
    onSignout,
    isLoading = false
}: AppbarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    return (
        <div className="flex justify-between items-center border-b border-slate-200 px-4 py-3 bg-white shadow-sm">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        WalletMate
                    </h1>
                    <p className="text-xs text-slate-500">Your Digital Wallet</p>
                </div>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
                {/* User Profile Dropdown or Sign In Button */}
                {isLoading ? (
                    <div className="w-24 h-8 bg-slate-100 rounded animate-pulse"></div>
                ) : user ? (
                    <div className="relative">
                        <div 
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="hidden md:block">
                                <p className="font-medium text-slate-800">{user.name || 'User'}</p>
                                <p className="text-xs text-slate-500">{user.email || ''}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="font-medium text-slate-800">{user.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email || ''}</p>
                                </div>
                                <div className="py-1">
                                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center space-x-3">
                                        <User className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-700">Profile</span>
                                    </div>
                                    <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center space-x-3" onClick={onSignout}>
                                        <LogOut className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-700">Sign Out</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button onClick={onSignin}>
                        Sign In
                    </Button>
                )}
            </div>
        </div>
    );
}