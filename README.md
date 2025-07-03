# Product Page Mockup Generator

Questa è una semplice applicazione web per generare mockup di pagine prodotto a partire da un file CSV. L'app è progettata per essere ospitata su GitHub Pages e funziona interamente lato client.

## Come Funziona

1.  **Carica il CSV**: L'utente utilizza il pulsante "Carica CSV" per selezionare un file `.csv` dal proprio computer.
2.  **Generazione Pagine**: Lo script legge il file e, per ogni riga, genera una pagina prodotto basata su un template HTML che replica fedelmente la grafica del sito di esempio.
3.  **Navigazione**: Sulla sinistra appare un elenco dei prodotti caricati. Cliccando su un prodotto, il relativo mockup viene visualizzato sulla destra.

## Struttura del File CSV

Affinché l'applicazione funzioni correttamente, il file CSV deve avere una riga di intestazione (header) con i seguenti nomi di colonna. I nomi sono case-sensitive.

### Campi Principali
*   `id`: Usato come identificatore (es. Minsan).
*   `title`: Il nome del prodotto (H1).
*   `description`: La descrizione lunga del prodotto. Può contenere HTML.
*   `short_description`: La descrizione breve mostrata vicino all'immagine.
*   `manufacturer`: Il brand del prodotto.
*   `image_url`: Un URL all'immagine principale del prodotto. Se non fornito, verrà usato un placeholder.

### Campi Attributo (Chip)
Tutte le altre colonne nel CSV verranno renderizzate automaticamente come "chip" (o badge) sotto l'area principale del prodotto. Ad esempio:
*   `formato`
*   `azione`
*   `problematica`
*   `prodotti_senza`
*   `tipologia_pelle`
*   etc...

Le colonne dei meta-dati (`meta_title`, `meta_description`, `meta_keyword`) verranno usate nei meta tag della pagina generata ma non visualizzate come chip.
