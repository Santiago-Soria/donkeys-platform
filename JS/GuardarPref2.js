document.addEventListener("DOMContentLoaded", () => {
  // Mostrar qué filtroTipo ya está guardado (habitacion o depa)
  const filtroTipoGuardado = localStorage.getItem("filtroTipo");
  console.log("Filtro tipo guardado en localStorage:", filtroTipoGuardado);

  document.querySelectorAll(".location-card").forEach(opcion => {
    opcion.addEventListener("click", () => {
      const zonaSeleccionada = opcion.querySelector("h3").textContent.trim();
      localStorage.setItem("filtroZona", zonaSeleccionada);
      
    });
  });
});


