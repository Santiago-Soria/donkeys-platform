import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Config Firebase (tu config aquí)
const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.appspot.com",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const cardPropietario = document.querySelector(".landlord-card");
  const btnAgregarPropiedad = document.getElementById("btnAgregarPropiedad");

  async function verificarYRedirigir() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Debes iniciar sesión como arrendador o crear una cuenta como arrendador para poner en renta.");
        window.location.href = "iniciosesion.html";
        return;
      }

      const uid = user.uid;

      try {
        // Verificar si es estudiante
        const estudiantesRef = collection(db, "Estudiantes");
        const qEstudiantes = query(estudiantesRef, where("UID", "==", uid));
        const snapEstudiantes = await getDocs(qEstudiantes);

        if (!snapEstudiantes.empty) {
          alert("Tu cuenta está registrada como estudiante. Debes crear una cuenta como arrendador o iniciar sesión como arrendador.");
          window.location.href = "iniciosesion.html";
          return;
        }

        // Verificar si es propietario
        const propietariosRef = collection(db, "Propietario");
        const qPropietarios = query(propietariosRef, where("UID", "==", uid));
        const snapPropietarios = await getDocs(qPropietarios);

        if (snapPropietarios.empty) {
          // No es propietario, enviarlo a registro propietario
          window.location.href = "Registro4.html";
          return;
        }

        // Verificar que los datos del propietario estén completos
        const dataProp = snapPropietarios.docs[0].data();
        const camposRequeridos = ["Calle", "CP", "Ciudad", "Municipio", "No_Exterior", "No_Interior", "Pais"];
        const datosCompletos = camposRequeridos.every(campo => dataProp[campo] && dataProp[campo].toString().trim() !== "");

        if (datosCompletos) {
          window.location.href = "Registro6.html"; // Página siguiente si está completo
        } else {
          window.location.href = "Registro4.html"; // Página de completar registro
        }

      } catch (error) {
        console.error("❌ Error al verificar usuario:", error);
        alert("Ocurrió un error. Intenta de nuevo más tarde.");
      }
    });
  }

  // Agregar listener a landlord-card si existe
  if (cardPropietario) {
    cardPropietario.style.cursor = "pointer";
    cardPropietario.addEventListener("click", verificarYRedirigir);
  }

  // Agregar listener a botón agregar propiedad si existe
  if (btnAgregarPropiedad) {
    btnAgregarPropiedad.style.cursor = "pointer";
    btnAgregarPropiedad.addEventListener("click", (e) => {
      e.preventDefault(); // evitar acción por defecto si es un enlace
      verificarYRedirigir();
    });
  }
});
