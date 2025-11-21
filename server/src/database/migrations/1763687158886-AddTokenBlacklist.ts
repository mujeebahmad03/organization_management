import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenBlacklist1763687158886 implements MigrationInterface {
  name = 'AddTokenBlacklist1763687158886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token_blacklist" ("token" character varying(500) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_8c2ca80e62a4a178870aa9e7a0e" PRIMARY KEY ("token"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cebed586d3a7c46f3f9b76cf1" ON "token_blacklist" ("expiresAt") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8c2ca80e62a4a178870aa9e7a0" ON "token_blacklist" ("token") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8c2ca80e62a4a178870aa9e7a0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1cebed586d3a7c46f3f9b76cf1"`,
    );
    await queryRunner.query(`DROP TABLE "token_blacklist"`);
  }
}
