document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Form submission
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos'
            });
            return;
        }
        
        // Aquí iría la lógica de autenticación
        console.log('Email:', email);
        console.log('Password:', password);
        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso (simulado)',
            showConfirmButton: false,
            timer: 1500
        });
    });

    // Social login buttons
    document.querySelector('.google-btn').addEventListener('click', function() {
        Swal.fire({
            icon: 'info',
            title: 'Google',
            text: 'Iniciar sesión con Google'
        });
    });
    
    document.querySelector('.facebook-btn').addEventListener('click', function() {
        Swal.fire({
            icon: 'info',
            title: 'Facebook',
            text: 'Iniciar sesión con Facebook'
        });
    });
});