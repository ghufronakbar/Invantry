/*
  Warnings:

  - The values [WRONG_PASSWORD,ACCEPT_ACCOUNT,DECLINE_ACCOUNT] on the enum `RecordType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecordType_new" AS ENUM ('IN_TRANSACTION', 'OUT_TRANSACTION', 'CREATE_PRODUCT', 'EDIT_PRODUCT', 'DELETE_PRODUCT', 'REGISTER', 'ACCOUNT_CONFIRMED');
ALTER TABLE "RecordModification" ALTER COLUMN "type" TYPE "RecordType_new" USING ("type"::text::"RecordType_new");
ALTER TYPE "RecordType" RENAME TO "RecordType_old";
ALTER TYPE "RecordType_new" RENAME TO "RecordType";
DROP TYPE "RecordType_old";
COMMIT;
