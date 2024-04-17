import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDefaultValueForUser1713349152949
  implements MigrationInterface
{
  name = 'UpdateDefaultValueForUser1713349152949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "bio" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "image" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "image" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "bio" DROP DEFAULT`,
    );
  }
}
