# Minisito Concorso Illustramente 2026/2027

Bozza in HTML, CSS e JavaScript del minisito per il concorso “A come amicizia. Portatrice di buone nuove”, già organizzata per il passaggio a WordPress.

Per vederla basta aprire `index.html` nel browser. Per pubblicarla su WordPress segui la guida **`GUIDA-WORDPRESS.html`**, che è un file a parte, fuori da questa cartella.

## Struttura

```
concorso-2026/
├── index.html          Il concorso: presentazione, bando, form contatti
├── bando.html          Il bando 2026/2027 (testo integrale, indice, ancore #art-1 … #art-14-16)
├── partner.html        I partner: organizzatori e patrocini, con descrizione e link
├── giuria.html         Le giurie: Illustrazione e Poesia
├── iscriviti.html      Iscrizione: dati anagrafici + upload delle opere (prototipo)
├── banner-home.html    Banner da inserire nella home di illustramente.it
├── css/style.css       Stile (variabili in cima al file)
├── js/main.js          Menu mobile, validazione dei form, logica del modulo di iscrizione
├── assets/img/         Immagini (grafica provvisoria, loghi partner, loghi footer)
├── download/           PDF del bando
└── wordpress/
    ├── prepara-contenuti.html   Strumento che prepara i contenuti da incollare
    └── tema-child/              File da copiare nel tema child (Illustramente2015)
```

## Regole per modificare la bozza senza romperla in WordPress

- **Il contenuto di ogni pagina sta tra i commenti `WP: INIZIO` e `WP: FINE`.** Header e footer sono fuori: in WordPress li genera il modello di pagina (`wordpress/tema-child/concorso/parts/`). Se cambi header o footer, cambiali in tutti e 5 i file HTML **e** nei due file PHP.
- **Classi con prefisso `ic-`** e regole CSS che iniziano con `.ic`: così il minisito non si scontra con Avada.
- **Niente stili o script scritti nei tag** (`style="…"`, `onclick="…"`): WordPress può toglierli. Usa una classe in `css/style.css`.
- **Link interni** scritti come `bando.html`, `index.html#contatti`; **immagini** in `assets/img/`; **PDF** in `download/`. Lo strumento `prepara-contenuti.html` li trasforma negli indirizzi di WordPress.
- **Menu**: lista `<ul class="ic-nav-list">`, voce attiva con `aria-current="page"`, classi `ic-nav-home` e `ic-nav-cta` sulle voci speciali (è la stessa struttura che genera WordPress).

## Moduli

I due moduli (contatti in `index.html`, iscrizione in `iscriviti.html`) **controllano i dati ma non li inviano**. In WordPress si ricreano con Quform, già installato sul sito: campi e regole sono descritti nella guida.

Il modulo di iscrizione segue il bando:

- **Scuola o esordiente**: cambiano i campi e la quota (gratuita oppure € 15,00 con ricevuta del bonifico).
- **Minorenni**: in base alla data di nascita compare l’autorizzazione del genitore (Art. 5).
- **Categorie**: A oppure B, più C facoltativa (doppia iscrizione, Art. 7).
  - Con B: piattaforma di IA obbligatoria (Art. 3/b).
  - Con A e C: dichiarazione “senza IA” (Art. 12).
- **Controlli sui file**: formato, peso e, per JPG/PNG, A3 verticale a 300 DPI (3508 × 4961 px).
- **Poesia**: conteggio automatico delle parole (200–400, Art. 4/a).

## Colori

Le variabili sono in cima a `css/style.css`:

- **Blu**: `--ic-navy` `#2d4373`.
- **Teal**: `--ic-teal` `#22748f`.
- **Arancio**:
  - `--ic-orange` `#ff6a00` è l’arancio del marchio, usato per le decorazioni;
  - `--ic-orange-strong` `#c84b00` è usato per pulsanti e testi, perché il bianco su `#ff6a00` non è abbastanza leggibile (contrasto 2,9:1 invece di 4,5:1).

## Da completare

- Locandina 2026/2027: sostituire `assets/img/locandina-provvisoria-2026-2027.svg` (in `index.html` e `banner-home.html`).
- Data di chiusura delle iscrizioni (pagina Bando, riquadro “In breve”).
- Descrizioni dei partner e nomi delle giurie: da far confermare.
