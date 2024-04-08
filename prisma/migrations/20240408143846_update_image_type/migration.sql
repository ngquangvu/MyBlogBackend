/*
  Warnings:

  - You are about to alter the column `mimeType` on the `Images` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Images` MODIFY `mimeType` VARCHAR(191) NOT NULL;
