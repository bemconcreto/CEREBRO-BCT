/**
 * Normaliza um registro `Imovel` do Prisma para o formato consumido
 * pelas APIs (admin e públicas): converte Decimal/Float para Number
 * e calcula a valorização acumulada a partir de valorCompra/valorMercado.
 */
export function normalizeImovel(imovel: any) {
  const valorCompra = Number(imovel.valorCompra ?? 0);
  const valorMercado = Number(imovel.valorMercado ?? 0);

  return {
    id: imovel.id,
    nome: imovel.nome,
    slug: imovel.slug,
    localizacao: imovel.localizacao,
    descricao: imovel.descricao,
    valorCompra,
    valorMercado,
    valorizacaoAcumulada:
      valorCompra > 0 ? (valorMercado - valorCompra) / valorCompra : 0,
    percentualPool: Number(imovel.percentualPool ?? 0),
    status: imovel.status,
    imagemUrl: imovel.imagemUrl ?? null,
    roiProjetado: imovel.roiProjetado ?? null,
    roiRealizado: imovel.roiRealizado ?? null,
    dataAquisicao: imovel.dataAquisicao ?? null,
    statusDocumental: imovel.statusDocumental ?? null,
    documentos: imovel.documentos ?? null,
    createdAt: imovel.createdAt,
  };
}
