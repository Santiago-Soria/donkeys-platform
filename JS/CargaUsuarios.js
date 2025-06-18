import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";


import {
  getAuth,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
const auth = getAuth(app);

// Elementos DOM
const usersTableBody = document.getElementById("usersTableBody");
const totalUsersEl = document.getElementById("totalUsers");
const studentUsersEl = document.getElementById("studentUsers");
const landlordUsersEl = document.getElementById("landlordUsers");
const unverifiedUsersEl = document.getElementById("unverifiedUsers");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const typeFilter = document.getElementById("typeFilter");

const modalUserName = document.getElementById("modalUserName");
const modalContent = document.getElementById("modalContent");

const rejectBtn = document.getElementById("rejectBtn");
const verifyBtn = document.getElementById("verifyBtn");
const rechazoMotivoContainer = document.getElementById("rechazoMotivoContainer");
const rechazoMotivoInput = document.getElementById("rechazoMotivo");
const btnEnviarMotivo = document.getElementById("btnEnviarMotivo");
const noResults = document.getElementById("noResults");

const sidebarCollapse = document.getElementById('sidebarCollapse');
const sidebar = document.getElementById('sidebar');

const menuItems = document.querySelectorAll('#sidebar ul li a');

// Variables para estado actual
let allUsers = [];
let currentUser = null; // usuario mostrado en modal
let currentUserCollection = ""; // "Estudiantes" o "Propietario"

// Modal Bootstrap
const bootstrapModal = new bootstrap.Modal(document.getElementById("documentModal"));

// --- Agregar botón borrar usuario al modal ---
const modalFooter = document.querySelector("#documentModal .modal-footer");
const deleteUserBtn = document.createElement("button");
deleteUserBtn.type = "button";
deleteUserBtn.className = "btn btn-danger ms-auto";
deleteUserBtn.innerHTML = '<i class="fas fa-trash me-1"></i>Borrar Usuario';
modalFooter.appendChild(deleteUserBtn);

// Función para cargar usuarios
async function cargarUsuarios() {
  try {
    const estudiantesCol = collection(db, "Estudiantes");
    const propietariosCol = collection(db, "Propietario");

    const [estudiantesSnapshot, propietariosSnapshot] = await Promise.all([
      getDocs(estudiantesCol),
      getDocs(propietariosCol),
    ]);

    allUsers = [];

    estudiantesSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const nombre = ((data.Nombre ?? "") + " " + (data.Apellido_P ?? "") + " " + (data.Apellido_M ?? "")).trim();
      allUsers.push({
        id: docSnap.id,
        nombreCompleto: nombre || "Sin nombre",
        telefono: data.Telefono || "Sin teléfono",
        verificado: data.Verificado === true,
        fechaRegistro: data.fechaRegistro ? (data.fechaRegistro.toDate ? data.fechaRegistro.toDate() : new Date(data.fechaRegistro)) : null,
        tipo: "Estudiante",
        documentos: data.Documentos || [],
        rawData: data,
        collection: "Estudiantes",
      });
    });

    propietariosSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const nombre = ((data.Nombre ?? "") + " " + (data.Apellido_P ?? "") + " " + (data.Apellido_M ?? "")).trim();
      allUsers.push({
        id: docSnap.id,
        nombreCompleto: nombre || "Sin nombre",
        telefono: data.Telefono || "Sin teléfono",
        verificado: data.Verificado === true,
        fechaRegistro: data.fechaRegistro ? (data.fechaRegistro.toDate ? data.fechaRegistro.toDate() : new Date(data.fechaRegistro)) : null,
        tipo: "Arrendador",
        documentos: data.Documentos || [],
        rawData: data,
        collection: "Propietario",
      });
    });

    filtrarYMostrarUsuarios();
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

async function cargarDocumentosVerificacion(correo) {
  try {
    console.log("Iniciando carga de documentos de verificación para correo:", correo);

    const verificacionesCol = collection(db, "verificaciones");
    const q = query(verificacionesCol, where("email", "==", correo));
    
    const snapshot = await getDocs(q);
    console.log("Cantidad de documentos encontrados:", snapshot.size);

    if (snapshot.empty) {
      console.log("No hay documentos en la colección 'verificaciones' para este correo.");
      const noDocs = document.createElement("p");
      noDocs.classList.add("text-muted");
      noDocs.textContent = "No hay documentos de verificación disponibles.";
      modalContent.appendChild(noDocs);
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      console.log("Campos del documento:", Object.keys(data));

      console.log("Documento verificación:", data);

      const docsDiv = document.createElement("div");
      docsDiv.classList.add("mt-3");
      docsDiv.innerHTML = `<h5>Documentos de verificación:</h5>`;

      if (data.urlCredencial) {
        console.log("URL Credencial:", data.urlcredencial);
        const credencialLink = document.createElement("a");
        credencialLink.href = data.urlCredencial;
        credencialLink.target = "_blank";
        credencialLink.textContent = "Ver Credencial";
        credencialLink.className = "d-block mb-1";
        docsDiv.appendChild(credencialLink);
      } else {
        console.log("No hay URL de credencial");
      }

      if (data.urlHorario) {
        console.log("URL Horario:", data.urlhorario);
        const horarioLink = document.createElement("a");
        horarioLink.href = data.urlHorario;
        horarioLink.target = "_blank";
        horarioLink.textContent = "Ver Horario";
        horarioLink.className = "d-block mb-1";
        docsDiv.appendChild(horarioLink);
      } else {
        console.log("No hay URL de horario");
      }

      modalContent.appendChild(docsDiv);
    });

  } catch (error) {
    console.error("Error al cargar documentos de verificación:", error);
    const errorText = document.createElement("p");
    errorText.classList.add("text-danger");
    errorText.textContent = "Error al cargar los documentos de verificación.";
    modalContent.appendChild(errorText);
  }
}

// Filtrar y mostrar usuarios
function filtrarYMostrarUsuarios() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const type = typeFilter.value;

  let filtered = allUsers.filter((user) => {
    if (!user.nombreCompleto.toLowerCase().includes(searchTerm)) return false;
    if (status === "verified" && !user.verificado) return false;
    if (status === "unverified" && user.verificado) return false;
    if (type === "student" && user.tipo !== "Estudiante") return false;
    if (type === "landlord" && user.tipo !== "Arrendador") return false;
    return true;
  });

  usersTableBody.innerHTML = "";

  filtered.forEach((user) => {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = user.nombreCompleto;
    tdNombre.title = `Teléfono: ${user.telefono}`;
    tr.appendChild(tdNombre);

    const tdTipo = document.createElement("td");
    tdTipo.textContent = user.tipo;
    tdTipo.classList.add(user.tipo === "Estudiante" ? "text-primary" : "text-success");
    tr.appendChild(tdTipo);

    const tdEstado = document.createElement("td");
    tdEstado.textContent = user.verificado ? "Verificado" : "Pendiente";
    tdEstado.classList.add(user.verificado ? "text-success" : "text-warning");
    tr.appendChild(tdEstado);

    const tdFecha = document.createElement("td");
    tdFecha.textContent = user.fechaRegistro ? user.fechaRegistro.toLocaleDateString() : "-";
    tr.appendChild(tdFecha);

    const tdAcciones = document.createElement("td");
    const btnVer = document.createElement("button");
    btnVer.textContent = "Ver detalles";
    btnVer.className = "btn btn-sm btn-primary";
    btnVer.addEventListener("click", () => abrirModalUsuario(user));
    tdAcciones.appendChild(btnVer);
    tr.appendChild(tdAcciones);

    usersTableBody.appendChild(tr);
  });

  totalUsersEl.textContent = filtered.length;
  studentUsersEl.textContent = filtered.filter((u) => u.tipo === "Estudiante").length;
  landlordUsersEl.textContent = filtered.filter((u) => u.tipo === "Arrendador").length;
  unverifiedUsersEl.textContent = filtered.filter((u) => !u.verificado).length;

  if (filtered.length === 0) {
    noResults.classList.remove("d-none");
  } else {
    noResults.classList.add("d-none");
  }
}

// Abrir modal usuario
async function abrirModalUsuario(user) {
  currentUser = user;
  currentUserCollection = user.collection;

  modalUserName.textContent = user.nombreCompleto;

  // Limpiar contenido previo
  modalContent.innerHTML = "";

  // Mostrar info básica
  const infoDiv = document.createElement("div");
  infoDiv.innerHTML = `
    <p><strong>Tipo:</strong> ${user.tipo}</p>
    <p><strong>Teléfono:</strong> ${user.telefono}</p>
    <p><strong>Estado:</strong> ${user.verificado ? "Verificado" : "Pendiente"}</p>
    <p><strong>Fecha de registro:</strong> ${user.fechaRegistro ? user.fechaRegistro.toLocaleDateString() : "-"}</p>
  `;
  modalContent.appendChild(infoDiv);

  // Mostrar documentos (simulado)
  if (user.documentos.length > 0) {
    const docsDiv = document.createElement("div");
    docsDiv.classList.add("mt-3");
    docsDiv.innerHTML = `<h5>Documentos:</h5>`;
    user.documentos.forEach((doc, i) => {
      const docLink = document.createElement("a");
      docLink.href = doc.url || "#";
      docLink.target = "_blank";
      docLink.textContent = doc.nombre || `Documento ${i + 1}`;
      docLink.className = "d-block mb-1";
      docsDiv.appendChild(docLink);
    });
    modalContent.appendChild(docsDiv);
  } else {
    const noDocs = document.createElement("p");
    noDocs.classList.add("text-muted");
    noDocs.textContent = "No hay documentos para mostrar.";
    modalContent.appendChild(noDocs);
  }

  // Ocultar motivo rechazo y limpiar textarea
  rechazoMotivoContainer.classList.add("d-none");
  rechazoMotivoInput.value = "";

  await cargarDocumentosVerificacion(user.rawData.Correo);
  bootstrapModal.show();
}

// Botón rechazar usuario
rejectBtn.addEventListener("click", () => {
  rechazoMotivoContainer.classList.remove("d-none");
  rechazoMotivoInput.focus();
});

// Enviar motivo rechazo
btnEnviarMotivo.addEventListener("click", async () => {
  const motivo = rechazoMotivoInput.value.trim();
  if (!motivo) {
    alert("Por favor escribe un motivo para el rechazo.");
    rechazoMotivoInput.focus();
    return;
  }

  if (!currentUser) return;

  try {
    const userDocRef = doc(db, currentUserCollection, currentUser.id);
    await updateDoc(userDocRef, {
      Verificado: false,
      MotivoRechazo: motivo,
    });

    alert("Usuario rechazado correctamente.");
    bootstrapModal.hide();
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al rechazar usuario:", error);
    alert("Error al rechazar usuario, intenta de nuevo.");
  }
});

// Botón verificar usuario
verifyBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  try {
    const userDocRef = doc(db, currentUserCollection, currentUser.id);
    await updateDoc(userDocRef, {
      Verificado: true,
      MotivoRechazo: "",
    });

    alert("Usuario verificado correctamente.");
    bootstrapModal.hide();
    await cargarUsuarios();
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    alert("Error al verificar usuario, intenta de nuevo.");
  }
});

// Botón borrar usuario (Firestore + Auth)
deleteUserBtn.addEventListener("click", async () => {
  if (!currentUser) return alert("No hay usuario seleccionado.");

  const confirmado = confirm(`¿Seguro que deseas borrar al usuario "${currentUser.nombreCompleto}"? Esta acción es irreversible.`);
  if (!confirmado) return;

  try {
    // Eliminar documento Firestore
    const userDocRef = doc(db, currentUserCollection, currentUser.id);
    await deleteDoc(userDocRef);

    // Obtener UID Auth guardado en Firestore
    const authUid = currentUser.rawData.authUid || currentUser.rawData.UID;
    if (!authUid) {
      alert("No se encontró UID de autenticación para este usuario, solo se borró el documento Firestore.");
      bootstrapModal.hide();
      await cargarUsuarios();
      return;
    }

    // Usuario autenticado actual
    const usuarioActual = auth.currentUser;

    if (usuarioActual && usuarioActual.uid === authUid) {
      // Borrar usuario de Firebase Auth (solo si es el mismo usuario logueado)
      await deleteUser(usuarioActual);
      alert("Usuario borrado correctamente de Firestore y Auth.");
    } else {
      alert("Documento Firestore borrado. Para borrar el usuario de Auth debes iniciar sesión con ese usuario o usar un backend con Admin SDK.");
    }

    bootstrapModal.hide();
    await cargarUsuarios();

  } catch (error) {
    console.error("Error al borrar usuario:", error);
    alert("Error al borrar usuario, revisa la consola.");
  }
});

// Filtros y búsqueda
searchInput.addEventListener("input", filtrarYMostrarUsuarios);
statusFilter.addEventListener("change", filtrarYMostrarUsuarios);
typeFilter.addEventListener("change", filtrarYMostrarUsuarios);

// Función para toggle sidebar
function toggleSidebar() {
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// Al cargar DOM
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();

  // Listener botón toggle sidebar
  if (sidebarCollapse && sidebar) {
    sidebarCollapse.addEventListener('click', toggleSidebar);
  }

  // Resaltar item activo menú sidebar
  menuItems.forEach(item => {
    if (item.getAttribute('href') === location.pathname) {
      item.parentElement.classList.add('active');
    }
  });
});
