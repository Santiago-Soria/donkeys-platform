import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM completamente cargado");

  const form = document.querySelector(".domicilio-form");
  if (!form) {
    console.error("❌ No se encontró el formulario .domicilio-form");
    return;
  }

  console.log("✅ Formulario encontrado");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📤 Se envió el formulario");

    // Obtener valores
    const calle = form.querySelector('input[name="calle"]').value.trim();
    const noExt = form.querySelector('input[name="noExt"]').value.trim();
    const noInt = form.querySelector('input[name="noInt"]').value.trim();
    const cp = form.querySelector('input[name="cp"]').value.trim();
    const ciudad = form.querySelector('input[name="ciudad"]').value.trim();
    const municipio = form.querySelector('input[name="municipio"]').value.trim();
    const pais = form.querySelector('input[name="pais"]').value.trim();

    console.log("📦 Datos capturados:", { calle, noExt, noInt, cp, ciudad, municipio, pais });

    // Validación básica
    if (!calle || !noExt || !cp || !ciudad || !municipio || !pais) {
      alert("⚠️ Por favor, completa todos los campos obligatorios.");
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("⚠️ Usuario no autenticado.");
        alert("⚠️ Usuario no autenticado.");
        return;
      }

      console.log("✅ Usuario autenticado:", user.email);

      try {
        const q = query(collection(db, "Estudiantes"), where("UID", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.warn("⚠️ No se encontraron datos del estudiante con UID:", user.uid);
          alert("⚠️ No se encontraron datos del estudiante.");
          return;
        }

        console.log(`📄 Se encontró el estudiante (${querySnapshot.size} documento):`, querySnapshot.docs[0].data());

        const estudianteDoc = querySnapshot.docs[0];
        const estudianteData = estudianteDoc.data();

        await addDoc(collection(db, "Propietario"), {
          ...estudianteData,
          Calle: calle,
          No_Exterior: noExt,
          No_Interior: noInt,
          CP: cp,
          Ciudad: ciudad,
          Municipio: municipio,
          Pais: pais,
          fechaRegistro: serverTimestamp()
        });

        console.log("✅ Domicilio guardado correctamente en Propietario");

        await deleteDoc(doc(db, "Estudiantes", estudianteDoc.id));
        console.log("🗑️ Documento del estudiante eliminado de Estudiantes");

        alert("✅ Datos de domicilio guardados y estudiante convertido en propietario.");
        window.location.href = "/HTML/Registro5.html";

      } catch (error) {
        console.error("❌ Error durante el proceso:", error);
        alert("❌ Error al guardar el domicilio: " + error.message);
      }
    });
  });
});
