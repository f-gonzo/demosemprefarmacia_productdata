document.addEventListener('DOMContentLoaded', function() {
    const csvFileInput = document.getElementById('csvFileInput');
    const productList = document.getElementById('productList');
    const productFrame = document.getElementById('productFrame');
    const productListContainer = document.getElementById('productListContainer');

    let templateHtml = '';
    let products = [];

    // 1. Carica il template HTML all'avvio
    fetch('template.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore: Impossibile caricare template.html. Assicurati che il file sia presente nella stessa cartella.");
            }
            return response.text();
        })
        .then(html => {
            templateHtml = html;
        })
        .catch(error => {
            productListContainer.innerHTML = `<p style="color:red; padding: 15px;">${error.message}</p>`;
            console.error(error);
        });

    // 2. Gestisce il caricamento e il parsing del CSV
    csvFileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file || !templateHtml) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            products = parseCSV(text);
            renderProductList();
        };
        reader.readAsText(file);
    });

    function parseCSV(text) {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(','); // Semplice parser, non gestisce virgole nei valori
            const product = {};
            headers.forEach((header, index) => {
                product[header] = values[index] ? values[index].trim() : '';
            });
            data.push(product);
        }
        return data;
    }

    // 3. Renderizza la lista di navigazione dei prodotti
    function renderProductList() {
        if (products.length === 0) {
            productListContainer.innerHTML = '<p>Nessun prodotto trovato nel CSV.</p>';
            return;
        }

        productList.innerHTML = ''; // Pulisce la lista precedente
        products.forEach((product, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = product.title || `Prodotto ${index + 1}`;
            a.dataset.index = index;
            li.appendChild(a);
            productList.appendChild(li);
        });

        // Mostra il primo prodotto di default
        displayProduct(0);
    }

    // 4. Mostra un prodotto specifico nell'iframe
    function displayProduct(index) {
        if (!products[index]) return;

        const product = products[index];
        let finalHtml = templateHtml;

        // Sostituisce i segnaposto con i dati del prodotto
        for (const key in product) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, product[key]);
        }
        
        // Pulisce eventuali segnaposto non trovati
        finalHtml = finalHtml.replace(/\{\{\w+\}\}/g, '');

        // Usa srcdoc per iniettare l'HTML nell'iframe in modo sicuro
        productFrame.srcdoc = finalHtml;
        
        // Aggiorna lo stato attivo nella navigazione
        updateActiveLink(index);
    }
    
    function updateActiveLink(activeIndex) {
        const links = productList.querySelectorAll('a');
        links.forEach((link, index) => {
            if (index === activeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 5. Gestisce i click nella lista di navigazione
    productList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const index = parseInt(e.target.dataset.index, 10);
            displayProduct(index);
        }
    });
});
