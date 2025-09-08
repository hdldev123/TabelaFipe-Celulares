export function calcularMediana(valores) {
  if (!valores || valores.length === 0) return null;
  
  const valoresOrdenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(valoresOrdenados.length / 2);
  
  if (valoresOrdenados.length % 2 === 0) {
    return (valoresOrdenados[meio - 1] + valoresOrdenados[meio]) / 2;
  } else {
    return valoresOrdenados[meio];
  }
}

export function calcularDesvioPadrao(valores) {
  if (!valores || valores.length === 0) return 0;
  
  const media = valores.reduce((sum, val) => sum + val, 0) / valores.length;
  const variancia = valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / valores.length;
  
  return Math.sqrt(variancia);
}

export function filtrarPrecosValidos(precos, fatorDesvioPadrao = 2) {
  if (!precos || precos.length === 0) return [];
  
  const valores = precos.map(p => p.valor);
  const media = valores.reduce((sum, val) => sum + val, 0) / valores.length;
  const desvioPadrao = calcularDesvioPadrao(valores);
  
  const limiteInferior = media - (desvioPadrao * fatorDesvioPadrao);
  const limiteSuperior = media + (desvioPadrao * fatorDesvioPadrao);
  
  return precos.filter(preco => {
    const valor = preco.valor;
    return valor >= limiteInferior && valor <= limiteSuperior && valor >= 100 && valor <= 15000;
  });
}

export function formatarPreco(preco) {
  if (!preco) return 'N/A';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
}