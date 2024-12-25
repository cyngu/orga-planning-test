/*
  Warnings:

  - You are about to drop the column `title` on the `EventCalendar` table. All the data in the column will be lost.
  - Added the required column `titleAm` to the `EventCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titlePm` to the `EventCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventCalendar" DROP COLUMN "title",
ADD COLUMN     "titleAm" TEXT NOT NULL,
ADD COLUMN     "titlePm" TEXT NOT NULL;
