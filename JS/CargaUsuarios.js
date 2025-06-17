import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usersTableBody = document.getElementById('usersTableBody');
const totalUsersEl = document.getElementById('totalUsers');
const studentUsersEl = document.getElementById('studentUsers');
const landlordUsersEl = document.getElementById('landlordUsers');
const unverifiedUsersEl = document.getElementById('unverifiedUsers');

const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const typeFilter = document.getElementById('typeFilter');

let allUsers = []; // Aquí guardaremos la lista combinada de usuarios

async function cargarUsuarios() {
  try {
    console.log('Cargando usuarios...');

    const estudiantesCol = collection(db, "Estudiantes");
    const propietariosCol = collection(db, "Propietario");

    const [estudiantesSnapshot, propietariosSnapshot] = await Promise.all([
      getDocs(estudiantesCol),
      getDocs(propietariosCol)
    ]);

    allUsers = [];

    estudiantesSnapshot.forEach(doc => {
      const data = doc.data();
      const nombre = ((data.Nombre ?? '').trim() + ' ' + (data.Apellido_P ?? '').trim() + ' ' + (data.Apellido_M ?? '').trim()).trim();
      allUsers.push({
        id: doc.id,
        nombreCompleto: nombre === '' ? 'Sin nombre' : nombre,
        telefono: data.Telefono || 'Sin teléfono',
        verificado: data.Verificado === true,
        fechaRegistro: data.fechaRegistro ? (data.fechaRegistro.toDate ? data.fechaRegistro.toDate() : new Date(data.fechaRegistro)) : null,
        tipo: 'Estudiante'
      });
    });

    propietariosSnapshot.forEach(doc => {
      const data = doc.data();
      const nombre = ((data.Nombre ?? '').trim() + ' ' + (data.Apellido_P ?? '').trim() + ' ' + (data.Apellido_M ?? '').trim()).trim();
      allUsers.push({
        id: doc.id,
        nombreCompleto: nombre === '' ? 'Sin nombre' : nombre,
        telefono: data.Telefono || 'Sin teléfono',
        verificado: data.Verificado === true,
        fechaRegistro: data.fechaRegistro ? (data.fechaRegistro.toDate ? data.fechaRegistro.toDate() : new Date(data.fechaRegistro)) : null,
        tipo: 'Arrendador'
      });
    });

    filtrarYMostrarUsuarios();

  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

function filtrarYMostrarUsuarios() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const type = typeFilter.value;

  let filtered = allUsers.filter(user => {
    if (!user.nombreCompleto.toLowerCase().includes(searchTerm)) return false;

    if (status === 'verified' && !user.verificado) return false;
    if (status === 'unverified' && user.verificado) return false;

    if (type === 'student' && user.tipo !== 'Estudiante') return false;
    if (type === 'landlord' && user.tipo !== 'Arrendador') return false;

    return true;
  });

  usersTableBody.innerHTML = '';

  let totalUsers = filtered.length;
  let studentUsers = filtered.filter(u => u.tipo === 'Estudiante').length;
  let landlordUsers = filtered.filter(u => u.tipo === 'Arrendador').length;
  let unverifiedUsers = filtered.filter(u => !u.verificado).length;

  filtered.forEach(user => {
    const tr = document.createElement('tr');

    const tdUsuario = document.createElement('td');
    tdUsuario.textContent = user.nombreCompleto;
    tdUsuario.title = `Teléfono: ${user.telefono}`;
    tr.appendChild(tdUsuario);

    const tdTipo = document.createElement('td');
    tdTipo.textContent = user.tipo;
    tdTipo.classList.add(user.tipo === 'Estudiante' ? 'text-primary' : 'text-success');
    tr.appendChild(tdTipo);

    const tdEstado = document.createElement('td');
    tdEstado.textContent = user.verificado ? 'Verificado' : 'Pendiente';
    tdEstado.classList.add(user.verificado ? 'text-success' : 'text-warning');
    tr.appendChild(tdEstado);

    const tdRegistro = document.createElement('td');
    tdRegistro.textContent = user.fechaRegistro ? user.fechaRegistro.toLocaleDateString() : '-';
    tr.appendChild(tdRegistro);

    const tdAcciones = document.createElement('td');
    tr.appendChild(tdAcciones);

    usersTableBody.appendChild(tr);
  });

  totalUsersEl.textContent = totalUsers;
  studentUsersEl.textContent = studentUsers;
  landlordUsersEl.textContent = landlordUsers;
  unverifiedUsersEl.textContent = unverifiedUsers;

  if (totalUsers === 0) {
    document.getElementById('noResults').classList.remove('d-none');
  } else {
    document.getElementById('noResults').classList.add('d-none');
  }
}

async function init() {
  await cargarUsuarios();

  searchInput.addEventListener('input', filtrarYMostrarUsuarios);
  statusFilter.addEventListener('change', filtrarYMostrarUsuarios);
  typeFilter.addEventListener('change', filtrarYMostrarUsuarios);

  const sidebarCollapse = document.getElementById('sidebarCollapse');
  const sidebar = document.getElementById('sidebar');
  if (sidebarCollapse && sidebar) {
      sidebarCollapse.addEventListener('click', () => sidebar.classList.toggle('active'));
  }

  const currentLocation = location.pathname;
  const menuItems = document.querySelectorAll('#sidebar ul li a');
  menuItems.forEach(item => {
      if (item.getAttribute('href') === currentLocation) {
          item.parentElement.classList.add('active');
      }
  });
}

document.addEventListener('DOMContentLoaded', init);
