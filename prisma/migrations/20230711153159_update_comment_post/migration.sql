-- AlterTable
ALTER TABLE `post_comments` ADD COLUMN `authorId` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
