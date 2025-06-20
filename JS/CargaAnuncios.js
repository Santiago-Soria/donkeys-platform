import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Config Firebase
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

// Mapeos
const mapaZona = {
  "Zacatenco": "Zacatenco",
  "Milpa Alta": "Milpa Alta",
  "Casco Santo Tomás": "Santo Tomas",
  "Ticomán": "Ticoman",
  "Culhuacán": "Culhuacan",
  "Iztacalco": "Iztacalco"
};

const mapaPrecio = {
  "Menos de $2,500": { min: 0, max: 2499 },
  "$2,500 - $3,500": { min: 2500, max: 3500 },
  "Más de $3,500": { min: 3501, max: Infinity }
};

// Estado de filtros
let filtroTipoPropiedadBool = null;
let filtroZona = null;
let filtroPrecioMin = null;
let filtroPrecioMax = null;

// Variable global para guardar anuncios ya cargados
let anunciosCache = [];

// Dropdowns y filtros
const tipoDropdownBtn = document.getElementById("tipoDropdown");
const tipoDropdownItems = document.querySelectorAll("#tipoDropdown + ul.dropdown-menu a");

const ubicacionDropdownBtn = document.getElementById("ubicacionDropdown");
const ubicacionDropdownItems = document.querySelectorAll("#ubicacionDropdown + ul.dropdown-menu a");

const precioDropdownBtn = document.getElementById("precioDropdown");
const precioDropdownItems = document.querySelectorAll("#precioDropdown + .dropdown-menu .dropdown-item");

const ordenDropdownBtn = document.getElementById("sortDropdown");
const ordenDropdownItems = document.querySelectorAll('ul[aria-labelledby="sortDropdown"] a');

// Eventos filtros (cambian filtro y recargan)
tipoDropdownItems.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const txt = item.textContent.trim().toLowerCase();
    tipoDropdownBtn.querySelector("span").textContent = item.textContent.trim();
    filtroTipoPropiedadBool = txt === "departamento" ? true : (txt === "habitación" ? false : null);
    cargarAnuncios();
  });
});

ubicacionDropdownItems.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const txt = item.textContent.trim();
    ubicacionDropdownBtn.querySelector("span").textContent = txt;
    filtroZona = mapaZona[txt] || null;
    cargarAnuncios();
  });
});

precioDropdownItems.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    const txt = item.textContent.trim();
    precioDropdownBtn.querySelector("span").textContent = txt;
    const rango = mapaPrecio[txt];
    filtroPrecioMin = rango?.min ?? null;
    filtroPrecioMax = rango?.max ?? null;
    cargarAnuncios();
  });
});

ordenDropdownItems.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    ordenDropdownBtn.querySelector("span.sort-label").textContent = item.textContent.trim();
    const tipoOrden = item.getAttribute("data-sort");
    ordenarAnuncios(tipoOrden);
  });
});

// Función que carga anuncios de Firebase y guarda en cache, aplicando filtros
async function cargarAnuncios() {
  try {
    let filtros = [];
    // Siempre filtrar solo anuncios con Disponibilidad == true
    filtros.push(where("Disponibilidad", "==", true));

    if (filtroTipoPropiedadBool !== null) {
      filtros.push(where("Tipo", "==", filtroTipoPropiedadBool));
    }

    if (filtroZona !== null) {
      filtros.push(where("Zona", "==", filtroZona));
    }

    if (filtroPrecioMin !== null && filtroPrecioMax !== null) {
      filtros.push(where("Precio", ">=", filtroPrecioMin));
      filtros.push(where("Precio", "<=", filtroPrecioMax));
    }

    const ref = collection(db, "Anuncio");
    const q = filtros.length > 0 ? query(ref, ...filtros) : ref;
    const snapshot = await getDocs(q);

    console.log("📥 Documentos obtenidos:", snapshot.size);
    anunciosCache = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      console.log(`📄 Anuncio ID: ${docSnap.id}`, data);
      anunciosCache.push({ id: docSnap.id, ...data });
    });

    // Filtrado extra por seguridad (en caso de datos inconsistentes)
    anunciosCache = anunciosCache.filter(anuncio => anuncio.Disponibilidad === true);

    renderizarAnuncios(anunciosCache);

  } catch (error) {
    console.error("❌ Error al cargar anuncios:", error);
  }
}



// Función para pintar anuncios en el DOM
function renderizarAnuncios(anuncios) {
  const contenedor = document.getElementById("contenedor-anuncios");
  if (!contenedor) return console.error("❌ No se encontró contenedor");

  contenedor.innerHTML = "";

  console.log(`🖼️ Renderizando ${anuncios.length} anuncios`);

  anuncios.forEach(data => {
    const precio = data.Precio ? `${data.Precio}$` : "Sin precio";
    const direccion = data.Direccion || "Dirección no especificada";
    const descripcion = data.Descripcion || "Sin descripción";
    const titulo = data.Titulo || "Sin título";
    const zona = data.Zona || "";
    const publicacion = data.Publicacion ? data.Publicacion.toDate().toLocaleDateString() : "";
    const urlImagen = data.URLImagen1 || "/Imagenes/default-placeholder.png"; // Fallback si no hay imagen

    const tarjeta = document.createElement("a");
    tarjeta.href = "/HTML/resultados2.html";
    tarjeta.addEventListener("click", () => {
  localStorage.setItem("idAnuncio", data.id); // <-- Guarda el ID del anuncio
});
    tarjeta.className = "property-link";
    tarjeta.innerHTML = `
      <div class="row property-card mb-4">
        <div class="col-md-4 p-0">
          <div class="property-image" style="background-image: url('${urlImagen}'); background-size: cover; background-position: center; height: 100%;"></div>
        </div>
        <div class="col-md-8 p-4">
          <div class="property-price">${precio}</div>
          <div class="property-title mt-3">${titulo}<br>${direccion}, ${zona}<br>Publicado el: ${publicacion}</div>
          <div class="property-description">${descripcion}</div>
        </div>
      </div>`;

    contenedor.appendChild(tarjeta);
  });

  const contadorResultados = document.querySelector(".results-count");
  if (contadorResultados) contadorResultados.textContent = `${anuncios.length} resultados encontrados`;

  const paginacion = document.querySelector(".property-count");
  if (paginacion) paginacion.textContent = `${anuncios.length} propiedades encontradas`;
}



// Función para ordenar la cache y renderizar según criterio
function ordenarAnuncios(tipoOrden) {
  if (anunciosCache.length === 0) return;

  let sorted = [...anunciosCache];

  switch (tipoOrden) {
    case "precio-asc":
      sorted.sort((a, b) => (a.Precio || 0) - (b.Precio || 0));
      break;
    case "precio-desc":
      sorted.sort((a, b) => (b.Precio || 0) - (a.Precio || 0));
      break;
    case "fecha-asc":
      sorted.sort((a, b) => {
        const fechaA = a.Publicacion ? a.Publicacion.toDate() : new Date(0);
        const fechaB = b.Publicacion ? b.Publicacion.toDate() : new Date(0);
        return fechaA - fechaB;
      });
      break;
    case "fecha-desc":
      sorted.sort((a, b) => {
        const fechaA = a.Publicacion ? a.Publicacion.toDate() : new Date(0);
        const fechaB = b.Publicacion ? b.Publicacion.toDate() : new Date(0);
        return fechaB - fechaA;
      });
      break;
    default:
      break;
  }

  renderizarAnuncios(sorted);
}

// Al cargar la página, leer filtros guardados en localStorage y cargar anuncios
document.addEventListener("DOMContentLoaded", () => {
  // Leer filtros guardados en localStorage
  const filtroTipo = localStorage.getItem("filtroTipo");        // Ej: "Departamento" o "Habitación"
  const filtroZonaLS = localStorage.getItem("filtroZona");      // Ej: "Zacatenco"
  const filtroPresupuesto = localStorage.getItem("filtroPresupuesto"); // Ej: "Menos de $2,500"

  // Mapear tipo
  if (filtroTipo) {
    const tipoLower = filtroTipo.toLowerCase();
    if (tipoLower === "departamento") filtroTipoPropiedadBool = true;
    else if (tipoLower === "habitación") filtroTipoPropiedadBool = false;
    else filtroTipoPropiedadBool = null;

    // Actualizar texto dropdown
    if (tipoDropdownBtn) tipoDropdownBtn.querySelector("span").textContent = filtroTipo;
  }

  // Mapear zona
  if (filtroZonaLS) {
    filtroZona = mapaZona[filtroZonaLS] || null;

    // Actualizar texto dropdown
    if (ubicacionDropdownBtn) ubicacionDropdownBtn.querySelector("span").textContent = filtroZonaLS;
  }

  // Mapear presupuesto
  if (filtroPresupuesto) {
    const rango = mapaPrecio[filtroPresupuesto];
    filtroPrecioMin = rango?.min ?? null;
    filtroPrecioMax = rango?.max ?? null;

    // Actualizar texto dropdown
    if (precioDropdownBtn) precioDropdownBtn.querySelector("span").textContent = filtroPresupuesto;
  }

  // Cargar anuncios con los filtros ya asignados
  cargarAnuncios();
});
