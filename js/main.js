// --- FUNCIONES MATEMÁTICAS COMPARTIDAS ---

// Función clave para la Normal: Aproximación de la CDF (Área)
function standardNormalCDF(z) {
    if (z === 0) return 0.5;
    const sign = z > 0 ? 1 : -1;
    z = Math.abs(z);
    
    const b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
    const t = 1.0 / (1.0 + 0.2316419 * z); 
    const poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
    const Qz = Math.exp(-z * z / 2.0) / Math.sqrt(2 * Math.PI) * poly;
    
    return (sign === 1) ? (1.0 - Qz) : Qz;
}

// Función de Densidad de Probabilidad (PDF) Normal
function normalPDF(x, mu, sigma) {
    const sigma2 = Math.pow(sigma, 2);
    const exponente = -Math.pow(x - mu, 2) / (2 * sigma2); 
    const factor = 1 / (sigma * Math.sqrt(2 * Math.PI)); 
    return factor * Math.exp(exponente);
}

// Factorial (para Binomial y Poisson)
function factorial(n) {
    if (n < 0) return NaN;
    if (n > 170) return Infinity; // Evitar stack overflow y números demasiado grandes
    return n <= 1 ? 1 : n * factorial(n - 1);
}


// --- FUNCIONES DE GRÁFICOS COMPARTIDAS ---

let chart; // Variable global para guardar el gráfico actual

// Gráfico de Barras Simple (para Binomial y Poisson)
function graficarSimple(datos, etiqueta) {
    const grafico = document.getElementById("grafico");
    if (!grafico) return;
    if (chart) chart.destroy();
    chart = new Chart(grafico, {
        type: 'bar',
        data: {
            labels: [etiqueta],
            datasets: [{
                label: 'Probabilidad P(X=x)',
                data: datos,
                backgroundColor: 'rgba(40, 167, 69, 0.7)', 
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: Math.max(0.1, ...datos) * 1.1 } }
        }
    });
}

// Gráfico de Línea para la Curva Normal
function graficarCurvaNormal(mu, sigma, lowerBound, upperBound, labelText) {
    const grafico = document.getElementById("grafico");
    if (!grafico) return;
    if (chart) chart.destroy();

    const rango_factor = 3; 
    const rango_min = mu - rango_factor * sigma;
    const rango_max = mu + rango_factor * sigma;
    const pasos = 200; 
    const datos_curva = [];
    const max_y = normalPDF(mu, mu, sigma);

    for (let i = 0; i <= pasos; i++) {
        let x_val = rango_min + (rango_max - rango_min) * i / pasos;
        datos_curva.push({x: parseFloat(x_val.toFixed(3)), y: parseFloat(normalPDF(x_val, mu, sigma).toFixed(5))});
    }

    let final_area_data = [];
    let start_x = isNaN(lowerBound) ? rango_min : lowerBound;
    let end_x = isNaN(upperBound) ? rango_max : upperBound;
    
    final_area_data.push({x: start_x, y: 0}); 
    for (const point of datos_curva) {
        if (point.x >= start_x && point.x <= end_x) {
            final_area_data.push(point);
        }
    }
    final_area_data.push({x: end_x, y: 0});
    
    chart = new Chart(grafico, {
        type: 'line', 
        data: {
            datasets: [
                {
                    label: labelText, 
                    data: final_area_data,
                    borderColor: 'rgba(0, 123, 255, 0.1)', 
                    backgroundColor: 'rgba(0, 123, 255, 0.4)',
                    borderWidth: 0,
                    pointRadius: 0, 
                    fill: 'origin',
                    tension: 0, 
                    parsing: false,
                },
                {
                    label: `Curva Normal (μ=${mu}, σ=${sigma})`,
                    data: datos_curva, 
                    borderColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgba(0, 0, 0, 0)', 
                    borderWidth: 2,
                    pointRadius: 0, 
                    fill: false,
                    tension: 0.4, 
                    parsing: false 
                }
            ]
        },
        options: {
            responsive: true,
            aspectRatio: 1.5, 
            maintainAspectRatio: true, 
            scales: {
                x: {
                    type: 'linear', 
                    title: { display: true, text: 'Valores de X' },
                    min: rango_min,
                    max: rango_max,
                    ticks: { autoSkipPadding: 5 }
                },
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: 'Densidad f(x)' },
                    max: max_y * 1.2 
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}

// Gráfico de Línea para la Curva Exponencial
function graficarCurvaExponencial(lambda) {
    const grafico = document.getElementById("grafico");
    if (!grafico) return;
    if (chart) chart.destroy();

    const media = 1 / lambda;
    const rango_max = 5 * media;
    const pasos = 150;
    const datos_curva = [];

    for (let i = 0; i <= pasos; i++) {
        const x_val = (rango_max) * i / pasos;
        const y_val = lambda * Math.exp(-lambda * x_val);
        datos_curva.push({x: x_val, y: y_val});
    }

    chart = new Chart(grafico, {
        type: 'line', 
        data: {
            datasets: [
                {
                    label: `Curva Exponencial (λ=${lambda})`,
                    data: datos_curva,
                    borderColor: 'rgb(255, 193, 7)', 
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0, 
                    fill: 'origin', 
                    tension: 0.2,
                    parsing: false
                }
            ]
        },
        options: {
            responsive: true,
            aspectRatio: 1.5, 
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    title: { display: true, text: 'Valores de X' }
                },
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: 'Densidad de Probabilidad f(x)' }
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}