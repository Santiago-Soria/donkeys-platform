// Sample user data
const users = [
    {
        id: 1,
        name: 'María García López',
        email: 'maria.garcia@email.com',
        phone: '+52 55 1234 5678',
        type: 'student',
        verified: false,
        registrationDate: '2024-06-10',
        documents: {
            credencial: '/api/docs/student-1-credencial.jpg',
            horario: '/api/docs/student-1-horario.pdf'
        }
    },
    {
        id: 2,
        name: 'Carlos Rodríguez Mendoza',
        email: 'carlos.rodriguez@email.com',
        phone: '+52 55 2345 6789',
        type: 'landlord',
        verified: true,
        registrationDate: '2024-06-08',
        documents: {
            ineFrente: '/api/docs/landlord-2-ine-front.jpg',
            ineReverso: '/api/docs/landlord-2-ine-back.jpg',
            comprobanteDomicilio: '/api/docs/landlord-2-address.pdf'
        }
    },
    {
        id: 3,
        name: 'Ana Martínez Silva',
        email: 'ana.martinez@email.com',
        phone: '+52 55 3456 7890',
        type: 'student',
        verified: true,
        registrationDate: '2024-06-09',
        documents: {
            credencial: '/api/docs/student-3-credencial.jpg',
            horario: '/api/docs/student-3-horario.pdf'
        }
    },
    {
        id: 4,
        name: 'Roberto Fernández Torres',
        email: 'roberto.fernandez@email.com',
        phone: '+52 55 4567 8901',
        type: 'landlord',
        verified: false,
        registrationDate: '2024-06-11',
        documents: {
            ineFrente: '/api/docs/landlord-4-ine-front.jpg',
            ineReverso: '/api/docs/landlord-4-ine-back.jpg',
            comprobanteDomicilio: '/api/docs/landlord-4-address.pdf'
        }
    },
    {
        id: 5,
        name: 'Laura Jiménez Morales',
        email: 'laura.jimenez@email.com',
        phone: '+52 55 5678 9012',
        type: 'student',
        verified: false,
        registrationDate: '2024-06-12',
        documents: {
            credencial: '/api/docs/student-5-credencial.jpg',
            horario: '/api/docs/student-5-horario.pdf'
        }
    }
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');
const usersTableBody = document.getElementById('usersTableBody');
const noResults = document.getElementById('noResults');
const documentModal = new bootstrap.Modal(document.getElementById('documentModal'));
const modalUserName = document.getElementById('modalUserName');
const modalContent = document.getElementById('modalContent');
const verifyBtn = document.getElementById('verifyBtn');
const rejectBtn = document.getElementById('rejectBtn');

// Stats elements
const totalUsersEl = document.getElementById('totalUsers');
const unverifiedUsersEl = document.getElementById('unverifiedUsers');
const studentUsersEl = document.getElementById('studentUsers');
const landlordUsersEl = document.getElementById('landlordUsers');

// Current selected user
let currentSelectedUser = null;

// Initialize the page
function init() {
    updateStats();
    renderUsers(users);
    
    // Add event listeners
    searchInput.addEventListener('input', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
    typeFilter.addEventListener('change', filterUsers);
    verifyBtn.addEventListener('click', verifyUser);
    rejectBtn.addEventListener('click', rejectUser);
}

// Update statistics
function updateStats() {
    totalUsersEl.textContent = users.length;
    unverifiedUsersEl.textContent = users.filter(u => !u.verified).length;
    studentUsersEl.textContent = users.filter(u => u.type === 'student').length;
    landlordUsersEl.textContent = users.filter(u => u.type === 'landlord').length;
}

// Filter users based on search and filters
function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const type = typeFilter.value;
    
    const filtered = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesStatus = status === 'all' || 
                            (status === 'verified' && user.verified) ||
                            (status === 'unverified' && !user.verified);
        const matchesType = type === 'all' || user.type === type;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    renderUsers(filtered);
}

// Render users to the table
function renderUsers(usersToRender) {
    usersTableBody.innerHTML = '';
    
    if (usersToRender.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }
    
    noResults.classList.add('d-none');
    
    usersToRender.forEach(user => {
        const row = document.createElement('tr');
        
        // User info cell
        const userCell = document.createElement('td');
        userCell.innerHTML = `
            <div class="fw-medium">${user.name}</div>
            <div class="text-muted small">${user.email}</div>
            <div class="text-muted extra-small">${user.phone}</div>
        `;
        
        // Type cell
        const typeCell = document.createElement('td');
        const typeBadge = document.createElement('span');
        typeBadge.className = user.type === 'student' ? 
            'user-type-badge user-type-student' : 'user-type-badge user-type-landlord';
        typeBadge.textContent = user.type === 'student' ? 'Estudiante' : 'Arrendador';
        typeCell.appendChild(typeBadge);
        
        // Status cell
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = user.verified ? 
            'status-badge status-verified' : 'status-badge status-pending';
        statusBadge.textContent = user.verified ? 'Verificado' : 'Pendiente';
        statusCell.appendChild(statusBadge);
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = user.registrationDate;
        dateCell.className = 'text-muted';
        
        // Actions cell
        const actionsCell = document.createElement('td');
        const viewBtn = document.createElement('a');
        viewBtn.href = '#';
        viewBtn.className = 'action-link';
        viewBtn.innerHTML = '<i class="fas fa-eye me-1"></i> Ver Documentos';
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showDocuments(user);
        });
        actionsCell.appendChild(viewBtn);
        
        // Append all cells to row
        row.appendChild(userCell);
        row.appendChild(typeCell);
        row.appendChild(statusCell);
        row.appendChild(dateCell);
        row.appendChild(actionsCell);
        
        usersTableBody.appendChild(row);
    });
}

// Show documents in modal
function showDocuments(user) {
    currentSelectedUser = user;
    modalUserName.textContent = user.name;
    modalContent.innerHTML = '';
    
    if (user.type === 'student') {
        // Student documents
        modalContent.innerHTML = `
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="document-card">
                        <h6 class="d-flex align-items-center gap-2">
                            <i class="fas fa-id-card text-primary"></i>
                            Credencial Estudiantil
                        </h6>
                        <div class="mt-3">
                            <img src="https://via.placeholder.com/400x250/e5e7eb/6b7280?text=Credencial+Estudiantil" 
                                 alt="Credencial estudiantil" class="img-fluid rounded">
                            <div class="mt-3 d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-download me-1"></i> Descargar
                                </button>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-expand me-1"></i> Ver completa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="document-card">
                        <h6 class="d-flex align-items-center gap-2">
                            <i class="fas fa-calendar-alt text-success"></i>
                            Horario Académico
                        </h6>
                        <div class="mt-3 text-center py-4 bg-light rounded">
                            <i class="fas fa-file-pdf document-icon text-danger"></i>
                            <p class="text-muted mb-1">Documento PDF</p>
                            <p class="text-muted small">horario-academico.pdf</p>
                            <div class="mt-3 d-flex gap-2 justify-content-center">
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-download me-1"></i> Descargar
                                </button>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-expand me-1"></i> Ver documento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Landlord documents
        modalContent.innerHTML = `
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="document-card">
                        <h6 class="d-flex align-items-center gap-2">
                            <i class="fas fa-id-card text-primary"></i>
                            INE - Frente
                        </h6>
                        <div class="mt-3">
                            <img src="https://via.placeholder.com/400x250/e5e7eb/6b7280?text=INE+Frente" 
                                 alt="INE frente" class="img-fluid rounded">
                            <div class="mt-3 d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-download me-1"></i> Descargar
                                </button>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-expand me-1"></i> Ver completa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="document-card">
                        <h6 class="d-flex align-items-center gap-2">
                            <i class="fas fa-id-card text-primary"></i>
                            INE - Reverso
                        </h6>
                        <div class="mt-3">
                            <img src="https://via.placeholder.com/400x250/e5e7eb/6b7280?text=INE+Reverso" 
                                 alt="INE reverso" class="img-fluid rounded">
                            <div class="mt-3 d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-download me-1"></i> Descargar
                                </button>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-expand me-1"></i> Ver completa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-12">
                    <div class="document-card">
                        <h6 class="d-flex align-items-center gap-2">
                            <i class="fas fa-home text-success"></i>
                            Comprobante de Domicilio
                        </h6>
                        <div class="mt-3 text-center py-4 bg-light rounded">
                            <i class="fas fa-file-pdf document-icon text-danger"></i>
                            <p class="text-muted mb-1">Documento PDF</p>
                            <p class="text-muted small">comprobante-domicilio.pdf</p>
                            <div class="mt-3 d-flex gap-2 justify-content-center">
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-download me-1"></i> Descargar
                                </button>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-expand me-1"></i> Ver documento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    documentModal.show();
}

// Verify user
function verifyUser() {
    if (!currentSelectedUser) return;

    // In a real app, you would make an API call here
    console.log(`Verifying user ${currentSelectedUser.id}`);
    currentSelectedUser.verified = true;

    // Update UI
    documentModal.hide();
    filterUsers();
    updateStats();

    // Show success message con SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Usuario verificado',
        text: `Usuario ${currentSelectedUser.name} ha sido verificado correctamente.`,
        timer: 1600,
        showConfirmButton: false
    });
}

// Reject user
function rejectUser() {
    document.getElementById('rechazoMotivoContainer').classList.remove('d-none');
    document.getElementById('btnEnviarMotivo').onclick = function() {
        const motivo = document.getElementById('rechazoMotivo').value.trim();
        if (!motivo) {
            Swal.fire({
                icon: 'warning',
                title: 'Motivo requerido',
                text: 'Por favor, escribe el motivo del rechazo.'
            });
            return;
        }
        Swal.fire({
            icon: 'info',
            title: 'Motivo enviado',
            text: 'Motivo enviado: ' + motivo,
            timer: 1600,
            showConfirmButton: false
        });
        const modal = bootstrap.Modal.getInstance(document.getElementById('documentModal'));
        modal.hide();
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    init();

    // Sidebar toggle
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    if (sidebarCollapse && sidebar) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
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