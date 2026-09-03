-- CreateTable
CREATE TABLE "AdoConnection" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "adoProject" TEXT NOT NULL,
    "patEnc" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "connectedByUserId" TEXT NOT NULL,
    "typeMapping" JSONB NOT NULL,
    "stateMapping" JSONB NOT NULL,
    "lastValidatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkItemLink" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "builderSessionId" TEXT,
    "builderItemId" TEXT NOT NULL,
    "builderItemKind" TEXT NOT NULL,
    "adoWorkItemId" INTEGER NOT NULL,
    "adoWorkItemType" TEXT NOT NULL,
    "adoUrl" TEXT NOT NULL,
    "lastKnownState" TEXT NOT NULL,
    "lastKnownCategory" TEXT,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "lastSyncError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkItemLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdoConnection_projectId_key" ON "AdoConnection"("projectId");

-- CreateIndex
CREATE INDEX "WorkItemLink_builderSessionId_idx" ON "WorkItemLink"("builderSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkItemLink_connectionId_adoWorkItemId_key" ON "WorkItemLink"("connectionId", "adoWorkItemId");

-- AddForeignKey
ALTER TABLE "AdoConnection" ADD CONSTRAINT "AdoConnection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkItemLink" ADD CONSTRAINT "WorkItemLink_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "AdoConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkItemLink" ADD CONSTRAINT "WorkItemLink_builderSessionId_fkey" FOREIGN KEY ("builderSessionId") REFERENCES "BuilderSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
