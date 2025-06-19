import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
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
        alert("Debes iniciar sesión para colocar en renta una propiedad.");
        window.location.href = "/HTML/iniciosesion.html";
        return;
      }

      const uid = user.uid;
      const propietariosRef = collection(db, "Propietario");
      const q = query(propietariosRef, where("UID", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No hay documento para este UID, redirige a Registro4
        window.location.href = "/HTML/Registro4.html";
        return;
      }

      const docData = querySnapshot.docs[0].data();

      const camposNecesarios = ["Calle", "CP", "Ciudad", "Municipio", "No_Exterior", "No_Interior", "Pais"];
      const tieneTodos = camposNecesarios.every(campo => docData[campo] && docData[campo].toString().trim() !== "");

      if (tieneTodos) {
        window.location.href = "/HTML/Registro6.html";
      } else {
        window.location.href = "/HTML/Registro4.html";
      }
    });
  });
});
