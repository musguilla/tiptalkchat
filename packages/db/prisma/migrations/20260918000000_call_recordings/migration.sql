-- CreateTable
CREATE TABLE "CallRecording" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "egressId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedById" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "fileKey" TEXT,
    "fileUrl" TEXT,
    "durationSec" INTEGER,
    "sizeBytes" BIGINT,

    CONSTRAINT "CallRecording_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallRecording_egressId_key" ON "CallRecording"("egressId");

-- CreateIndex
CREATE INDEX "CallRecording_roomId_idx" ON "CallRecording"("roomId");

-- CreateIndex
CREATE INDEX "CallRecording_status_idx" ON "CallRecording"("status");

-- AddForeignKey
ALTER TABLE "CallRecording" ADD CONSTRAINT "CallRecording_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
