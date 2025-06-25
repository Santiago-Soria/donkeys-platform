function selectOption(optionType) {
    // Guardar el tipo de usuario en localStorage
    localStorage.setItem('userType', optionType);
    
    // Confirmación con SweetAlert2 antes de redirigir
    Swal.fire({
        icon: 'question',
        title: '¿Continuar con el registro?',
        text: optionType === 'renter'
            ? 'Vas a registrarte como estudiante. ¿Deseas continuar?'
            : 'Vas a registrarte como arrendador. ¿Deseas continuar?',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            if(optionType === 'renter') {
                window.location.href = 'Registro3.html';
            } else {
                window.location.href = 'Registro4.html';
            }
        }
    });
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