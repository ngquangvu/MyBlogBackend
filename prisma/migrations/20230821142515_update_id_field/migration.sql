/*
  Warnings:

  - The primary key for the `post_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_CategoryToPost` DROP FOREIGN KEY `_CategoryToPost_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PostToTag` DROP FOREIGN KEY `_PostToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `post_comments` DROP FOREIGN KEY `post_comments_postId_fkey`;

-- AlterTable
ALTER TABLE `_CategoryToPost` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_PostToTag` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post_comments` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `postId` VARCHAR(191) NOT NULL,
    MODIFY `parentId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `posts` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToTag` ADD CONSTRAINT `_PostToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToPost` ADD CONSTRAINT `_CategoryToPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
