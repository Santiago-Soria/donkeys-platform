import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit
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

// Buscamos los contenedores con más precisión
const publicacionesContainer = document.querySelector("#content .container-fluid .row:nth-child(2) .col-lg-6:nth-child(1)");
const usuariosContainer = document.querySelector("#content .container-fluid .row:nth-child(2) .col-lg-6:nth-child(2)");

console.log("Contenedor publicaciones:", publicacionesContainer);
console.log("Contenedor usuarios:", usuariosContainer);

// Cargar últimas publicaciones
async function cargarUltimasPublicaciones() {
  try {
    const anunciosRef = collection(db, "Anuncio");
    const q = query(anunciosRef, orderBy("Publicacion", "desc"), limit(5)); // Cambio aquí
    const snapshot = await getDocs(q);

    if (!publicacionesContainer) {
      console.warn("❌ Contenedor de publicaciones no encontrado.");
      return;
    }

    publicacionesContainer.innerHTML = "";
    console.log("📦 Total anuncios encontrados:", snapshot.size);

    if (snapshot.empty) {
      publicacionesContainer.innerHTML = "<p class='text-muted'>No hay publicaciones recientes.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log("📢 Anuncio:", data);

      const tipoTexto = data.Tipo === true ? "Departamento" : data.Tipo === false ? "Cuarto" : "Sin tipo";
      const estadoTexto = data.Disponibilidad === true ? "Activo" : "Pendiente";

      const card = document.createElement("div");
      card.className = "card post-card mb-3";
      card.innerHTML = `
        <div class="card-body">
          <div class="row">
            <div class="col-3"><div class="user-avatar" style="background-image: url('${data.URLImagen1 || ""}'); background-size: cover;"></div></div>
            <div class="col-9">
              <h5 class="user-name">${data.Titulo || "Sin título"}</h5>
              <p class="post-price">$${data.Precio || "0"}</p>
              <p class="post-type">${tipoTexto}</p>
              <p class="post-location">${data.Zona || "Sin zona"}</p>
            </div>
          </div>
          <span class="badge ${estadoTexto === "Activo" ? "status-active" : "status-pending"}">${estadoTexto}</span>
        </div>
      `;
      publicacionesContainer.appendChild(card);
    });
  } catch (error) {
    console.error("❌ Error al cargar publicaciones:", error);
  }
}



// Cargar últimos usuarios
async function cargarUltimosUsuarios() {
  try {
    const estudiantesRef = collection(db, "Estudiantes");
    const propietariosRef = collection(db, "Propietario");

    const [estudiantesSnap, propietariosSnap] = await Promise.all([
      getDocs(estudiantesRef),
      getDocs(propietariosRef)
    ]);

    const usuarios = [];

    // Procesar estudiantes
    estudiantesSnap.forEach(doc => {
      const data = doc.data();
      const nombreCompleto = `${data.Nombre || ""} ${data.Apellido_P || ""} ${data.Apellido_M || ""}`.trim();
      usuarios.push({
        nombre: nombreCompleto,
        email: data.Correo || "Sin email",
        estado: data.Verificado ? "Activo" : "Pendiente",
        fechaRegistro: data.fechaRegistro,
        rol: "Estudiante"
      });
    });

    // Procesar propietarios
    propietariosSnap.forEach(doc => {
      const data = doc.data();
      usuarios.push({
        nombre: data.Nombre || "Sin nombre",
        email: data.Correo || "Sin email",
        estado: data.Verificado ? "Activo" : "Pendiente",
        fechaRegistro: data.fechaRegistro,
        rol: "Arrendador"
      });
    });

    console.log("👥 Usuarios combinados:", usuarios);

    usuarios.sort((a, b) => {
      const fechaA = a.fechaRegistro?.toDate?.() || new Date(0);
      const fechaB = b.fechaRegistro?.toDate?.() || new Date(0);
      return fechaB - fechaA;
    });

    const ultimos = usuarios.slice(0, 5);

    if (!usuariosContainer) {
      console.warn("❌ Contenedor de usuarios no encontrado.");
      return;
    }

    usuariosContainer.innerHTML = "";

    ultimos.forEach(data => {
      console.log("🧑 Usuario:", data);

      const card = document.createElement("div");
      card.className = "card user-card mb-3";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="user-name">${data.nombre}</h5>
          <p class="user-role">${data.rol}</p>
          <p class="user-email">${data.email}</p>
          <span class="badge ${data.estado === "Activo" ? "status-active" : "status-pending"}">${data.estado}</span>
        </div>
      `;
      usuariosContainer.appendChild(card);
    });
  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error);
  }
}
async function cargarContadores() {
  try {
    const estudiantesSnap = await getDocs(collection(db, "Estudiantes"));
    const propietariosSnap = await getDocs(collection(db, "Propietario"));
    const anunciosSnap = await getDocs(collection(db, "Anuncio"));

    // Total de usuarios
    const totalUsuarios = estudiantesSnap.size + propietariosSnap.size;

    // Usuarios activos y pendientes
    let usuariosActivos = 0;
    let usuariosPendientes = 0;

    estudiantesSnap.forEach(doc => {
      const data = doc.data();
      if (data.Verificado === true) {
        usuariosActivos++;
        console.log(`✅ ${data.Nombre} ${data.Apellido_P || ''} ${data.Apellido_M || ''} - Verificado`);
      } else {
        usuariosPendientes++;
        console.log(`⏳ ${data.Nombre} ${data.Apellido_P || ''} ${data.Apellido_M || ''} - Pendiente`);
      }
    });

    propietariosSnap.forEach(doc => {
      const data = doc.data();
      if (data.Verificado === true) {
        usuariosActivos++;
        console.log(`✅ ${data.Nombre} - Verificado`);
      } else {
        usuariosPendientes++;
        console.log(`⏳ ${data.Nombre} - Pendiente`);
      }
    });

    // Total publicaciones
    const totalPublicaciones = anunciosSnap.size;

    // Publicaciones pendientes (Disponibilidad !== true)
    let publicacionesPendientes = 0;
    anunciosSnap.forEach(doc => {
      if (doc.data().Disponibilidad !== true) publicacionesPendientes++;
    });

    // Pendientes totales = pendientes usuarios + pendientes publicaciones
    const pendientesTotales = usuariosPendientes + publicacionesPendientes;

    // Actualizar los contadores en la interfaz
    document.getElementById("totalUsuarios").textContent = totalUsuarios;
    document.getElementById("usuariosActivos").textContent = usuariosActivos;
    document.getElementById("totalPublicaciones").textContent = totalPublicaciones;

    // Aquí actualiza el contador de pendientes sumando ambos
    document.getElementById("pendientes").textContent = pendientesTotales;

  } catch (error) {
    console.error("❌ Error al cargar contadores:", error);
  }
}



// Ejecutar también
cargarContadores();



// Ejecutar
cargarUltimasPublicaciones();
cargarUltimosUsuarios();
