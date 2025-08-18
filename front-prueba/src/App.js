
import React, { useState } from 'react';
import './App.css';

function App() {
  const [output, setOutput] = useState('');

  const probarConexion = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/analisis');
      if (res.ok) {
        setOutput('✅ Conexión exitosa con la base de datos');
      } else {
        setOutput('❌ Error de conexión con la base de datos');
      }
    } catch (error) {
      setOutput('❌ Error de conexión con la base de datos');
    }
  };

  const traerAnalisis = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/analisis');
      if (res.ok) {
        const data = await res.json();
        setOutput(JSON.stringify(data, null, 2));
      } else {
        setOutput('❌ No se pudo traer los análisis');
      }
    } catch (error) {
      setOutput('❌ No se pudo traer los análisis');
    }
  };

  return (
    <div className="App">
      <h2>***************** MENÚ *****************</h2>
      <button onClick={probarConexion}>1) Probar conexión con Base de datos</button>
      <br /><br />
      <button onClick={traerAnalisis}>2) Traer análisis de la base de datos</button>
      <br /><br />
      <pre style={{textAlign: 'left', background: '#f4f4f4', padding: '1em'}}>{output}</pre>
    </div>
  );
}

export default App;
