/*
  Warnings:

  - You are about to drop the `Entreprise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingPlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingPlaceBooking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParkingPlace" DROP CONSTRAINT "ParkingPlace_entrepriseId_fkey";

-- DropForeignKey
ALTER TABLE "ParkingPlaceBooking" DROP CONSTRAINT "ParkingPlaceBooking_parkingPlaceId_fkey";

-- DropForeignKey
ALTER TABLE "ParkingPlaceBooking" DROP CONSTRAINT "ParkingPlaceBooking_userId_fkey";

-- DropTable
DROP TABLE "Entreprise";

-- DropTable
DROP TABLE "ParkingPlace";

-- DropTable
DROP TABLE "ParkingPlaceBooking";
