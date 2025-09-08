import React, { useState } from 'react';
import TabelaFipe from './components/TabelaFipe/TabelaFipe';
import Cabecalho from './components/Cabecalho/Cabecalho';
import styles from './App.module.css';

function App() {
  const [etapaAtual, setEtapaAtual] = useState(0);

  return (
    <div className={styles.app}>
      <Cabecalho />
      <main className={styles.mainContent}>
        <TabelaFipe etapaAtual={etapaAtual} onMudarEtapa={setEtapaAtual} />
      </main>
    </div>
  );
}

export default App;