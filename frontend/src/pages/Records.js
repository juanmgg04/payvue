import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Records() {
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const incomeData = await axios.get('http://localhost:5000/finances/income');
      const expenseData = await axios.get('http://localhost:5000/finances/debt'); // Updated endpoint to 'debt'
      const allRecords = [
        ...incomeData.data.map((i) => ({ ...i, type: 'income' })),
        ...expenseData.data.map((e) => ({ ...e, type: 'debt' })),
      ];
      setRecords(allRecords);
    } catch (error) {
      console.error('Error al obtener registros:', error);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:5000/finances/${type}/${id}`);
      alert('Registro eliminado exitosamente');
      fetchRecords();
    } catch (error) {
      alert('Error al eliminar el registro');
    }
  };

  const filteredRecords = records.filter(
    (record) => filterType === 'all' || record.type === filterType
  );

  return (
    <div className="container mt-4">
      <h1>Registros de Ingresos y Gastos</h1>
      
      <Sidebar /> {/* Added Sidebar component */}
      <div className="mb-3">
        <select
          className="form-control"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="income">Ingresos</option>
          <option value="debt">Gastos</option>
        </select>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.type === 'income' ? 'Ingreso' : 'Gasto'}</td>
              <td>{record.source || record.name}</td>
              <td>${record.amount || record.total_amount}</td>
              <td>{record.date || record.due_date}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDelete(record.type, record.id)}
                >
                  Eliminar
                </button>
           
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Records;