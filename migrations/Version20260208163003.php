<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260208163003 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "order" ALTER status TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE "order" ALTER payment_status TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE "order" ALTER delivery_type DROP NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER delivery_type TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE "order" ALTER delivery_address TYPE TEXT');
        $this->addSql('ALTER TABLE "order" ALTER delivery_address DROP NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER requested_date TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE "order" ALTER requested_date DROP NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER notes TYPE TEXT');
        $this->addSql('ALTER TABLE "order" ALTER notes DROP NOT NULL');
        $this->addSql('COMMENT ON COLUMN "order".requested_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE order_item ALTER unit_price TYPE NUMERIC(10, 2)');
        $this->addSql('ALTER TABLE product ALTER price TYPE NUMERIC(10, 2)');
        $this->addSql('ALTER TABLE product ALTER image DROP NOT NULL');
        $this->addSql('ALTER TABLE review ALTER product_id SET NOT NULL');
        $this->addSql('ALTER TABLE review ALTER comment DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE review ALTER product_id DROP NOT NULL');
        $this->addSql('ALTER TABLE review ALTER comment SET NOT NULL');
        $this->addSql('ALTER TABLE order_item ALTER unit_price TYPE NUMERIC(5, 2)');
        $this->addSql('ALTER TABLE product ALTER price TYPE NUMERIC(5, 2)');
        $this->addSql('ALTER TABLE product ALTER image SET NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER status TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "order" ALTER payment_status TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "order" ALTER delivery_type SET NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER delivery_type TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "order" ALTER delivery_address TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "order" ALTER delivery_address SET NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER requested_date TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE "order" ALTER requested_date SET NOT NULL');
        $this->addSql('ALTER TABLE "order" ALTER notes TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "order" ALTER notes SET NOT NULL');
        $this->addSql('COMMENT ON COLUMN "order".requested_date IS NULL');
    }
}
