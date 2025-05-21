import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await axios.get('http://localhost:5000/finances/payment');
    setPayments(res.data);
  };

  const filteredPayments = payments.filter(p =>
    (p.debt_name?.toLowerCase().includes(search.toLowerCase()) || p.amount.toString().includes(search)) &&
    (!dateFilter || p.date === dateFilter)
  );

  return (
    <div className="container mt-4">
      <h2>Historial de Pagos</h2>
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por deuda o monto"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Deuda</th>
            <th>Monto Pagado</th>
            <th>Fecha</th>
            <th>Cuotas Restantes</th>
            <th>Restante</th>
            <th>Recibo</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(p => (
            <tr key={p.id}>
              <td>{p.debt_name}</td>
              <td>${p.amount}</td>
              <td>{p.date}</td>
              <td>{p.remaining_installments}</td>
              <td>${p.remaining_amount}</td>
              <td>
                {p.receipt_url && (
                  <a href={`http://localhost:5000${p.receipt_url}`} target="_blank" rel="noopener noreferrer">Ver Recibo</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;