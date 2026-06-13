-- AlterTable
ALTER TABLE "Imovel" ADD COLUMN     "imagemUrl" TEXT,
ADD COLUMN     "roiProjetado" DOUBLE PRECISION,
ADD COLUMN     "roiRealizado" DOUBLE PRECISION,
ADD COLUMN     "dataAquisicao" TIMESTAMP(3),
ADD COLUMN     "statusDocumental" TEXT;

-- CreateTable
CREATE TABLE "TokenPrice" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "precoUsd" DOUBLE PRECISION NOT NULL,
    "cotacaoUsdBrl" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id")
);

-- Seed initial price: US$0,60 x R$5,00 = R$3,00 (Memorando de Captacao)
INSERT INTO "TokenPrice" ("id", "precoUsd", "cotacaoUsdBrl", "updatedAt")
VALUES (1, 0.60, 5.00, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
