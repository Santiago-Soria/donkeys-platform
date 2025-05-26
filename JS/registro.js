document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const email = document.getElementById('email').value;
        const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        const terms = document.getElementById('terms').checked;
        
        // Validaciones
        if (!nombre || !apellidos || !email || !fechaNacimiento || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (!terms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }
        
        // Validar edad mínima (18 años)
        const birthDate = new Date(fechaNacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            alert('Debes tener al menos 18 años para registrarte');
            return;
        }
        
        // Si todo está correcto
        alert('Registro exitoso (simulado)');
        console.log({
            nombre,
            apellidos,
            email,
            fechaNacimiento,
            password
        });
        
        // Aquí normalmente redirigirías al usuario o enviarías los datos al servidor
    });
});