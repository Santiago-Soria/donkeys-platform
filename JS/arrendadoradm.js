document.addEventListener('DOMContentLoaded', function() {
  const sortTrigger = document.getElementById('sortTrigger');
  const sortDropdown = document.getElementById('sortDropdown');
  const sortOptions = document.querySelectorAll('.sort-option');
  let currentSort = 'recent'; // O la opción que quieras por defecto

  // Toggle dropdown al dar click en el trigger
  sortTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    sortDropdown.classList.toggle('show');
  });

  // Manejar selección de opción
  sortOptions.forEach(option => {
    option.addEventListener('click', function() {
      sortOptions.forEach(opt => opt.classList.remove('selected')); // Cambia 'active' a 'selected' para que coincida con arrendadoradm.js
      this.classList.add('selected');
      currentSort = this.getAttribute('data-value');
      console.log('Selected sort:', currentSort);
      // Aquí no haces renderProperties() porque esa función está en arrendadoradm.js
      // Solo ocultamos el dropdown:
      sortDropdown.classList.remove('show');
    });
  });

  // Cerrar dropdown si se hace click afuera
  document.addEventListener('click', function() {
    sortDropdown.classList.remove('show');
  });

  // Evitar que el dropdown se cierre si se hace click dentro de él
  sortDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // Marcar la opción por defecto como seleccionada
  const defaultOption = document.querySelector(`.sort-option[data-value="${currentSort}"]`);
  if (defaultOption) defaultOption.classList.add('selected');

  // Aquí puedes dejar la lógica para los botones de estado "Rentado" / "No rentado"
  function initializeStatus() {
    const cards = document.querySelectorAll('.property-card');
    cards.forEach(card => {
      const btn = card.querySelector('.status-btn');
      const statusText = card.querySelector('.property-status');
      if (!btn || !statusText) return;

      const isRentado = statusText.textContent.trim() === 'Rentado';
      btn.textContent = isRentado ? 'Rentado' : 'No rentado';
      btn.classList.add(isRentado ? 'rentado' : 'no-rentado');
      statusText.classList.add(isRentado ? 'rentado' : 'no-rentado');
    });
  }

  initializeStatus();

  // Sincronizar botón y texto de estado para todas las tarjetas
  const cards = document.querySelectorAll('.property-card');
  cards.forEach(card => {
    const btn = card.querySelector('.status-btn');
    const statusText = card.querySelector('.property-status');
    if (!btn || !statusText) return;

    btn.addEventListener('click', function() {
      const btnText = btn.textContent.trim();
      if (btnText === 'No rentado' || btnText === 'Disponible') {
        btn.textContent = 'Rentado';
        btn.classList.remove('no-rentado');
        btn.classList.add('rentado');

        statusText.textContent = 'Rentado';
        statusText.classList.remove('no-rentado');
        statusText.classList.add('rentado');

        console.log('Estado actualizado a: Rentado');
      } else {
        btn.textContent = 'No rentado';
        btn.classList.remove('rentado');
        btn.classList.add('no-rentado');

        statusText.textContent = 'No rentado';
        statusText.classList.remove('rentado');
        statusText.classList.add('no-rentado');

        console.log('Estado actualizado a: No rentado');
      }
    });
  });
});
