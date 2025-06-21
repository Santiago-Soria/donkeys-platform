import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase config
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
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos de la interfaz
const propiedadesCountEl = document.querySelector(".properties-count");
const statusEl = document.querySelector(".user-status");
const nombreEl = document.querySelector(".user-name");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.warn("❌ No hay usuario logeado.");
    if (propiedadesCountEl) propiedadesCountEl.textContent = "";
    if (statusEl) statusEl.textContent = "";
    if (nombreEl) nombreEl.textContent = "";
    return;
  }

  const correo = user.email.toLowerCase();
  console.log("👤 Usuario logeado:", correo);

  try {
    // === Buscar en Propietarios ===
    const propietarioQuery = query(
      collection(db, "Propietario"),
      where("Correo", "==", correo)
    );
    const propietarioSnap = await getDocs(propietarioQuery);

    if (!propietarioSnap.empty) {
      const propDoc = propietarioSnap.docs[0];
      const propData = propDoc.data();
      console.log("✅ Usuario es ARRRENDADOR:", propData);

      // Mostrar estado
      if (statusEl) {
        statusEl.textContent = propData.Verificado
          ? "Arrendador Verificado"
          : "Arrendador No verificado";
      }

      // Mostrar nombre completo
      const nombreCompleto = `${propData.Nombre || ""} ${propData.Apellido_P || ""} ${propData.Apellido_M || ""}`.trim();
      if (nombreEl) nombreEl.textContent = nombreCompleto;
      console.log("👤 Nombre mostrado (Propietario):", nombreCompleto);

      // Buscar TODOS sus anuncios
      const uidPropietario = propData.UID;
      const todosSusAnunciosQuery = query(
        collection(db, "Anuncio"),
        where("ID_Propietario", "==", uidPropietario)
      );
      const todosSusAnunciosSnap = await getDocs(todosSusAnunciosQuery);
      console.log(`🔍 Anuncios totales encontrados del usuario: ${todosSusAnunciosSnap.size}`);

      let cantidadRentados = 0;
      todosSusAnunciosSnap.forEach(doc => {
        const data = doc.data();
        const disponible = data.Disponibilidad === true;
        console.log(`📄 Anuncio: ${data.Titulo || "Sin título"} | Disponible: ${disponible}`);
        if (!disponible) cantidadRentados++;
      });

      console.log(`📦 Propiedades rentadas (Disponibilidad false): ${cantidadRentados}`);

      if (propiedadesCountEl) {
        propiedadesCountEl.textContent = `Actualmente está rentando: ${cantidadRentados} inmueble${cantidadRentados !== 1 ? "s" : ""}`;
      }

      return;
    }

    // === Buscar en Estudiantes ===
    const estudianteQuery = query(
      collection(db, "Estudiantes"),
      where("Correo", "==", correo)
    );
    const estudianteSnap = await getDocs(estudianteQuery);

    if (!estudianteSnap.empty) {
      const estDoc = estudianteSnap.docs[0];
      const estData = estDoc.data();
      console.log("👨‍🎓 Usuario es ESTUDIANTE:", estData);

      // Mostrar estado
      if (statusEl) {
        statusEl.textContent = estData.Verificado
          ? "Estudiante Verificado"
          : "Estudiante No verificado";
      }

      // Mostrar nombre completo
      const nombreCompleto = `${estData.Nombre || ""} ${estData.Apellido_P || ""} ${estData.Apellido_M || ""}`.trim();
      if (nombreEl) nombreEl.textContent = nombreCompleto;
      console.log("👤 Nombre mostrado (Estudiante):", nombreCompleto);

      if (propiedadesCountEl) propiedadesCountEl.textContent = ""; // Oculta propiedades
      return;
    }

    console.warn("❗ Usuario no encontrado en ninguna colección.");
    if (statusEl) statusEl.textContent = "Rol no identificado";
    if (propiedadesCountEl) propiedadesCountEl.textContent = "";
    if (nombreEl) nombreEl.textContent = "";

  } catch (error) {
    console.error("❌ Error al verificar datos del usuario:", error);
    if (statusEl) statusEl.textContent = "";
    if (propiedadesCountEl) propiedadesCountEl.textContent = "";
    if (nombreEl) nombreEl.textContent = "";
  }
});
