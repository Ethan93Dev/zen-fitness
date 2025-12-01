-- CreateEnum
CREATE TYPE "USERROLE" AS ENUM ('NOTMEMBER', 'MEMBER', 'TRAINER');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'MANAGER', 'TRAINER', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "memberSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userrole" "USERROLE" NOT NULL DEFAULT 'NOTMEMBER',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visits" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "checkin" TIMESTAMP(3) NOT NULL,
    "checkout" TIMESTAMP(3),

    CONSTRAINT "Visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkout" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workout" TEXT NOT NULL,

    CONSTRAINT "UserWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritedExercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "gifUrl" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "instructions" TEXT[],
    "secondaryMuscles" TEXT[],

    CONSTRAINT "FavoritedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "RoleType" NOT NULL DEFAULT 'EMPLOYEE',
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrainer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "employeeId" INTEGER,

    CONSTRAINT "UserTrainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkoutToUserWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_WorkoutToUserWorkout_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserWorkoutFavoritedExercises" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserWorkoutFavoritedExercises_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritedExercise_name_key" ON "FavoritedExercise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_employeeId_key" ON "Trainer"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrainer_userId_trainerId_key" ON "UserTrainer"("userId", "trainerId");

-- CreateIndex
CREATE INDEX "_WorkoutToUserWorkout_B_index" ON "_WorkoutToUserWorkout"("B");

-- CreateIndex
CREATE INDEX "_UserWorkoutFavoritedExercises_B_index" ON "_UserWorkoutFavoritedExercises"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visits" ADD CONSTRAINT "Visits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkout" ADD CONSTRAINT "UserWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainer" ADD CONSTRAINT "UserTrainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainer" ADD CONSTRAINT "UserTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainer" ADD CONSTRAINT "UserTrainer_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkoutToUserWorkout" ADD CONSTRAINT "_WorkoutToUserWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "UserWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkoutToUserWorkout" ADD CONSTRAINT "_WorkoutToUserWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorkoutFavoritedExercises" ADD CONSTRAINT "_UserWorkoutFavoritedExercises_A_fkey" FOREIGN KEY ("A") REFERENCES "FavoritedExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorkoutFavoritedExercises" ADD CONSTRAINT "_UserWorkoutFavoritedExercises_B_fkey" FOREIGN KEY ("B") REFERENCES "UserWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
