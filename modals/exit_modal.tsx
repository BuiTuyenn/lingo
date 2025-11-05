"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use_exit_modal";


export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const {isOpen, Open, Close} = useExitModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={Close}>
            <DialogContent>
                <div className="flex items-center w-full justify-center mb-5">
                    <Image 
                    src="/mascot_sad.svg"
                    alt="Mascot"
                    height={80}
                    width={80}
                    />
                </div>
                <DialogTitle className="text-center font-bold text-2xl">
                    Wait, don't go!
                </DialogTitle>
                <DialogDescription className="text-center text-base">
                    You're about to leave the lesson. Are you sure ?
                </DialogDescription>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={Close}
                        >
                            keep learning              
                        </Button>
                        <Button
                            variant="dangerOutline"
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                Close();   
                                router.push("learn");
                            }}
                        >
                            Exit session              
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
