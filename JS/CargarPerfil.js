import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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

// 🔍 Busca primero en Estudiantes y luego en Propietario
async function obtenerDatosUsuarioPorUID(uid) {
  // Intenta en Estudiantes
  const estudiantesCol = collection(db, "Estudiantes");
  const qEst = query(estudiantesCol, where("UID", "==", uid), limit(1));
  const snapEst = await getDocs(qEst);

  if (!snapEst.empty) {
    const data = snapEst.docs[0].data();
    console.log("✅ Usuario encontrado en Estudiantes:", data);
    return data;
  }

  // Si no está en Estudiantes, intenta en Propietario
  const propietariosCol = collection(db, "Propietario");
  const qProp = query(propietariosCol, where("UID", "==", uid), limit(1));
  const snapProp = await getDocs(qProp);

  if (!snapProp.empty) {
    const data = snapProp.docs[0].data();
    console.log("✅ Usuario encontrado en Propietario:", data);
    return data;
  }

  // No se encontró en ninguna colección
  console.warn("⚠️ No se encontró usuario con UID:", uid);
  return null;
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // 📧 Mostrar email si hay input con id="email"
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.value = user.email;

    // 🔍 Obtener datos desde Firestore
    const datos = await obtenerDatosUsuarioPorUID(user.uid);

    if (datos) {
      const telInput = document.getElementById('Telefono');
      if (telInput && datos.Telefono) telInput.value = datos.Telefono;

      const fechaInput = document.getElementById('fecha_nacimiento');
      if (fechaInput && datos.fechaNacimiento) fechaInput.value = datos.fechaNacimiento;
    }
  }
});
