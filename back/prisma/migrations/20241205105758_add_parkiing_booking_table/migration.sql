-- CreateTable
CREATE TABLE "ParkingPlaceBooking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "parkingPlaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ParkingPlaceBooking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParkingPlaceBooking" ADD CONSTRAINT "ParkingPlaceBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingPlaceBooking" ADD CONSTRAINT "ParkingPlaceBooking_parkingPlaceId_fkey" FOREIGN KEY ("parkingPlaceId") REFERENCES "ParkingPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
