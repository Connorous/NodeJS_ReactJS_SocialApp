/*
  Warnings:

  - Added the required column `pageOwnerId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "pageOwnerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_pageOwnerId_fkey" FOREIGN KEY ("pageOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
