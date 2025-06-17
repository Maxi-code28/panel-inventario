import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './styles.css';

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/stock')
      .then(response => setStock(response.data))
      .catch(error => console.error('Error al obtener el stock:', error));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/stock', { product, quantity })
      .then(() => {
        setProduct('');
        setQuantity('');
        axios.get('http://localhost:5000/api/stock').then(response => setStock(response.data));
      });
  };

  const chartData = {
    labels: stock.map(item => item.product),
    datasets: [{
      label: 'Niveles de Stock (kg)',
      data: stock.map(item => item.quantity),
      backgroundColor: ['#FFCA28', '#FF5722', '#4CAF50'],
      borderColor: ['#FFB300', '#E64A19', '#388E3C'],
      borderWidth: 1
    }]
  };

  return (
    <div className="inventory">
      <h1>Gestión de Inventario</h1>
      <form onSubmit={handleAdd}>
        <label>
          Producto:
          <input type="text" value={product} onChange={e => setProduct(e.target.value)} required />
        </label>
        <label>
          Cantidad (kg):
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </label>
        <button type="submit">Agregar</button>
      </form>
      <Bar data={chartData} options={{
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Stock (kg)' } },
          x: { title: { display: true, text: 'Productos' } }
        },
        plugins: { legend: { display: true, position: 'top' } }
      }} />
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad (kg)</th>
            <th>Última Actualización</th>
          </tr>
        </thead>
        <tbody>
          {stock.map(item => (
            <tr key={item.id}>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{item.last_updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ReactDOM.render(<Inventory />, document.getElementById('root'));