import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

const gridContainer = document.querySelector(".property-grid");
const filterButtons = document.querySelectorAll(".filter-tag");
const sortDropdown = document.querySelector("#sortDropdown");
const sortTrigger = document.querySelector("#sortTrigger");
const searchBox = document.querySelector(".textholder");

let allProperties = [];
let currentSort = "recent";

// Instancia del modal Bootstrap
const editModalElement = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalElement);
const editForm = document.getElementById("editForm");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("❌ No hay usuario logeado.");
    return;
  }
  const correo = user.email.toLowerCase();
  console.log("🔑 Usuario logeado:", correo);

  const propietarioSnap = await getDocs(query(collection(db, "Propietario"), where("Correo", "==", correo)));
  if (propietarioSnap.empty) {
    console.log("❌ No se encontró propietario con este correo.");
    return;
  }

  const propietario = propietarioSnap.docs[0].data();
  const uid = propietario.UID;

  const anunciosSnap = await getDocs(query(collection(db, "Anuncio"), where("ID_Propietario", "==", uid)));
  allProperties = anunciosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  renderProperties();
});

function renderProperties() {
  let filtered = [...allProperties];

  // Filtrado
  const activeFilter = document.querySelector(".filter-tag.active")?.textContent || "Todos";
  if (activeFilter === "Rentado") {
    filtered = filtered.filter(p => p.Disponibilidad === false);
  } else if (activeFilter === "En renta") {
    filtered = filtered.filter(p => p.Disponibilidad === true);
  }

  // Búsqueda
  const searchText = searchBox.value.trim().toLowerCase();
  if (searchText) {
    filtered = filtered.filter(p => p.Titulo?.toLowerCase().includes(searchText));
  }

  // Ordenamiento
  const selectedSortOption = sortDropdown.querySelector(".sort-option.selected")?.dataset.value || currentSort;
  if (selectedSortOption === "recent") {
    filtered.sort((a, b) => (b.Publicacion?.seconds || 0) - (a.Publicacion?.seconds || 0));
  } else if (selectedSortOption === "price-asc") {
    filtered.sort((a, b) => (a.Precio || 0) - (b.Precio || 0));
  } else if (selectedSortOption === "price-desc") {
    filtered.sort((a, b) => (b.Precio || 0) - (a.Precio || 0));
  }

  gridContainer.innerHTML = "";

  if (filtered.length === 0) {
    gridContainer.innerHTML = "<p>No se encontraron propiedades.</p>";
    return;
  }

  filtered.forEach(p => {
    const tipoTexto = p.Tipo === true ? "Departamento" : "Habitación";
    const estadoTexto = p.Disponibilidad === false ? "Rentado" : "Disponible";
    let fechaTexto = "N/A";
    if (p.Publicacion?.toDate) fechaTexto = p.Publicacion.toDate().toLocaleDateString();

    const card = document.createElement("div");
    card.className = "property-card";
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="property-image">
        <img src="${p.URLImagen1 || "https://placehold.co/203x287"}" alt="Property">
      </div>
      <div class="property-info">
        <h3 class="property-status">${estadoTexto}</h3>
        <div class="property-detail">
          <span class="detail-label">Fecha:</span>
          <span class="detail-value">${fechaTexto}</span>
        </div>
        <div class="property-detail">
          <span class="detail-label">Tipo:</span>
          <span class="detail-value">${tipoTexto}</span>
        </div>
        <button class="edit-btn btn btn-sm btn-primary">Editar</button>
        <button class="status-btn btn btn-sm ${p.Disponibilidad ? "btn-success" : "btn-danger"}">${estadoTexto}</button>
      </div>`;

    gridContainer.appendChild(card);

    // Editar botón
    card.querySelector(".edit-btn").addEventListener("click", () => {
      openEditModal(p);
    });

    // Estado botón (disponible/rentado)
    card.querySelector(".status-btn").addEventListener("click", async () => {
      const newDisponibilidad = !p.Disponibilidad;
      try {
        await updateDoc(doc(db, "Anuncio", p.id), { Disponibilidad: newDisponibilidad });
        p.Disponibilidad = newDisponibilidad;
        renderProperties();
      } catch (err) {
        alert("Error al actualizar disponibilidad.");
        console.error(err);
      }
    });
  });
}

function openEditModal(property) {
  document.getElementById("editId").value = property.id;
  document.getElementById("editTitulo").value = property.Titulo || "";
  document.getElementById("editPrecio").value = property.Precio || "";
  document.getElementById("editTipo").value = String(property.Tipo);
  document.getElementById("editDisponibilidad").value = String(property.Disponibilidad);
  editModal.show();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  const titulo = document.getElementById("editTitulo").value.trim();
  const precio = Number(document.getElementById("editPrecio").value);
  const tipo = document.getElementById("editTipo").value === "true";
  const disponibilidad = document.getElementById("editDisponibilidad").value === "true";

  try {
    await updateDoc(doc(db, "Anuncio", id), {
      Titulo: titulo,
      Precio: precio,
      Tipo: tipo,
      Disponibilidad: disponibilidad,
    });

    const index = allProperties.findIndex(p => p.id === id);
    if (index !== -1) {
      allProperties[index].Titulo = titulo;
      allProperties[index].Precio = precio;
      allProperties[index].Tipo = tipo;
      allProperties[index].Disponibilidad = disponibilidad;
    }

    renderProperties();
    editModal.hide();
    alert("Propiedad actualizada correctamente.");
  } catch (error) {
    console.error("Error actualizando propiedad:", error);
    alert("Error al guardar cambios.");
  }
});

// Event listeners para filtros, orden y búsqueda (como ya tienes, solo recuerda invocar renderProperties)
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProperties();
  });
});

sortTrigger.addEventListener("click", () => {
  sortDropdown.classList.toggle("show");
});

sortDropdown.querySelectorAll(".sort-option").forEach(option => {
  option.addEventListener("click", () => {
    sortDropdown.querySelectorAll(".sort-option").forEach(opt => opt.classList.remove("selected"));
    option.classList.add("selected");
    currentSort = option.dataset.value;
    renderProperties();
    sortDropdown.classList.remove("show");
  });
});

searchBox.addEventListener("input", renderProperties);
