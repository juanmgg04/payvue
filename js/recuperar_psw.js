document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Aquí iría la lógica de autenticación
    console.log('Iniciando sesión con:', {
        username,
        password
    });
});

document.querySelector('.google-btn').addEventListener('click', function() {
    alert('Por el momento esta opción no está disponible');
});