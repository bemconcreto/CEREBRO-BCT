-- CreateTable
CREATE TABLE "Holding" (
    "id" SERIAL NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "descricao" TEXT,
    "patrimonioTotal" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" SERIAL NOT NULL,
    "holdingId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "descricao" TEXT,
    "valorCompra" DOUBLE PRECISION NOT NULL,
    "valorMercado" DOUBLE PRECISION NOT NULL,
    "percentualPool" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "documentos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emissao" (
    "id" SERIAL NOT NULL,
    "holdingId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "totalTokens" BIGINT NOT NULL,
    "valorToken" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultor" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "codigoIndicacao" TEXT NOT NULL,
    "statusCertificacao" TEXT NOT NULL,
    "totalVendas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "emissaoId" INTEGER NOT NULL,
    "investidorId" INTEGER NOT NULL,
    "consultorId" INTEGER,
    "quantidade" BIGINT NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Holding_cnpj_key" ON "Holding"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_slug_key" ON "Imovel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Consultor_usuarioId_key" ON "Consultor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Consultor_codigoIndicacao_key" ON "Consultor"("codigoIndicacao");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emissao" ADD CONSTRAINT "Emissao_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultor" ADD CONSTRAINT "Consultor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_emissaoId_fkey" FOREIGN KEY ("emissaoId") REFERENCES "Emissao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_investidorId_fkey" FOREIGN KEY ("investidorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "Consultor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
