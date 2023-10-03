-- CreateTable
CREATE TABLE `tokens` (
    `hashed_refresh_token` VARCHAR(191) NULL,
    `authentication_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `tokens_hashed_refresh_token_key`(`hashed_refresh_token`),
    UNIQUE INDEX `tokens_authentication_id_key`(`authentication_id`),
    INDEX `tokens_authentication_id_idx`(`authentication_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_authentication_id_fkey` FOREIGN KEY (`authentication_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
