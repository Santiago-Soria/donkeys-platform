import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail
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

// Validaciones
function validarPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).+$/;
  return regex.test(password);
}

function validarCorreo(correo) {
  const regex = /^[^\s@]+@(alumno\.ipn\.mx|hotmail\.com|outlook\.com|yahoo\.com|gmail\.com)$/i;
  return regex.test(correo);
}

function validarTelefono(telefono) {
  const regex = /^\d{10}$/;
  return regex.test(telefono);
}

// Cargar unidades académicas
async function cargarUnidadesAcademicas() {
  const select = document.getElementById("unidadAcademicaSelect");
  if (!select) return;

  const snapshot = await getDocs(collection(db, "Unidad_Academica"));
  snapshot.forEach((doc) => {
    const data = doc.data();
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = data.nombre;
    select.appendChild(option);
  });
}
cargarUnidadesAcademicas();

const correoGuardado = localStorage.getItem("correoUsuario");
const desdeGoogle = localStorage.getItem("registroDesdeGoogle") === "true";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".register-form");
  if (!form) return;

  // Si viene de Google y es nuevo usuario, ocultar contraseñas y llenar correo
  if (desdeGoogle && correoGuardado) {
    const correoInput = document.getElementById("email");
    if (correoInput) {
      correoInput.value = correoGuardado;
      correoInput.disabled = true;
      correoInput.required = false;
    }

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");

    if (passwordInput) {
      passwordInput.closest(".form-group")?.classList.add("d-none");
      passwordInput.disabled = true;
      passwordInput.required = false;
    }

    if (confirmPasswordInput) {
      confirmPasswordInput.closest(".form-group")?.classList.add("d-none");
      confirmPasswordInput.disabled = true;
      confirmPasswordInput.required = false;
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre")?.value.trim();
    const apellidoP = document.getElementById("apellidos")?.value.trim().split(" ")[0] || "";
    const apellidoM = document.getElementById("apellidos")?.value.trim().split(" ")[1] || "";
    const correo = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirm_password")?.value;
    const Telefono = document.getElementById("Telefono")?.value;
    const unidad = document.getElementById("unidadAcademicaSelect")?.value || "N/A";

    if (!validarCorreo(correo)) {
      await Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "El correo debe ser válido y terminar en @alumno.ipn.mx, @hotmail.com, @outlook.com, @yahoo.com o @gmail.com"
      });
      return;
    }

    if (!desdeGoogle) {
      // Solo validar contraseñas si NO viene de Google
      if (password !== confirmPassword) {
        await Swal.fire({
          icon: "error",
          title: "Contraseñas no coinciden",
          text: "Las contraseñas no coinciden. Por favor, verifica."
        });
        return;
      }

      if (!validarPassword(password)) {
        await Swal.fire({
          icon: "error",
          title: "Contraseña insegura",
          text: "La contraseña debe contener al menos una mayúscula, minúscula, número, símbolo especial y no tener espacios."
        });
        return;
      }

      if (await correoExisteEnAuth(correo) || await correoExisteEnFirestore(correo)) {
        await Swal.fire({
          icon: "error",
          title: "Correo ya registrado",
          text: "El correo ya está registrado. Por favor utiliza otro."
        });
        return;
      }
    }

    try {
      let user;
      if (!desdeGoogle) {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
        user = userCredential.user;
      } else {
        user = auth.currentUser;
      }

      await addDoc(collection(db, "Estudiantes"), {
        UID: user.uid,
        Nombre: nombre,
        Apellido_P: apellidoP,
        Apellido_M: apellidoM,
        Correo: correo,
        Telefono: Telefono,
        ID_Unidad: unidad,
        fechaRegistro: serverTimestamp()
      });

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Estudiante registrado correctamente.",
        timer: 1800,
        showConfirmButton: false
      });
      form.reset();

      // Limpiar localStorage
      localStorage.removeItem("correoUsuario");
      localStorage.removeItem("registroDesdeGoogle");

      window.location.href = "Registro2.html";
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      await Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "Ocurrió un error al registrar: " + error.message
      });
    }
  });
});

async function correoExisteEnFirestore(correo) {
  const q = query(collection(db, "Estudiantes"), where("Correo", "==", correo), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

async function correoExisteEnAuth(correo) {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, correo);
    return methods.length > 0;
  } catch (error) {
    console.error("Error verificando correo en Auth:", error);
    return false;
  }
}
