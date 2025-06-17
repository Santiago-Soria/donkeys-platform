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

// Dropdowns
const tipoDropdownBtn = document.getElementById("tipoDropdown");
const tipoDropdownItems = document.querySelectorAll("#tipoDropdown + ul.dropdown-menu a");

const ubicacionDropdownBtn = document.getElementById("ubicacionDropdown");
const ubicacionDropdownItems = document.querySelectorAll("#ubicacionDropdown + ul.dropdown-menu a");

const precioDropdownBtn = document.getElementById("precioDropdown");
const precioDropdownItems = document.querySelectorAll("#precioDropdown + .dropdown-menu .dropdown-item");

// Filtros
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

async function cargarAnuncios() {
  const contenedor = document.getElementById("contenedor-anuncios");
  if (!contenedor) return console.error("❌ No se encontró contenedor");

  contenedor.innerHTML = "";
  try {
    // Construir filtros
    let filtros = [];

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

    // Ejecutar query con filtros
    const ref = collection(db, "Anuncio");
    const q = filtros.length > 0 ? query(ref, ...filtros) : ref;
    const snapshot = await getDocs(q);

    let contador = 0;
    snapshot.forEach(doc => {
      const data = doc.data();

      const precio = data.Precio ? `${data.Precio}$` : "Sin precio";
      const direccion = data.Direccion || "Dirección no especificada";
      const descripcion = data.Descripcion || "Sin descripción";
      const titulo = data.Titulo || "Sin título";
      const zona = data.Zona || "";
      const publicacion = data.Publicacion ? data.Publicacion.toDate().toLocaleDateString() : "";

      const tarjeta = document.createElement("a");
      tarjeta.href = "/HTML/resultados2.html";
      tarjeta.className = "property-link";
      tarjeta.innerHTML = `
        <div class="row property-card mb-4">
          <div class="col-md-4 p-0"><div class="property-image"></div></div>
          <div class="col-md-8 p-4">
            <div class="property-price">${precio}</div>
            <div class="property-title mt-3">${titulo}<br>${direccion}, ${zona}<br>Publicado el: ${publicacion}</div>
            <div class="property-description">${descripcion}</div>
          </div>
        </div>`;

      contenedor.appendChild(tarjeta);
      contador++;
    });

    const contadorResultados = document.querySelector(".results-count");
    if (contadorResultados) contadorResultados.textContent = `${contador} resultados encontrados`;

    const paginacion = document.querySelector(".property-count");
    if (paginacion) paginacion.textContent = `${contador} propiedades encontradas`;

  } catch (error) {
    console.error("❌ Error al cargar anuncios:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarAnuncios);
