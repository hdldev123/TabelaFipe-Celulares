import React from 'react';
import { Smartphone } from 'lucide-react';
import styles from './Cabecalho.module.css';

const Cabecalho: React.FC = () => {
  return (
    <header className={styles.cabecalho}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Smartphone className={styles.icone} />
          <h1 className={styles.titulo}>Tabela FIPE Celulares</h1>
        </div>
        <p className={styles.subtitulo}>
          Consulte o preço mediano de mercado para smartphones novos e usados
        </p>
      </div>
    </header>
  );
};

export default Cabecalho;