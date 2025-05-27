function selectOption(optionType) {
    // Guardar el tipo de usuario en localStorage
    localStorage.setItem('userType', optionType);
    
    // Redirigir al formulario de registro correspondiente
    if(optionType === 'renter') {
        window.location.href = '/HTML/Registro3.html';
    } else {
        window.location.href = 'registro-propietario.html';
    }
}

// Opcional: Animación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 * index);
    });
});