/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `subscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `subscriber_email_key` ON `subscriber`(`email`);
