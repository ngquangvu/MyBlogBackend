/*
  Warnings:

  - You are about to drop the column `name` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `name`,
    MODIFY `parentId` INTEGER NULL,
    MODIFY `url` VARCHAR(191) NULL;
