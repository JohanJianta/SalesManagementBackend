-- CreateTable
CREATE TABLE `promotions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `cluster_id` INTEGER UNSIGNED NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `thumbnail_url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expired_at` DATETIME(0) NULL,

    INDEX `promotions_cluster_id_foreign`(`cluster_id`),
    INDEX `promotions_user_id_foreign`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_cluster_id_foreign` FOREIGN KEY (`cluster_id`) REFERENCES `clusters`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;
