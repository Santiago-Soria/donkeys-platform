import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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

const navBar = document.querySelector('.navbar-nav.ms-auto');

// Crear elementos para usuario y botón salir
const userItem = document.createElement('li');
userItem.classList.add('nav-item', 'mx-2');
const logoutItem = document.createElement('li');
logoutItem.classList.add('nav-item', 'mx-2');

const userSpan = document.createElement('a');
userSpan.classList.add('nav-link', 'text-white', 'fs-5', 'text-decoration-underline');
userSpan.href = '/HTML/EditPerfilArren.html';
userSpan.style.cursor = 'default';


const logoutBtn = document.createElement('a');
logoutBtn.classList.add('nav-link', 'text-white', 'fs-5', 'border', 'border-white', 'px-3', 'py-1', 'rounded');
logoutBtn.href = '#';
logoutBtn.textContent = 'Salir';

userItem.appendChild(userSpan);
logoutItem.appendChild(logoutBtn);

// Función para mostrar UI según estado de sesión
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Hay sesión activa
    // Ocultar el link "Iniciar Sesión"
    const loginLink = navBar.querySelector('a[href="/HTML/iniciosesion.html"]');
    if (loginLink) {
      loginLink.parentElement.style.display = 'none';
    }

    // Mostrar correo y botón salir si no están ya en el nav
    if (!navBar.contains(userItem)) {
      userSpan.textContent = user.email;
      navBar.appendChild(userItem);
      navBar.appendChild(logoutItem);
    }
  } else {
    // No hay sesión activa
    // Mostrar el link "Iniciar Sesión"
    const loginLink = navBar.querySelector('a[href="/HTML/iniciosesion.html"]');
    if (loginLink) {
      loginLink.parentElement.style.display = 'block';
    }

    // Quitar los elementos de usuario y salir si existen
    if (navBar.contains(userItem)) {
      navBar.removeChild(userItem);
    }
    if (navBar.contains(logoutItem)) {
      navBar.removeChild(logoutItem);
    }
  }
});

// Logout al dar click
logoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    alert('Sesión cerrada correctamente.');
    window.location.reload();
  } catch (error) {
    alert('Error al cerrar sesión.');
    console.error(error);
  }
});
