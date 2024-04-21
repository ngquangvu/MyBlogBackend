/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `posts_key_key` ON `posts`(`key`);
