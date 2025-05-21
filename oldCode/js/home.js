 // Manejo del botón del menú de hamburguesa
 const menuToggle = document.getElementById('menuToggle');
 const sidebar = document.querySelector('.sidebar');
 const mainContent = document.querySelector('.main-content');

 menuToggle.addEventListener('click', () => {
     sidebar.classList.toggle('active-sidebar');
     mainContent.classList.toggle('active-content');
 });

  // Savings Chart
 const savingsCtx = document.getElementById('savingsChart').getContext('2d');
 new Chart(savingsCtx, {
     type: 'line',
     data: {
         labels: ['23 Nov', '24', '25', '26', '27', '28', '29', '30'],
         datasets: [{
             label: 'Total de ahorro',
             data: [25000, 27000, 29000, 31000, 35000, 32000, 37000, 45000],
             borderColor: '#0d6efd',
             tension: 0.4,
             fill: false
         }]
     },
     options: {
         responsive: true,
         plugins: {
             legend: {
                 display: false
             }
         },
         scales: {
             y: {
                 beginAtZero: true,
                 ticks: {
                     callback: function(value) {
                         return '$' + value.toLocaleString();
                     }
                 }
             }
         }
     }
 });

 // Expenses Chart
 const expensesCtx = document.getElementById('expensesChart').getContext('2d');
 new Chart(expensesCtx, {
     type: 'bar',
     data: {
         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
         datasets: [{
             label: 'Gastos mensuales',
             data: [45000, 48000, 43000, 40000, 52000, 75000, 55000, 65000, 48000, 43000, 40000, 35000],
             backgroundColor: '#0d6efd'
         }]
     },
     options: {
         responsive: true,
         plugins: {
             legend: {
                 display: false
             }
         },
         scales: {
             y: {
                 beginAtZero: true,
                 ticks: {
                     callback: function(value) {
                         return '$' + value.toLocaleString();
                     }
                 }
             }
         }
     }
 });

  // Mostrar el modal al hacer clic en "Ver perfil"
  document.getElementById('viewProfileLink').addEventListener('click', function() {
    var profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
    profileModal.show();
});