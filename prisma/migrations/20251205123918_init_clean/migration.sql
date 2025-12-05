/*
  Warnings:

  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `course` table. All the data in the column will be lost.
  - You are about to drop the `our_user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_user_id_fkey";

-- AlterTable
ALTER TABLE "course" DROP CONSTRAINT "course_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "cost" DROP NOT NULL,
ALTER COLUMN "material" DROP NOT NULL,
ALTER COLUMN "published_at" DROP NOT NULL,
ALTER COLUMN "published_at" DROP DEFAULT,
ADD CONSTRAINT "course_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "our_user";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'APPRENTICE',
    "status" "Status" NOT NULL DEFAULT 'APPROVED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
