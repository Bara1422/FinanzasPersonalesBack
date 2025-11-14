/*
  Warnings:

  - You are about to drop the column `estado` on the `Notificacion` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_evento` on the `Notificacion` table. All the data in the column will be lost.
  - You are about to drop the column `id_transaccion` on the `Notificacion` table. All the data in the column will be lost.
  - You are about to drop the column `mensaje` on the `Notificacion` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Notificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_vencimiento` to the `Notificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_categoria` to the `Notificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_usuario` to the `Notificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto` to the `Notificacion` table without a default value. This is not possible if the table is not empty.
  - Made the column `descripcion` on table `Transaccion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Notificacion" DROP CONSTRAINT "Notificacion_id_transaccion_fkey";

-- AlterTable
ALTER TABLE "Notificacion" DROP COLUMN "estado",
DROP COLUMN "fecha_evento",
DROP COLUMN "id_transaccion",
DROP COLUMN "mensaje",
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_categoria" INTEGER NOT NULL,
ADD COLUMN     "id_usuario" INTEGER NOT NULL,
ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pagado" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaccion" ALTER COLUMN "descripcion" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;
