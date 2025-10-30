import { cn } from "@/lib/utils";
import Link from "next/link";
import { Image } from "lucide-react";
import React from "react"
import { SidebarItem } from "./sidebar_item";
import {
    ClerkLoading,
    ClerkLoaded,
    UserButton,
} from "@clerk/nextjs"
import { Loader } from "lucide-react";
type Props = {
    className?: string;
}
export const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex min-h-screen lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col ",
            className,
        )}>
            <Link href="/main/learn">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <img src="/mascot.svg" height={40} width={40} alt="Mascot" />
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                        Lingo
                    </h1>
                </div>
            </Link>
            <div className="flex flex-col gap-y-2 flex-1">
                <SidebarItem 
                    label="learn" 
                    href="/main/learn"
                    iconSrc="/learn.svg"
                />
                <SidebarItem 
                    label="Leaderboard" 
                    href="/main/Leaderboard"
                    iconSrc="/Leaderboard.svg"
                />
                <SidebarItem 
                    label="quests" 
                    href="/main/quests"
                    iconSrc="/quests.svg"
                />
                <SidebarItem 
                    label="shop" 
                    href="/main/shop"
                    iconSrc="/shop.svg"
                />
            </div>
            <div  className="p-4">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <UserButton afterSignOutUrl="/"/>
                </ClerkLoaded>
            </div>
        </div>
    );
};
