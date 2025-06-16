document.addEventListener('DOMContentLoaded', function() {
  const sortTrigger = document.getElementById('sortTrigger');
  const sortDropdown = document.getElementById('sortDropdown');
  const sortOptions = document.querySelectorAll('.sort-option');
  let currentSort = 'recent'; // Default sort option

  // Toggle dropdown
  sortTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    sortDropdown.classList.toggle('show');
  });

  // Handle option selection
  sortOptions.forEach(option => {
    option.addEventListener('click', function() {
      sortOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      currentSort = this.getAttribute('data-value');
      console.log('Selected sort:', currentSort);
      // sortProperties(currentSort);
      sortDropdown.classList.remove('show');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    sortDropdown.classList.remove('show');
  });

  // Prevent dropdown from closing when clicking inside it
  sortDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // Set default active option
  document.querySelector(`.sort-option[data-value="${currentSort}"]`).classList.add('active');

  // Inicialización de estado para todas las tarjetas
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