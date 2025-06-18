import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
const db = getFirestore(app);

const mapaZona = {
  "Zacatenco": "Zacatenco",
  "Milpa Alta": "Milpa Alta",
  "Casco Santo Tomás": "Santo Tomas",
  "Ticomán": "Ticoman",
  "Culhuacán": "Culhuacan",
  "Iztacalco": "Iztacalco"
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".domicilio-form");
  const unidadSelect = document.getElementById("unidad-academica");

  unidadSelect.innerHTML = Object.keys(mapaZona).map(
    (zona) => `<option value="${zona}">${zona}</option>`
  ).join("");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Debes iniciar sesión para continuar.");
      return;
    }

    const uid = auth.currentUser.uid;
    const unidadSeleccionada = unidadSelect.value;
    const calle = form.elements[0].value.trim();
    const noExt = form.elements[1].value.trim();
    const noInt = form.elements[2].value.trim();
    const cp = form.elements[3].value.trim();
    const ciudad = form.elements[4].value.trim();
    const municipio = form.elements[5].value.trim();
    const precio = form.elements[7].value.trim();

    const direccionCompleta = `${calle}, No. Ext ${noExt}${noInt ? ", No. Int " + noInt : ""}, C.P. ${cp}, ${ciudad}, ${municipio}`;
    const zona = mapaZona[unidadSeleccionada] || null;

    const anuncioData = {
      direccion: direccionCompleta,
      precio: precio,
      publicacion: new Date(),
      disponibilidad: true,
      zona: zona,
      ID_Propietario: uid,
    };

    try {
      const anunciosRef = collection(db, "Anuncio");
      const docRef = await addDoc(anunciosRef, anuncioData);
      console.log("Documento agregado con ID:", docRef.id);

      // Actualizar el documento con el campo idAnuncio igual al id del documento
      await updateDoc(doc(db, "Anuncio", docRef.id), {
        idAnuncio: docRef.id
      });
          // Guardar id del anuncio en localStorage para usarlo en la siguiente pantalla
        localStorage.setItem("idAnuncioActual", docRef.id);

      alert("Domicilio subido correctamente.");
      window.location.href = "/HTML/Registro6-2.html";s
    } catch (error) {
      console.error("Error al subir el domicilio:", error);
      alert("Error al subir el domicilio. Intenta de nuevo.");
    }


  });
});
