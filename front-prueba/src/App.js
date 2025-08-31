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

  

  // Opción 6: Obtener muestra por nro_informe
  const obtenerMuestraPorNroInforme = async () => {
    const nro_informe = prompt('Ingrese el número de informe:');
    if (!nro_informe) {
      setOutput('❌ Debe ingresar un número de informe');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/muestras?nro_informe=${nro_informe}`);
      if (res.ok) {
        const data = await res.json();
        if (data.count === 0) {
          setOutput('No se encontró ninguna muestra con ese número de informe.');
        } else {
          setOutput(JSON.stringify(data.data, null, 2));
        }
      } else {
        setOutput('❌ Error al obtener la muestra');
      }
    } catch (error) {
      setOutput('❌ Error al obtener la muestra');
    }
  };

  // Opción 7: Registrar Muestra
  const registrarMuestra = async () => {
    // Ejemplo de datos, puedes usar un formulario para obtenerlos
    const muestra = {
      nro_informe: 6178,
      muestra_nombre: "pozo",
      parametros: {
        pH: { valor: 7.6, unidad: null },
        hierro_total: { valor: 0.4, unidad: "mg/l" },
        calcio: { valor: 144, unidad: "mg/l" },
        magnesio: { valor: 7.2, unidad: "mg/l" },
        arsenico: { valor: 0.05, unidad: "mg/l" }
      }
    };
    try {
      const res = await fetch('http://localhost:3000/api/muestra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(muestra)
      });
      if (res.ok) {
        const data = await res.json();
        setOutput('✅ Muestra registrada:\n' + JSON.stringify(data.data, null, 2));
      } else {
        setOutput('❌ Error al registrar la muestra');
      }
    } catch (error) {
      setOutput('❌ Error al registrar la muestra');
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
        <br /><br />
        <button onClick={obtenerMuestraPorNroInforme}>
          6) Obtener muestra por nro_informe
        </button>
        <br /><br />
        <button onClick={registrarMuestra}>
          7) Registrar Muestra
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
