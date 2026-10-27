/*
  Warnings:

  - The primary key for the `projects_employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[project_id,employee_id]` on the table `projects_employees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "projects_employees" DROP CONSTRAINT "projects_employees_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "projects_employees_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_employees_project_id_employee_id_key" ON "projects_employees"("project_id", "employee_id");
