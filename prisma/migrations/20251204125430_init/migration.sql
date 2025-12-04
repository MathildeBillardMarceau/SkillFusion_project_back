-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INSTRUCTOR', 'APPRENTICE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'BANNED');

-- CreateTable
CREATE TABLE "course" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "image" TEXT,
    "level" "Level",
    "duration" TEXT NOT NULL,
    "cost" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "our_user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'APPRENTICE',
    "status" "Status" NOT NULL DEFAULT 'APPROVED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "our_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_title_key" ON "course"("title");

-- CreateIndex
CREATE UNIQUE INDEX "course_slug_key" ON "course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "our_user_email_key" ON "our_user"("email");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "our_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
