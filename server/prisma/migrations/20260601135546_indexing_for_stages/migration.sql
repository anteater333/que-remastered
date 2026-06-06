-- CreateIndex
CREATE INDEX "stages_isPublished_uploadedAt_idx" ON "stages"("isPublished", "uploadedAt" DESC);

-- CreateIndex
CREATE INDEX "stages_status_idx" ON "stages"("status");

-- CreateIndex
CREATE INDEX "stages_uploaderId_idx" ON "stages"("uploaderId");
