import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpauU81ETkJBO6Zo7womi4fGBvy8ThpkQ",
  authDomain: "donkeys-cc454.firebaseapp.com",
  projectId: "donkeys-cc454",
  storageBucket: "donkeys-cc454.firebasestorage.app",
  messagingSenderId: "679976056227",
  appId: "1:679976056227:web:7c38245c3363a6f0735616",
  measurementId: "G-6PR3CRYVRE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const credencialInput = document.getElementById("credencial");
  const horarioInput = document.getElementById("horario");
  const submitBtn = document.querySelector(".submit-btn");

  const credencialUploadBox = document.getElementById("credencialUpload");
  const horarioUploadBox = document.getElementById("horarioUpload");

  // Función para actualizar estado del botón según archivos seleccionados
  function checkFiles() {
    if (credencialInput.files.length > 0 && horarioInput.files.length > 0) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Subir documentos";
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sube ambos documentos para continuar";
    }
  }

  // Abrir diálogo de selección al hacer click en la caja personalizada
  credencialUploadBox.addEventListener("click", () => credencialInput.click());
  horarioUploadBox.addEventListener("click", () => horarioInput.click());

  // Actualizar UI al cambiar archivos
  credencialInput.addEventListener("change", () => {
    if (credencialInput.files.length > 0) {
      credencialUploadBox.querySelector(".file-instructions").textContent =
        credencialInput.files[0].name;
    } else {
      credencialUploadBox.querySelector(".file-instructions").textContent =
        "Haz clic o arrastra tu credencial";
    }
    checkFiles();
  });

  horarioInput.addEventListener("change", () => {
    if (horarioInput.files.length > 0) {
      horarioUploadBox.querySelector(".file-instructions").textContent =
        horarioInput.files[0].name;
    } else {
      horarioUploadBox.querySelector(".file-instructions").textContent =
        "Haz clic o arrastra tu horario";
    }
    checkFiles();
  });

  // Subir archivos al hacer submit
  const form = document.querySelector(".verification-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (credencialInput.files.length === 0 || horarioInput.files.length === 0) {
      alert("Por favor sube ambos documentos.");
      return;
    }

    const credencialFile = credencialInput.files[0];
    const horarioFile = horarioInput.files[0];

    // Validar tamaño máximo 5MB
    const maxSize = 5 * 1024 * 1024;
    if (credencialFile.size > maxSize || horarioFile.size > maxSize) {
      alert("Cada archivo debe ser menor a 5MB.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Subiendo...";
      console.log("Iniciando subida de archivos...");

      // Usuario actual (o "anonimo" si no hay)
      const user = auth.currentUser;
      if (!user) {
        alert("Debes iniciar sesión para subir documentos.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Sube ambos documentos para continuar";
        return;
      }
      const email = user.email;
      const uid = user.uid;
      console.log("Usuario:", email, uid);

      // Crear referencias únicas con timestamp para evitar sobreescritura
      const credencialRef = ref(
        storage,
        `INE/${email}/${credencialFile.name}_${Date.now()}`
      );
      const horarioRef = ref(
        storage,
        `Horario/${email}/${horarioFile.name}_${Date.now()}`
      );

      // Subir archivos
      const credencialSnapshot = await uploadBytes(credencialRef, credencialFile);
      console.log("Credencial subida, snapshot:", credencialSnapshot);

      const urlCredencial = await getDownloadURL(credencialRef);
      console.log("URL Credencial:", urlCredencial);

      const horarioSnapshot = await uploadBytes(horarioRef, horarioFile);
      console.log("Horario subido, snapshot:", horarioSnapshot);

      const urlHorario = await getDownloadURL(horarioRef);
      console.log("URL Horario:", urlHorario);

      // Guardar en la colección "verificaciones" (registro general)
      const docRef = await addDoc(collection(db, "verificaciones"), {
        fecha: new Date(),
        email,
        urlCredencial,
        urlHorario,
        nombreCredencial: credencialFile.name,
        nombreHorario: horarioFile.name,
      });
      console.log("Documento Firestore creado con ID:", docRef.id);

      // Buscar documento en "estudiantes" por campo UID
      const estudiantesRef = collection(db, "estudiantes");
      const q = query(estudiantesRef, where("UID", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No existe, crear nuevo documento con URLs
        const newDocRef = await addDoc(estudiantesRef, {
          UID: uid,
          urlCredencial,
          urlHorario,
          fechaUltimaVerificacion: new Date(),
        });
        console.log("Documento creado en estudiantes con ID:", newDocRef.id);
      } else {
        // Existe, actualizar documento con URLs
        const docId = querySnapshot.docs[0].id;
        const docRefEstudiante = doc(db, "estudiantes", docId);
        await updateDoc(docRefEstudiante, {
          urlCredencial,
          urlHorario,
          fechaUltimaVerificacion: new Date(),
        });
        console.log("Documento actualizado en estudiantes con ID:", docId);
      }

      alert("Documentos subidos y datos guardados correctamente.");
      form.reset();
      credencialUploadBox.querySelector(".file-instructions").textContent =
        "Haz clic o arrastra tu credencial";
      horarioUploadBox.querySelector(".file-instructions").textContent =
        "Haz clic o arrastra tu horario";
      submitBtn.textContent = "Sube ambos documentos para continuar";
      submitBtn.disabled = true;
    } catch (error) {
      console.error("Error al subir archivos:", error);
      alert("Error al subir archivos: " + error.message);
      submitBtn.textContent = "Sube ambos documentos para continuar";
      submitBtn.disabled = false;
    }
  });
});
