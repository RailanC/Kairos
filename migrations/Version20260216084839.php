<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260216084839 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE cart_item_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE cart_item (id INT NOT NULL, cart_id INT NOT NULL, product_id INT DEFAULT NULL, quantity INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F0FE25271AD5CDBF ON cart_item (cart_id)');
        $this->addSql('CREATE INDEX IDX_F0FE25274584665A ON cart_item (product_id)');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE25271AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE25274584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE cart DROP CONSTRAINT fk_ba388b74584665a');
        $this->addSql('DROP INDEX idx_ba388b74584665a');
        $this->addSql('ALTER TABLE cart DROP product_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE cart_item_id_seq CASCADE');
        $this->addSql('ALTER TABLE cart_item DROP CONSTRAINT FK_F0FE25271AD5CDBF');
        $this->addSql('ALTER TABLE cart_item DROP CONSTRAINT FK_F0FE25274584665A');
        $this->addSql('DROP TABLE cart_item');
        $this->addSql('ALTER TABLE cart ADD product_id INT NOT NULL');
        $this->addSql('ALTER TABLE cart ADD CONSTRAINT fk_ba388b74584665a FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_ba388b74584665a ON cart (product_id)');
    }
}
