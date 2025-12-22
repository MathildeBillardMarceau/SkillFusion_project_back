-- CreateTable
CREATE TABLE "course_has_subscriber" (
    "completion" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "course_has_subscriber_pkey" PRIMARY KEY ("course_id","user_id")
);

-- CreateTable
CREATE TABLE "course_prerequisites_course" (
    "course_id" TEXT NOT NULL,
    "prerequisite_id" TEXT NOT NULL,

    CONSTRAINT "course_prerequisites_course_pkey" PRIMARY KEY ("course_id","prerequisite_id")
);

-- AddForeignKey
ALTER TABLE "course_has_subscriber" ADD CONSTRAINT "course_has_subscriber_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_has_subscriber" ADD CONSTRAINT "course_has_subscriber_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites_course" ADD CONSTRAINT "course_prerequisites_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites_course" ADD CONSTRAINT "course_prerequisites_course_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
