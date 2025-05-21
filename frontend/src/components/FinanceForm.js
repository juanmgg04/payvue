import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FinanceForm({ type, onSuccess }) {
  const [totalIncome, setTotalIncome] = useState('');
  const [periodicity, setPeriodicity] = useState('');
  const [debtOptions, setDebtOptions] = useState([]);
  const [selectedDebt, setSelectedDebt] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (type === 'expense') {
      fetchDebts();
    }
  }, [type]);

  const fetchDebts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/finances/debt');
      setDebtOptions(response.data);
    } catch (error) {
      console.error('Error al obtener las deudas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data =
      type === 'income'
        ? {
            amount: parseFloat(totalIncome), // Cambia 'total_income' a 'amount'
            source: 'Ingreso Total', // Agrega un valor para 'source'
            date: new Date().toISOString().split('T')[0], // Usa la fecha actual
          }
        : {
            amount: parseFloat(amount),
            debt_id: selectedDebt,
            description,
            date,
          };

    try {
      const url = `http://localhost:5000/finances/${type}`;
      await axios.post(url, data);
      alert(`${type === 'income' ? 'Ingreso' : 'Gasto'} registrado exitosamente`);
      onSuccess();
    } catch (error) {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === 'income' ? (
        <>
          <div className="mb-3">
            <label className="form-label">Ingresos Totales</label>
            <input
              type="number"
              className="form-control"
              value={totalIncome}
              onChange={(e) => setTotalIncome(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Periodicidad</label>
            <select
              className="form-control"
              value={periodicity}
              onChange={(e) => setPeriodicity(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccione...
              </option>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label">Deuda Asociada</label>
            <select
              className="form-control"
              value={selectedDebt}
              onChange={(e) => setSelectedDebt(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccione una deuda...
              </option>
              {debtOptions.map((debt) => (
                <option key={debt.id} value={debt.id}>
                  {debt.name} - ${debt.remaining_amount}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Monto</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </>
      )}
      <button type="submit" className="btn btn-primary">
        Registrar {type === 'income' ? 'Ingreso' : 'Gasto'}
      </button>
    </form>
  );
}

export default FinanceForm;