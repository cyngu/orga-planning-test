-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingPlace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chargingStation" BOOLEAN NOT NULL DEFAULT false,
    "underground" BOOLEAN NOT NULL DEFAULT false,
    "entrepriseId" TEXT NOT NULL,

    CONSTRAINT "ParkingPlace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParkingPlace" ADD CONSTRAINT "ParkingPlace_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
