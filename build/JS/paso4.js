document.addEventListener('DOMContentLoaded', function() {
    // Preferencias disponibles
    const preferences = [
        { id: 1, name: 'Petfriendly', icon: 'fa-paw' },
        { id: 2, name: 'Visitas Permitidas', icon: 'fa-user-friends' },
        { id: 3, name: 'Servicios Incluidos', icon: 'fa-concierge-bell' },
        { id: 4, name: 'Internet Incluido', icon: 'fa-wifi' },
        { id: 5, name: 'Cocina Equipada', icon: 'fa-utensils' },
        { id: 6, name: 'Lavandería', icon: 'fa-tshirt' },
        { id: 7, name: 'Estacionamiento', icon: 'fa-car' },
        { id: 8, name: 'Seguridad 24/7', icon: 'fa-shield-alt' },
        { id: 9, name: 'TV Cable', icon: 'fa-tv' }
    ];

    const grid = document.getElementById('preferences-grid');
    const counter = document.querySelector('.selected-count');
    const finalizarBtn = document.getElementById('finalizar-btn');
    let selectedPreferences = [];

    // Generar las tarjetas de preferencias
    preferences.forEach(pref => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="preference-card" data-id="${pref.id}">
                <i class="fas ${pref.icon}"></i>
                <h3 class="preference-name">${pref.name}</h3>
                <i class="fas fa-check-circle check-icon"></i>
            </div>
        `;
        grid.appendChild(col);
    });

    // Manejar clic en las tarjetas
    grid.addEventListener('click', function(e) {
        const card = e.target.closest('.preference-card');
        if (!card) return;

        const id = parseInt(card.dataset.id);
        const index = selectedPreferences.indexOf(id);
        
        if (index === -1) {
            // Seleccionar
            selectedPreferences.push(id);
            card.classList.add('selected');
        } else {
            // Deseleccionar
            selectedPreferences.splice(index, 1);
            card.classList.remove('selected');
        }
        
        updateCounter();
        updateFinalizarButton();
    });

    // Actualizar contador
    function updateCounter() {
        const count = selectedPreferences.length;
        counter.textContent = `${count} preferencia${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''}`;
    }

    // Habilitar/deshabilitar botón Finalizar
    function updateFinalizarButton() {
        finalizarBtn.disabled = selectedPreferences.length === 0;
    }

    // Botón Finalizar
    finalizarBtn.addEventListener('click', function() {
       
        // Aquí puedes redirigir o enviar los datos al servidor
    });

    // Inicializar
    updateFinalizarButton();
});