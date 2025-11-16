document.addEventListener('DOMContentLoaded', () => {
    // Data structure derived from your notes
    const metricsData = [
        {
            name: "RSS — Residual Sum of Squares",
            id: "rss",
            icon: "✅",
            aspects: {
                Purpose: "Measures unexplained variation; how far fitted values are from observed data.",
                Utility: "Lower RSS → better fit (in-sample). Foundation for all other metrics.",
                Bounds: "RSS ≥ 0. No upper bound (depends on scale of y).",
                "How it Works": "Sums squared residuals.",
                Ingredients: "Observed responses, Fitted values, Sample size n",
                "When to Use": "Only to compare models fit to the same dataset. Not scale-free → cannot compare across different y-scales.",
                Equation: "\\text{RSS} = \\sum_{i=1}^n (y_i - \\hat y_i)^2"
            }
        },
        {
            name: "SSE — Sum of Squared Errors",
            id: "sse",
            icon: "✅",
            aspects: {
                Purpose: "Estimate of regression variance / error variance.",
                Utility: "Forms the basis of: RSE, F-tests, Standard errors of coefficients",
                Bounds: "SSE ≥ 0. No upper bound.",
                "How it Works": "RSS scaled by degrees of freedom.",
                Ingredients: "RSS, n: sample size, p: number of predictors",
                "When to Use": "To compute RSE, F-test, confidence intervals.",
                Equation: "\\text{SSE} = \\frac{1}{\\,n - p - 1\\,}\\sum_{i=1}^n (y_i - \\hat y_i)^2"
            }
        },
        {
            name: "RSE — Residual Standard Error",
            id: "rse",
            icon: "✅",
            aspects: {
                Purpose: "Measures typical prediction error in units of y.",
                Utility: "Easy to interpret. Comparable across models on same dataset",
                Bounds: "RSE ≥ 0.",
                "How it Works": "Square root of SSE.",
                Ingredients: "SSE, Sample size, p predictors",
                "When to Use": "When communicating model accuracy to students/clients.",
                Equation: "\\text{RSE} = \\sqrt{\\text{SSE}}"
            }
        },
        {
            name: "R²",
            id: "r2",
            icon: "✅",
            aspects: {
                Purpose: "Proportion of total variability in y explained by the model.",
                Utility: "Simple interpretability.",
                Bounds: "0 \\le R^2 \\le 1",
                "How it Works": "Comparing explained vs. total variation.",
                Ingredients: "RSS, SST",
                "When to Use": "Communicating “percentage of variation explained.” Do not use to choose between models with different # of predictors.",
                Equation: "R^2 = 1 - \\frac{\\text{RSS}}{\\text{SST}}"
            }
        },
        {
            name: "Adjusted R²",
            id: "adj-r2",
            icon: "✅",
            aspects: {
                Purpose: "Penalty version of R² to account for model size.",
                Utility: "Fairer comparison when models have different numbers of predictors.",
                Bounds: "Not always between 0 and 1: Can be negative. Upper bound < 1",
                "How it Works": "Adjusts R² by degrees of freedom.",
                Ingredients: "n, p, RSS, SST",
                "When to Use": "Comparing models with different number of predictors. Teaching model parsimony.",
                Equation: "R^2_{\\text{adj}} = 1 - \\frac{\\,\\text{RSS}/(n-p-1)\\,}{\\text{SST}/(n-1)}"
            }
        },
        {
            name: "AIC — Akaike Information Criterion",
            id: "aic",
            icon: "✅",
            aspects: {
                Purpose: "Balances model fit and model complexity (penalizes adding predictors).",
                Utility: "Compares across non-nested models. Used for model selection.",
                Bounds: "No fixed bounds (lower is better).",
                "How it Works": "Penalizes models with higher number of parameters.",
                Ingredients: "n, RSS, p predictors",
                "When to Use": "Choosing best predictive model. Comparing models with different predictors. When sample size is not super small",
                Equation: "For linear regression with Gaussian errors: \\text{AIC} = n\\ln\\left(\\frac{\\text{RSS}}{n}\\right) + 2(p + 1)"
            }
        },
        {
            name: "BIC — Bayesian Information Criterion",
            id: "bic",
            icon: "✅",
            aspects: {
                Purpose: "More conservative penalty than AIC.",
                Utility: "Sacrifices flexibility for simplicity. Prefers smaller models.",
                Bounds: "No fixed bounds (lower is better).",
                "How it Works": "Penalizes with log(n) instead of a constant.",
                Ingredients: "n, RSS, Number of parameters",
                "When to Use": "When you want parsimony (simple models). Large-sample scenarios. Teaching “fewer predictors unless truly needed.”",
                Equation: "\\text{BIC} = n\\ln\\left(\\frac{\\text{RSS}}{n}\\right) + (p+1)\\ln n"
            }
        }
    ];

    const container = document.getElementById('metrics-container');

    // 1. Generate HTML structure from the data
    metricsData.forEach(metric => {
        const metricDiv = document.createElement('div');
        metricDiv.classList.add('metric');
        metricDiv.setAttribute('data-id', metric.id);

        // Metric Header (Clickable to open/close)
        metricDiv.innerHTML = `
            <div class="metric-header" data-id="${metric.id}">
                ${metric.icon} ${metric.name} <span>&gt;</span>
            </div>
            <div class="aspect-buttons" id="${metric.id}-buttons"></div>
            <div class="aspect-content" id="${metric.id}-content"></div>
        `;

        // Aspect Buttons
        const buttonsDiv = metricDiv.querySelector('.aspect-buttons');
        Object.keys(metric.aspects).forEach(aspectName => {
            const button = document.createElement('button');
            button.classList.add('aspect-button');
            button.textContent = aspectName;
            button.setAttribute('data-metric-id', metric.id);
            button.setAttribute('data-aspect-name', aspectName);
            buttonsDiv.appendChild(button);
        });

        container.appendChild(metricDiv);
    });

    // 2. Add Event Listeners for Interactivity

    // Toggle Metric (Header Click)
    container.querySelectorAll('.metric-header').forEach(header => {
        header.addEventListener('click', function() {
            const metricDiv = this.closest('.metric');
            const isActive = metricDiv.classList.contains('active');
            
            // Close all metrics first for a single-open experience
            document.querySelectorAll('.metric').forEach(m => {
                m.classList.remove('active');
                // Hide content of all (resets current visible content)
                m.querySelector('.aspect-content').classList.remove('visible');
            });
            document.querySelectorAll('.aspect-button').forEach(b => b.classList.remove('active'));

            if (!isActive) {
                metricDiv.classList.add('active');
            }
        });
    });

    // Show Aspect Content (Button Click)
    container.querySelectorAll('.aspect-button').forEach(button => {
        button.addEventListener('click', function() {
            const metricId = this.getAttribute('data-metric-id');
            const aspectName = this.getAttribute('data-aspect-name');
            const metricData = metricsData.find(m => m.id === metricId);
            const contentDiv = document.getElementById(`${metricId}-content`);

            // Clear previous content
            contentDiv.innerHTML = '';
            
            // Deactivate all buttons for this metric
            document.querySelectorAll(`.aspect-button[data-metric-id="${metricId}"]`).forEach(b => b.classList.remove('active'));
            
            // Activate current button
            this.classList.add('active');

            // Find the content for the selected aspect
            const content = metricData.aspects[aspectName];

            // Render content
            const contentItem = document.createElement('div');
            contentItem.classList.add('content-item');
            contentItem.innerHTML = `<strong>${aspectName}</strong>`;
            
            // Check if it's the Equation aspect, which requires KaTeX rendering
            if (aspectName === 'Equation') {
                const equationSpan = document.createElement('div');
                equationSpan.classList.add('katex-display');
                
                // Use setTimeout to ensure the content area has opened before KaTeX renders
                setTimeout(() => {
                    try {
                         katex.render(content.replace(/\\text\{/g, '\\text{').trim(), equationSpan, {
                            throwOnError: false,
                            displayMode: true
                        });
                    } catch (e) {
                        equationSpan.innerHTML = `<p style="color: red;">Error rendering equation: ${e.message}</p><code>${content}</code>`;
                    }
                }, 300); // Small delay for smooth open
                
                contentItem.appendChild(equationSpan);
            } else {
                contentItem.innerHTML += `<p>${content}</p>`;
            }
            
            contentDiv.appendChild(contentItem);

            // Make content visible with transition
            contentDiv.classList.add('visible');
        });
    });
});