// Lógica solo para la página normal.html

document.addEventListener("DOMContentLoaded", () => {
    
    // Obtener elementos
    const btnCalcular = document.getElementById("btnCalcular");
    const resultado = document.getElementById("resultado");
    const calcTypeSelect = document.getElementById("calcType");

    // Lógica para mostrar/ocultar el campo x2 dinámicamente
    calcTypeSelect.addEventListener("change", (event) => {
        const type = event.target.value;
        const x1Label = document.getElementById('x1Label');
        const x2Group = document.getElementById("x2-group");
        
        if (type === "between") {
            x1Label.innerHTML = `<i class="fa-solid fa-ruler-vertical"></i> x₁ (Límite inferior):`;
            x2Group.style.display = "block";
        } else {
            x1Label.innerHTML = `<i class="fa-solid fa-ruler-vertical"></i> x (Valor límite):`;
            x2Group.style.display = "none";
        }
    });

    // Asignar evento de cálculo
    btnCalcular.addEventListener('click', calcularNormal);

    function calcularNormal() {
        // Obtener valores
        const mu = parseFloat(document.getElementById("mu").value);
        const sigma = parseFloat(document.getElementById("sigma").value);
        const calcType = document.getElementById("calcType").value;
        const x1 = parseFloat(document.getElementById("x1").value);
        const x2Input = document.getElementById("x2");
        const x2 = x2Input.style.display !== 'none' ? parseFloat(x2Input.value) : NaN;
        
        const MIN_SIGMA = 0.01; 

        // Validar
        if (isNaN(mu) || isNaN(sigma) || isNaN(x1) || sigma < MIN_SIGMA) {
            resultado.innerHTML = `
                <span class="resultado-valor" style="color: #D32F2F;">Error</span>
                <span class="resultado-interpretacion">La **desviación estándar (σ)** debe ser mayor o igual a **${MIN_SIGMA}**.</span>
            `;
            if (window.chart) window.chart.destroy();
            return;
        }

        if (calcType === "between" && (isNaN(x2) || x1 >= x2)) {
             resultado.innerHTML = `
                <span class="resultado-valor" style="color: #D32F2F;">Error</span>
                <span class="resultado-interpretacion">Para P(x₁ ≤ X ≤ x₂), asegúrate de que x₁ < x₂.</span>
            `;
             if (window.chart) window.chart.destroy();
             return;
        }
        
        let prob = 0;
        let Z1, Z2;
        let labelText, probText, lowerBound, upperBound;

        // Calcular (usando 'standardNormalCDF' de main.js)
        switch (calcType) {
            case "lessThan":
                Z1 = (x1 - mu) / sigma;
                prob = standardNormalCDF(Z1);
                labelText = `P(X ≤ ${x1})`;
                lowerBound = NaN; 
                upperBound = x1;
                break;
                
            case "greaterThan":
                Z1 = (x1 - mu) / sigma;
                prob = 1.0 - standardNormalCDF(Z1);
                labelText = `P(X ≥ ${x1})`;
                lowerBound = x1;
                upperBound = NaN;
                break;

            case "between":
                Z1 = (x1 - mu) / sigma;
                Z2 = (x2 - mu) / sigma;
                prob = standardNormalCDF(Z2) - standardNormalCDF(Z1);
                labelText = `P(${x1} ≤ X ≤ ${x2})`;
                lowerBound = x1;
                upperBound = x2;
                break;
        }

        // Mostrar resultado
        resultado.innerHTML = `
            <span class="resultado-valor">${labelText} = ${prob.toFixed(5)}</span>
            <span class="resultado-interpretacion">El área bajo la curva que representa esta probabilidad es ${prob.toFixed(5)}.</span>
        `;
        
        // Graficar (usando 'graficarCurvaNormal' de main.js)
        graficarCurvaNormal(mu, sigma, lowerBound, upperBound, labelText);
    }
});