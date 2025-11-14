// Lógica solo para la página exponencial.html

document.addEventListener("DOMContentLoaded", () => {
    
    const btnCalcular = document.getElementById("btnCalcular");
    const resultado = document.getElementById("resultado");
    
    btnCalcular.addEventListener('click', calcularExponencial);

    function calcularExponencial() {
        // Obtener valores
        const lambda = parseFloat(document.getElementById("lambda").value);
        const x = parseFloat(document.getElementById("x").value);

        // Validar
        if (isNaN(lambda) || isNaN(x) || lambda <= 0 || x < 0) {
            resultado.innerHTML = `
                <span class="resultado-valor" style="color: #D32F2F;">Error</span>
                <span class="resultado-interpretacion">Por favor, ingresa valores válidos. Asegúrate que λ > 0 y x ≥ 0.</span>
            `;
            if (window.chart) window.chart.destroy();
            return;
        }

        // Calcular (Esto es la PDF, no la CDF)
        const prob = lambda * Math.exp(-lambda * x);
        
        // Mostrar resultado
        resultado.innerHTML = `
            <span class="resultado-valor">f(${x}) = ${prob.toFixed(5)}</span>
            <span class="resultado-interpretacion">Densidad de probabilidad en el tiempo ${x}.</span>
        `;
        
        // Graficar (usando 'graficarCurvaExponencial' de main.js)
        graficarCurvaExponencial(lambda);
    }
});