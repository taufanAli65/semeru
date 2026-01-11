-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('SuperAdmin', 'Admin', 'Mahasiswa', 'Mentor');

-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('Active', 'NonActive');

-- CreateEnum
CREATE TYPE "activityCategory" AS ENUM ('Kompetisi', 'Pelatihan', 'Seminar');

-- CreateEnum
CREATE TYPE "activityStatus" AS ENUM ('Active', 'NonActive', 'Done', 'Created');

-- CreateEnum
CREATE TYPE "userActivityStatus" AS ENUM ('Registered', 'Attended', 'NotAttended', 'Pass', 'Fail');

-- CreateEnum
CREATE TYPE "activityImageCategory" AS ENUM ('Certificate', 'Poster');

-- CreateEnum
CREATE TYPE "monevCategory" AS ENUM ('Prestasi', 'Seminar', 'Kepemimpinan', 'Pelatihan', 'Akademik', 'Publikasi', 'Kecendekiawanan');

-- CreateEnum
CREATE TYPE "periodStatus" AS ENUM ('Incomplete', 'Complete');

-- CreateEnum
CREATE TYPE "recordStatus" AS ENUM ('Pending', 'Verified', 'Fail');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "userRole" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_information" (
    "user_information_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "nomor_whatsapp" TEXT NOT NULL,
    "program_studi" TEXT NOT NULL,
    "fakultas" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "universitas" TEXT NOT NULL,
    "status" "userStatus" NOT NULL,

    CONSTRAINT "user_information_pkey" PRIMARY KEY ("user_information_id")
);

-- CreateTable
CREATE TABLE "activity" (
    "activity_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "activityStatus" NOT NULL,
    "limit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "activity_images" (
    "activity_image_id" UUID NOT NULL,
    "activity_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_category" "activityImageCategory" NOT NULL,
    "alternative_text" TEXT NOT NULL,

    CONSTRAINT "activity_images_pkey" PRIMARY KEY ("activity_image_id")
);

-- CreateTable
CREATE TABLE "trn_activity_registration" (
    "registration_id" UUID NOT NULL,
    "activity_id" UUID NOT NULL,
    "user_id" UUID,
    "participant_name" TEXT NOT NULL,
    "participant_email" TEXT NOT NULL,
    "participant_whatsapp" TEXT NOT NULL,
    "institution_origin" TEXT NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "userActivityStatus" NOT NULL,

    CONSTRAINT "trn_activity_registration_pkey" PRIMARY KEY ("registration_id")
);

-- CreateTable
CREATE TABLE "monev_periods" (
    "period_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "mentor" UUID NOT NULL,
    "semester" INTEGER NOT NULL,
    "status" "periodStatus" NOT NULL DEFAULT 'Incomplete',
    "general_feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monev_periods_pkey" PRIMARY KEY ("period_id")
);

-- CreateTable
CREATE TABLE "monev_records" (
    "record_id" UUID NOT NULL,
    "period_id" UUID NOT NULL,
    "category" "monevCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "grade_value" DOUBLE PRECISION,
    "status" "recordStatus" NOT NULL DEFAULT 'Pending',
    "reviewer_notes" TEXT,
    "verified_by" UUID,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monev_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_information_user_id_key" ON "user_information"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "monev_periods_user_id_semester_key" ON "monev_periods"("user_id", "semester");

-- AddForeignKey
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_images" ADD CONSTRAINT "activity_images_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("activity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trn_activity_registration" ADD CONSTRAINT "trn_activity_registration_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("activity_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trn_activity_registration" ADD CONSTRAINT "trn_activity_registration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monev_periods" ADD CONSTRAINT "monev_periods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monev_periods" ADD CONSTRAINT "monev_periods_mentor_fkey" FOREIGN KEY ("mentor") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monev_records" ADD CONSTRAINT "monev_records_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "monev_periods"("period_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monev_records" ADD CONSTRAINT "monev_records_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
