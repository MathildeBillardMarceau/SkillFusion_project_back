/*
  Warnings:

  - You are about to drop the column `excerpt` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "excerpt",
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_has_category" (
    "course_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "course_has_category_pkey" PRIMARY KEY ("course_id","category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "course_has_category" ADD CONSTRAINT "course_has_category_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_has_category" ADD CONSTRAINT "course_has_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
