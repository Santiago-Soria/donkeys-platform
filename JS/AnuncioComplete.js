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
    await Swal.fire({
      icon: "error",
      title: "Sin ID de anuncio",
      text: "No se proporcionó idAnuncio. Regresa e intenta de nuevo."
    });
    return;
  }

  try {
    const anuncioRef = doc(db, "Anuncio", idAnuncio);
    const anuncioSnap = await getDoc(anuncioRef);

    if (!anuncioSnap.exists()) {
      await Swal.fire({
        icon: "error",
        title: "No encontrado",
        text: "No se encontró el anuncio en Firestore."
      });
      return;
    }

    const data = anuncioSnap.data();
    console.log("✅ Datos del anuncio:", data);

    // Rellenar imágenes
    const container = document.querySelector(".row.g-3");
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const url = data[`URLImagen${i}`];
      if (url) {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3";
        col.innerHTML = `
          <div class="gallery-item" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="openModal('${url}')">
            <img src="${url}" alt="Imagen ${i}" class="img-fluid rounded">
          </div>`;
        container.appendChild(col);
      }
    }

    // Rellenar texto general y mapa
    document.querySelector(".property-title").textContent = data.Titulo || "Sin título";
    document.querySelector(".rent-price").textContent = `Renta $${data.Precio || "N/A"}`;
    document.querySelector(".description").textContent = data.Descripcion || "Sin descripción";
    document.querySelector(".address").textContent = data.Direccion || "Sin dirección";
    const direccionUrl = encodeURIComponent(data.Direccion || "");
    document.querySelector(".map-container iframe").src = `https://www.google.com/maps?q=$${direccionUrl}&output=embed`;

    // Cargar propietario y OBTENER TELÉFONO (VERSIÓN CORREGIDA)
    const idPropietario = data.ID_Propietario;
    console.log("🔎 ID_Propietario (UID) del anuncio:", idPropietario);

    if (!idPropietario) {
      await Swal.fire({
        icon: "warning",
        title: "Sin propietario",
        text: "No se encontró el propietario de este anuncio."
      });
      document.querySelector(".owner-name").textContent = "Arrendador: Desconocido";
    } else {
      const propietariosRef = collection(db, "Propietario");
      const q = query(propietariosRef, where("UID", "==", idPropietario));
      const querySnapshotPropietario = await getDocs(q);

      if (querySnapshotPropietario.empty) {
        await Swal.fire({
          icon: "warning",
          title: "Propietario no encontrado",
          text: "No se encontró el propietario con ese UID."
        });
        document.querySelector(".owner-name").textContent = "Arrendador: Desconocido";
      } else {
        querySnapshotPropietario.forEach((docProp) => {
          const pData = docProp.data();
          const nombreCompleto = `${pData.Nombre} ${pData.Apellido_P} ${pData.Apellido_M}`;
          const telefono = pData.Telefono;

          console.log("📞 Teléfono del arrendador obtenido:", telefono);
          document.querySelector(".owner-name").textContent = `Arrendador: ${nombreCompleto}`;

          // Guardamos el teléfono en el formulario para usarlo en resultados2.js
          const contactForm = document.getElementById('contactForm');
          if (contactForm && telefono) {
              contactForm.dataset.telefonoArrendador = telefono;
              console.log("✅ Teléfono guardado en el formulario.");
          } else {
              Swal.fire({
                icon: "warning",
                title: "Teléfono no disponible",
                text: "No se pudo guardar el teléfono del arrendador."
              });
          }
        });
      }
    }

    // Mostrar amenidades
    const amenidades = data.amenidades || [];
    const contenedorAmenidades = document.querySelector(".row.mt-4");
    contenedorAmenidades.innerHTML = "";
    amenidades.forEach(amenidad => {
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
    const serviciosSnap = await getDocs(collection(db, "Servicio"));
    let servicioEncontrado = false;
    serviciosSnap.forEach(servDoc => {
      const servData = servDoc.data();
      if (servData.idAnuncio && servData.idAnuncio.trim() === idAnuncio.trim()) {
        document.querySelector(".feature-text.dimensiones").textContent = `${servData.dimensiones || "?"} m² tot.`;
        document.querySelector(".feature-text.bano").textContent = `${servData.banos || "?"} baño(s)`;
        document.querySelector(".feature-text.estac").textContent = `${servData.estacionamiento || "?"} estac.`;
        document.querySelector(".feature-text.recamaras").textContent = `${servData.recamaras || "?"} rec.`;
        servicioEncontrado = true;
      }
    });

    if (!servicioEncontrado) {
      Swal.fire({
        icon: "info",
        title: "Sin servicios",
        text: "No se encontraron servicios para este anuncio."
      });
    }

  } catch (error) {
    console.error("❌ Error cargando detalles del anuncio:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al cargar los detalles del anuncio."
    });
  }
}

// Modal galería
window.openModal = function(url) {
  const img = document.getElementById("expandedImage");
  img.src = url;
  console.log("🖼️ Imagen expandida:", url);
};

document.addEventListener("DOMContentLoaded", cargarDetallesAnuncio);
