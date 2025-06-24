document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const amenidadCards = document.querySelectorAll('.amenidad-card');
  const nextBtn = document.querySelector('.next-btn');
  const backButton = document.querySelector('.back-header');
  const searchInput = document.querySelector('.search-input');
  
  // Variables de estado
  let selectedAmenities = [];
  const MIN_SELECTION = 1; // Mínimo requerido
  
  // Inicialización
  function init() {
    setupEventListeners();
    updateNextButton();
  }
  
  // Configurar event listeners
  function setupEventListeners() {
    // Selección de amenidades
    amenidadCards.forEach(card => {
      card.addEventListener('click', toggleAmenitySelection);
    });
    
    // Botón de regresar
    backButton.addEventListener('click', () => {
      window.history.back();
    });
    
    // Botón siguiente
    nextBtn.addEventListener('click', handleNextStep);
    
    // Búsqueda de amenidades
    searchInput.addEventListener('input', filterAmenities);
  }
  
  // Alternar selección de amenidad
  function toggleAmenitySelection(event) {
    const card = event.currentTarget;
    const amenityName = card.querySelector('.amenidad-name').textContent;
    
    if (card.classList.contains('selected')) {
      // Deseleccionar
      card.classList.remove('selected');
      selectedAmenities = selectedAmenities.filter(item => item !== amenityName);
    } else {
      // Seleccionar
      card.classList.add('selected');
      selectedAmenities.push(amenityName);
    }
    
    updateNextButton();
  }
  
  // Actualizar estado del botón siguiente
  function updateNextButton() {
    const isValid = selectedAmenities.length >= MIN_SELECTION;
    
    nextBtn.disabled = !isValid;
    nextBtn.classList.toggle('btn-disabled', !isValid);
    
    if (isValid) {
      nextBtn.title = `Seleccionadas: ${selectedAmenities.length} amenidad(es)`;
    } else {
      nextBtn.title = `Selecciona al menos ${MIN_SELECTION} amenidad`;
    }
  }
  
  // Filtrar amenidades por búsqueda
  function filterAmenities() {
    const searchTerm = searchInput.value.toLowerCase();
    
    amenidadCards.forEach(card => {
      const amenityName = card.querySelector('.amenidad-name').textContent.toLowerCase();
      const isVisible = amenityName.includes(searchTerm);
      
      card.style.display = isVisible ? 'flex' : 'none';
    });
  }
  
  // Manejar el siguiente paso
  function handleNextStep() {
    if (selectedAmenities.length < MIN_SELECTION) {
      alert(`Por favor selecciona al menos ${MIN_SELECTION} amenidad.`);
      return;
    }
    
    // Aquí puedes:
    // 1. Guardar las amenidades seleccionadas (selectedAmenities)
    // 2. Redirigir a la siguiente página
    // 3. Enviar los datos al servidor
    
    console.log('Amenidades seleccionadas:', selectedAmenities);
    alert(`Has seleccionado ${selectedAmenities.length} amenidades. Redirigiendo...`);
    
    // Ejemplo de redirección:
     window.location.href = 'Registro9.html';
  }
  
  // Inicializar la aplicación
  init();
});