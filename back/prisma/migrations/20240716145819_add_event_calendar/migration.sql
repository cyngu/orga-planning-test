-- CreateTable
CREATE TABLE "EventCalendar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hourlyAm" TEXT NOT NULL,
    "hourlyPm" TEXT NOT NULL,
    "workTime" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EventCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventCalendar_userId_idx" ON "EventCalendar"("userId");

-- AddForeignKey
ALTER TABLE "EventCalendar" ADD CONSTRAINT "EventCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
