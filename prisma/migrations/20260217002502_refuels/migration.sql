-- CreateTable
CREATE TABLE "Refuel" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "miles" INTEGER NOT NULL,
    "gallons" DECIMAL(10,3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refuel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Refuel_vehicleId_date_idx" ON "Refuel"("vehicleId", "date");

-- AddForeignKey
ALTER TABLE "Refuel" ADD CONSTRAINT "Refuel_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
