/* ==========================================================
   Minisito Concorso Illustramente 2026/2027
   Nessuna libreria esterna. In WordPress il file viene
   caricato in fondo alla pagina (defer) da functions-concorso.php.

   1. Menu mobile e colonne laterali
   2. Validazione dei form (messaggi in italiano sotto ai campi)
   3. Modulo di iscrizione: blocchi che compaiono in base alle
      scelte, controllo dei file, conteggio parole, copia IBAN
   4. Avvio
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 1. Menu mobile ---------- */
  function initMenu() {
    var toggle = document.querySelector('.ic-nav-toggle');
    var nav = document.getElementById('ic-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });
  }

  /* ---------- 1b. Colonne laterali ferme solo se ci stanno ----------
     Le colonne laterali (indice della home, riquadri di Bando e Iscriviti) restano
     ferme mentre si scorre solo se sono più basse della finestra. Altrimenti
     scorrono con la pagina: niente barra di scorrimento interna, niente tagliato. */
  function initStickyAsides() {
    var asides = document.querySelectorAll('.ic-toc, .ic-side-card');
    if (!asides.length) return;
    var pending = false;
    var lastW = 0;
    var lastH = 0;

    function update() {
      pending = false;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      Array.prototype.forEach.call(asides, function (el) {
        el.classList.add('ic-is-sticky');
        var top = parseFloat(window.getComputedStyle(el).top) || 0;
        var fits = el.offsetHeight + top + 16 <= window.innerHeight;
        el.classList.toggle('ic-is-sticky', fits);
      });
    }

    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    // ricontrolla anche scorrendo, se nel frattempo la finestra è cambiata (zoom, barre del browser)
    window.addEventListener('scroll', function () {
      if (window.innerWidth !== lastW || window.innerHeight !== lastH) schedule();
    }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }

  /* ---------- 2. Validazione dei form ---------- */
  function messageFor(el) {
    var v = el.validity;
    if (v.customError) return el.validationMessage;
    if (v.valueMissing) {
      if (el.type === 'checkbox') return 'Spunta questa casella per continuare.';
      if (el.type === 'radio') return 'Scegli una delle opzioni.';
      if (el.type === 'file') return 'Carica il file richiesto.';
      if (el.tagName === 'SELECT') return 'Scegli una voce dall’elenco.';
      return 'Questo campo è obbligatorio.';
    }
    if (v.typeMismatch && el.type === 'email') return 'Inserisci un indirizzo e-mail valido (es. nome@dominio.it).';
    if (v.patternMismatch) return el.getAttribute('data-pattern-msg') || 'Il formato non è corretto.';
    if (v.rangeOverflow || v.rangeUnderflow) return el.getAttribute('data-range-msg') || 'Il valore non è valido.';
    if (v.tooLong) return 'Il testo è troppo lungo.';
    return el.validationMessage || 'Controlla questo campo.';
  }

  // Dove mostrare l'errore: gruppo di scelte, casella singola o campo
  function hostOf(el) {
    return el.closest('.ic-group') || el.closest('.ic-check') || el.closest('.ic-field') || el.parentNode;
  }

  function errorId(el) {
    return 'err-' + (el.name || el.id).replace(/[^\w-]/g, '');
  }

  function relatedControls(el) {
    if (el.type === 'radio' && el.form) {
      return Array.prototype.slice.call(el.form.querySelectorAll('input[type="radio"][name="' + el.name + '"]'));
    }
    return [el];
  }

  function setDescribedBy(el, id, add) {
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    var i = ids.indexOf(id);
    if (add && i === -1) ids.push(id);
    if (!add && i !== -1) ids.splice(i, 1);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  }

  function showError(el, msg) {
    var host = hostOf(el);
    var id = errorId(el);
    var box = document.getElementById(id);
    if (!box) {
      box = document.createElement('p');
      box.className = 'ic-field-error';
      box.id = id;
      if (host.classList.contains('ic-check')) host.insertAdjacentElement('afterend', box);
      else host.appendChild(box);
    }
    box.textContent = msg;
    host.classList.add('is-invalid');
    relatedControls(el).forEach(function (c) {
      c.setAttribute('aria-invalid', 'true');
      setDescribedBy(c, id, true);
    });
  }

  function clearError(el) {
    var host = hostOf(el);
    var id = errorId(el);
    var box = document.getElementById(id);
    if (box) box.remove();
    host.classList.remove('is-invalid');
    relatedControls(el).forEach(function (c) {
      c.removeAttribute('aria-invalid');
      setDescribedBy(c, id, false);
    });
  }

  function controlsOf(form) {
    return Array.prototype.filter.call(form.elements, function (el) {
      return el.name && el.willValidate && !el.disabled && !el.closest('.ic-hp');
    });
  }

  function validateOne(el) {
    if (el.disabled) { clearError(el); return true; }
    if (el.type === 'radio') el = el.form.querySelector('input[type="radio"][name="' + el.name + '"]');
    if (el.checkValidity()) { clearError(el); return true; }
    showError(el, messageFor(el));
    return false;
  }

  function validateForm(form) {
    var seen = {};
    var invalid = [];
    controlsOf(form).forEach(function (el) {
      if (el.type === 'radio') {
        if (seen[el.name]) return;
        seen[el.name] = true;
        el = form.querySelector('input[type="radio"][name="' + el.name + '"]');
      }
      if (!validateOne(el)) invalid.push(el);
    });
    return invalid;
  }

  function labelText(el) {
    var group = el.closest('.ic-group');
    var label = el.type === 'radio' && group ? group.querySelector('legend') : (el.labels && el.labels[0]);
    if (label) {
      label = label.cloneNode(true);
      label.querySelectorAll('.ic-sr-only').forEach(function (n) { n.remove(); });
    }
    var text = label ? label.textContent : (el.name || '');
    text = text.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
    return text.length > 70 ? text.slice(0, 67) + '…' : text;
  }

  function renderSummary(box, invalid) {
    box.innerHTML = '';
    var p = document.createElement('p');
    p.innerHTML = '<strong>Mancano alcune informazioni (' + invalid.length + ').</strong> Correggi i campi indicati:';
    var ul = document.createElement('ul');
    invalid.forEach(function (el) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + el.id;
      a.textContent = labelText(el) + ' – ' + messageFor(el);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        el.scrollIntoView({ block: 'center' });
        el.focus({ preventScroll: true });
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
    box.appendChild(p);
    box.appendChild(ul);
    box.hidden = false;
    box.focus();
  }

  /**
   * Collega la validazione a un form.
   * opts.summary  -> elemento in cui elencare gli errori (facoltativo)
   * opts.onSuccess -> cosa fare quando tutto è corretto
   */
  function initForm(form, opts) {
    form.setAttribute('novalidate', '');

    function live(e) {
      var el = e.target;
      if (!el.name || el.closest('.ic-hp')) return;
      if (form.hasAttribute('data-submitted') || hostOf(el).classList.contains('is-invalid')) validateOne(el);
    }
    form.addEventListener('input', live);
    form.addEventListener('change', live);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var trap = form.querySelector('.ic-hp input');
      if (trap && trap.value) return; // anti-spam
      form.setAttribute('data-submitted', '');
      if (opts.beforeValidate) opts.beforeValidate(form);

      var pending = Array.prototype.map.call(form.querySelectorAll('input[type="file"]'), function (f) {
        return f._icCheck || null;
      }).filter(Boolean);

      Promise.all(pending).then(function () {
        var invalid = validateForm(form);
        if (invalid.length) {
          if (opts.summary) renderSummary(opts.summary, invalid);
          else invalid[0].focus();
          return;
        }
        if (opts.summary) opts.summary.hidden = true;
        opts.onSuccess(form);
      });
    });
  }

  /* ---------- 3. Modulo di iscrizione ---------- */
  // A3 a 300 DPI: 3508 × 4961 px. Art. 3/a: orientamento verticale o orizzontale, stesso formato.
  var A3 = { w: 3508, h: 4961, tolerance: 0.02 };

  function radioValue(form, name) {
    var r = form.querySelector('input[name="' + name + '"]:checked');
    return r ? r.value : '';
  }

  function ageFrom(iso) {
    var p = (iso || '').split('-');
    if (p.length !== 3) return null;
    var birth = new Date(+p[0], +p[1] - 1, +p[2]);
    if (isNaN(birth.getTime())) return null;
    var now = new Date();
    var age = now.getFullYear() - birth.getFullYear();
    var m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  // Condizioni usate negli attributi data-ic-show="..." (più condizioni: "a|b")
  var CONDITIONS = {
    'tipo-mancante': function (f) { return !radioValue(f, 'tipo'); },
    'scuola': function (f) { return radioValue(f, 'tipo') === 'scuola'; },
    'esordiente': function (f) { return radioValue(f, 'tipo') === 'esordiente'; },
    // Solo chi partecipa senza una scuola (esordiente): per le scuole il blocco non compare (Art. 5)
    'minorenne': function (f) {
      var a = ageFrom(f.elements.data_nascita.value);
      return radioValue(f, 'tipo') === 'esordiente' && a !== null && a < 18;
    },
    'cat-a': function (f) { return radioValue(f, 'cat_illustrazione') === 'A'; },
    'cat-b': function (f) { return radioValue(f, 'cat_illustrazione') === 'B'; },
    'illustrazione': function (f) { return ['A', 'B'].indexOf(radioValue(f, 'cat_illustrazione')) !== -1; },
    'poesia': function (f) { return f.elements.cat_poesia.checked; },
    'nessuna-categoria': function (f) { return !CONDITIONS.illustrazione(f) && !CONDITIONS.poesia(f); }
  };

  function applyConditions(form) {
    form.querySelectorAll('[data-ic-show]').forEach(function (block) {
      var names = block.getAttribute('data-ic-show').split('|');
      block.hidden = !names.some(function (n) { return CONDITIONS[n] && CONDITIONS[n](form); });
    });
    // I campi nei blocchi nascosti vengono disattivati: non sono obbligatori e non vengono inviati
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      var off = !!el.closest('[data-ic-show][hidden]');
      if (el.disabled !== off) {
        el.disabled = off;
        if (off) clearError(el);
      }
    });
    // Almeno una categoria (A, B o C)
    var first = form.querySelector('input[name="cat_illustrazione"]');
    var hasIllustration = ['A', 'B'].indexOf(radioValue(form, 'cat_illustrazione')) !== -1;
    var hasPoetry = form.elements.cat_poesia.checked;
    var categoryMsg = '';
    if (radioValue(form, 'cat_illustrazione') === 'nessuna' && !hasPoetry) {
      categoryMsg = 'Scegli almeno una categoria: illustrazione (A o B) e/o poesia (C).';
    } else if (radioValue(form, 'tipo') === 'esordiente' && hasIllustration && hasPoetry) {
      // Esordienti: una sola sezione per iscrizione; l'altra richiede una seconda iscrizione e una seconda quota
      categoryMsg = 'Come esordiente puoi iscriverti a una sola sezione per volta: scegli illustrazione (A o B) oppure poesia (C). Per l’altra sezione compila una seconda iscrizione.';
    }
    first.setCustomValidity(categoryMsg);
    if (form.hasAttribute('data-submitted')) validateOne(first);
  }

  // Esordienti: una sola sezione per iscrizione (illustrazione oppure poesia).
  // Scegliendo una sezione, l'altra viene deselezionata.
  function enforceSingleSection(form, target) {
    if (!target || radioValue(form, 'tipo') !== 'esordiente') return;
    var poesia = form.elements.cat_poesia;
    if (target === poesia && poesia.checked) {
      var none = document.getElementById('cat-nessuna');
      if (none) none.checked = true;
    } else if (target.name === 'cat_illustrazione' && (target.value === 'A' || target.value === 'B')) {
      poesia.checked = false;
    }
  }

  function sizeMb(bytes) {
    return (bytes / 1048576).toFixed(1).replace('.', ',');
  }

  function checkA3(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth;
        var h = img.naturalHeight;
        URL.revokeObjectURL(url);
        var dims = w + ' × ' + h + ' px';
        // Verticale o orizzontale: si confrontano lato corto e lato lungo
        var shortSide = Math.min(w, h);
        var longSide = Math.max(w, h);
        if (shortSide < A3.w * (1 - A3.tolerance) || longSide < A3.h * (1 - A3.tolerance)) {
          return resolve({ msg: 'Il file è ' + dims + ': per un A3 a 300 DPI servono almeno ' + A3.w + ' × ' + A3.h + ' px (o ' + A3.h + ' × ' + A3.w + ' px in orizzontale).' });
        }
        if (Math.abs(longSide / shortSide - A3.h / A3.w) > 0.045) {
          return resolve({ msg: 'Le proporzioni (' + dims + ') non corrispondono a un foglio A3 (29,7 × 42 cm).' });
        }
        resolve({ msg: '', dims: dims });
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        resolve({ msg: 'Non riesco a leggere l’immagine: prova a esportarla di nuovo in JPG o PNG.' });
      };
      img.src = url;
    });
  }

  function initFileChecks(form) {
    form.querySelectorAll('input[type="file"][data-max-mb]').forEach(function (input) {
      var info = document.createElement('p');
      info.className = 'ic-file-info';
      info.setAttribute('aria-live', 'polite');
      input.insertAdjacentElement('afterend', info);

      input.addEventListener('change', function () {
        input.setCustomValidity('');
        info.textContent = '';
        input._icCheck = null;
        var file = input.files && input.files[0];
        if (!file) return;

        var max = parseFloat(input.getAttribute('data-max-mb'));
        var ext = (file.name.split('.').pop() || '').toLowerCase();
        var allowed = input.accept.split(',').map(function (s) { return s.trim().replace('.', '').toLowerCase(); });

        function done(extra) {
          if (!input.validationMessage) info.textContent = '✓ ' + file.name + ' (' + sizeMb(file.size) + ' MB' + (extra ? ', ' + extra : '') + ')';
          validateOne(input);
        }

        if (allowed.indexOf(ext) === -1) {
          input.setCustomValidity('Formato non accettato. Formati ammessi: ' + allowed.join(', ').toUpperCase() + '.');
          return done();
        }
        if (file.size > max * 1048576) {
          input.setCustomValidity('Il file pesa ' + sizeMb(file.size) + ' MB: il massimo è ' + max + ' MB.');
          return done();
        }
        if (input.hasAttribute('data-a3') && /^(jpe?g|png)$/.test(ext)) {
          input._icCheck = checkA3(file).then(function (r) {
            if (input.files[0] !== file) return; // nel frattempo è stato scelto un altro file
            input.setCustomValidity(r.msg);
            done(r.dims);
          });
        } else {
          done();
        }
      });
    });
  }

  function countWords(text) {
    // Conta le parole (Art. 4/a: da 50 a 300): i segni di punteggiatura isolati non contano come parole
    return text
      .replace(/[^\p{L}\p{N}\s'’-]/gu, ' ')
      .split(/\s+/)
      .filter(function (w) { return /[\p{L}\p{N}]/u.test(w); })
      .length;
  }

  function initWordCounters(form) {
    form.querySelectorAll('textarea[data-min-words]').forEach(function (area) {
      var min = +area.getAttribute('data-min-words');
      var max = +area.getAttribute('data-max-words');
      var badge = document.getElementById(area.getAttribute('data-counter'));
      function update() {
        var n = countWords(area.value);
        var ok = n >= min && n <= max;
        var filled = area.value.trim() !== ''; // anche solo spazi o punteggiatura contano come "scritto"
        badge.textContent = n + (n === 1 ? ' parola' : ' parole') + ' (richieste ' + min + '–' + max + ')';
        badge.classList.toggle('is-ok', ok);
        badge.classList.toggle('is-ko', !ok && filled);
        area.setCustomValidity(filled && !ok ? 'La poesia ha ' + n + ' parole: ne servono da ' + min + ' a ' + max + ', titolo escluso.' : '');
      }
      area.addEventListener('input', update);
      update();
    });
  }

  function initCopyButtons(root) {
    root.querySelectorAll('[data-ic-copy]').forEach(function (btn) {
      var label = btn.textContent;
      var timer = 0;
      function say(msg) {
        btn.textContent = msg;
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = label; }, 1800);
      }
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-ic-copy');
        var fail = function () { say('Copia non riuscita'); };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { say('Copiato!'); }, fail);
        } else {
          fail();
        }
      });
    });
  }

  function registrationRecap(form) {
    var f = form.elements;
    var cats = [];
    if (CONDITIONS['cat-a'](form)) cats.push('A – Illustrazione');
    if (CONDITIONS['cat-b'](form)) cats.push('B – Illustrazione con IA');
    if (CONDITIONS.poesia(form)) cats.push('C – Poesia');
    var files = Array.prototype.filter.call(form.querySelectorAll('input[type="file"]'), function (i) {
      return !i.disabled && i.files && i.files[0];
    }).map(function (i) { return i.files[0].name; });

    var rows = [
      ['Partecipante', f.nome.value + ' ' + f.cognome.value],
      ['Iscrizione come', radioValue(form, 'tipo') === 'scuola' ? 'Scuola (' + f.scuola_nome.value + ')' : 'Esordiente / non professionista'],
      ['Categorie', cats.join(', ')],
      ['File allegati', files.join(', ') || '—']
    ];
    var ul = document.createElement('ul');
    ul.className = 'ic-recap';
    rows.forEach(function (r) {
      var li = document.createElement('li');
      var b = document.createElement('strong');
      b.textContent = r[0] + ': ';
      li.appendChild(b);
      li.appendChild(document.createTextNode(r[1]));
      ul.appendChild(li);
    });
    return ul;
  }

  function initRegistration() {
    var form = document.getElementById('ic-form-iscrizione');
    if (!form) return;
    var status = document.getElementById('ic-reg-status');

    var today = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    form.elements.data_nascita.max = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

    initFileChecks(form);
    initWordCounters(form);
    initCopyButtons(form);
    applyConditions(form);
    form.addEventListener('change', function (e) {
      enforceSingleSection(form, e.target);
      applyConditions(form);
    });
    form.addEventListener('input', function (e) {
      if (e.target.name === 'data_nascita') applyConditions(form);
    });

    initForm(form, {
      summary: document.getElementById('ic-reg-errors'),
      beforeValidate: applyConditions,
      onSuccess: function () {
        // TODO WordPress: l'invio vero lo gestisce il plugin dei moduli (vedi la guida GUIDA-WORDPRESS.html, file a parte)
        status.innerHTML = '';
        var p = document.createElement('p');
        p.innerHTML = '<strong>Prova riuscita: tutti i controlli sono superati.</strong> ' +
          'Questa è una versione dimostrativa, quindi nessun dato è stato inviato.';
        status.appendChild(p);
        status.appendChild(registrationRecap(form));
        if (radioValue(form, 'tipo') === 'esordiente') {
          var reminder = document.createElement('p');
          reminder.textContent = 'Ricorda: ogni iscrizione vale per una sola sezione. Per partecipare anche all’altra sezione compila una seconda iscrizione e versa una seconda quota di € 15,00.';
          status.appendChild(reminder);
        }
        status.classList.add('is-visible');
        status.focus();
      }
    });
  }

  function initContact() {
    var form = document.getElementById('form-info');
    if (!form) return;
    var status = document.getElementById('form-status');
    initForm(form, {
      onSuccess: function () {
        // TODO WordPress: sostituire con il modulo del plugin (vedi la guida GUIDA-WORDPRESS.html, file a parte)
        status.textContent = 'Grazie! La tua richiesta è stata registrata. (Modalità di prova: nessun messaggio è stato inviato.)';
        status.classList.add('is-visible');
        form.reset();
        form.removeAttribute('data-submitted');
      }
    });
  }

  /* ---------- 4. Avvio ---------- */
  function start() {
    initMenu();
    initStickyAsides();
    initContact();
    initRegistration();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();