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

// Referencias DOM
const tableBody = document.getElementById("propertiesTableBody");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");

const totalProperties = document.getElementById("totalProperties");
const unverifiedProperties = document.getElementById("unverifiedProperties");
const departamentoProperties = document.getElementById("departamentoProperties");
const habitacionProperties = document.getElementById("habitacionProperties");

let anunciosData = [];  // Guardamos los anuncios para filtrar sin volver a Firestore

// Cargar anuncios desde Firestore
async function cargarAnuncios() {
  try {
    const anunciosRef = collection(db, "Anuncio");
    const anunciosSnapshot = await getDocs(anunciosRef);

    if (anunciosSnapshot.empty) {
      tableBody.innerHTML = "";
      noResults.classList.remove("d-none");
      return;
    }

    anunciosData = anunciosSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });

    noResults.classList.add("d-none");

    actualizarEstadisticas(anunciosData);
    mostrarAnuncios(anunciosData);

  } catch (error) {
    console.error("Error cargando anuncios:", error);
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error cargando anuncios</td></tr>`;
  }
}

// Mostrar anuncios en la tabla
function mostrarAnuncios(anuncios) {
  tableBody.innerHTML = "";

  if (anuncios.length === 0) {
    noResults.classList.remove("d-none");
    return;
  }

  noResults.classList.add("d-none");

  anuncios.forEach(anuncio => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${anuncio.Direccion || "Sin dirección"}</td>
      <td>
        ${anuncio.Tipo === true
            ? '<span class="badge badge-departamento">departamento</span>'
            : '<span class="badge badge-habitacion">habitación</span>'}
      </td>
      <td>${anuncio.Disponibilidad ? '<span class="badge bg-success">Disponible</span>' : '<span class="badge bg-danger">No disponible</span>'}</td>
      <td>${anuncio.Publicacion ? new Date(anuncio.Publicacion.seconds * 1000).toLocaleDateString() : "N/A"}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-ver-detalle" data-id="${anuncio.id}">Ver</button>
      </td>
    `;

    tableBody.appendChild(fila);
  });

  // Activar botones de detalle
  document.querySelectorAll(".btn-ver-detalle").forEach(btn => {
    btn.addEventListener("click", () => {
      abrirModalDetalle(btn.getAttribute("data-id"));
    });
  });
}

// Actualizar estadísticas
function actualizarEstadisticas(anuncios) {
  totalProperties.textContent = anuncios.length;

  const sinVerificar = anuncios.filter(a => !a.Disponibilidad).length;
  unverifiedProperties.textContent = sinVerificar;

  const departamentos = anuncios.filter(a => a.Tipo === true).length;
  departamentoProperties.textContent = departamentos;

  const habitaciones = anuncios.filter(a => a.Tipo === false).length;
  habitacionProperties.textContent = habitaciones;
}

// Filtrar según inputs y selects
function filtrarAnuncios() {
  const texto = searchInput.value.trim().toLowerCase();
  const estado = statusFilter.value;
  const tipo = typeFilter.value;

  const filtrados = anunciosData.filter(anuncio => {
    const direccionLower = (anuncio.Direccion || "").toLowerCase();
    const propietarioLower = (anuncio.Propietario || "").toLowerCase();

    const textoCoincide = direccionLower.includes(texto) || propietarioLower.includes(texto);

    let estadoCoincide = false;
    if (estado === "all") estadoCoincide = true;
    else if (estado === "Disponible" && anuncio.Disponibilidad === true) estadoCoincide = true;
    else if (estado === "No Disponible" && anuncio.Disponibilidad === false) estadoCoincide = true;

    let tipoCoincide = false;
    if (tipo === "all") tipoCoincide = true;
    else if (tipo === "departamento" && anuncio.Tipo === true) tipoCoincide = true;
    else if (tipo === "habitacion" && anuncio.Tipo === false) tipoCoincide = true;

    return textoCoincide && estadoCoincide && tipoCoincide;
  });

  actualizarEstadisticas(filtrados);
  mostrarAnuncios(filtrados);
}

// Mostrar modal detalle
async function abrirModalDetalle(id) {
  const anuncio = anunciosData.find(a => a.id === id);
  if (!anuncio) return alert("No se encontró la dirección");

  const modalTitle = document.getElementById("modalPropertyTitle");
  const modalContent = document.getElementById("modalPropertyContent");

  modalTitle.textContent = anuncio.Direccion || "Dirección sin definir";

  modalContent.innerHTML = `
    <p><strong>Tipo:</strong> ${anuncio.Tipo === true ? "departamento" : "habitación"}</p>
    <p><strong>Estado:</strong> ${anuncio.Disponibilidad ? "Disponible" : "No disponible"}</p>
    <p><strong>Fecha de publicación:</strong> ${anuncio.Publicacion ? new Date(anuncio.Publicacion.seconds * 1000).toLocaleDateString() : "N/A"}</p>
    <p><strong>Propietario:</strong> ${anuncio.propietario || "Desconocido"}</p>
    <p><strong>Descripción:</strong> ${anuncio.descripcion || "Sin descripción"}</p>

    <div class="mb-3">
      <strong>Comprobante de domicilio:</strong>
      ${anuncio.comprobanteUrl ? `<a href="${anuncio.comprobanteUrl}" target="_blank" class="btn btn-sm btn-primary ms-2"><i class="fas fa-file-alt me-1"></i> Ver comprobante</a>` : 'No disponible'}
    </div>

    <div class="d-flex gap-2 mt-4">
      <button id="btnAceptar" class="btn btn-success flex-fill"><i class="fa-solid fa-check"></i> Aceptar</button>
      <button id="btnRechazar" class="btn btn-danger flex-fill"><i class="fa-solid fa-xmark"></i> Rechazar</button>
    </div>
    <div id="rechazoMotivoContainer" class="mt-3 d-none">
      <textarea id="rechazoMotivo" class="form-control mb-2" placeholder="Escribe el motivo del rechazo"></textarea>
      <button id="btnEnviarRechazo" class="btn btn-warning">Enviar motivo</button>
    </div>
  `;

  const propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));
  propertyModal.show();

  // Lógica para botones aceptar/rechazar
  document.getElementById("btnAceptar").addEventListener("click", () => {
    alert("Aceptar anuncio (aquí va lógica de actualización)");
  });

  document.getElementById("btnRechazar").addEventListener("click", () => {
    document.getElementById("rechazoMotivoContainer").classList.remove("d-none");
  });

  document.getElementById("btnEnviarRechazo").addEventListener("click", () => {
    const motivo = document.getElementById("rechazoMotivo").value.trim();
    if (motivo === "") {
      alert("Escribe un motivo para rechazar.");
      return;
    }
    alert("Rechazado con motivo: " + motivo);
    // Aquí puedes guardar el motivo en Firestore si quieres.
  });
}

// Escuchas
searchInput.addEventListener("input", filtrarAnuncios);
statusFilter.addEventListener("change", filtrarAnuncios);
typeFilter.addEventListener("change", filtrarAnuncios);

// Control del sidebar
const sidebarCollapse = document.getElementById('sidebarCollapse');
const sidebar = document.getElementById('sidebar');

const menuItems = document.querySelectorAll('#sidebar ul li a');

// Inicializar al cargar DOM
window.addEventListener("DOMContentLoaded", () => {
  cargarAnuncios();

  if (sidebarCollapse && sidebar) {
    sidebarCollapse.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  menuItems.forEach(item => {
    if (item.getAttribute('href') === location.pathname) {
      item.parentElement.classList.add('active');
    }
  });
});
