import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './App.css';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [output, setOutput] = useState('');
  const [chartData, setChartData] = useState(null);

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
        setOutput(JSON.stringify(data.data, null, 2));
      } else {
        setOutput('❌ No se pudo traer los análisis');
      }
    } catch (error) {
      setOutput('❌ No se pudo traer los análisis');
    }
  };

  const traerPorcentajesClientes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/analisis/clientes/porcentaje');
      if (res.ok) {
        const data = await res.json();
        setOutput(JSON.stringify(data, null, 2));
      } else {
        setOutput('❌ No se pudo traer los porcentajes');
      }
    } catch (error) {
      setOutput('❌ No se pudo traer los porcentajes');
    }
  };

  const mostrarTotalAnalisis = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/analisis');
      if (res.ok) {
        const data = await res.json();
        setOutput(`Total de análisis: ${data.count}`);
      } else {
        setOutput('❌ No se pudo obtener el total de análisis');
      }
    } catch (error) {
      setOutput('❌ No se pudo obtener el total de análisis');
    }
  };

  // Opción 5: Mostrar gráfico estadístico
  const mostrarGraficoEstadistico = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/analisis/clientes/porcentaje');
      if (res.ok) {
        const data = await res.json();
        // data es un array de objetos: [{ cliente, total, porcentaje }, ...]
        const labels = data.map(item => item.cliente);
        const valores = data.map(item => item.porcentaje);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Porcentaje de análisis por cliente',
              data: valores,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        });
        setOutput('');
      } else {
        setOutput('❌ No se pudo obtener los datos para el gráfico');
        setChartData(null);
      }
    } catch (error) {
      setOutput('❌ No se pudo obtener los datos para el gráfico');
      setChartData(null);
    }
  };

  return (
    <div className="App">
      <h2>***************** MENÚ *****************</h2>
      <div>
        <button onClick={probarConexion}>
          1) Probar conexión con Base de datos
        </button>
        <br /><br />
        <button onClick={traerAnalisis}>
          2) Traer análisis de la base de datos
        </button>
        <br /><br />
        <button onClick={traerPorcentajesClientes}>
          3) Traer porcentajes de clientes
        </button>
        <br /><br />
        <button onClick={mostrarTotalAnalisis}>
          4) Mostrar Total de análisis
        </button>
        <br /><br />
        <button onClick={mostrarGraficoEstadistico}>
          5) Mostrar gráfico estadístico
        </button>
      </div>
      {output && (
        <pre>{output}</pre>
      )}
      {chartData && (
        <div>
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
