import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [payment, setPayment] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const incomeData = await axios.get('http://localhost:5000/finances/income');
    // const expenseData = await axios.get('http://localhost:5000/finances/expense');
    const debtData = await axios.get('http://localhost:5000/finances/debt');
    const paymentData = await axios.get('http://localhost:5000/finances/payment');
    setIncomes(incomeData.data);
    // setExpenses(expenseData.data);
    setDebts(debtData.data);
    setPayment(paymentData.data);
  };

  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
//   const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalInstallments = debts.reduce((sum, debt) => sum + parseFloat(debt.installment_amount || 0), 0);

  const incomeChartData = {
    labels: incomes.map((i) => i.date),
    datasets: [
      {
        label: 'Total de ahorro',
        data: incomes.map((i) => i.amount),
        borderColor: '#0d6efd',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const expenseChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Gastos mensuales',
        data: Array(12).fill(0), // Inicializa un array con 12 ceros
        backgroundColor: '#0d6efd',
      },
    ],
  };

  // Procesar los datos de gastos para agruparlos por mes
  debts.forEach((debt) => {
    const month = new Date(debt.due_date).getMonth(); // Obtiene el índice del mes (0 = Enero, 11 = Diciembre)
    expenseChartData.datasets[0].data[month] += debt.installment_amount; // Suma el monto al mes correspondiente
  });

  const calculateDaysUntilPayment = (paymentDay) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const paymentDate = new Date(currentYear, currentMonth, paymentDay);

    if (paymentDate < today) {
      // Si el día de pago ya pasó este mes, calcula para el próximo mes
      paymentDate.setMonth(currentMonth + 1);
    }

    const diffTime = paymentDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Días restantes
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="container">
          <h1 className="mb-4">Dashboard</h1>

          

          <div className="row mt-4">
            <div className="col-md-6">
              <h3>Ingresos</h3>
              
            </div>
            <div className="col-md-6">
              <h3>Gastos</h3>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="stats-card p-3 text-center bg-white shadow-sm rounded">
                <div className="text-muted mb-2">Ingresos mensuales</div>
                <h3 className="mb-0 text-primary">${totalIncomes.toFixed(2)}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card p-3 text-center bg-white shadow-sm rounded">
                <div className="text-muted mb-2">Ahorro mensual</div>
                <h3 className="mb-0 text-success">${(totalIncomes - totalInstallments).toFixed(2)}</h3>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stats-card p-3 text-center bg-white shadow-sm rounded">
                <div className="text-muted mb-2">Gastos mensuales</div>
                <h3 className="mb-0 text-danger">${totalInstallments.toFixed(2)}</h3>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row">
            <div className="col-md-8">
              <div className="chart-container p-3 bg-white shadow-sm rounded">
                <h5 className="mb-4">Total de ahorro</h5>
                <Line data={incomeChartData} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="chart-container p-3 bg-white shadow-sm rounded">
                <h5 className="mb-4">Deudas Restantes</h5>
                {debts.map((debt) => (
                  <div key={debt.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>{debt.name}</span>
                      <span>{debt.remaining_payments} Cuotas</span>
                    </div>
                    <div className="progress debt-progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${(debt.remaining_amount / debt.total_amount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="chart-container p-3 bg-white shadow-sm rounded">
                <h5 className="mb-4">Deudas próximas a vencer</h5>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Entidad</th>
                        <th>Valor</th>
                        <th>Días Restantes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debts.map((debt) => (
                        <tr key={debt.id}>
                          <td>{debt.name}</td>
                          <td>${debt.installment_amount}</td>
                          <td>{calculateDaysUntilPayment(debt.payment_day)} días</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="chart-container p-3 bg-white shadow-sm rounded">
                <h5 className="mb-4">Meses con más gastos</h5>
                <Bar data={expenseChartData} />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default Dashboard;