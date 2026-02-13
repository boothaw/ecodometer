-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT,
    "year" INTEGER,
    "model" TEXT,
    "make" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_clerkUserId_key" ON "Profile"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
