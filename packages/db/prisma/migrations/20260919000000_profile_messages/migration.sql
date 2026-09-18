-- CreateTable
CREATE TABLE "ProfileMessage" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileMessage_toUserId_readAt_idx" ON "ProfileMessage"("toUserId", "readAt");

-- CreateIndex
CREATE INDEX "ProfileMessage_fromUserId_idx" ON "ProfileMessage"("fromUserId");

-- CreateIndex
CREATE INDEX "ProfileMessage_toUserId_fromUserId_createdAt_idx" ON "ProfileMessage"("toUserId", "fromUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProfileMessage" ADD CONSTRAINT "ProfileMessage_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMessage" ADD CONSTRAINT "ProfileMessage_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
