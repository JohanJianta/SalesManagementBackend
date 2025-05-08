/*
  Warnings:

  - A unique constraint covering the columns `[clickable_area_id]` on the table `clusters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clickable_area_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clickable_area_id` to the `clusters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clickable_area_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clusters` ADD COLUMN `clickable_area_id` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `clickable_area_id` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `clickable_areas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `shape` ENUM('rectangle', 'circle') NOT NULL DEFAULT 'rectangle',
    `x1` FLOAT NOT NULL,
    `y1` FLOAT NOT NULL,
    `x2` FLOAT NULL,
    `y2` FLOAT NULL,
    `radius` FLOAT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `clusters_clickable_area_id_key` ON `clusters`(`clickable_area_id`);

-- CreateIndex
CREATE INDEX `cluster_clickable_area_id_foreign` ON `clusters`(`clickable_area_id`);

-- CreateIndex
CREATE UNIQUE INDEX `products_clickable_area_id_key` ON `products`(`clickable_area_id`);

-- CreateIndex
CREATE INDEX `product_clickable_area_id_foreign` ON `products`(`clickable_area_id`);

-- AddForeignKey
ALTER TABLE `clusters` ADD CONSTRAINT `cluster_clickable_area_id_foreign` FOREIGN KEY (`clickable_area_id`) REFERENCES `clickable_areas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `product_clickable_area_id_foreign` FOREIGN KEY (`clickable_area_id`) REFERENCES `clickable_areas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
