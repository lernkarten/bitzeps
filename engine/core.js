/*
 * core.js – Grundgerüst der Engine.
 * Muss als ERSTES Skript geladen werden (vor allen Blättern).
 *
 * Stellt bereit:
 *  - window.registerBlatt(blatt)   → von den Dateien in blaetter/ aufgerufen
 *  - window.EE                     → Namensraum der Engine (Renderer, Hilfsfunktionen)
 *  - Entwicklungsbanner für Fehler (auch Syntaxfehler in Blatt-Dateien)
 *
 * Keine Speicherung: alles liegt nur in JavaScript-Variablen.
 */
(function () {
  "use strict";

  var EE = (window.EE = window.EE || {});

  // ---------------------------------------------------------------
  // Zentrale Einstellungen (nur hier ändern)
  // ---------------------------------------------------------------
  EE.KONFIG = {
    // Wertung bei "zuordnen":
    //   "proKarte" → 1 Punkt pro richtig zugeordneter Karte (Teilpunkte)
    //   "alles"    → Punkte nur, wenn alle Karten richtig liegen
    zuordnenWertung: "proKarte",
    nameMaxLaenge: 20,

    // NUR FÜR DIE ENTWICKLUNG: zeigt auf jeder Seite einen Knopf „Überspringen“.
    // Vor der Veröffentlichung auf false setzen!
    entwicklung: false
  };

  EE.renderers = {}; // typ → Renderer-Objekt (siehe engine/renderers/)
  EE.blaetterRoh = []; // { blatt, datei } – noch nicht geprüft
  EE.moduleRoh = []; // { modul, datei } – noch nicht geprüft
  EE.meldungen = []; // { art: "fehler" | "hinweis", text }
  EE.fehlendeDateien = []; // <script>-Dateien, die nicht geladen werden konnten

  // ---------------------------------------------------------------
  // Registrierung der Blätter
  // ---------------------------------------------------------------
  window.registerBlatt = function (blatt) {
    var script = document.currentScript;
    var datei = script ? script.getAttribute("src") : "unbekannte Datei";
    EE.blaetterRoh.push({ blatt: blatt, datei: datei });
  };

  // Module fassen Blätter (Übungen) zusammen, z. B. Modul 12 „Fotos von anderen“.
  // Ein Blatt gehört zum Modul, dessen Nummer vor dem Bindestrich steht ("12-IV" → Modul "12").
  window.registerModul = function (modul) {
    var script = document.currentScript;
    var datei = script ? script.getAttribute("src") : "unbekannte Datei";
    EE.moduleRoh.push({ modul: modul, datei: datei });
  };

  /** Modulnummer eines Blatts: "12-IV" → "12", 12 → "12", ohne Nummer → null. */
  EE.modulNummerVon = function (blatt) {
    if (blatt.nummer === undefined || blatt.nummer === null) return null;
    return String(blatt.nummer).split("-")[0].trim() || null;
  };

  // ---------------------------------------------------------------
  // Entwicklungsbanner
  // ---------------------------------------------------------------
  EE.melde = function (art, text) {
    EE.meldungen.push({ art: art, text: text });
    (art === "fehler" ? console.error : console.warn)("[Bitzeps] " + text);
    zeigeBanner();
  };
  EE.meldeFehler = function (text) { EE.melde("fehler", text); };
  EE.meldeHinweis = function (text) { EE.melde("hinweis", text); };

  function zeigeBanner() {
    var banner = document.getElementById("dev-banner");
    if (!banner) return;
    var anzahlFehler = EE.meldungen.filter(function (m) { return m.art === "fehler"; }).length;
    var anzahlHinweise = EE.meldungen.length - anzahlFehler;

    banner.innerHTML = "";
    banner.className = anzahlFehler ? "dev-banner hat-fehler" : "dev-banner";
    var titel = [];
    if (anzahlFehler) titel.push(anzahlFehler + " Fehler");
    if (anzahlHinweise) titel.push(anzahlHinweise + (anzahlHinweise === 1 ? " Hinweis" : " Hinweise"));
    banner.appendChild(EE.el("strong", { text: "⚠ Prüfung der Aufgaben: " + titel.join(", ") }));

    var liste = EE.el("ul");
    EE.meldungen.forEach(function (m) {
      liste.appendChild(EE.el("li", { class: "meldung-" + m.art, text: (m.art === "fehler" ? "Fehler: " : "Hinweis: ") + m.text }));
    });
    banner.appendChild(liste);
    banner.appendChild(EE.el("button", {
      type: "button",
      class: "banner-zu",
      text: "Ausblenden",
      onclick: function () { banner.hidden = true; }
    }));
    banner.hidden = false;
  }

  // Syntaxfehler in Blatt-Dateien und fehlende Skript-Dateien abfangen
  window.addEventListener("error", function (e) {
    var ziel = e.target;
    if (ziel && ziel.tagName === "SCRIPT") {
      EE.fehlendeDateien.push(ziel.getAttribute("src"));
      EE.meldeFehler("Datei nicht gefunden: " + ziel.getAttribute("src") + " (Dateiname im <script>-Tag prüfen)");
      return;
    }
    if (ziel && ziel.tagName === "IMG") return; // Bilder meldet validate.js
    if (!e.filename || e.message === "Script error.") {
      // Bei Doppelklick-Start (file://) verrät der Browser keine Details.
      EE.meldeFehler("Eine Datei enthält einen Fehler (Details: Browser-Konsole, Taste F12).");
      return;
    }
    var ort = e.filename.split("/").slice(-2).join("/") + ", Zeile " + e.lineno;
    EE.meldeFehler(ort + ": " + e.message);
  }, true);

  // ---------------------------------------------------------------
  // Hilfsfunktionen
  // ---------------------------------------------------------------

  /** Erzeugt ein Element. attrs: class, text, onclick, sonstige Attribute. */
  EE.el = function (tag, attrs, kinder) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === undefined || v === null || v === false) return;
        if (k === "text") e.textContent = v;
        else if (k === "class") e.className = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function") e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? "" : v);
      });
    }
    (kinder || []).forEach(function (k) {
      if (k) e.appendChild(typeof k === "string" ? document.createTextNode(k) : k);
    });
    return e;
  };

  /** Gibt eine gemischte Kopie zurück (Fisher-Yates). */
  EE.mischen = function (liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  /** Für tolerante Textvergleiche: klein, ohne Rand-Leerzeichen, ohne Satzzeichen am Ende. */
  EE.normalisiere = function (text) {
    return String(text)
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.!?,;:]+$/, "")
      .trim();
  };
})();
