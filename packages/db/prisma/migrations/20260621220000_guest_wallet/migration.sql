-- Make Wallet.userId nullable; add Wallet.guestId
ALTER TABLE "Wallet" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Wallet" DROP CONSTRAINT IF EXISTS "Wallet_userId_fkey";
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Wallet" ADD COLUMN IF NOT EXISTS "guestId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Wallet_guestId_key" ON "Wallet"("guestId");
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_guestId_fkey"
  FOREIGN KEY ("guestId") REFERENCES "GuestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
