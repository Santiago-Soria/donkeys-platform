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

    // Manejar el envío del formulario
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (message.length === 0) {
            alert('Por favor escribe un mensaje antes de enviar.');
            return;
        }
        
        // Aquí iría tu lógica para enviar el mensaje
        console.log('Mensaje a enviar:', message);
        
        // Ejemplo de feedback al usuario
        alert('Mensaje enviado correctamente');
        messageInput.value = '';
        sendButton.disabled = true;
        sendButton.classList.add('btn-disabled');
        sendButton.classList.remove('btn-enabled');
    });

    function openModal(imageSrc) {
    document.getElementById('expandedImage').src = imageSrc;
}

});