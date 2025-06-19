import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Configura Firebase
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

// Obtener el id del anuncio seleccionado
const idAnuncio = localStorage.getItem("idAnuncio");
console.log("📌 ID del anuncio obtenido del localStorage:", idAnuncio);

async function cargarDetallesAnuncio() {
  if (!idAnuncio) {
    console.error("❌ No se proporcionó idAnuncio");
    return;
  }

  try {
    const anuncioRef = doc(db, "Anuncio", idAnuncio);
    const anuncioSnap = await getDoc(anuncioRef);

    if (!anuncioSnap.exists()) {
      console.error("❌ No se encontró el anuncio en Firestore");
      return;
    }

    const data = anuncioSnap.data();
    console.log("✅ Datos del anuncio:", data);

    // Rellenar imágenes
    const container = document.querySelector(".row.g-3");
    container.innerHTML = ""; // Limpiar imágenes previas

    for (let i = 1; i <= 5; i++) {
      const url = data[`URLImagen${i}`];
      if (url) {
        console.log(`🖼️ Imagen ${i}:`, url);
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3";
        col.innerHTML = `
          <div class="gallery-item" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="openModal('${url}')">
            <img src="${url}" alt="Imagen ${i}" class="img-fluid rounded">
          </div>`;
        container.appendChild(col);
      }
    }

    // Rellenar texto general
    document.querySelector(".property-title").textContent = data.Titulo || "Sin título";
    document.querySelector(".rent-price").textContent = `Renta $${data.Precio || "N/A"}`;
    document.querySelector(".description").textContent = data.Descripcion || "Sin descripción";
    document.querySelector(".address").textContent = data.Direccion || "Sin dirección";

    console.log("📋 Título:", data.Titulo);
    console.log("💲 Precio:", data.Precio);
    console.log("📍 Dirección:", data.Direccion);
    console.log("📝 Descripción:", data.Descripcion);

    // Actualizar mapa con la dirección
    const direccionUrl = encodeURIComponent(data.Direccion || "");
    const urlMapa = `https://www.google.com/maps?q=${direccionUrl}&output=embed`;
    const iframeMapa = document.querySelector(".map-container iframe");
    iframeMapa.src = urlMapa;

    // Cargar propietario buscando en Propietario donde UID == ID_Propietario
    const idPropietario = data.ID_Propietario; // O el campo exacto que tengas para UID
    console.log("🔎 ID_Propietario (UID) del anuncio:", idPropietario);

    if (!idPropietario) {
      console.warn("⚠️ No se encontró ID_Propietario en el anuncio");
      document.querySelector(".owner-name").textContent = "Arrendador: Desconocido";
    } else {
      const propietariosRef = collection(db, "Propietario");
      const q = query(propietariosRef, where("UID", "==", idPropietario));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("⚠️ No se encontró propietario con ese UID");
        document.querySelector(".owner-name").textContent = "Arrendador: Desconocido";
      } else {
        querySnapshot.forEach((docProp) => {
          const pData = docProp.data();
          const nombreCompleto = `${pData.Nombre} ${pData.Apellido_P} ${pData.Apellido_M}`;
          document.querySelector(".owner-name").textContent = `Arrendador: ${nombreCompleto}`;
        });
      }
    }

    // Mostrar amenidades
    const amenidades = data.amenidades || [];
    console.log("📦 Amenidades:", amenidades);

    const contenedorAmenidades = document.querySelector(".row.mt-4");
    contenedorAmenidades.innerHTML = "";

    amenidades.forEach(amenidad => {
      console.log("➕ Amenidad:", amenidad);
      const col = document.createElement("div");
      col.className = "col-6 mb-3";
      col.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="fa-solid fa-check amenity-icon me-2"></i>
          <p class="amenity-text">${amenidad}</p>
        </div>`;
      contenedorAmenidades.appendChild(col);
    });

    // Cargar datos de servicios
    console.log("🔍 Buscando coincidencias en la colección Servicio...");
    const serviciosSnap = await getDocs(collection(db, "Servicio"));
    let servicioEncontrado = false;

    serviciosSnap.forEach(servDoc => {
      const servData = servDoc.data();
      console.log("📄 Documento Servicio:", servData);

      if (servData.idAnuncio && servData.idAnuncio.trim() === idAnuncio.trim()) {
        console.log("✅ Coincidencia de servicio encontrada para el anuncio");

        document.querySelector(".feature-text.dimensiones").textContent = `${servData.dimensiones || "?"} m² tot.`;
        document.querySelector(".feature-text.bano").textContent = `${servData.banos || "?"} baño(s)`;
        document.querySelector(".feature-text.estac").textContent = `${servData.estacionamiento || "?"} estac.`;
        document.querySelector(".feature-text.recamaras").textContent = `${servData.recamaras || "?"} rec.`;
        document.querySelector(".feature-text.anios").textContent = `${servData.anios || "?"} años`;

        servicioEncontrado = true;
      }
    });

    if (!servicioEncontrado) {
      console.warn("⚠️ No se encontraron servicios con ese idAnuncio");
    }

  } catch (error) {
    console.error("❌ Error cargando detalles del anuncio:", error);
  }
}

// Modal galería
window.openModal = function(url) {
  const img = document.getElementById("expandedImage");
  img.src = url;
  console.log("🖼️ Imagen expandida:", url);
};

document.addEventListener("DOMContentLoaded", cargarDetallesAnuncio);
