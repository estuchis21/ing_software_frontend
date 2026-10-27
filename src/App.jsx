import React, { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function App() {
  const [formData, setFormData] = useState({
    profundidad: 2500,
    presion_inicial: 300,
    temperatura: 85,
    etapa_fractura: 12
  });

  const [resultado, setResultado] = useState(null);
  const [chartDataLine, setChartDataLine] = useState(null);
  const [chartDataBar, setChartDataBar] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Conexión con el backend de FastAPI en el puerto 8000
      const response = await axios.post('http://127.0.0.1:8000/predict-dynamic', formData);
      const data = response.data;

      setResultado(data.prediccion_produccion);

      setChartDataLine({
        labels: data.charts.line_chart.labels,
        datasets: [{
          label: 'Tendencia de Producción (bep)',
          data: data.charts.line_chart.values,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
        }]
      });

      setChartDataBar({
        labels: data.charts.bar_chart.labels,
        datasets: [{
          label: 'Importancia de Variables',
          data: data.charts.bar_chart.values,
          backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
        }]
      });

    } catch (error) {
      console.error("Error al conectar con FastAPI", error);
      alert("No se pudo conectar con el servidor de FastAPI. Verificá que esté encendido.");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Dashboard de Predicción - Pozos de Petróleo</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <div>
          <label>Profundidad (m):</label>
          <input type="number" name="profundidad" value={formData.profundidad} onChange={handleChange} style={{width: '100%', padding: '8px'}} />
        </div>
        <div>
          <label>Presión Inicial (PSI):</label>
          <input type="number" name="presion_inicial" value={formData.presion_inicial} onChange={handleChange} style={{width: '100%', padding: '8px'}} />
        </div>
        <div>
          <label>Temperatura (°C):</label>
          <input type="number" name="temperatura" value={formData.temperatura} onChange={handleChange} style={{width: '100%', padding: '8px'}} />
        </div>
        <div>
          <label>Etapas de Fractura:</label>
          <input type="number" name="etapa_fractura" value={formData.etapa_fractura} onChange={handleChange} style={{width: '100%', padding: '8px'}} />
        </div>
        <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Calcular Predicción y Generar Gráficos
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4fd', borderLeft: '5px solid #007bff', fontSize: '18px' }}>
          <strong>Resultado de la Predicción:</strong> {resultado} barriles equivalentes / día
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        {chartDataLine && (
          <div style={{ background: 'white', padding: '15px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <Line data={chartDataLine} />
          </div>
        )}
        {chartDataBar && (
          <div style={{ background: 'white', padding: '15px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <Bar data={chartDataBar} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;