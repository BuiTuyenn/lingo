"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useClerk
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "./(marketing)/header";
import { Footer } from "./(marketing)/footer";

export default function Home() {
  const { openSignIn, openSignUp } = useClerk();

  const handleSignIn = () => {
    openSignIn({
      redirectUrl: "/learn"
    });
  };

  const handleSignUp = () => {
    openSignUp({
      redirectUrl: "/learn"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-screen-lg mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
          <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
            <Image src="/hero.svg" fill alt="Hero" />
          </div>
          <div className="flex flex-col items-center gap-y-8 max-w-[330px] w-full">
            <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
              Learn, practice, and master new languages with Lingo.
            </h1>
            <div className="flex flex-col items-center gap-y-3 w-full">
              <ClerkLoading>
                <Loader className="h-5 w-5 text-muted-foreground animate-spin mx-auto" />
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <Button size="lg" variant="Secondary" className="w-full bg-green-500 text-white hover:bg-green-600" onClick={handleSignUp}>
                    Get started
                  </Button>
                  <Button size="lg" variant="primaryOutline" className="w-full mt-2 text-blue-500 hover:text-blue-600" onClick={handleSignIn}>
                    I already have an account
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" variant="Secondary" className="w-full" asChild>
                    <Link href="/learn">
                      Continue Learning
                    </Link>
                  </Button>
                </SignedIn>
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
