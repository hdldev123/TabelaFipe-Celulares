import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import styles from './Dropdown.module.css';

interface OpcaoDropdown {
  valor: any;
  texto: string;
  extra?: string;
}

interface Props {
  placeholder: string;
  opcoes: OpcaoDropdown[];
  valorSelecionado: any;
  onSelecionar: (valor: any) => void;
  carregando: boolean;
  desabilitado: boolean;
}

const Dropdown: React.FC<Props> = ({
  placeholder,
  opcoes,
  valorSelecionado,
  onSelecionar,
  carregando,
  desabilitado
}) => {
  const [aberto, setAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  const handleSelecionar = (opcao: OpcaoDropdown) => {
    onSelecionar(opcao.valor);
    setAberto(false);
  };

  const obterTextoSelecionado = () => {
    if (!valorSelecionado) return placeholder;
    
    const opcaoSelecionada = opcoes.find(o => o.valor === valorSelecionado || o.valor?.id === valorSelecionado?.id);
    return opcaoSelecionada ? opcaoSelecionada.texto : placeholder;
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.botao} ${desabilitado ? styles.desabilitado : ''} ${aberto ? styles.ativo : ''}`}
        onClick={() => !desabilitado && !carregando && setAberto(!aberto)}
        disabled={desabilitado || carregando}
      >
        <span className={styles.texto}>{obterTextoSelecionado()}</span>
        <div className={styles.icone}>
          {carregando ? (
            <Loader2 className={styles.spinner} />
          ) : (
            <ChevronDown className={`${styles.chevron} ${aberto ? styles.rotacionado : ''}`} />
          )}
        </div>
      </button>

      {aberto && opcoes.length > 0 && (
        <div className={styles.menu}>
          {opcoes.map((opcao, index) => (
            <button
              key={index}
              type="button"
              className={styles.opcao}
              onClick={() => handleSelecionar(opcao)}
            >
              <span className={styles.textoOpcao}>{opcao.texto}</span>
              {opcao.extra && <span className={styles.extra}>{opcao.extra}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;