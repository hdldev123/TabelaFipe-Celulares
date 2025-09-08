import React from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { DadosConsulta, ModeloCelular } from '../../types/tipos';
import styles from './SeletorCascata.module.css';

interface Props {
  dadosConsulta: DadosConsulta;
  opcoes: {
    anos: number[];
    marcas: string[];
    modelos: ModeloCelular[];
  };
  carregando: {
    anos: boolean;
    marcas: boolean;
    modelos: boolean;
  };
  onSelecionarAno: (ano: number) => void;
  onSelecionarMarca: (marca: string) => void;
  onSelecionarModelo: (modelo: ModeloCelular) => void;
}

const SeletorCascata: React.FC<Props> = ({
  dadosConsulta,
  opcoes,
  carregando,
  onSelecionarAno,
  onSelecionarMarca,
  onSelecionarModelo
}) => {
  return (
    <div className={styles.seletorCascata}>
      <div className={styles.etapa}>
        <label className={styles.label}>1. Ano de Lançamento</label>
        <Dropdown
          placeholder="Selecione o ano"
          opcoes={opcoes.anos.map(ano => ({ valor: ano, texto: ano.toString() }))}
          valorSelecionado={dadosConsulta.ano}
          onSelecionar={onSelecionarAno}
          carregando={carregando.anos}
          desabilitado={false}
        />
      </div>

      <div className={styles.etapa}>
        <label className={styles.label}>2. Marca</label>
        <Dropdown
          placeholder="Selecione a marca"
          opcoes={opcoes.marcas.map(marca => ({ valor: marca, texto: marca }))}
          valorSelecionado={dadosConsulta.marca}
          onSelecionar={onSelecionarMarca}
          carregando={carregando.marcas}
          desabilitado={!dadosConsulta.ano}
        />
      </div>

      <div className={styles.etapa}>
        <label className={styles.label}>3. Modelo</label>
        <Dropdown
          placeholder="Selecione o modelo"
          opcoes={opcoes.modelos.map(modelo => ({ 
            valor: modelo, 
            texto: modelo.nome,
            extra: `${modelo.temPrecoNovo ? '✅ Novo' : ''} ${modelo.temPrecoUsado ? '✅ Usado' : ''}`.trim()
          }))}
          valorSelecionado={dadosConsulta.modelo}
          onSelecionar={onSelecionarModelo}
          carregando={carregando.modelos}
          desabilitado={!dadosConsulta.marca}
        />
      </div>
    </div>
  );
};

export default SeletorCascata;