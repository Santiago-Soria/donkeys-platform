// Sample property data
const properties = [
    {
        id: 1,
        address: 'Av. Reforma 123, CDMX',
        owner: 'María García López',
        type: 'departamento',
        verified: false,
        description: 'Hermoso departamento con vista al parque, ideal para estudiantes o profesionales.',
        price: 12000,
        registrationDate: '2024-06-10',
        images: ['/api/imgs/prop-1.jpg'],
        documents: {
            escritura: '/api/docs/prop-1-escritura.pdf',
            reciboAgua: '/api/docs/prop-1-agua.pdf'
        }
    },
    {
        id: 2,
        address: 'Calle Juárez 456, CDMX',
        owner: 'Carlos Rodríguez Mendoza',
        type: 'habitacion',
        verified: true,
        registrationDate: '2024-06-08',
        images: ['/api/imgs/prop-2.jpg'],
        documents: {
            contrato: '/api/docs/prop-2-contrato.pdf'
        }
    }
    // ...más propiedades
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');
const propertiesTableBody = document.getElementById('propertiesTableBody');
const noResults = document.getElementById('noResults');
const propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));
const modalPropertyTitle = document.getElementById('modalPropertyTitle');
const modalPropertyContent = document.getElementById('modalPropertyContent');

// Stats elements
const totalPropertiesEl = document.getElementById('totalProperties');
const unverifiedPropertiesEl = document.getElementById('unverifiedProperties');
const departamentoPropertiesEl = document.getElementById('departamentoProperties');
const habitacionPropertiesEl = document.getElementById('habitacionProperties');

// Current selected property
let currentSelectedProperty = null;

// Initialize the page
function init() {
    updateStats();
    renderProperties(properties);

    searchInput.addEventListener('input', filterProperties);
    statusFilter.addEventListener('change', filterProperties);
    typeFilter.addEventListener('change', filterProperties);
}

// Update statistics
function updateStats() {
    totalPropertiesEl.textContent = properties.length;
    unverifiedPropertiesEl.textContent = properties.filter(p => !p.verified).length;
    departamentoPropertiesEl.textContent = properties.filter(p => p.type === 'departamento').length;
    habitacionPropertiesEl.textContent = properties.filter(p => p.type === 'habitacion').length;
}

function filterProperties() {
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const type = typeFilter.value;

    const filtered = properties.filter(property => {
        const matchesSearch = property.address.toLowerCase().includes(searchTerm) ||
                              property.owner.toLowerCase().includes(searchTerm);
        const matchesStatus = status === 'all' ||
            (status === 'verified' && property.verified) ||
            (status === 'unverified' && !property.verified);
        const matchesType = type === 'all' || property.type === type;
        return matchesSearch && matchesStatus && matchesType;
    });

    renderProperties(filtered);
}

// Render properties to the table
function renderProperties(propertiesToRender) {
    propertiesTableBody.innerHTML = '';

    if (propertiesToRender.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }
    noResults.classList.add('d-none');

    propertiesToRender.forEach(property => {
        const row = document.createElement('tr');

        // Propiedad info cell
        const propertyCell = document.createElement('td');
        propertyCell.innerHTML = `
            <div class="fw-medium">${property.address}</div>
            <div class="text-muted small">Propietario: ${property.owner}</div>
        `;

        // Tipo cell
        const typeCell = document.createElement('td');
        const typeBadge = document.createElement('span');
        typeBadge.className = property.type === 'departamento'
            ? 'user-type-badge user-type-student'
            : 'user-type-badge user-type-landlord';
        typeBadge.textContent = property.type === 'departamento' ? 'Departamento' : 'Habitación';
        typeCell.appendChild(typeBadge);

        // Estado cell
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = property.verified
            ? 'status-badge status-verified'
            : 'status-badge status-pending';
        statusBadge.textContent = property.verified ? 'Verificada' : 'Sin verificar';
        statusCell.appendChild(statusBadge);

        // Fecha cell
        const dateCell = document.createElement('td');
        dateCell.textContent = property.registrationDate;
        dateCell.className = 'text-muted';

        // Acciones cell
        const actionsCell = document.createElement('td');
        const viewBtn = document.createElement('a');
        viewBtn.href = '#';
        viewBtn.className = 'action-link';
        viewBtn.innerHTML = '<i class="fas fa-eye me-1"></i> Ver Detalles';
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showProperty(property);
        });
        actionsCell.appendChild(viewBtn);

        // Append all cells to row
        row.appendChild(propertyCell);
        row.appendChild(typeCell);
        row.appendChild(statusCell);
        row.appendChild(dateCell);
        row.appendChild(actionsCell);

        propertiesTableBody.appendChild(row);
    });
}

// Show property documents in modal
function showPropertyDocuments(property) {
    currentSelectedProperty = property;
    modalPropertyTitle.textContent = `Documentos de la propiedad en ${property.address}`;
    modalPropertyContent.innerHTML = '';
    
    // Document cards
    for (const [docType, docUrl] of Object.entries(property.documents)) {
        const card = document.createElement('div');
        card.className = 'document-card';
        card.innerHTML = `
            <h6 class="d-flex align-items-center gap-2">
                <i class="fas fa-file-alt text-primary"></i>
                ${docType.charAt(0).toUpperCase() + docType.slice(1)}
            </h6>
            <div class="mt-3 text-center">
                <a href="${docUrl}" class="btn btn-sm btn-primary" target="_blank">
                    <i class="fas fa-eye me-1"></i> Ver Documento
                </a>
            </div>
        `;
        modalPropertyContent.appendChild(card);
    }
    
    propertyModal.show();
}

// Show property details in modal
function showProperty(property) {
    currentSelectedProperty = property;
    modalPropertyTitle.textContent = property.address;

    // Galería de imágenes
    const galleryHtml = `
    <div class="container mt-4">
        <div class="row g-3">
            ${property.images.map((img, idx) => `
                <div class="col-md-6 col-lg-3">
                    <div class="gallery-item" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="openModal('${img}')">
                        <img src="${img}" alt="Imagen ${idx + 1}" class="img-fluid rounded">
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    `;

    // Información de precio y descripción (puedes adaptar estos campos a tu estructura real)
    const price = property.price ? `<h2 class="rent-price">Renta $${property.price}</h2>` : '';
    const description = property.description ? `<p class="description mt-3">${property.description}</p>` : '';

    // Mapa y dirección
    const mapHtml = `
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-4">
                <div class="address-container">
                    <div class="location-icon">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <p class="address">${property.address}</p>
                </div>
            </div>
            <div class="col-md-8">
                <div class="map-container">
                    <iframe 
                        src="https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed"
                        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy">
                    </iframe>
                </div>
            </div>
        </div>
    </div>
    `;

    // Características principales (puedes adaptar estos campos a tu estructura real)
    const featuresHtml = `
    <div class="container mt-5 property-features">
        <div class="row text-center justify-content-center">
            <div class="col-6 col-md-4 col-lg-2 mb-3">
                <div class="feature-icon mx-auto">
                    <i class="fa-solid fa-ruler-combined"></i>
                </div>
                <p class="feature-text">${property.size || '80 m² tot.'}</p>
            </div>
            <div class="col-6 col-md-4 col-lg-2 mb-3">
                <div class="feature-icon mx-auto">
                    <i class="fa-solid fa-bath"></i>
                </div>
                <p class="feature-text">${property.bathrooms || '1 baño'}</p>
            </div>
            <div class="col-6 col-md-4 col-lg-2 mb-3">
                <div class="feature-icon mx-auto">
                    <i class="fa-solid fa-car"></i>
                </div>
                <p class="feature-text">${property.parking || '2 estac.'}</p>
            </div>
            <div class="col-6 col-md-4 col-lg-2 mb-3">
                <div class="feature-icon mx-auto">
                    <i class="fa-solid fa-bed"></i>
                </div>
                <p class="feature-text">${property.bedrooms || '3 rec.'}</p>
            </div>
            
        </div>
    </div>
    `;

    // Información del arrendador y amenidades (puedes adaptar estos campos a tu estructura real)
    const ownerHtml = `
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6">
                <div class="d-flex align-items-center mb-3">
                </div>
                <h3 class="amenities-title">Amenidades</h3>
                <div class="row mt-4">
                    <div class="col-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-wifi amenity-icon me-2"></i>
                            <p class="amenity-text">Wifi</p>
                        </div>
                    </div>
                    <div class="col-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-paw amenity-icon me-2"></i>
                            <p class="amenity-text">Petfriendly</p>
                        </div>
                    </div>
                    <div class="col-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-tv amenity-icon me-2"></i>
                            <p class="amenity-text">TV</p>
                        </div>
                    </div>
                    <div class="col-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-shower amenity-icon me-2"></i>
                            <p class="amenity-text">Agua Caliente</p>
                        </div>
                    </div>
                    <div class="col-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-snowflake amenity-icon me-2"></i>
                            <p class="amenity-text">Aire Acondicionado</p>
                        </div>
                    </div>
                    <div class="col-6 mb-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-snowflake amenity-icon me-2"></i>
                            <p class="amenity-text">Aire Acondicionado</p>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
    `;

    modalPropertyContent.innerHTML = `
        ${galleryHtml}
        <div class="container mt-5">
            <div class="row">
                <div class="col-12">
                    ${price}
                    ${description}
                </div>
            </div>
        </div>
        ${mapHtml}
        ${featuresHtml}
        ${ownerHtml}
        <div class="mb-3">
            <strong>Comprobante de domicilio:</strong>
            <a href="${property.documents.comprobante}" target="_blank" class="btn btn-sm btn-primary ms-2">
                <i class="fas fa-file-alt me-1"></i> Ver comprobante
            </a>
        </div>
        <div class="d-flex gap-2 mt-4">
            <button id="btnAceptar" class="btn btn-success flex-fill"><i class="fa-solid fa-check"></i> Aceptar</button>
            <button id="btnRechazar" class="btn btn-danger flex-fill"><i class="fa-solid fa-xmark"></i> Rechazar</button>
        </div>
        <div id="rechazoMotivoContainer" class="mt-3 d-none">
            <textarea id="rechazoMotivo" class="form-control mb-2" placeholder="Escribe el motivo del rechazo"></textarea>
            <button id="btnEnviarRechazo" class="btn btn-enviarmotivo">Enviar motivo</button>
        </div>
    `;
    propertyModal.show();

    // Lógica de botones con SweetAlert2
    document.getElementById('btnAceptar').onclick = async function() {
        // Aquí tu lógica para aceptar (por ejemplo, marcar como verificada)
        await Swal.fire({
            icon: 'success',
            title: 'Propiedad aceptada',
            text: '¡Propiedad aceptada y verificada correctamente!',
            timer: 1600,
            showConfirmButton: false
        });
        propertyModal.hide();
    };

    document.getElementById('btnRechazar').onclick = function() {
        document.getElementById('rechazoMotivoContainer').classList.remove('d-none');
    };

    document.getElementById('btnEnviarRechazo').onclick = async function() {
        const motivo = document.getElementById('rechazoMotivo').value.trim();
        if (!motivo) {
            await Swal.fire({
                icon: 'warning',
                title: 'Motivo requerido',
                text: 'Por favor, escribe el motivo del rechazo.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        // Aquí tu lógica para enviar el motivo (puedes hacer un fetch/AJAX)
        await Swal.fire({
            icon: 'success',
            title: 'Motivo enviado',
            text: 'El motivo del rechazo ha sido enviado correctamente.',
            timer: 1600,
            showConfirmButton: false
        });
        propertyModal.hide();
    };
}

function openModal(imgUrl) {
    const expandedImage = document.getElementById('expandedImage');
    expandedImage.src = imgUrl;
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
}
window.openModal = openModal; // Para que funcione el onclick en HTML generado

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    init();

    // Sidebar toggle
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }

    // Activate current menu item
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('#sidebar ul li a');
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation) {
            item.parentElement.classList.add('active');
        }
    });
});

