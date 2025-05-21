import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FinanceForm from './FinanceForm'; // Importa el formulario
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Sidebar.css';
import { showSuccess, showError, showConfirm } from '../utils/alert';

function Sidebar( { onExpenseAdded }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [formType, setFormType] = useState('income'); // Controla el tipo de formulario
  const [paymentName, setPaymentName] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [numInstallments, setNumInstallments] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
const [incomes, setIncomes] = useState([]);
const [expenses, setExpenses] = useState([]);

// Estado para el modal de pagos
const [paymentAmount, setPaymentAmount] = useState('');
const [paymentFile, setPaymentFile] = useState(null);
const [selectedDebt, setSelectedDebt] = useState('');
const [debts, setDebts] = useState([]);

const fetchDebts = async () => {
  const res = await axios.get('http://localhost:5000/finances/debt');
  setDebts(res.data);
};

  const fetchData = async () => {
    try {
      const incomeData = await axios.get('http://localhost:5000/finances/income');
      const expenseData = await axios.get('http://localhost:5000/finances/expense');
      setIncomes(incomeData.data);
      setExpenses(expenseData.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const calculateInstallment = () => {
    if (totalDebt && numInstallments && interestRate) {
      const totalWithInterest = parseFloat(totalDebt) * (1 + parseFloat(interestRate) / 100);
      const installment = totalWithInterest / parseInt(numInstallments, 10);
      setInstallmentAmount(installment.toFixed(2));
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalWithInterest = parseFloat(totalDebt) * (1 + parseFloat(interestRate) / 100);
      const installment = totalWithInterest / parseInt(numInstallments, 10);

      const data = {
        name: paymentName,
        total_amount: parseFloat(totalDebt),
        remaining_amount: parseFloat(totalDebt),
        due_date: new Date().toISOString().split('T')[0], // Fecha actual
        interest_rate: parseFloat(interestRate),
        num_installments: parseInt(numInstallments, 10),
        installment_amount: installment.toFixed(2),
        payment_day: parseInt(paymentDay), // Nuevo campo
      };

      await axios.post('http://localhost:5000/finances/debt', data);
      alert('Gasto registrado exitosamente');
      onExpenseAdded(); // Notifica al Dashboard para actualizar los datos
    } catch (error) {
      alert('Error al registrar el gasto');
    }
  };

  // Cargar deudas al abrir el modal
useEffect(() => {
  if (isSidebarVisible) {
    axios.get('http://localhost:5000/finances/debt').then(res => setDebts(res.data));
  }
}, [isSidebarVisible]);

const handlePaymentFileChange = (e) => {
  setPaymentFile(e.target.files[0]);
};

const handleRegisterPayment = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('amount', paymentAmount);
  formData.append('debt_id', selectedDebt);
  formData.append('file', paymentFile);

  try {
    await axios.post('http://localhost:5000/finances/payment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    showSuccess('Pago registrado exitosamente');
    setPaymentAmount('');
    setPaymentFile(null);
    setSelectedDebt('');
    onExpenseAdded && onExpenseAdded();
  } catch (error) {
    showError('Error al registrar el pago');
  }
};

  useEffect(() => {
    calculateInstallment();
  }, [totalDebt, numInstallments, interestRate]);

  return (
    <div className="d-flex">
      {/* Botón para alternar el sidebar */}
      <button
        className="btn btn-light menu-toggle"
        onClick={toggleSidebar}
        style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar bg-light p-3 ${isSidebarVisible ? 'active-sidebar' : ''}`}
        style={{
          width: '280px',
          height: '100vh',
          position: 'fixed',
          left: isSidebarVisible ? '0' : '-280px',
          top: '0',
          transition: 'left 0.3s ease',
        }}
      >
        <h4 className="mb-4">PayVue</h4>
        <nav className="nav nav-pills flex-column mb-auto">
          <Link className="nav-link text-dark" to="/dashboard">
            <i className="bi bi-house-door me-2"></i> Inicio
          </Link>
          <button
            className="nav-link text-dark btn btn-link text-start"
            onClick={() => setFormType('income')}
            data-bs-toggle="modal"
            data-bs-target="#financeFormModal"
          >
            <i className="bi bi-wallet me-2"></i> Registrar Ingreso
          </button>
          <button
            className="nav-link text-dark btn btn-link text-start"
            data-bs-toggle="modal"
            data-bs-target="#expenseModal"
          >
            <i className="bi bi-credit-card me-2"></i> Registrar Gasto
          </button>
          <button
            className="nav-link text-dark btn btn-link text-start"
            data-bs-toggle="modal"
            data-bs-target="#registerPaymentModal"
            onClick={fetchDebts}
          >
            <i className="bi bi-cash-coin me-2"></i> Registrar Pago de Deuda
          </button>
          <Link className="nav-link text-dark" to="/records">
            <i className="bi bi-table me-2"></i> Registros
          </Link>
          <Link className="nav-link text-dark" to="/history">
            <i className="bi bi-clock-history me-2"></i> Historial de pagos
          </Link>
          <Link className="nav-link text-dark" to="/">
            <i className="bi bi-box-arrow-left me-2"></i> Cerrar sesión
          </Link>
        </nav>

       
      </div>

      {/* Modal para el formulario de finanzas */}
      <div
        className="modal fade"
        id="financeFormModal"
        tabIndex="-1"
        aria-labelledby="financeFormModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="financeFormModalLabel">
                {formType === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto'}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <FinanceForm type={formType} onSuccess={fetchData} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Registrar Gasto */}
      <div
        className="modal fade"
        id="expenseModal"
        tabIndex="-1"
        aria-labelledby="expenseModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="expenseModalLabel">Registrar Gasto</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleExpenseSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Pago</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total de la Deuda</label>
                  <input
                    type="number"
                    className="form-control"
                    value={totalDebt}
                    onChange={(e) => setTotalDebt(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Número de Cuotas</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numInstallments}
                    onChange={(e) => setNumInstallments(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Porcentaje de Interés</label>
                  <input
                    type="number"
                    className="form-control"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Monto por Cuota</label>
                  <input
                    type="text"
                    className="form-control"
                    value={installmentAmount}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Día de Pago</label>
                  <input
                    type="number"
                    className="form-control"
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Registrar Gasto
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para registrar pago de deuda */}
<div
  className="modal fade"
  id="registerPaymentModal"
  tabIndex="-1"
  aria-labelledby="registerPaymentModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="registerPaymentModalLabel">Registrar Pago de Deuda</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form onSubmit={handleRegisterPayment}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Monto del Pago</label>
            <input
              type="number"
              className="form-control"
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Recibo (imagen/pdf)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={handlePaymentFileChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Seleccionar Deuda</label>
            <select
              className="form-control"
              value={selectedDebt}
              onChange={e => setSelectedDebt(e.target.value)}
              required
            >
              <option value="">Seleccione una deuda...</option>
              {debts.map(debt => (
                <option key={debt.id} value={debt.id}>
                  {debt.name} - ${debt.remaining_amount}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">Registrar Pago</button>
        </div>
      </form>
    </div>
  </div>
</div>

    </div>
  );
}

export default Sidebar;