-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "defaultBranch" TEXT,
ADD COLUMN     "githubInstallationId" TEXT,
ADD COLUMN     "lastSyncError" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "lastSyncedSha" TEXT,
ADD COLUMN     "repoName" TEXT,
ADD COLUMN     "repoOwner" TEXT,
ADD COLUMN     "syncStatus" TEXT,
ADD COLUMN     "workingBranch" TEXT;

-- CreateTable
CREATE TABLE "GitHubInstallation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "installationId" INTEGER NOT NULL,
    "accountLogin" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubInstallation_installationId_key" ON "GitHubInstallation"("installationId");

-- CreateIndex
CREATE INDEX "GitHubInstallation_userId_idx" ON "GitHubInstallation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_repoOwner_repoName_userId_key" ON "Project"("repoOwner", "repoName", "userId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_githubInstallationId_fkey" FOREIGN KEY ("githubInstallationId") REFERENCES "GitHubInstallation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubInstallation" ADD CONSTRAINT "GitHubInstallation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

