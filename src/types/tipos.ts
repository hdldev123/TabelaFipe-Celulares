export interface DadosConsulta {
  ano: number | null;
  marca: string | null;
  modelo: ModeloCelular | null;
}

export interface ModeloCelular {
  id: string;
  nome: string;
  temPrecoNovo: boolean;
  temPrecoUsado: boolean;
}

export interface EspecificacoesCelular {
  tela?: string;
  processador?: string;
  memoria?: string;
  armazenamento?: string;
  camera?: string;
  bateria?: string;
  sistemaOperacional?: string;
}

export interface ResultadoPrecos {
  modelo: {
    nome: string;
    marca: string;
    anoLancamento: number;
    imagem?: string;
    especificacoes?: EspecificacoesCelular;
  };
  precos: {
    novo: number | null;
    usado: number | null;
  };
  estatisticas: {
    totalAnunciosNovos: number;
    totalAnunciosUsados: number;
    ultimaAtualizacao: string;
  };
}