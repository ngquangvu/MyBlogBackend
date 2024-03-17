/*
  Warnings:

  - You are about to drop the column `parentId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `parentId`,
    DROP COLUMN `url`;
