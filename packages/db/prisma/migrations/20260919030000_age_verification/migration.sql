-- AlterTable
ALTER TABLE "User" ADD COLUMN "ageStatus" TEXT NOT NULL DEFAULT 'none';
ALTER TABLE "User" ADD COLUMN "ageVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AgeVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "documentKey" TEXT NOT NULL,
    "selfieKey" TEXT,
    "declaredAdult" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "rejectionReason" TEXT,

    CONSTRAINT "AgeVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgeVerification_userId_idx" ON "AgeVerification"("userId");
CREATE INDEX "AgeVerification_status_idx" ON "AgeVerification"("status");

-- AddForeignKey
ALTER TABLE "AgeVerification" ADD CONSTRAINT "AgeVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
