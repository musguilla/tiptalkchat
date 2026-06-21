-- Make Tip.senderId nullable (was NOT NULL)
ALTER TABLE "Tip" ALTER COLUMN "senderId" DROP NOT NULL;
-- Drop existing FK constraint to recreate it with ON DELETE CASCADE behavior intact but nullable
ALTER TABLE "Tip" DROP CONSTRAINT IF EXISTS "Tip_senderId_fkey";
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- New columns for guest tipping
ALTER TABLE "Tip" ADD COLUMN IF NOT EXISTS "senderGuestId" TEXT;
ALTER TABLE "Tip" ADD COLUMN IF NOT EXISTS "senderEmail" TEXT;
-- Index for guest lookups
CREATE INDEX IF NOT EXISTS "Tip_senderGuestId_idx" ON "Tip"("senderGuestId");
