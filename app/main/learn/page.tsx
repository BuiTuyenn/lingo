import { redirect } from "next/navigation";

import { lessons, units as unitsSchema } from "@/db/schema";
import { FeedWapper } from "@/components/feed_wapper";
import { UserProgress } from "@/components/ui/user_progress";
import { StickyWrapper } from "@/components/sticky_wrapper";

import { 
  getUserProgress, 
  getUnits, 
  getCourseProgress, 
  getLessonPercentage 
} from "@/db/queries";

import { Unit } from "./unit";
import { Header } from "./header";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
  ]);

  if (!userProgress || !userProgress.activeCourse ){
    redirect("/main/courses")
  }

  if (!courseProgress){
    redirect("/main/courses")
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={ userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWapper>
        <Header title={userProgress.activeCourse.title}/>
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson as typeof lessons.
                $inferSelect & {
                   unit: typeof unitsSchema.$inferSelect; 
                  } | undefined}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
        </FeedWapper>
    </div>
  );
};

export default LearnPage;
