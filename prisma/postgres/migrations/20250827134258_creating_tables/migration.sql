-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('superAdmin', 'users');

-- CreateEnum
CREATE TYPE "public"."MovieSituation" AS ENUM ('upcoming', 'released', 'canceled');

-- CreateTable
CREATE TABLE "public"."users" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(250),
    "email" VARCHAR(250),
    "password" TEXT,
    "type" "public"."UserType" DEFAULT 'users',
    "profileImage" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "storageUuid" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."storage" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mimetype" VARCHAR(200),
    "type" VARCHAR(200),
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "storage_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."movies" (
    "uuid" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "language" VARCHAR(100),
    "situation" "public"."MovieSituation" DEFAULT 'upcoming',
    "synopsis" TEXT,
    "popularity" INTEGER DEFAULT 0,
    "votesQuantity" INTEGER DEFAULT 0,
    "ratingPercentage" DOUBLE PRECISION DEFAULT 0,
    "trailerUrl" TEXT,
    "posterUrl" TEXT,
    "budget" INTEGER,
    "revenue" INTEGER,
    "profit" INTEGER,
    "releaseDate" TIMESTAMP,
    "durationInMinutes" INTEGER,
    "genre" TEXT[],
    "posterUuid" UUID,
    "userUuid" UUID,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_type_idx" ON "public"."users"("type");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "public"."users"("createdAt");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "public"."users"("deletedAt");

-- CreateIndex
CREATE INDEX "storage_name_idx" ON "public"."storage"("name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_storageUuid_fkey" FOREIGN KEY ("storageUuid") REFERENCES "public"."storage"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movies" ADD CONSTRAINT "movies_posterUuid_fkey" FOREIGN KEY ("posterUuid") REFERENCES "public"."storage"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movies" ADD CONSTRAINT "movies_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "public"."users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
