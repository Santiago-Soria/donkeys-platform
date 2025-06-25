import { getAuth, updatePassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Obtener referencia al formulario
const form = document.querySelector('.edit-profile-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');

// Escuchar el envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevaContrasena = passwordInput.value.trim();
  const confirmarContrasena = confirmPasswordInput.value.trim();

  // Si el usuario ingresó contraseñas (no están vacías)
  if (nuevaContrasena || confirmarContrasena) {

    // Validar coincidencia
    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Por favor, asegúrate de que ambas contraseñas sean iguales."
      });
      return;
    }

    // Validar seguridad de contraseña
    const esSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(nuevaContrasena);
    if (!esSegura) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña insegura",
        text: "La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo."
      });
      return;
    }

    try {
      const auth = getAuth();
      const usuario = auth.currentUser;

      if (usuario) {
        await updatePassword(usuario, nuevaContrasena);
        await Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "Contraseña actualizada exitosamente."
        });
        passwordInput.value = '';
        confirmPasswordInput.value = '';
      } else {
        Swal.fire({
          icon: "error",
          title: "No autenticado",
          text: "No hay usuario autenticado."
        });
      }

    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Swal.fire({
          icon: "info",
          title: "Reautenticación requerida",
          text: "Por seguridad, vuelve a iniciar sesión para cambiar tu contraseña."
        });
        // window.location.href = "/HTML/login.html";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Error al actualizar la contraseña: " + error.message
        });
      }
    }

  } else {
    // Si no cambió contraseña, simplemente continúa (puedes agregar lógica para guardar otros datos si quieres)
    Swal.fire({
      icon: "info",
      title: "Sin cambios de contraseña",
      text: "No se ingresó nueva contraseña. Datos actualizados sin cambiar la contraseña."
    });
  }
});
