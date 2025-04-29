/*
  Warnings:

  - You are about to drop the column `price` on the `product_units` table. All the data in the column will be lost.
  - Added the required column `address` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `corner_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clusters` ADD COLUMN `address` VARCHAR(255) NOT NULL,
    ADD COLUMN `is_apartment` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `product_units` DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `corner_price` BIGINT NOT NULL,
    ADD COLUMN `default_price` BIGINT NOT NULL;
