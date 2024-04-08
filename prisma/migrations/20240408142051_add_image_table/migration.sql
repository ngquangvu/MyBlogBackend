-- CreateTable
CREATE TABLE `Images` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `sizeKb` INTEGER NOT NULL,
    `mimeType` ENUM('JPG', 'JPEG', 'PNG', 'GIF') NOT NULL,
    `sizeType` ENUM('EXTRA_LARGE', 'LARGE', 'MEDIUM', 'THUMBNAIL') NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Images` ADD CONSTRAINT `Images_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
