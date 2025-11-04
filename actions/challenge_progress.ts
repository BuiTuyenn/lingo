"use server";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { challengeProgress, challenges, lessons, userProgress } from "@/db/schema";
import { getUserProgress } from "@/db/queries";

export const upsertChallengeProgress = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingLessonProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractice = !!existingLessonProgress;

    if (currentUserProgress.hearts === 0 && !isPractice) {
        return { error: "hearts" };

    }

    if (isPractice) {
        await db.update(challengeProgress).set({
            completed: true,
        })
        .where(eq(challengeProgress.id, existingLessonProgress.id));

        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 5),
            points: currentUserProgress.points + 10,
        }).where(eq(userProgress.userId, userId));

        revalidatePath("/main/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonId}`);
        return;
    }

    await db.insert(challengeProgress).values({
        challengeId,
        userId,
        completed: true,
    });

    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/main/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
};