const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active-sidebar');
    mainContent.classList.toggle('active-content');
});

document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Flatpickr en el contenedor del calendario
    const calendarContainer = document.getElementById("calendar");
    const calendar = flatpickr(calendarContainer, {
        inline: true, // Hace que el calendario se muestre de forma inline (sin campo de texto)
        dateFormat: "Y-m-d", // Cambia el formato de fecha si lo deseas
    });

    // Mostrar el modal cuando se hace clic en el ícono del calendario
    document.getElementById("openCalendarButton").addEventListener("click", function () {
        const myModal = new bootstrap.Modal(document.getElementById("calendarModal"));
        myModal.show();
    });
});


