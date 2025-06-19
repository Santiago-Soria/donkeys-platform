import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase config
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

  if (!cardPropietario) return;

  cardPropietario.style.cursor = "pointer";

  cardPropietario.addEventListener("click", () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Debes iniciar sesión como arrendador o crear una cuenta como arrendador para poner en renta.");
        window.location.href = "/HTML/iniciosesion.html";
        return;
      }

      const uid = user.uid;

      try {
        // Verificar si el UID está en Estudiante
        const estudianteRef = collection(db, "Estudiantes");
        const queryEstudiante = query(estudianteRef, where("UID", "==", uid));
        const snapshotEstudiante = await getDocs(queryEstudiante);

        if (!snapshotEstudiante.empty) {
          alert("Tu cuenta está registrada como estudiante. Debes crear una cuenta como arrendador o iniciar sesion como arrendador.");
          window.location.href = "/HTML/iniciosesion.html";
          return;
        }

        // Verificar si el UID está en Propietario
        const propietarioRef = collection(db, "Propietario");
        const queryProp = query(propietarioRef, where("UID", "==", uid));
        const snapshotProp = await getDocs(queryProp);

        if (snapshotProp.empty) {
          window.location.href = "/HTML/Registro4.html";
          return;
        }

        const data = snapshotProp.docs[0].data();
        const camposRequeridos = ["Calle", "CP", "Ciudad", "Municipio", "No_Exterior", "No_Interior", "Pais"];
        const completos = camposRequeridos.every(campo => data[campo] && data[campo].toString().trim() !== "");

        if (completos) {
          window.location.href = "/HTML/Registro6.html";
        } else {
          window.location.href = "/HTML/Registro4.html";
        }

      } catch (error) {
        console.error("❌ Error al verificar usuario:", error);
        alert("Ocurrió un error. Intenta de nuevo más tarde.");
      }
    });
  });
});
