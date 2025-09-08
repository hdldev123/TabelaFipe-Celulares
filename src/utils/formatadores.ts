export const formatarPreco = (preco: number | null): string => {
  if (!preco) return 'N/A';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
};

export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatarNumeroAnuncios = (numero: number): string => {
  if (numero === 0) return 'nenhum anúncio';
  if (numero === 1) return '1 anúncio';
  return `${numero} anúncios`;
};