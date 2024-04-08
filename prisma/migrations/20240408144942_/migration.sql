/*
  Warnings:

  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Images`;

-- CreateTable
CREATE TABLE `images` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `sizeKb` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `sizeType` ENUM('EXTRA_LARGE', 'LARGE', 'MEDIUM', 'THUMBNAIL') NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
