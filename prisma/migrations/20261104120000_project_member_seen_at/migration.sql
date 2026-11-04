-- Per-account read state for the builder's notification bell
ALTER TABLE "ProjectMember" ADD COLUMN "seenAt" TIMESTAMP(3);

-- Memberships from before the bell existed count as already seen
UPDATE "ProjectMember" SET "seenAt" = CURRENT_TIMESTAMP WHERE "seenAt" IS NULL;
