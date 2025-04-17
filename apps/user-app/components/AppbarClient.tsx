"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function AppbarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Set loading to false once session status is determined
  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  return (
   <div>
      <Appbar 
        onSignin={signIn} 
        onSignout={async () => {
          await signOut()
          router.push("/api/auth/signin")
        }} 
        user={session?.user} 
        isLoading={isLoading}
      />
   </div>
  );
}
