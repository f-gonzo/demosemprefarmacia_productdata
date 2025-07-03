document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.getElementById('csvFileInput');
    const productContentDiv = document.getElementById('product-content');
    const prevProductButton = document.getElementById('prevProduct');
    const nextProductButton = document.getElementById('nextProduct');
    const productIndicator = document.getElementById('productIndicator');

    let products = [];
    let currentProductIndex = 0;
    let productTemplate = '';

    // Carica il template del prodotto
    fetch('template.html')
        .then(response => response.text())
        .then(data => {
            productTemplate = data;
        })
        .catch(error => {
            console.error("Errore nel caricamento del template:", error);
            productContentDiv.innerHTML = "<p>Errore nel caricamento del template del prodotto.</p>";
        });

    csvFileInput.addEventListener('change', handleFileUpload);
    prevProductButton.addEventListener('click', showPreviousProduct);
    nextProductButton.addEventListener('click', showNextProduct);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvData = e.target.result;
                parseCSV(csvData);
                if (products.length > 0) {
                    currentProductIndex = 0;
                    displayCurrentProduct();
                    updateNavigation();
                } else {
                    productContentDiv.innerHTML = "<p>Nessun prodotto trovato nel file CSV o formato non valido.</p>";
                    updateNavigation();
                }
            };
            reader.readAsText(file);
        }
    }

    function parseCSV(csvData) {
        products = []; // Resetta i prodotti
        const lines = csvData.split(/\r\n|\n/);
        if (lines.length < 2) return; // Almeno intestazione e una riga di dati

        const headers = lines[0].split(';').map(header => header.trim());

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '') continue; // Salta righe vuote

            const values = line.split(';').map(value => value.trim());
            const product = {};
            headers.forEach((header, index) => {
                product[header] = values[index];
            });
            products.push(product);
        }
    }

    function displayCurrentProduct() {
        if (products.length === 0 || !productTemplate) {
            productContentDiv.innerHTML = "<p>Carica un file CSV e assicurati che il template sia caricato.</p>";
            updateNavigation();
            return;
        }

        const product = products[currentProductIndex];
        let populatedTemplate = productTemplate;

        // Sostituisci i placeholder nel template con i dati del prodotto
        // Questo presume che i placeholder nel template siano nel formato {{NOME_COLONNA}}
        for (const key in product) {
            if (product.hasOwnProperty(key)) {
                const placeholder = new RegExp(`{{${key}}}`, 'g');
                populatedTemplate = populatedTemplate.replace(placeholder, product[key]);
            }
        }
        productContentDiv.innerHTML = populatedTemplate;
        updateNavigation();
    }

    function showPreviousProduct() {
        if (currentProductIndex > 0) {
            currentProductIndex--;
            displayCurrentProduct();
        }
    }

    function showNextProduct() {
        if (currentProductIndex < products.length - 1) {
            currentProductIndex++;
            displayCurrentProduct();
        }
    }

    function updateNavigation() {
        if (products.length === 0) {
            productIndicator.textContent = "Prodotto 0 di 0";
            prevProductButton.disabled = true;
            nextProductButton.disabled = true;
        } else {
            productIndicator.textContent = `Prodotto ${currentProductIndex + 1} di ${products.length}`;
            prevProductButton.disabled = currentProductIndex === 0;
            nextProductButton.disabled = currentProductIndex === products.length - 1;
        }
    }

    // Stato iniziale
    updateNavigation();
});
