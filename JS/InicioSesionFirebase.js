import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Tu configuración de Firebase
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
  // Agrega más correos de admin aquí
];

  // Iniciar sesión con correo y contraseña
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Inicio de sesión exitoso");
      localStorage.setItem("correoUsuario", email);
      if (correosAdmins.includes(email)) {
      // Redirige a admin
      window.location.href = "/HTML/administradorusuarios.html";
    } else {
      // Redirige a usuario normal
      window.location.href = "/HTML/Index.html";
    }
    } catch (error) {
      alert("❌ Correo o contraseña incorrectos");
      console.error(error);
    }
  });

  // Iniciar sesión con Google
  const googleBtn = document.querySelector(".google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert(`✅ Bienvenido ${user.displayName}`);
        localStorage.setItem("correoUsuario", user.email);
        window.location.href = "/HTML/Index.html";
      } catch (error) {
        console.error("Error en login con Google:", error);
        alert("❌ No se pudo iniciar sesión con Google");
      }
    });
  }
});
