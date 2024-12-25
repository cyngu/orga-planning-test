-- CreateTable
CREATE TABLE "AdminConfiguration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AdminConfiguration_pkey" PRIMARY KEY ("id")
);
