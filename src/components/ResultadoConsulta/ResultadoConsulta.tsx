import React from 'react';
import { ArrowLeft, Smartphone, Calendar, Tag } from 'lucide-react';
import { ResultadoPrecos } from '../../types/tipos';
import { formatarPreco } from '../../utils/formatadores';
import styles from './ResultadoConsulta.module.css';

interface Props {
  resultado: ResultadoPrecos;
  onVoltar: () => void;
  carregando: boolean;
}

const ResultadoConsulta: React.FC<Props> = ({ resultado, onVoltar, carregando }) => {
  if (carregando) {
    return (
      <div className={styles.carregando}>
        <div className={styles.spinner}></div>
        <p>Consultando preços...</p>
      </div>
    );
  }

  return (
    <div className={styles.containerResultado}>
      <button className={styles.botaoVoltar} onClick={onVoltar}>
        <ArrowLeft className={styles.iconeVoltar} />
        Nova Consulta
      </button>

      <div className={styles.cardResultado}>
        <div className={styles.cabecalhoModelo}>
          <div className={styles.infoModelo}>
            <h2 className={styles.nomeModelo}>{resultado.modelo.nome}</h2>
            <div className={styles.detalhesModelo}>
              <span className={styles.detalhe}>
                <Tag size={16} />
                {resultado.modelo.marca}
              </span>
              <span className={styles.detalhe}>
                <Calendar size={16} />
                {resultado.modelo.anoLancamento}
              </span>
            </div>
          </div>
          {resultado.modelo.imagem && (
            <img 
              src={resultado.modelo.imagem} 
              alt={resultado.modelo.nome}
              className={styles.imagemModelo}
            />
          )}
        </div>

        <div className={styles.especificacoes}>
          <h3 className={styles.tituloSecao}>Especificações</h3>
          <div className={styles.gridEspecificacoes}>
            {resultado.modelo.especificacoes?.tela && (
              <div className={styles.especificacao}>
                <span className={styles.labelEspec}>Tela:</span>
                <span>{resultado.modelo.especificacoes.tela}</span>
              </div>
            )}
            {resultado.modelo.especificacoes?.processador && (
              <div className={styles.especificacao}>
                <span className={styles.labelEspec}>Processador:</span>
                <span>{resultado.modelo.especificacoes.processador}</span>
              </div>
            )}
            {resultado.modelo.especificacoes?.memoria && (
              <div className={styles.especificacao}>
                <span className={styles.labelEspec}>Memória:</span>
                <span>{resultado.modelo.especificacoes.memoria}</span>
              </div>
            )}
            {resultado.modelo.especificacoes?.armazenamento && (
              <div className={styles.especificacao}>
                <span className={styles.labelEspec}>Armazenamento:</span>
                <span>{resultado.modelo.especificacoes.armazenamento}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.precos}>
          <h3 className={styles.tituloSecao}>Preços Medianos de Mercado</h3>
          
          <div className={styles.tabelaPrecos}>
            <div className={styles.linhaPreco}>
              <div className={styles.tipoPreco}>
                <Smartphone className={styles.iconePreco} />
                <span>Aparelho Novo</span>
              </div>
              <div className={`${styles.valorPreco} ${styles.precoNovo}`}>
                {resultado.precos.novo ? formatarPreco(resultado.precos.novo) : 'N/A'}
              </div>
            </div>

            <div className={styles.linhaPreco}>
              <div className={styles.tipoPreco}>
                <Smartphone className={styles.iconePreco} />
                <span>Aparelho Usado</span>
              </div>
              <div className={`${styles.valorPreco} ${styles.precoUsado}`}>
                {resultado.precos.usado ? formatarPreco(resultado.precos.usado) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rodape}>
          <p className={styles.infoAtualizacao}>
            <strong>Última atualização:</strong>{' '}
            {new Date(resultado.estatisticas.ultimaAtualizacao).toLocaleDateString('pt-BR')}
          </p>
          <p className={styles.infoFontes}>
            Baseado em {resultado.estatisticas.totalAnunciosNovos} anúncios novos e{' '}
            {resultado.estatisticas.totalAnunciosUsados} anúncios usados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultadoConsulta;