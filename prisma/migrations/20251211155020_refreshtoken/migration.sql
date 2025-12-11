-- DropForeignKey
ALTER TABLE "course_has_category" DROP CONSTRAINT "course_has_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "course_has_category" DROP CONSTRAINT "course_has_category_course_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "refreshToken" TEXT;

-- AddForeignKey
ALTER TABLE "course_has_category" ADD CONSTRAINT "course_has_category_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_has_category" ADD CONSTRAINT "course_has_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
