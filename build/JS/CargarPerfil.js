import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, limit } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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

async function obtenerDatosUsuarioPorUID(uid) {
  const usuariosCol = collection(db, "Estudiantes");
  const q = query(usuariosCol, where("UID", "==", uid), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data();
    console.log("Datos Firestore encontrados para UID:", uid, docData);
    return docData;
  } else {
    console.warn("No se encontró documento con UID:", uid);
    return null;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Poner email en input si existe
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.value = user.email;

    // Obtener datos de Firestore por UID
    const datos = await obtenerDatosUsuarioPorUID(user.uid);
    if (datos) {
      const telInput = document.getElementById('Telefono');
      if (telInput && datos.Telefono) telInput.value = datos.Telefono;

      const fechaInput = document.getElementById('fecha_nacimiento');
      if (fechaInput && datos.fechaNacimiento) fechaInput.value = datos.fechaNacimiento;
    }
  }
});
