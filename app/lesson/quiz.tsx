"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useAudio } from "react-use";
import { useRouter } from "next/navigation";
import { useTransition, useState} from "react";

import { reduceHearts } from "@/actions/user_progress";
import { challenges, challengeOptions } from "@/db/schema";
import { upsertChallengeProgress } from "@/actions/challenge_progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result_card";
import { QuestionBubble } from "./question_bubble";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any;
};

export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    const router = useRouter();
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio ({src: "/correct.wav"});
    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio ({src: "/incorrect.wav"});
    const [pending, startTransition] = useTransition();

    const [lessonId, setLessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(initialPercentage);
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onSelect = (id: number) => {
        if(status !== "none") return;

        setSelectedOption(id);
    };

    const onContinue = () => {
        if(!selectedOption) return;

        if(status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        };
        if(status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        };
        
        const correctOption = options.find((option) => option.correct);

        if(!correctOption) {
            return;
        }

        if(correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                .then((response) => {
                    if(response?.error === "hearts") {
                        console.log("Missing hearts");  
                        return;
                    }
                    
                    correctControls.play();
                    setStatus("correct");
                    setPercentage((prev) => prev + 100 / challenges.length);

                    if (initialPercentage === 100) {
                        setHearts((prev) => Math.min(prev + 1, 5));
                    }
                })
                .catch(() => toast.error("something went wrong. Please try again."));
            })
            } else {
                startTransition(() => {
                    reduceHearts(challenge.id)
                    .then ((response) => {
                        if(response?.error === "hearts") {
                            console.log("Missing hearts");
                            return;
                        }

                        setStatus("wrong");

                        if(!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("something went wrong. Please try again."));
            });
        }
    };

    if(true || !challenge) {
        return (
            <>
                <Confetti
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                {incorrectAudio}
                {correctAudio}
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto 
                text-center items-center justify-center h-full">
                    <Image
                        src="/finish.svg"
                        alt="Finish"
                        className="hidden lg:block"
                        width={100}
                        height={100}
                    />
                    <Image
                        src="/finish.svg"
                        alt="Finish"
                        className="block lg:hidden"
                        width={50}
                        height={50}
                    />
                    <h1 className="text-2xl lg:text-4xl font-bold text-neutral-700">
                        Great Job! <br/> You've completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        );
    }
};
