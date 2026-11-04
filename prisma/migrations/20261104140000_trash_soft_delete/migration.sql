-- Trash: deleted projects and pages are kept for 30 days, then purged
ALTER TABLE "Project" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "BuilderSession" ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "Project_deletedAt_idx" ON "Project"("deletedAt");
CREATE INDEX "BuilderSession_deletedAt_idx" ON "BuilderSession"("deletedAt");
