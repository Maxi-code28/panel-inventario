// Accede a React, ReactDOM, Axios desde las variables globales
const { useState, useEffect } = React;
const ReactDOM = window.ReactDOM;
const axios = window.axios;

const Bar = (props) => {
  const chartRef = React.useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  React.useEffect(() => {
    if (chartRef.current) {
      // Destruye el gráfico anterior si existe
      if (chartInstance) {
        chartInstance.destroy();
      }
      const newChart = new Chart(chartRef.current.getContext('2d'), {
        type: 'bar',
        data: props.data,
        options: props.options
      });
      setChartInstance(newChart);
    }
  }, [props.data, props.options]); // Dependencias para evitar re-renderizados innecesarios

  return React.createElement('canvas', { ref: chartRef });
};

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    console.log('Fetching stock...');
    axios.get('http://localhost:5000/api/stock')
      .then(response => {
        console.log('Stock fetched:', response.data);
        setStock(response.data);
      })
      .catch(error => console.error('Error fetching stock:', error));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product || !quantity) {
      console.error('Producto o cantidad no pueden estar vacíos');
      return;
    }
    console.log('Adding product:', { product, quantity });
    axios.post('http://localhost:5000/api/stock', { product, quantity })
      .then(() => {
        console.log('Product added, refreshing stock...');
        setProduct('');
        setQuantity('');
        axios.get('http://localhost:5000/api/stock').then(response => setStock(response.data));
      })
      .catch(error => console.error('Error adding product:', error));
  };

  const handleInputChange = (e, setter) => {
    console.log('Input changed:', e.target.value);
    setter(e.target.value);
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
    React.createElement('div', { className: 'inventory' },
      React.createElement('h1', null, 'Gestión de Inventario'),
      React.createElement('form', { onSubmit: handleAdd },
        React.createElement('label', null,
          'Producto:',
          React.createElement('input', { type: 'text', value: product, onChange: e => handleInputChange(e, setProduct), required: true })
        ),
        React.createElement('label', null,
          'Cantidad (kg):',
          React.createElement('input', { type: 'number', value: quantity, onChange: e => handleInputChange(e, setQuantity), required: true })
        ),
        React.createElement('button', { type: 'submit' }, 'Agregar')
      ),
      React.createElement(Bar, { data: chartData, options: {
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Stock (kg)' } },
                  x: { title: { display: true, text: 'Productos' } } },
        plugins: { legend: { display: true, position: 'top' } },
        animation: { duration: 0 } // Desactiva animaciones para evitar parpadeo
      }}),
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Producto'),
            React.createElement('th', null, 'Cantidad (kg)'),
            React.createElement('th', null, 'Última Actualización')
          )
        ),
        React.createElement('tbody', null,
          stock.map(item =>
            React.createElement('tr', { key: item.id },
              React.createElement('td', null, item.product),
              React.createElement('td', null, item.quantity),
              React.createElement('td', null, item.last_updated)
            )
          )
        )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Inventory));