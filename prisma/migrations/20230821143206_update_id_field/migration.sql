-- AlterTable
ALTER TABLE `categories` MODIFY `parentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `posts` MODIFY `parentId` VARCHAR(191) NULL;
