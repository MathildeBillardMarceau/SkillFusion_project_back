BEGIN; -- Début de transaction

-- =========================================
-- Supprimer les tables existantes
-- =========================================
DROP TABLE IF EXISTS "course_has_subscriber";
DROP TABLE IF EXISTS "course_prerequisites_course";
DROP TABLE IF EXISTS "course_has_category";
DROP TABLE IF EXISTS "chapter_has_media";
DROP TABLE IF EXISTS "category";
DROP TABLE IF EXISTS "message";
DROP TABLE IF EXISTS "media";
DROP TABLE IF EXISTS "chapter";
DROP TABLE IF EXISTS "course";
DROP TABLE IF EXISTS "user";

-- =========================================
-- Supprimer les ENUM existants
-- =========================================
DROP TYPE IF EXISTS role_enum;
DROP TYPE IF EXISTS level_enum;
DROP TYPE IF EXISTS status_enum;
DROP TYPE IF EXISTS video_enum;

-- ===========================
-- ENUMS
-- ===========================
CREATE TYPE role_enum AS ENUM ('ADMIN', 'INSTRUCTOR', 'APPRENTICE');
CREATE TYPE level_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TYPE status_enum AS ENUM ('PENDING', 'APPROVED', 'BANNED');
CREATE TYPE video_enum AS ENUM ('IMAGE', 'VIDEO');

-- ===========================
-- TABLE : user
-- ===========================
CREATE TABLE "user" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" role_enum NOT NULL DEFAULT 'APPRENTICE',
    "status" status_enum NOT NULL DEFAULT 'APPROVED',
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE : course
-- ===========================
CREATE TABLE "course" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "level" level_enum,
    "duration" TEXT,
    "cost" TEXT,
    "material" TEXT,
    "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "published_at" TIMESTAMP DEFAULT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE : chapter
-- ===========================
CREATE TABLE "chapter" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INT NOT NULL,
    "text" TEXT,
    "course_id" UUID NOT NULL REFERENCES "course"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE : media
-- ===========================
CREATE TABLE "media" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "url" TEXT UNIQUE NOT NULL,
    "type" video_enum NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE : message
-- ===========================
CREATE TABLE "message" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "course_id" UUID NOT NULL REFERENCES "course"("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE : category
-- ===========================
CREATE TABLE "category" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT UNIQUE NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- TABLE : chapter_has_media (Many-to-Many)
-- ===========================
CREATE TABLE "chapter_has_media" (
    "chapter_id" UUID NOT NULL REFERENCES "chapter"("id") ON DELETE CASCADE,
    "media_id" UUID NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
    PRIMARY KEY ("chapter_id", "media_id")
);

-- ===========================
-- TABLE : course_has_category (Many-to-Many)
-- ===========================
CREATE TABLE "course_has_category" (
    "course_id" UUID NOT NULL REFERENCES "course"("id") ON DELETE CASCADE,
    "category_id" UUID NOT NULL REFERENCES "category"("id") ON DELETE CASCADE,
    PRIMARY KEY ("course_id", "category_id")
);

-- ===========================
-- TABLE : course_prerequisites_course (Many-to-Many)
-- ===========================
CREATE TABLE "course_prerequisites_course" (
    "course_id" UUID NOT NULL REFERENCES "course"("id") ON DELETE CASCADE,
    "prerequisite_id" UUID NOT NULL REFERENCES "course"("id") ON DELETE CASCADE,
    PRIMARY KEY ("course_id", "prerequisite_id")
);

-- ===========================
-- TABLE : course_has_subscriber (Many-to-Many)
-- ===========================
CREATE TABLE "course_has_subscriber" (
    "course_id" UUID NOT NULL REFERENCES "course"("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "completion" INT,
    PRIMARY KEY ("course_id", "user_id") -- clé primaire composite
);

COMMIT; -- Fin de transaction