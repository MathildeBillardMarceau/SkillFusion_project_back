-- CreateEnum
CREATE TYPE "Category" AS ENUM ('AUTRE', 'PEINTURE', 'PLOMBERIE', 'ELECTRICITE', 'MENUISERIE');

-- CreateTable
CREATE TABLE "courses_card" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "courses_card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_card_courseId_key" ON "courses_card"("courseId");

-- AddForeignKey
ALTER TABLE "courses_card" ADD CONSTRAINT "courses_card_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
