// Lógica solo para la página binomial.html

// 1. Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Obtener los elementos de ESTA página
    const btnCalcular = document.getElementById("btnCalcular");
    const resultado = document.getElementById("resultado");
    
    // 3. Asignar el evento
    btnCalcular.addEventListener('click', calcularBinomial);

    // 4. Función de cálculo (modificada de tu original)
    function calcularBinomial() {
        // Obtener valores
        const n = parseInt(document.getElementById("n").value);
        const p = parseFloat(document.getElementById("p").value);
        const x = parseInt(document.getElementById("x").value);

        // Validar
        if (isNaN(n) || isNaN(p) || isNaN(x) || p < 0 || p > 1 || x < 0 || n < 0 || x > n) {
            resultado.innerHTML = `
                <span class="resultado-valor" style="color: #D32F2F;">Error</span>
                <span class="resultado-interpretacion">Por favor, ingresa valores válidos. Asegúrate que n > 0, 0 ≤ p ≤ 1, y 0 ≤ x ≤ n.</span>
            `;
            if (window.chart) window.chart.destroy();
            return;
        }

        // Calcular
        // Usamos la función 'factorial' que está en js/main.js
        const comb = factorial(n) / (factorial(x) * factorial(n - x));
        const prob = comb * Math.pow(p, x) * Math.pow(1 - p, n - x);
        
        // Mostrar resultado
        resultado.innerHTML = `
            <span class="resultado-valor">P(X=${x}) = ${prob.toFixed(5)}</span>
            <span class="resultado-interpretacion">La probabilidad de obtener ${x} éxitos es ${prob.toFixed(5)}.</span>
        `;
        
        // Graficar
        // Usamos la función 'graficarSimple' que está en js/main.js
        graficarSimple([prob], `P(X=${x})`);
    }
});