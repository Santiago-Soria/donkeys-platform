document.addEventListener('DOMContentLoaded', function() {
    const recoveryForm = document.getElementById('recoveryForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.getElementById('btnText');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const emailInput = document.getElementById('email');

    recoveryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Ocultar mensajes previos
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        btnText.textContent = 'Enviando...';
        
        // Simular envío de correo (reemplazar con lógica real)
        setTimeout(() => {
            // Validación básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(emailInput.value)) {
                successMessage.style.display = 'block';
                successMessage.classList.add('animate__animated', 'animate__fadeIn');
                recoveryForm.style.display = 'none';
            } else {
                errorMessage.style.display = 'block';
                errorMessage.classList.add('animate__animated', 'animate__fadeIn');
                document.getElementById('errorText').textContent = 'Por favor ingresa una dirección de correo válida.';
            }
            
            // Restaurar botón
            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            btnText.textContent = 'Enviar Enlace de Recuperación';
        }, 2000);
    });
    
    // Limpiar mensajes de error al escribir
    emailInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
});

function goBack() {
    // Aquí puedes agregar la lógica para volver a la pantalla de login
    window.history.back();
}