document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const nextBtn = document.querySelector('.next-btn');
  const inputs = document.querySelectorAll('.detail-input');
  const descriptionTextarea = document.querySelector('.description-textarea');
  const characterCounter = document.querySelector('.character-counter');
  
  // Configuración
  const MIN_DESCRIPTION_LENGTH = 20;
  const MAX_DESCRIPTION_LENGTH = 500;

  // Inicialización
  function init() {
    setupEventListeners();
    updateNextButton();
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Validación en tiempo real para los inputs numéricos
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        // Validar que solo sean números
        this.value = this.value.replace(/[^0-9]/g, '');
        updateNextButton();
      });
    });

    // Contador de caracteres para la descripción
    descriptionTextarea.addEventListener('input', function() {
      const currentLength = this.value.length;
      characterCounter.textContent = `${currentLength}/${MAX_DESCRIPTION_LENGTH} caracteres`;
      
      // Limitar a máximo permitido
      if (currentLength > MAX_DESCRIPTION_LENGTH) {
        this.value = this.value.substring(0, MAX_DESCRIPTION_LENGTH);
        characterCounter.textContent = `${MAX_DESCRIPTION_LENGTH}/${MAX_DESCRIPTION_LENGTH} caracteres`;
      }
      
      updateNextButton();
    });

    // Botón siguiente
    nextBtn.addEventListener('click', handleNextStep);
  }

  // Validar campos requeridos
  function validateFields() {
    let isValid = true;
    
    // Validar que todos los inputs numéricos tengan valor
    inputs.forEach(input => {
      if (!input.value || isNaN(input.value)) {
        isValid = false;
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }
    });
    
    // Validar descripción
    if (descriptionTextarea.value.length < MIN_DESCRIPTION_LENGTH) {
      isValid = false;
      descriptionTextarea.classList.add('invalid');
    } else {
      descriptionTextarea.classList.remove('invalid');
    }
    
    return isValid;
  }

  // Actualizar estado del botón
  function updateNextButton() {
    const isValid = validateFields();
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle('btn-disabled', !isValid);
  }

  // Manejar el siguiente paso
  function handleNextStep() {
    if (!validateFields()) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos',
        confirmButtonColor: '#5A2F34',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    // Recolectar datos
    const propertyData = {
      dimensions: document.querySelector('.detail-field:nth-child(1) .detail-input').value,
      bathrooms: document.querySelector('.detail-field:nth-child(2) .detail-input').value,
      parking: document.querySelector('.detail-field:nth-child(3) .detail-input').value,
      bedrooms: document.querySelector('.detail-field:nth-child(4) .detail-input').value,
      age: document.querySelector('.detail-field:nth-child(5) .detail-input').value,
      description: descriptionTextarea.value
    };
    
    console.log('Datos del inmueble:', propertyData);
    
    // Mostrar confirmación y redirigir con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Listo!',
      text: 'La información de tu inmueble ha sido guardada correctamente.',
      confirmButtonColor: '#5A2F34',
      confirmButtonText: 'Continuar'
    }).then(() => {
      window.location.href = 'siguiente-pagina.html'; // Cambia esta URL
    });
  }

  // Función para mostrar alertas (usando SweetAlert2)
  function showAlert(title, text, icon, callback = null) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: '#5A2F34',
        confirmButtonText: 'Entendido'
      }).then((result) => {
        if (result.isConfirmed && callback) {
          callback();
        }
      });
    } else {
      // Fallback a alerta nativa si SweetAlert2 no está cargado
      alert(`${title}\n\n${text}`);
      if (callback) callback();
    }
  }

  // Iniciar la aplicación
  init();
});