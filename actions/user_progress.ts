"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { getCoursesById, getUserProgress } from "@/db/queries";
import { error } from "console";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect("/sign-in?redirect_url=courses");
    }

    const courses = await getCoursesById(courseId);

    if (!courses) {
        throw new Error("Course not found");
    }

    // TODO: Enable once units and lessons are added
    // if(!course.units,length || !course.units[0].lessons.length) {
    //     throw new Error("Course is empty");
    // }
    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.svg",
        }).where(eq(userProgress.userId, userId));

        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }
    
    const currentUserProgress = await getUserProgress();

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if(!challenge) {
        return {error: "challenge not found"};
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.
    findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    })

    const isPracticed = !!existingChallengeProgress;

    if(isPracticed) {
        return {error: "practice"};
    }

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if(currentUserProgress.hearts === 0) {
        return {error: "hearts"};
    }

    await db.update(userProgress).set({
        hearts: Math.max(0, currentUserProgress.hearts - 1),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};

