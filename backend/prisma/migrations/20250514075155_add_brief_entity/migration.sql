-- CreateTable
CREATE TABLE "Brief" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToBrief" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToBrief_AB_unique" ON "_ArticleToBrief"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToBrief_B_index" ON "_ArticleToBrief"("B");

-- AddForeignKey
ALTER TABLE "_ArticleToBrief" ADD CONSTRAINT "_ArticleToBrief_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToBrief" ADD CONSTRAINT "_ArticleToBrief_B_fkey" FOREIGN KEY ("B") REFERENCES "Brief"("id") ON DELETE CASCADE ON UPDATE CASCADE;
