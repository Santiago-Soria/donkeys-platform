import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Configuración Firebase
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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password i");

  // Mostrar/ocultar contraseña
  document.querySelector(".toggle-password").addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.classList.remove("fa-eye");
      togglePassword.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      togglePassword.classList.remove("fa-eye-slash");
      togglePassword.classList.add("fa-eye");
    }
  });

  const correosAdmins = [
    "eduardomp1708@hotmail.com",
    "palaciosroblesd@gmail.com",
    "erck.fran@gmail.com",
    "sant.soria.26ss@gmail.com"
  ];

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Inicio de sesión exitoso");
      localStorage.setItem("correoUsuario", email);

      if (correosAdmins.includes(email)) {
        window.location.href = "administradorusuarios.html";
      } else {
        window.location.href = "/index.html";
      }
    } catch (error) {
      alert("❌ Correo o contraseña incorrectos");
      console.error(error);
    }
  });

  const googleBtn = document.querySelector(".google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;

        alert(`✅ Bienvenido ${user.displayName}`);
        localStorage.setItem("correoUsuario", email);

        // Verificar si ya está en Firestore
        const q = query(
          collection(db, "Estudiantes"),
          where("Correo", "==", email),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Usuario ya registrado → ir a index
          window.location.href = "/index.html";
        } else {
          // Usuario nuevo → ir a registro, ocultar contraseña
          localStorage.setItem("registroDesdeGoogle", "true");
          window.location.href = "Registro.html";
        }
      } catch (error) {
        console.error("Error en login con Google:", error);
        alert("❌ No se pudo iniciar sesión con Google");
      }
    });
  }
});
