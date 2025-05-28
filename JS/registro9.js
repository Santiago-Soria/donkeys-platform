document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const backButton = document.querySelector('.back-header');
  const nextBtn = document.querySelector('.next-btn');
  const descriptionTextarea = document.querySelector('.description-textarea');
  
  // Mínimo de caracteres requeridos
  const MIN_DESCRIPTION_LENGTH = 20;
  
  // Inicialización
  function init() {
    setupEventListeners();
    updateNextButton();
  }
  
  // Configurar event listeners
  function setupEventListeners() {
    // Botón de regresar
    backButton.addEventListener('click', function() {
      window.history.back();
    });
    
    // Botón siguiente
    nextBtn.addEventListener('click', handleNextStep);
    
    // Validación de texto en tiempo real
    descriptionTextarea.addEventListener('input', updateNextButton);
  }
  
  // Actualizar estado del botón siguiente
  function updateNextButton() {
    const isValid = descriptionTextarea.value.length >= MIN_DESCRIPTION_LENGTH;
    
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle('btn-disabled', !isValid);
    
    if (isValid) {
      nextBtn.title = 'Descripción válida';
    } else {
      nextBtn.title = `La descripción debe tener al menos ${MIN_DESCRIPTION_LENGTH} caracteres`;
    }
  }
  
  // Manejar el siguiente paso
  function handleNextStep() {
    if (descriptionTextarea.value.length < MIN_DESCRIPTION_LENGTH) {
      alert(`Por favor escribe una descripción de al menos ${MIN_DESCRIPTION_LENGTH} caracteres.`);
      return;
    }
    
    // Aquí pueden:
    // 1. Guardar la descripción
    // 2. Redirigir a la siguiente página
    // 3. Enviar los datos al servidor
    
    console.log('Descripción:', descriptionTextarea.value);
    
    showAlert(
            'Documentos recibidos', 
            'Tus documentos han sido enviados para verificación. Te notificaremos por correo electrónico cuando hayan sido procesados.', 
            'success',
            function() {
                // Redirigir después de mostrar el mensaje
                window.location.href = '/HTML/Index.html';
            }
        );

    
  }

     // Función para mostrar alertas personalizadas
    function showAlert(title, message, type, callback) {
        const alertBox = document.createElement('div');
        alertBox.className = `custom-alert custom-alert-${type}`;
        
        alertBox.innerHTML = `
            <div class="custom-alert-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="custom-alert-button">Aceptar</button>
            </div>
        `;
        
        document.body.appendChild(alertBox);
        
        const closeButton = alertBox.querySelector('.custom-alert-button');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(alertBox);
            if (callback) callback();
        });
    }
  
  // Inicializar la aplicación
  init();
});