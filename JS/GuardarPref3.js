document.addEventListener("DOMContentLoaded", () => {
    console.log("Filtros guardados actualmente:");
    console.log("filtroTipo:", localStorage.getItem("filtroTipo"));
    console.log("filtroZona:", localStorage.getItem("filtroZona"));
  document.querySelectorAll(".budget-card").forEach(card => {
    card.addEventListener("click", () => {
      const presupuesto = card.querySelector(".budget-range").textContent.trim();

      // Normalizar al formato usado en JS de resultados1d
      let valor;
      if (presupuesto.toLowerCase().includes("menos")) valor = "Menos de $2,500";
      else if (presupuesto.toLowerCase().includes("más")) valor = "Más de $3,500";
      else valor = "$2,500 - $3,500";

      localStorage.setItem("filtroPresupuesto", valor);

      // Mostrar en consola TODO lo que llevas guardado
      console.log("Presupuesto guardado en localStorage:", valor);
      console.log("filtroPresupuesto:", localStorage.getItem("filtroPresupuesto"));

      // Luego redirigir
      window.location.href = "paso4.html"; // ir al paso 4
    });
  });
});
