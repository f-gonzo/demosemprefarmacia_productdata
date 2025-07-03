document.addEventListener('DOMContentLoaded', function() {
    const csvFileInput = document.getElementById('csvFileInput');
    const productList = document.getElementById('productList');
    const productFrame = document.getElementById('productFrame');
    const productListContainer = document.getElementById('productListContainer');

    let templateHtml = '';
    let products = [];
    
    // Colonne da non mostrare come chip
    const CORE_FIELDS = [
        'id', 'title', 'description', 'short_description', 'manufacturer', 
        'image_url', 'meta_title', 'meta_description', 'meta_keyword'
    ];

    // Carica il template HTML
    fetch('template.html')
        .then(response => {
            if (!response.ok) throw new Error("Errore: Impossibile caricare template.html.");
            return response.text();
        })
        .then(html => templateHtml = html)
        .catch(error => {
            productListContainer.innerHTML = `<p style="color:red; padding:15px;">${error.message}</p>`;
        });

    // Gestisce il caricamento e il parsing del CSV con PapaParse
    csvFileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file || !templateHtml) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                products = results.data.map(p => {
                    // Pulisce l'ID da eventuali caratteri non numerici
                    if (p.id) p.id = p.id.replace(/[^0-9]/g, '');
                    return p;
                });
                renderProductList();
            },
            error: function(error) {
                productListContainer.innerHTML = `<p style="color:red; padding:15px;">Errore nel parsing del CSV: ${error.message}</p>`;
            }
        });
    });

    // Renderizza la lista di navigazione
    function renderProductList() {
        if (products.length === 0) {
            productListContainer.innerHTML = '<p>Nessun prodotto trovato nel CSV.</p>';
            return;
        }

        productList.innerHTML = '';
        products.forEach((product, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = product.title || `Prodotto Senza Titolo ${index + 1}`;
            a.dataset.index = index;
            li.appendChild(a);
            productList.appendChild(li);
        });

        displayProduct(0);
    }

    // Mostra un prodotto specifico
    function displayProduct(index) {
        if (!products[index]) return;

        const product = products[index];
        let finalHtml = templateHtml;

        // 1. Genera HTML per i chip degli attributi
        let chipsHtml = Object.entries(product)
            .filter(([key, value]) => !CORE_FIELDS.includes(key) && value && value.trim() !== '-')
            .map(([key, value]) => `
                <div class="chip">
                    <span class="chip-label">${key.replace(/_/g, ' ')}:</span>
                    <span>${value}</span>
                </div>
            `)
            .join('');
        
        // 2. Sostituisce il placeholder dei chip
        finalHtml = finalHtml.replace('{{attribute_chips_html}}', chipsHtml);

        // 3. Sostituisce gli altri placeholder
        for (const key in product) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, product[key]);
        }
        
        // 4. Pulisce eventuali placeholder non trovati e gestisce l'immagine
        finalHtml = finalHtml.replace(/\{\{\w+\}\}/g, 'N/D');
        if (!product.image_url) {
             finalHtml = finalHtml.replace('src=""', 'src="https://via.placeholder.com/400x400.png?text=Immagine+mancante"');
        }
        
        productFrame.srcdoc = finalHtml;
        updateActiveLink(index);
    }
    
    // Aggiorna lo stile del link attivo
    function updateActiveLink(activeIndex) {
        productList.querySelectorAll('a').forEach((link, index) => {
            link.classList.toggle('active', index === activeIndex);
        });
    }

    // Gestisce i click sulla lista
    productList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            displayProduct(parseInt(e.target.dataset.index, 10));
        }
    });
});
