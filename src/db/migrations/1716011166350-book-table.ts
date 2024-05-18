import { MigrationInterface, QueryRunner } from "typeorm";

export class BookTable1716011166350 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(`
            CREATE TABLE book(
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                title varchar(256) NOT NULL,
                description varchar(512) NOT NULL,
                CONSTRAINT task_pk PRIMARY KEY (id)

            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS book;`)
    }

}
