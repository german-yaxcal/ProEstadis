// Lógica solo para la página poisson.html

document.addEventListener("DOMContentLoaded", () => {
    
    const btnCalcular = document.getElementById("btnCalcular");
    const resultado = document.getElementById("resultado");
    
    btnCalcular.addEventListener('click', calcularPoisson);

    function calcularPoisson() {
        // Obtener valores
        const lambda = parseFloat(document.getElementById("lambda").value);
        const x = parseInt(document.getElementById("x").value);

        // Validar
        if (isNaN(lambda) || isNaN(x) || lambda <= 0 || x < 0) {
            resultado.innerHTML = `
                <span class="resultado-valor" style="color: #D32F2F;">Error</span>
                <span class="resultado-interpretacion">Por favor, ingresa valores válidos. Asegúrate que λ > 0 y x ≥ 0.</span>
            `;
            if (window.chart) window.chart.destroy();
            return;
        }

        // Calcular (usando 'factorial' de main.js)
        const prob = (Math.pow(lambda, x) * Math.exp(-lambda)) / factorial(x);
        
        // Mostrar resultado
        resultado.innerHTML = `
            <span class="resultado-valor">P(X=${x}) = ${prob.toFixed(5)}</span>
            <span class="resultado-interpretacion">Probabilidad de que ocurran ${x} eventos.</span>
        `;
        
        // Graficar (usando 'graficarSimple' de main.js)
        graficarSimple([prob], `P(X=${x})`);
    }
});