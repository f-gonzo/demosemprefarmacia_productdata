# Product Page Mockup Generator

Questa è una semplice applicazione web per generare mockup di pagine prodotto a partire da un file CSV. L'app è progettata per essere ospitata su GitHub Pages e funziona interamente lato client.

## Come Funziona

1.  **Carica il CSV**: L'utente utilizza il pulsante "Carica CSV" per selezionare un file `.csv` dal proprio computer.
2.  **Generazione Pagine**: Lo script legge il file, e per ogni riga genera una pagina prodotto basata su un template HTML predefinito.
3.  **Navigazione**: Sulla sinistra appare un elenco dei prodotti caricati. Cliccando su un prodotto, il relativo mockup viene visualizzato sulla destra.

## Struttura del File CSV

Affinché l'applicazione funzioni correttamente, il file CSV deve avere una riga di intestazione (header) con i seguenti nomi di colonna. I nomi sono case-sensitive.

`id,title,description,short_description,tipo_di_prodotto,azione,problematica,formato,manufacturer`

Qualsiasi altra colonna verrà ignorata.

## Come Pubblicare su GitHub Pages

1.  Crea un nuovo repository su GitHub.
2.  Carica i file `index.html`, `style.css`, `script.js`, e `template.html` in questo repository.
3.  Vai su `Settings` > `Pages`.
4.  Nella sezione "Branch", seleziona il branch `main` (o `master`) e la cartella `/ (root)`.
5.  Clicca su `Save`. La tua app sarà disponibile all'URL indicato da GitHub dopo qualche minuto.
