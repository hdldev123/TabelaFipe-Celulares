import React, { useState, useEffect } from 'react';
import SeletorCascata from '../SeletorCascata/SeletorCascata';
import ResultadoConsulta from '../ResultadoConsulta/ResultadoConsulta';
import { buscarAnos, buscarMarcas, buscarModelos, buscarPrecos } from '../../services/apiService';
import { DadosConsulta, ModeloCelular, ResultadoPrecos } from '../../types/tipos';
import styles from './TabelaFipe.module.css';

interface Props {
  etapaAtual: number;
  onMudarEtapa: (etapa: number) => void;
}

const TabelaFipe: React.FC<Props> = ({ etapaAtual, onMudarEtapa }) => {
  const [dadosConsulta, setDadosConsulta] = useState<DadosConsulta>({
    ano: null,
    marca: null,
    modelo: null
  });
  
  const [opcoes, setOpcoes] = useState({
    anos: [] as number[],
    marcas: [] as string[],
    modelos: [] as ModeloCelular[]
  });
  
  const [carregando, setCarregando] = useState({
    anos: false,
    marcas: false,
    modelos: false,
    resultado: false
  });
  
  const [resultado, setResultado] = useState<ResultadoPrecos | null>(null);

  // Carregar anos na inicialização
  useEffect(() => {
    carregarAnos();
  }, []);

  const carregarAnos = async () => {
    setCarregando(prev => ({ ...prev, anos: true }));
    try {
      const anos = await buscarAnos();
      setOpcoes(prev => ({ ...prev, anos }));
    } catch (error) {
      console.error('Erro ao carregar anos:', error);
    } finally {
      setCarregando(prev => ({ ...prev, anos: false }));
    }
  };

  const carregarMarcas = async (ano: number) => {
    setCarregando(prev => ({ ...prev, marcas: true }));
    try {
      const marcas = await buscarMarcas(ano);
      setOpcoes(prev => ({ ...prev, marcas, modelos: [] }));
      setDadosConsulta(prev => ({ ...prev, marca: null, modelo: null }));
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setCarregando(prev => ({ ...prev, marcas: false }));
    }
  };

  const carregarModelos = async (marca: string, ano: number) => {
    setCarregando(prev => ({ ...prev, modelos: true }));
    try {
      const modelos = await buscarModelos(marca, ano);
      setOpcoes(prev => ({ ...prev, modelos }));
      setDadosConsulta(prev => ({ ...prev, modelo: null }));
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setCarregando(prev => ({ ...prev, modelos: false }));
    }
  };

  const consultarPrecos = async (idModelo: string) => {
    setCarregando(prev => ({ ...prev, resultado: true }));
    try {
      const dados = await buscarPrecos(idModelo);
      setResultado(dados);
      onMudarEtapa(1); // Vai para a tela de resultado
    } catch (error) {
      console.error('Erro ao consultar preços:', error);
    } finally {
      setCarregando(prev => ({ ...prev, resultado: false }));
    }
  };

  const voltarParaConsulta = () => {
    setResultado(null);
    onMudarEtapa(0);
  };

  const handleSelecionarAno = (ano: number) => {
    setDadosConsulta(prev => ({ ...prev, ano, marca: null, modelo: null }));
    carregarMarcas(ano);
  };

  const handleSelecionarMarca = (marca: string) => {
    setDadosConsulta(prev => ({ ...prev, marca, modelo: null }));
    if (dadosConsulta.ano) {
      carregarModelos(marca, dadosConsulta.ano);
    }
  };

  const handleSelecionarModelo = (modelo: ModeloCelular) => {
    setDadosConsulta(prev => ({ ...prev, modelo }));
    consultarPrecos(modelo.id);
  };

  if (etapaAtual === 1 && resultado) {
    return (
      <ResultadoConsulta
        resultado={resultado}
        onVoltar={voltarParaConsulta}
        carregando={carregando.resultado}
      />
    );
  }

  return (
    <div className={styles.containerTabela}>
      <div className={styles.card}>
        <h2 className={styles.titulo}>Consultar Preço de Celular</h2>
        <p className={styles.descricao}>
          Selecione o ano, marca e modelo para consultar o preço mediano de mercado
        </p>
        
        <SeletorCascata
          dadosConsulta={dadosConsulta}
          opcoes={opcoes}
          carregando={carregando}
          onSelecionarAno={handleSelecionarAno}
          onSelecionarMarca={handleSelecionarMarca}
          onSelecionarModelo={handleSelecionarModelo}
        />
      </div>
    </div>
  );
};

export default TabelaFipe;