document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const contactForm = document.getElementById('contactForm');

    // Validar en tiempo real
    messageInput.addEventListener('input', function() {
        // Eliminar espacios en blanco al inicio y final
        const trimmedValue = this.value.trim();
        
        // Habilitar/deshabilitar botón
        sendButton.disabled = trimmedValue.length === 0;
        
        // Cambiar estilo visual
        if (trimmedValue.length > 0) {
            sendButton.classList.remove('btn-disabled');
            sendButton.classList.add('btn-enabled');
        } else {
            sendButton.classList.add('btn-disabled');
            sendButton.classList.remove('btn-enabled');
        }
    });

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (message.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Mensaje vacío',
            text: 'Por favor escribe un mensaje antes de enviar.'
        });
        return;
    }
    
    // Recuperamos el teléfono que guardamos en el paso anterior
    const telefonoArrendador = contactForm.dataset.telefonoArrendador;
    // Debug
    console.log(telefonoArrendador);
    if (!telefonoArrendador) {
        Swal.fire({
            icon: 'error',
            title: 'Sin número',
            text: 'Lo sentimos, no se pudo encontrar el número de teléfono del arrendador.'
        });
        return;
    }

    // Limpiamos el número y agregamos el código de país de México (52)
    let numeroLimpio = telefonoArrendador.replace(/\s/g, '');
    if (numeroLimpio.length === 10) {
        numeroLimpio = '52' + numeroLimpio;
    }
    
    // Codificamos el mensaje para que sea parte de la URL
    const mensajeCodificado = encodeURIComponent(message);
    
    // Creamos la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
    
    console.log('Abriendo WhatsApp:', whatsappUrl);
    
    // Abrimos la URL en una nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Feedback al usuario con SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Redirigiendo a WhatsApp',
        text: 'Tu mensaje se está enviando por WhatsApp.',
        timer: 1500,
        showConfirmButton: false
    });

    // Limpiamos el formulario
    messageInput.value = '';
    sendButton.disabled = true;
    sendButton.classList.add('btn-disabled');
    sendButton.classList.remove('btn-enabled');
});

    function openModal(imageSrc) {
    document.getElementById('expandedImage').src = imageSrc;
}

});