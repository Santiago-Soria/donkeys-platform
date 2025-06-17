import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias a elementos dropdown
const tipoDropdownBtn = document.getElementById("tipoDropdown");
const tipoDropdownItems = document.querySelectorAll("#tipoDropdown + ul.dropdown-menu a");

// Estado filtro tipo propiedad (true = departamento, false = habitacion, null = sin filtro)
let filtroTipoPropiedadBool = null;

// Escuchar clics en opciones del dropdown "Tipo"
tipoDropdownItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const textoSeleccionado = item.textContent.trim().toLowerCase();

    // Actualizar texto botón
    tipoDropdownBtn.querySelector("span").textContent = item.textContent.trim();

    // Mapear texto a booleano o null
    if (textoSeleccionado === "departamento") filtroTipoPropiedadBool = true;
    else if (textoSeleccionado === "habitación") filtroTipoPropiedadBool = false;
    else filtroTipoPropiedadBool = null;

    // Recargar anuncios con filtro actualizado
    cargarAnuncios();
  });
});

// Función para cargar anuncios desde Firestore y aplicar filtro
async function cargarAnuncios() {
  const contenedor = document.getElementById("contenedor-anuncios");
  console.log("Buscando contenedor 'contenedor-anuncios'...");
  if (!contenedor) {
    console.error("❌ Contenedor no encontrado para insertar anuncios.");
    return;
  }
  console.log("✅ Contenedor encontrado:", contenedor);

  try {
    const querySnapshot = await getDocs(collection(db, "Anuncio"));
    contenedor.innerHTML = ""; // Limpiar anuncios actuales

    let contador = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Validar que exista el campo Tipo y sea booleano o 0/1
      if (data.Tipo === undefined || data.Tipo === null) return;

      // Filtrar por tipo propiedad si hay filtro activo
      if (filtroTipoPropiedadBool !== null) {
        // data.Tipo puede ser booleano o número, normalizamos a booleano
        const tipoBool = Boolean(data.Tipo);
        if (tipoBool !== filtroTipoPropiedadBool) {
          return; // No coincide con filtro, saltar
        }
      }

      const precio = data.Precio ? data.Precio + "$" : "Sin precio";
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
          <div class="col-md-4 p-0">
            <div class="property-image"></div>
          </div>
          <div class="col-md-8 p-4">
            <div class="property-price">${precio}</div>
            <div class="property-title mt-3">
              ${titulo}<br>
              ${direccion}, ${zona}<br>
              Publicado el: ${publicacion}<br>
            </div>
            <div class="property-description">
              ${descripcion}
            </div>
          </div>
        </div>
      `;

      contenedor.appendChild(tarjeta);
      contador++;
    });

    // Mostrar contador de resultados
    const contadorResultados = document.querySelector(".results-count");
    if (contadorResultados) {
      contadorResultados.textContent = `${contador} resultados encontrados`;
    }

    const paginacion = document.querySelector(".property-count");
    if (paginacion) {
      paginacion.textContent = `${contador} propiedades encontradas`;
    }

  } catch (error) {
    console.error("❌ Error al cargar anuncios:", error);
  }
}

document.addEventListener("DOMContentLoaded", cargarAnuncios);
