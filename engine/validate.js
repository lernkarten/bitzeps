/*
 * validate.js – prüft Blätter gegen das Schema (siehe instructions.md, Abschnitt 4).
 *
 * Ergebnis pro Blatt: { fehler: [...], hinweise: [...] }
 *  - fehler   → Blatt wird NICHT angeboten (andere Blätter laufen weiter)
 *  - hinweise → Blatt läuft, aber etwas sollte verbessert werden (z. B. Tippfehler im Feldnamen)
 */
(function () {
  "use strict";

  var EE = window.EE;

  var BLATT_FELDER = ["id", "titel", "nummer", "beschreibung", "tipps", "seiten"];
  var AUFGABE_FELDER = ["typ", "thema", "stufe", "bild", "bildQuelle", "erklaerung", "punkte"];
  var TYP_FELDER = {
    "info": ["typ", "titel", "text", "merksatz", "textDanach", "abschnitte", "kasten", "tippsAnzeigen", "bild", "bildQuelle", "stichpunkte"],
    "multiple-choice": AUFGABE_FELDER.concat(["frage", "optionen", "richtig"]),
    "wahr-falsch": AUFGABE_FELDER.concat(["aussage", "richtig"]),
    "eintippen": AUFGABE_FELDER.concat(["frage", "akzeptiert"]),
    "zuordnen": AUFGABE_FELDER.concat(["anweisung", "gruppen", "karten", "stil"]),
    "ja-nein": AUFGABE_FELDER.concat(["frage", "antworten", "aussagen"]),
    "freies-html": AUFGABE_FELDER.concat(["html", "onMount", "bewertet"]),
    "quiz": ["typ", "thema", "stufe", "titel", "aufgaben", "erklaerung"]
  };

  function istText(v) { return typeof v === "string" && v.trim() !== ""; }
  function istGanzzahl(v) { return typeof v === "number" && Math.floor(v) === v; }
  function istIndex(v, laenge) { return istGanzzahl(v) && v >= 0 && v < laenge; }
  function istTextListe(v, min) {
    return Array.isArray(v) && v.length >= min && v.every(istText);
  }

  /** Ist diese Seite eine bewertete Aufgabe (zählt Punkte)? */
  EE.istBewertet = function (seite) {
    var r = EE.renderers[seite.typ];
    return !!(r && r.bewertet(seite));
  };

  EE.validiereBlatt = function (blatt) {
    var fehler = [];
    var hinweise = [];

    if (!blatt || typeof blatt !== "object") {
      return { fehler: ["registerBlatt() wurde ohne Blatt-Objekt aufgerufen."], hinweise: hinweise };
    }

    // --- Blatt ---
    if (!istText(blatt.id)) fehler.push("Feld „id“ fehlt.");
    else if (!/^[a-z0-9-]+$/.test(blatt.id)) fehler.push("„id“ darf nur kleine Buchstaben, Ziffern und Bindestriche enthalten (ohne Umlaute): „" + blatt.id + "“");
    if (!istText(blatt.titel)) fehler.push("Feld „titel“ fehlt.");
    if (blatt.nummer !== undefined && typeof blatt.nummer !== "number" && !istText(blatt.nummer)) fehler.push("„nummer“ muss eine Zahl oder ein Text sein, z. B. 12 oder \"12-II\".");
    if (blatt.beschreibung !== undefined && !istText(blatt.beschreibung)) fehler.push("„beschreibung“ muss ein Text sein.");
    if (blatt.tipps !== undefined && !istTextListe(blatt.tipps, 1)) fehler.push("„tipps“ muss eine Liste von Texten sein.");
    unbekannteFelder(blatt, BLATT_FELDER, "Blatt", hinweise);

    if (!Array.isArray(blatt.seiten) || blatt.seiten.length === 0) {
      fehler.push("„seiten“ muss eine Liste mit mindestens einer Seite sein.");
      return { fehler: fehler, hinweise: hinweise };
    }

    // --- Seiten ---
    blatt.seiten.forEach(function (seite, i) {
      var wo = "Seite " + (i + 1) + (seite && seite.typ ? " (" + seite.typ + ")" : "");
      var f = function (text) { fehler.push(wo + ": " + text); };
      var h = function (text) { hinweise.push(wo + ": " + text); };

      if (!seite || typeof seite !== "object") { f("ist kein Objekt."); return; }
      if (!EE.renderers[seite.typ]) {
        f("unbekannter Typ „" + seite.typ + "“. Erlaubt: " + Object.keys(EE.renderers).join(", "));
        return;
      }

      unbekannteFelder(seite, TYP_FELDER[seite.typ] || [], wo, hinweise);

      // Bild
      if (seite.bild !== undefined) {
        if (!istText(seite.bild)) f("„bild“ muss ein Pfad sein, z. B. \"bilder/foto.jpg\".");
        else if (/^(https?:)?\/\//i.test(seite.bild)) f("„bild“ muss eine lokale Datei sein (keine Internet-Adresse).");
        if (!istText(seite.bildQuelle)) f("„bildQuelle“ fehlt (Pflicht, wenn ein Bild angegeben ist).");
      }

      // Gemeinsame Felder bewerteter Aufgaben
      if (EE.istBewertet(seite)) {
        if (!istText(seite.thema)) f("„thema“ fehlt.");
        if (![1, 2, 3].includes(seite.stufe)) f("„stufe“ muss 1, 2 oder 3 sein.");
        if (seite.punkte !== undefined && !(istGanzzahl(seite.punkte) && seite.punkte > 0)) f("„punkte“ muss eine ganze Zahl größer 0 sein.");
        // Beim Quiz haben die Teilaufgaben eigene Erklärungen
        if (!istText(seite.erklaerung) && seite.typ !== "quiz") h("„erklaerung“ fehlt (empfohlen: kurz erklären, warum).");
      }

      // Typ-spezifisch
      switch (seite.typ) {
        case "info":
          if (!istText(seite.titel) && !istText(seite.text) && !seite.stichpunkte && !seite.kasten && !seite.abschnitte && !seite.merksatz) f("braucht mindestens „titel“, „text“, „abschnitte“, „kasten“ oder „stichpunkte“.");
          if (seite.abschnitte !== undefined) {
            if (!Array.isArray(seite.abschnitte) || seite.abschnitte.length === 0) f("„abschnitte“ muss eine Liste mit mindestens einem Abschnitt sein.");
            else seite.abschnitte.forEach(function (a, ai) {
              var wa = "Abschnitt " + (ai + 1);
              if (!a || !istText(a.text)) { f(wa + ": „text“ fehlt."); return; }
              if (a.titel !== undefined && !istText(a.titel)) f(wa + ": „titel“ muss ein Text sein.");
              if (a.symbol !== undefined && !istText(a.symbol)) f(wa + ": „symbol“ muss ein Text sein (z. B. ein Emoji).");
              if (a.farbe !== undefined && ["blau", "gruen", "gelb", "rot"].indexOf(a.farbe) === -1) f(wa + ": „farbe“ kennt nur \"blau\", \"gruen\", \"gelb\", \"rot\".");
              unbekannteFelder(a, ["symbol", "titel", "text", "farbe"], wo + ", " + wa, hinweise);
            });
          }
          if (seite.kasten !== undefined && !istText(seite.kasten)) f("„kasten“ muss ein Text sein.");
          if (seite.textDanach !== undefined && !istText(seite.textDanach)) f("„textDanach“ muss ein Text sein.");
          if (seite.merksatz !== undefined) {
            if (!seite.merksatz || typeof seite.merksatz !== "object") f("„merksatz“ muss { begriff, text } sein.");
            else {
              if (!istText(seite.merksatz.begriff)) f("„merksatz“: „begriff“ fehlt.");
              if (!istText(seite.merksatz.text)) f("„merksatz“: „text“ fehlt.");
              unbekannteFelder(seite.merksatz, ["symbol", "begriff", "text"], wo + ", merksatz", hinweise);
            }
          }
          if (seite.tippsAnzeigen !== undefined && typeof seite.tippsAnzeigen !== "boolean") f("„tippsAnzeigen“ muss true oder false sein.");
          if (seite.tippsAnzeigen === true && !istTextListe(blatt.tipps, 1)) f("„tippsAnzeigen: true“, aber das Blatt hat keine „tipps“.");
          if (seite.stichpunkte !== undefined && !istTextListe(seite.stichpunkte, 1)) f("„stichpunkte“ muss eine Liste von Texten sein.");
          break;

        case "multiple-choice":
          if (!istText(seite.frage)) f("„frage“ fehlt.");
          if (!istTextListe(seite.optionen, 2)) { f("„optionen“ braucht mindestens zwei Texte."); break; }
          if (Array.isArray(seite.richtig)) {
            if (seite.richtig.length === 0) f("„richtig“ ist eine leere Liste.");
            seite.richtig.forEach(function (r) {
              if (!istIndex(r, seite.optionen.length)) f("„richtig“ enthält ungültigen Index " + JSON.stringify(r) + " (erlaubt 0 bis " + (seite.optionen.length - 1) + ").");
            });
            if (new Set(seite.richtig).size !== seite.richtig.length) f("„richtig“ enthält einen Index doppelt.");
          } else if (!istIndex(seite.richtig, seite.optionen.length)) {
            f("„richtig“ muss ein Index von 0 bis " + (seite.optionen.length - 1) + " sein (0 = erste Option).");
          }
          if (new Set(seite.optionen.map(EE.normalisiere)).size !== seite.optionen.length) f("zwei Optionen sind gleich.");
          break;

        case "wahr-falsch":
          if (!istText(seite.aussage)) f("„aussage“ fehlt.");
          if (typeof seite.richtig !== "boolean") f("„richtig“ muss true oder false sein (ohne Anführungszeichen).");
          break;

        case "eintippen":
          if (!istText(seite.frage)) f("„frage“ fehlt.");
          if (!istTextListe(seite.akzeptiert, 1)) f("„akzeptiert“ muss eine Liste mit mindestens einer Antwort sein (auch Zahlen in Anführungszeichen, z. B. \"8\").");
          break;

        case "zuordnen":
          if (!istText(seite.anweisung)) f("„anweisung“ fehlt.");
          if (!istTextListe(seite.gruppen, 2)) { f("„gruppen“ braucht mindestens zwei Texte."); break; }
          if (!Array.isArray(seite.karten) || seite.karten.length === 0) { f("„karten“ braucht mindestens eine Karte."); break; }
          seite.karten.forEach(function (k, ki) {
            if (!k || !istText(k.text)) f("Karte " + (ki + 1) + ": „text“ fehlt.");
            else if (!istIndex(k.gruppe, seite.gruppen.length)) f("Karte „" + k.text + "“: „gruppe“ muss ein Index von 0 bis " + (seite.gruppen.length - 1) + " sein.");
            if (k && k.hinweis !== undefined && !istText(k.hinweis)) f("Karte " + (ki + 1) + ": „hinweis“ muss ein Text sein.");
            if (k) unbekannteFelder(k, ["text", "gruppe", "hinweis"], wo + ", Karte " + (ki + 1), hinweise);
          });
          if (seite.stil !== undefined && seite.stil !== "ampel" && seite.stil !== "gruen-rot") f("„stil“ kennt nur \"ampel\" (3 Gruppen) und \"gruen-rot\" (2 Gruppen).");
          if (seite.stil === "gruen-rot" && seite.gruppen.length !== 2) f("„stil: gruen-rot“ braucht genau zwei Gruppen (z. B. Erlaubt / Nicht erlaubt).");
          if (seite.stil === "ampel" && seite.gruppen.length !== 3) f("„stil: ampel“ braucht genau drei Gruppen (Grün, Gelb, Rot).");
          break;

        case "ja-nein":
          if (!istText(seite.frage)) f("„frage“ fehlt (z. B. \"Ist das in Ordnung?\").");
          if (seite.antworten !== undefined && !(istTextListe(seite.antworten, 2) && seite.antworten.length === 2)) f("„antworten“ muss genau zwei Texte haben, z. B. [\"Ja\", \"Nein\"].");
          if (!Array.isArray(seite.aussagen) || seite.aussagen.length === 0) { f("„aussagen“ braucht mindestens eine Aussage."); break; }
          seite.aussagen.forEach(function (a, ai) {
            var wa = "Aussage " + (ai + 1);
            if (!a || !istText(a.text)) { f(wa + ": „text“ fehlt."); return; }
            if (typeof a.richtig !== "boolean") f(wa + " („" + a.text + "“): „richtig“ muss true (= Ja) oder false (= Nein) sein, ohne Anführungszeichen.");
            if (!istText(a.erklaerung)) h(wa + ": „erklaerung“ fehlt (empfohlen).");
            unbekannteFelder(a, ["text", "richtig", "erklaerung"], wo + ", " + wa, hinweise);
          });
          break;

        case "quiz":
          if (seite.titel !== undefined && !istText(seite.titel)) f("„titel“ muss ein Text sein.");
          if (!Array.isArray(seite.aufgaben) || seite.aufgaben.length === 0) { f("„aufgaben“ braucht mindestens eine Aufgabe."); break; }
          seite.aufgaben.forEach(function (t, ti) {
            var wt = "Aufgabe " + (ti + 1);
            if (!t || typeof t !== "object") { f(wt + " ist kein Objekt."); return; }
            if (EE.QUIZ_TYPEN.indexOf(t.typ) === -1) { f(wt + ": Typ „" + t.typ + "“ geht im Quiz nicht. Erlaubt: " + EE.QUIZ_TYPEN.join(", ")); return; }
            // Teilaufgabe wie eine eigene Seite prüfen; thema/stufe erbt sie vom Quiz
            var teil = Object.assign({ thema: seite.thema, stufe: seite.stufe }, t);
            var erg = EE.validiereBlatt({ id: "quiz", titel: "Quiz", seiten: [teil] });
            var ersetze = function (m) { return m.replace(/^Seite 1/, wo + ", " + wt); };
            erg.fehler.forEach(function (m) { fehler.push(ersetze(m)); });
            erg.hinweise.forEach(function (m) { if (/^Seite 1/.test(m)) hinweise.push(ersetze(m)); });
          });
          break;

        case "freies-html":
          if (typeof seite.html !== "string") f("„html“ fehlt.");
          else if (/(src|href)\s*=\s*["']?\s*(https?:)?\/\//i.test(seite.html)) f("„html“ verweist auf eine Internet-Adresse. Nur lokale Dateien sind erlaubt.");
          if (seite.onMount !== undefined && typeof seite.onMount !== "function") f("„onMount“ muss eine Funktion sein.");
          if (seite.bewertet !== undefined && typeof seite.bewertet !== "boolean") f("„bewertet“ muss true oder false sein.");
          if (seite.bewertet === true && typeof seite.onMount !== "function") f("„bewertet: true“ braucht eine „onMount“-Funktion, die api.antwort(true/false) aufruft.");
          break;
      }
    });

    if (!blatt.seiten.some(function (s) { return s && EE.renderers[s.typ] && EE.istBewertet(s); })) {
      hinweise.push("Das Blatt enthält keine bewertete Aufgabe (nur Erklärseiten).");
    }

    return { fehler: fehler, hinweise: hinweise };
  };

  function unbekannteFelder(obj, erlaubt, wo, hinweise) {
    Object.keys(obj).forEach(function (k) {
      if (erlaubt.indexOf(k) === -1) hinweise.push(wo + ": unbekanntes Feld „" + k + "“ wird ignoriert. Tippfehler? (Umlaute schreiben: ae, oe, ue)");
    });
  }

  /** Prüft ein Modul aus blaetter/module.js. Ergebnis wie bei validiereBlatt. */
  EE.validiereModul = function (modul) {
    var fehler = [], hinweise = [];
    if (!modul || typeof modul !== "object") return { fehler: ["registerModul() wurde ohne Modul-Objekt aufgerufen."], hinweise: hinweise };
    if (typeof modul.nummer !== "number" && !istText(modul.nummer)) fehler.push("„nummer“ fehlt (z. B. \"12\").");
    else if (String(modul.nummer).indexOf("-") !== -1) fehler.push("„nummer“ eines Moduls hat keinen Bindestrich (\"12\", nicht \"12-I\").");
    if (!istText(modul.titel)) fehler.push("„titel“ fehlt.");
    if (modul.beschreibung !== undefined && !istText(modul.beschreibung)) fehler.push("„beschreibung“ muss ein Text sein.");
    unbekannteFelder(modul, ["nummer", "titel", "beschreibung"], "Modul", hinweise);
    return { fehler: fehler, hinweise: hinweise };
  };

  /** Prüft (asynchron), ob ein Bild geladen werden kann. */
  EE.pruefeBild = function (pfad, wo) {
    var img = new Image();
    img.onerror = function () { EE.meldeFehler(wo + ": Bild nicht gefunden: " + pfad); };
    img.src = pfad;
  };
})();
