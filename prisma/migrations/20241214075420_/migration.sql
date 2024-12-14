/*
  Warnings:

  - Added the required column `type` to the `RecordModification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('IN_TRANSACTION', 'OUT_TRANSACTION', 'CREATE_PRODUCT', 'EDIT_PRODUCT', 'DELETE_PRODUCT', 'REGISTER', 'WRONG_PASSWORD', 'ACCEPT_ACCOUNT', 'DECLINE_ACCOUNT');

-- AlterTable
ALTER TABLE "RecordModification" ADD COLUMN     "type" "RecordType" NOT NULL;
