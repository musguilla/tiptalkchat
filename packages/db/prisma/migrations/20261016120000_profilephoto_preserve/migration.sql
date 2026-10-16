-- Preserve user media for admin moderation.
-- Gallery photos become soft-deletable; avatars are archived so past avatars
-- are never lost. Files are always kept in Supabase.

ALTER TABLE "ProfilePhoto" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'gallery';
ALTER TABLE "ProfilePhoto" ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "ProfilePhoto_source_idx" ON "ProfilePhoto"("source");

-- Backfill: archive every current avatar as a ProfilePhoto row so the admin
-- Media view keeps them even if the user later changes or removes the avatar.
INSERT INTO "ProfilePhoto" ("id", "userId", "publicUrl", "storageKey", "isPublic", "source", "createdAt")
SELECT gen_random_uuid()::text, u."id", u."avatarUrl", u."avatarUrl", false, 'avatar', now()
FROM "User" u
WHERE u."avatarUrl" IS NOT NULL;
