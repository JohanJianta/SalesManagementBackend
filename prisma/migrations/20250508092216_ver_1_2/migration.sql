-- CreateTable
CREATE TABLE `clickable_areas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `cluster_id` INTEGER UNSIGNED NOT NULL,
    `top` FLOAT NOT NULL,
    `left` FLOAT NOT NULL,
    `width` FLOAT NOT NULL,
    `height` FLOAT NOT NULL,
    `center_x` FLOAT NOT NULL,
    `center_y` FLOAT NOT NULL,

    UNIQUE INDEX `clickable_areas_cluster_id_key`(`cluster_id`),
    INDEX `clickable_area_cluster_id_foreign`(`cluster_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clickable_areas` ADD CONSTRAINT `clickable_area_cluster_id_foreign` FOREIGN KEY (`cluster_id`) REFERENCES `clusters`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
