/*
 * app.js – Ablaufsteuerung: Start → Blattauswahl → Seiten → Ergebnis.
 * Muss als LETZTES Skript geladen werden (nach allen Blättern).
 */
(function () {
  "use strict";

  var EE = window.EE, el = EE.el;
  var main = document.getElementById("app");
  var kopf = document.getElementById("kopf");

  var DOPPELTIPP_SPERRE_MS = 350; // verhindert, dass ein Doppeltipp auf „Weiter“ eine Seite überspringt

  var blaetter = []; // geprüfte, nutzbare Blätter
  var module = []; // { nummer, titel, beschreibung, blaetter: [] } – sortiert, nur mit Blättern
  var durchgang = null; // aktueller Durchlauf eines Blatts

  // ---------------------------------------------------------------
  // Quelle der Aufgaben.
  // Stufe 1/2: statisch aus blaetter/. Für Stufe 3 (Server) nur dieses Objekt austauschen;
  // die Renderer bleiben unverändert.
  // ---------------------------------------------------------------
  EE.quelle = {
    module: function () { return module; },
    blaetter: function () { return blaetter; },
    seiten: function (blatt) { return blatt.seiten.slice(); }
  };

  // ---------------------------------------------------------------
  // Start: Blätter prüfen
  // ---------------------------------------------------------------
  function init() {
    var ids = {};

    // Blatt-Dateien, die geladen wurden, aber kein Blatt registriert haben → meist ein Syntaxfehler
    var registriert = EE.blaetterRoh.map(function (e) { return e.datei; })
      .concat(EE.moduleRoh.map(function (e) { return e.datei; }));
    Array.prototype.forEach.call(document.querySelectorAll("script[src]"), function (s) {
      var src = s.getAttribute("src");
      if (src.indexOf("engine/") === 0 || registriert.indexOf(src) !== -1 || EE.fehlendeDateien.indexOf(src) !== -1) return;
      EE.meldeFehler(src + ": hat kein Blatt registriert. Wahrscheinlich ein Tippfehler in der Datei (fehlendes Komma, Klammer oder Anführungszeichen).");
    });

    EE.blaetterRoh.forEach(function (eintrag) {
      var blatt = eintrag.blatt;
      var name = eintrag.datei + (blatt && blatt.id ? " (Blatt „" + blatt.id + "“)" : "");
      var erg;
      try {
        erg = EE.validiereBlatt(blatt);
      } catch (e) {
        erg = { fehler: ["Prüfung abgebrochen: " + e.message], hinweise: [] };
      }
      if (!erg.fehler.length && ids[blatt.id]) {
        erg.fehler.push("Die id „" + blatt.id + "“ gibt es schon in " + ids[blatt.id] + ".");
      }
      erg.hinweise.forEach(function (h) { EE.meldeHinweis(name + ": " + h); });
      if (erg.fehler.length) {
        erg.fehler.forEach(function (f) { EE.meldeFehler(name + ": " + f); });
        EE.meldeFehler(name + ": Dieses Blatt wird erst angezeigt, wenn die Fehler behoben sind.");
        return;
      }
      ids[blatt.id] = eintrag.datei;
      blaetter.push(blatt);
      blatt.seiten.forEach(function (s, i) {
        if (s.bild) EE.pruefeBild(s.bild, name + ", Seite " + (i + 1));
      });
    });

    // Sortierung nach Modulnummer: 12 vor "12-II" vor 13; Blätter ohne Nummer ans Ende
    blaetter.sort(function (a, b) {
      var na = a.nummer === undefined ? Infinity : parseFloat(a.nummer);
      var nb = b.nummer === undefined ? Infinity : parseFloat(b.nummer);
      if (isNaN(na)) na = Infinity;
      if (isNaN(nb)) nb = Infinity;
      return (na - nb)
        || String(a.nummer || "").localeCompare(String(b.nummer || ""), "de", { numeric: true })
        || a.titel.localeCompare(b.titel, "de");
    });

    baueModule();
    zeigeStart();
  }

  /** Prüft die Module und ordnet ihnen die Blätter zu (über die Nummer vor dem Bindestrich). */
  function baueModule() {
    var nachNummer = {};
    EE.moduleRoh.forEach(function (eintrag) {
      var m = eintrag.modul;
      var name = eintrag.datei + (m && m.titel ? " (Modul „" + m.titel + "“)" : "");
      var erg = EE.validiereModul(m);
      if (!erg.fehler.length && nachNummer[String(m.nummer)]) erg.fehler.push("Die Modulnummer „" + m.nummer + "“ gibt es zweimal.");
      erg.hinweise.forEach(function (h) { EE.meldeHinweis(name + ": " + h); });
      if (erg.fehler.length) { erg.fehler.forEach(function (f) { EE.meldeFehler(name + ": " + f); }); return; }
      nachNummer[String(m.nummer)] = { nummer: String(m.nummer), titel: m.titel, beschreibung: m.beschreibung, blaetter: [] };
    });

    var weitere = { nummer: null, titel: "Weitere Übungen", beschreibung: null, blaetter: [] };
    blaetter.forEach(function (blatt) {
      var nr = EE.modulNummerVon(blatt);
      if (nr && nachNummer[nr]) { nachNummer[nr].blaetter.push(blatt); return; }
      if (nr) EE.meldeHinweis("Blatt „" + blatt.id + "“ (Nummer " + blatt.nummer + "): Es gibt kein Modul „" + nr + "“ in blaetter/module.js. Das Blatt steht unter „Weitere Übungen“.");
      weitere.blaetter.push(blatt);
    });

    module = Object.keys(nachNummer).map(function (k) { return nachNummer[k]; })
      .filter(function (m) { return m.blaetter.length; })
      .sort(function (a, b) {
        return (parseFloat(a.nummer) - parseFloat(b.nummer)) || a.nummer.localeCompare(b.nummer, "de", { numeric: true });
      });
    if (weitere.blaetter.length) module.push(weitere);
  }

  function modulVon(blatt) {
    for (var i = 0; i < module.length; i++) if (module[i].blaetter.indexOf(blatt) !== -1) return module[i];
    return null;
  }

  /** Höchstmögliche Punkte eines Blatts (alle bewerteten Seiten). */
  function maxPunkteBlatt(blatt) {
    return blatt.seiten.filter(EE.istBewertet).reduce(function (summe, s) {
      return summe + EE.renderers[s.typ].maxPunkte(s);
    }, 0);
  }

  /** Titel ohne Modulnamen: „Fotos von anderen – Fremde Menschen“ → „Fremde Menschen“. */
  function kurztitel(blatt, modul) {
    if (!modul || !modul.nummer) return blatt.titel;
    var praefix = modul.titel.toLowerCase();
    var t = blatt.titel;
    if (t.toLowerCase().indexOf(praefix) !== 0) return t;
    var rest = t.slice(modul.titel.length).replace(/^\s*[–—\-:]\s*/, "");
    return rest || t;
  }

  /** Kleiner Fortschrittsbalken für Kacheln. */
  function stand(text, anteil, fertig) {
    return el("span", { class: "kachel-stand" + (fertig ? " ist-fertig" : "") }, [
      el("span", { class: "kachel-stand-text", text: text }),
      el("span", { class: "kachel-balken", "aria-hidden": "true" }, [
        el("span", { class: "kachel-balken-fuellung", style: "width:" + Math.round(anteil * 100) + "%" })
      ])
    ]);
  }

  // ---------------------------------------------------------------
  // Kopfzeile
  // ---------------------------------------------------------------
  function setzeKopf(opt) {
    kopf.innerHTML = "";
    if (!opt) { kopf.hidden = true; return; }
    kopf.hidden = false;

    var zeile = el("div", { class: "kopf-zeile" });
    zeile.appendChild(el("span", { class: "kopf-titel", text: opt.titel || "" }));
    if (opt.tipps && opt.tipps.length) {
      zeile.appendChild(el("button", {
        type: "button",
        class: "knopf klein tipps-knopf",
        "aria-haspopup": "dialog",
        text: "💡 Tipps",
        onclick: function () { zeigeTipps(opt.tippsTitel, opt.tipps); }
      }));
    }
    if (EE.session.name) zeile.appendChild(el("span", { class: "kopf-name", text: EE.session.name }));
    if (opt.zurueck) {
      var zurueckText = opt.zurueckText || "Zur Übersicht";
      var knopf = el("button", { type: "button", class: "knopf klein", text: zurueckText });
      var bestaetigen = null;
      knopf.addEventListener("click", function () {
        if (!opt.nachfragen || bestaetigen) { clearTimeout(bestaetigen); opt.zurueck(); return; }
        // Zweimal tippen nötig, damit niemand aus Versehen abbricht
        knopf.textContent = "Wirklich aufhören?";
        knopf.classList.add("warnung");
        bestaetigen = setTimeout(function () {
          bestaetigen = null;
          knopf.textContent = zurueckText;
          knopf.classList.remove("warnung");
        }, 3000);
      });
      zeile.appendChild(knopf);
    }
    kopf.appendChild(zeile);

    if (opt.fortschritt) {
      var f = opt.fortschritt;
      var prozent = Math.round((f.aktuell / f.gesamt) * 100);
      kopf.appendChild(el("div", { class: "fortschritt" }, [
        el("span", { class: "fortschritt-text", text: "Seite " + f.aktuell + " von " + f.gesamt }),
        el("div", {
          class: "fortschritt-balken",
          role: "progressbar",
          "aria-label": "Fortschritt",
          "aria-valuemin": "1",
          "aria-valuemax": String(f.gesamt),
          "aria-valuenow": String(f.aktuell)
        }, [el("div", { class: "fortschritt-fuellung", style: "width:" + prozent + "%" })])
      ]));
    }

    if (opt.springe && durchgang) {
      // NUR ENTWICKLUNG: direkt zu jeder Seite springen
      var leiste = el("nav", { class: "dev-sprungleiste", "aria-label": "Zu Seite springen (Entwicklung)" }, [
        el("span", { class: "dev-sprung-label", text: "Springen:" })
      ]);
      durchgang.seiten.forEach(function (s, i) {
        var aktuell = i === durchgang.index;
        var beantwortet = durchgang.antworten[i] !== undefined;
        var vorschau = s.titel || s.frage || s.anweisung || s.aussage || "";
        leiste.appendChild(el("button", {
          type: "button",
          class: "dev-sprung" + (aktuell ? " ist-aktuell" : "") + (beantwortet ? " ist-beantwortet" : ""),
          "aria-current": aktuell ? "page" : null,
          title: (i + 1) + ": " + s.typ + (vorschau ? " – " + vorschau : ""),
          text: (beantwortet ? "✓ " : "") + (i + 1) + " · " + (TYP_KURZ[s.typ] || s.typ),
          onclick: function () { opt.springe(i); }
        }));
      });
      kopf.appendChild(leiste);
    }
  }

  /** Fenster mit den Tipps zur Lektion. Legt sich über die Aufgabe, deren Zustand bleibt erhalten. */
  function zeigeTipps(lektion, tipps) {
    var vorher = document.activeElement;
    var overlay;
    function schliessen() {
      overlay.remove();
      document.removeEventListener("keydown", taste);
      if (vorher && vorher.focus) vorher.focus({ preventScroll: true });
    }
    function taste(e) { if (e.key === "Escape") schliessen(); }
    var zurueck = el("button", { type: "button", class: "knopf haupt", text: "Zurück zur Aufgabe", onclick: schliessen });
    overlay = el("div", {
      class: "tipps-overlay",
      onclick: function (e) { if (e.target === overlay) schliessen(); }
    }, [
      el("div", { class: "tipps-fenster", role: "dialog", "aria-modal": "true", "aria-labelledby": "tipps-titel" }, [
        el("h2", { id: "tipps-titel", class: "tipps-titel", text: "💡 Tipps zur Lektion" }),
        lektion ? el("p", { class: "tipps-lektion", text: lektion }) : null,
        el("ul", { class: "tipps-liste" }, tipps.map(function (t) { return el("li", { text: t }); })),
        el("div", { class: "fuss fuss-mitte" }, [zurueck])
      ])
    ]);
    document.body.appendChild(overlay);
    document.addEventListener("keydown", taste);
    zurueck.focus();
  }

  function neueAnsicht(kinder) {
    var offen = document.querySelector(".tipps-overlay");
    if (offen) offen.remove();
    main.innerHTML = "";
    kinder.forEach(function (k) { main.appendChild(k); });
    window.scrollTo(0, 0);
    var ueberschrift = main.querySelector("h1, h2");
    if (ueberschrift) {
      ueberschrift.setAttribute("tabindex", "-1");
      ueberschrift.focus({ preventScroll: true });
    }
  }

  // ---------------------------------------------------------------
  // 1. Startbildschirm: ausgedachter Name
  // ---------------------------------------------------------------
  function zeigeStart() {
    setzeKopf(null);
    var eingabe = el("input", {
      id: "name-eingabe",
      type: "text",
      class: "eingabe",
      maxlength: String(EE.KONFIG.nameMaxLaenge),
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: "false",
      enterkeyhint: "go"
    });
    var fehler = el("p", { class: "hinweis-pruefen", role: "status", "aria-live": "polite" });
    var form = el("form", { class: "karte start", autocomplete: "off", novalidate: true }, [
      el("div", { class: "marke" }, [
        el("img", { class: "marke-logo", src: "bilder/logo.svg", alt: "", width: "110", height: "100" }),
        el("div", { class: "marke-text" }, [
          el("span", { class: "marke-name" }, [el("span", { class: "marke-bit", text: "Bit" }), "zeps"]),
          el("span", { class: "marke-unterzeile", text: "Grips fürs Netz" })
        ])
      ]),
      el("h1", { text: "Hallo!" }),
      el("p", { class: "fliesstext", text: "Hier kannst du üben, wie du sicher mit Handy, Tablet und Internet umgehst." }),
      el("label", { for: "name-eingabe", class: "label", text: "Dein ausgedachter Name" }),
      eingabe,
      el("p", { class: "hinweis", text: "Nimm einen ausgedachten Namen, nicht deinen echten." }),
      fehler,
      el("button", { type: "submit", class: "knopf haupt", text: "Los geht’s" }),
      el("p", { class: "datenschutz", text: "Nichts wird gespeichert. Wenn du die Seite schließt, ist alles weg." })
    ]);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = eingabe.value.replace(/\s+/g, " ").trim();
      if (!name) { fehler.textContent = "Bitte gib zuerst einen ausgedachten Namen ein."; eingabe.focus(); return; }
      EE.session.starte(name);
      zeigeUebersicht();
    });
    neueAnsicht([form]);
  }

  // ---------------------------------------------------------------
  // 2a. Modulauswahl
  // ---------------------------------------------------------------
  function zeigeUebersicht() {
    durchgang = null;
    setzeKopf({ titel: "Übersicht" });
    var liste = EE.quelle.module();
    var kacheln = el("div", { class: "kacheln" }, liste.map(function (modul) {
      var anzahl = modul.blaetter.length;
      var gemacht = 0, punkte = 0, max = 0;
      modul.blaetter.forEach(function (b) {
        var best = EE.session.bestwerte[b.id];
        if (best) { gemacht++; punkte += best.punkte; }
        max += maxPunkteBlatt(b);
      });
      return el("button", { type: "button", class: "kachel kachel-modul", onclick: function () { zeigeModul(modul); } }, [
        modul.nummer ? el("span", { class: "kachel-nummer", text: "Modul " + modul.nummer }) : null,
        el("span", { class: "kachel-titel", text: modul.titel }),
        modul.beschreibung ? el("span", { class: "kachel-text", text: modul.beschreibung }) : null,
        gemacht
          ? stand(gemacht + " von " + anzahl + " Übungen gemacht · " + punkte + " von " + max + " Punkten", max ? punkte / max : 0, gemacht === anzahl)
          : el("span", { class: "kachel-info", text: anzahl + (anzahl === 1 ? " Übung" : " Übungen") })
      ]);
    }));
    neueAnsicht([
      el("h1", { text: "Hallo, " + EE.session.name + "!" }),
      el("p", { class: "fliesstext", text: liste.length ? "Was möchtest du üben? Wähle ein Thema." : "Es gibt noch keine Übungen." }),
      kacheln,
      el("div", { class: "fuss fuss-mitte" }, [
        el("button", {
          type: "button",
          class: "knopf leise",
          text: "Mit anderem Namen neu starten",
          onclick: function () { EE.session.beende(); zeigeStart(); }
        })
      ])
    ]);
  }

  // ---------------------------------------------------------------
  // 2b. Übungen (Blätter) eines Moduls
  // ---------------------------------------------------------------
  function zeigeModul(modul) {
    durchgang = null;
    var titel = (modul.nummer ? "Modul " + modul.nummer + " · " : "") + modul.titel;
    setzeKopf({ titel: titel, zurueck: zeigeUebersicht, zurueckText: "Alle Themen" });
    var kacheln = el("div", { class: "kacheln" }, modul.blaetter.map(function (blatt) {
      var anzahl = blatt.seiten.filter(EE.istBewertet).length;
      var best = EE.session.bestwerte[blatt.id];
      return el("button", { type: "button", class: "kachel", onclick: function () { starteBlatt(blatt, EE.quelle.seiten(blatt), false); } }, [
        blatt.nummer !== undefined ? el("span", { class: "kachel-nummer", text: String(blatt.nummer) }) : null,
        el("span", { class: "kachel-titel", text: kurztitel(blatt, modul) }),
        blatt.beschreibung ? el("span", { class: "kachel-text", text: blatt.beschreibung }) : null,
        best
          ? stand((best.punkte === best.max ? "⭐ " : "") + "Bestes Ergebnis: " + best.punkte + " von " + best.max + " Punkten", best.punkte / best.max, best.punkte === best.max)
          : el("span", { class: "kachel-info", text: anzahl + (anzahl === 1 ? " Aufgabe" : " Aufgaben") })
      ]);
    }));
    neueAnsicht([
      el("h1", { text: modul.titel }),
      modul.beschreibung ? el("p", { class: "fliesstext", text: modul.beschreibung }) : null,
      kacheln
    ]);
  }

  /** Zurück zur Übungsliste des Moduls, in dem das Blatt steht. */
  function zurueckZumModul(blatt) {
    var m = modulVon(blatt);
    if (m) zeigeModul(m); else zeigeUebersicht();
  }

  // ---------------------------------------------------------------
  // 3. Seiten eines Blatts
  // ---------------------------------------------------------------
  function starteBlatt(blatt, seiten, nurFehler) {
    // antworten: Seitenindex → { seite, erreicht, max }. Pro Seite höchstens ein Eintrag,
    // dadurch stimmen die Punkte auch nach Überspringen/Springen (Entwicklungsmodus).
    durchgang = { blatt: blatt, seiten: seiten, nurFehler: nurFehler, index: 0, antworten: {} };
    zeigeSeite();
  }

  /** Bewertete Ergebnisse in Seitenreihenfolge. Übersprungene Seiten fehlen und zählen nicht. */
  function ergebnisse(d) {
    return Object.keys(d.antworten)
      .map(Number)
      .sort(function (a, b) { return a - b; })
      .map(function (i) { return d.antworten[i]; });
  }

  var TYP_KURZ = {
    "info": "Info", "multiple-choice": "MC", "wahr-falsch": "W/F", "eintippen": "Tippen",
    "zuordnen": "Zuordnen", "ja-nein": "Ja/Nein", "freies-html": "HTML", "quiz": "Quiz"
  };

  function zeigeSeite() {
    var d = durchgang;
    var seite = d.seiten[d.index];
    var renderer = EE.renderers[seite.typ];
    var bewertet = renderer.bewertet(seite);
    var max = bewertet ? renderer.maxPunkte(seite) : 0;
    var gezeigtUm = Date.now();
    var ausgewertet = false;
    var ctrl = {};

    setzeKopf({
      titel: d.blatt.titel + (d.nurFehler ? " – Fehler üben" : ""),
      zurueck: function () { zurueckZumModul(d.blatt); },
      zurueckText: "Zu den Übungen",
      nachfragen: true,
      fortschritt: { aktuell: d.index + 1, gesamt: d.seiten.length },
      tipps: d.blatt.tipps,
      tippsTitel: d.blatt.titel,
      springe: EE.KONFIG.entwicklung ? function (i) { d.index = i; zeigeSeite(); } : null
    });

    var inhalt = el("div", { class: "inhalt" });
    var meldung = el("p", { class: "hinweis-pruefen", role: "status", "aria-live": "polite" });
    var rueckmeldung = el("div", { class: "rueckmeldung", role: "status", "aria-live": "polite", hidden: true });
    var fuss = el("div", { class: "fuss" });
    var karte = el("section", { class: "karte seite seite-" + seite.typ }, [inhalt, meldung, rueckmeldung, fuss]);
    // Hinweis „Tippe zuerst …“ verschwindet, sobald das Kind weiter antwortet
    inhalt.addEventListener("click", function () { meldung.textContent = ""; });

    var api = {
      ueberschrift: function (text) { return el("h2", { class: "frage", text: text }); },
      bild: function (container, s) {
        if (!s.bild) return;
        var img = el("img", { src: s.bild, alt: "", class: "bild" });
        img.addEventListener("error", function () {
          img.replaceWith(el("div", { class: "bild-fehlt", text: "Bild fehlt: " + s.bild }));
        });
        container.appendChild(el("figure", { class: "abbildung" }, [
          img,
          el("figcaption", { class: "bildquelle", text: "Bild: " + s.bildQuelle })
        ]));
      },
      pruefenAusloesen: function () { pruefen(); },
      tipps: function () { return d.blatt.tipps || []; },
      antwort: function (richtig) {
        if (ausgewertet || !bewertet) return;
        auswerten({ erreicht: richtig ? max : 0, max: max });
      }
    };

    try {
      ctrl = renderer.render(inhalt, seite, api) || {};
    } catch (e) {
      seiteKaputt(e, "beim Anzeigen");
      neueAnsicht([karte]);
      return;
    }

    if (EE.KONFIG.entwicklung) {
      // Entwicklungshilfe: Seite ohne Antwort überspringen (zählt nicht zur Gesamtpunktzahl)
      karte.appendChild(el("div", { class: "dev-ueberspringen" }, [
        el("button", {
          type: "button",
          class: "knopf klein dev-knopf",
          text: "⏭ Überspringen (nur Entwicklung)",
          onclick: function () {
            d.index++;
            if (d.index >= d.seiten.length) zeigeErgebnis(); else zeigeSeite();
          }
        })
      ]));
    }

    if (bewertet && typeof ctrl.pruefen === "function") {
      fuss.appendChild(el("button", { type: "button", class: "knopf haupt", text: "Prüfen", onclick: pruefen }));
    } else if (!bewertet) {
      zeigeWeiter();
    } // sonst: freies-html meldet selbst über api.antwort()

    neueAnsicht([karte]);

    function pruefen() {
      if (ausgewertet || typeof ctrl.pruefen !== "function") return;
      if (Date.now() - gezeigtUm < DOPPELTIPP_SPERRE_MS) return;
      var fehlt = ctrl.fehlt ? ctrl.fehlt() : null;
      if (fehlt) { meldung.textContent = fehlt; return; }
      meldung.textContent = "";
      var erg;
      try {
        erg = ctrl.pruefen();
      } catch (e) {
        seiteKaputt(e, "beim Prüfen");
        return;
      }
      auswerten(erg);
    }

    function auswerten(erg) {
      ausgewertet = true;
      d.antworten[d.index] = { seite: seite, erreicht: erg.erreicht, max: erg.max };
      EE.session.notiere(seite, erg.erreicht, erg.max);

      var art = erg.erreicht >= erg.max ? "richtig" : erg.erreicht > 0 ? "teilweise" : "falsch";
      var titel = {
        richtig: "✓ Richtig!",
        teilweise: "◐ Teilweise richtig: " + erg.erreicht + " von " + erg.max + " Punkten",
        falsch: "✗ Nicht ganz. Schau dir die Lösung an."
      }[art];
      rueckmeldung.className = "rueckmeldung rueckmeldung-" + art;
      rueckmeldung.innerHTML = "";
      rueckmeldung.appendChild(el("p", { class: "rueckmeldung-titel", text: titel }));
      if (seite.erklaerung) rueckmeldung.appendChild(el("p", { class: "rueckmeldung-text", text: seite.erklaerung }));
      rueckmeldung.hidden = false;

      fuss.innerHTML = "";
      gezeigtUm = Date.now();
      var weiter = zeigeWeiter();
      weiter.focus({ preventScroll: true });
      fuss.scrollIntoView({ block: "nearest" });
    }

    function zeigeWeiter() {
      var letzte = d.index === d.seiten.length - 1;
      var knopf = el("button", {
        type: "button",
        class: "knopf haupt",
        text: letzte ? "Zum Ergebnis" : "Weiter",
        onclick: function () {
          if (Date.now() - gezeigtUm < DOPPELTIPP_SPERRE_MS) return;
          d.index++;
          if (letzte) zeigeErgebnis(); else zeigeSeite();
        }
      });
      fuss.appendChild(knopf);
      return knopf;
    }

    function seiteKaputt(e, wann) {
      EE.meldeFehler("Blatt „" + d.blatt.id + "“, Seite " + (d.seiten.indexOf(seite) + 1) + ": Fehler " + wann + ": " + e.message);
      console.error(e);
      ausgewertet = true; // zählt nicht (kein Eintrag in d.antworten)
      delete d.antworten[d.index];
      inhalt.innerHTML = "";
      inhalt.appendChild(el("p", { class: "fliesstext", text: "Diese Seite funktioniert gerade nicht. Tippe auf „Weiter“." }));
      fuss.innerHTML = "";
      zeigeWeiter();
    }
  }

  // ---------------------------------------------------------------
  // 4. Ergebnis
  // ---------------------------------------------------------------
  function zeigeErgebnis() {
    var d = durchgang;
    setzeKopf({ titel: d.blatt.titel, zurueck: function () { zurueckZumModul(d.blatt); }, zurueckText: "Zu den Übungen" });

    var punkte = 0, max = 0;
    ergebnisse(d).forEach(function (e) { punkte += e.erreicht; max += e.max; });
    // Bestwert nur aus vollständigen Durchgängen („Fehler üben“ zählt nicht)
    if (!d.nurFehler) EE.session.merkeErgebnis(d.blatt.id, punkte, max);

    var satz, lob;
    if (max === 0) {
      satz = EE.session.name + ", du hast alles angeschaut.";
      lob = "";
    } else {
      satz = EE.session.name + ", du hast " + punkte + " von " + max + " Punkten.";
      var anteil = punkte / max;
      lob = anteil === 1 ? "Super, alles richtig!"
        : anteil >= 0.6 ? "Gut gemacht!"
        : "Schön, dass du geübt hast. Probier es gern nochmal!";
    }

    var fehlerSeiten = seitenZumUeben(d);
    var knoepfe = [
      el("button", { type: "button", class: "knopf haupt", text: "Nochmal", onclick: function () { starteBlatt(d.blatt, EE.quelle.seiten(d.blatt), false); } }),
      fehlerSeiten.length ? el("button", { type: "button", class: "knopf", text: "Fehler üben", onclick: function () { starteBlatt(d.blatt, fehlerSeiten, true); } }) : null,
      el("button", { type: "button", class: "knopf", text: "Andere Übung", onclick: function () { zurueckZumModul(d.blatt); } })
    ];

    neueAnsicht([
      el("section", { class: "karte ergebnis" }, [
        el("h1", { text: "Geschafft!" }),
        el("p", { class: "ergebnis-satz", text: satz }),
        lob ? el("p", { class: "fliesstext", text: lob }) : null,
        el("div", { class: "fuss fuss-mitte" }, knoepfe)
      ])
    ]);
  }

  /**
   * Adaptivität (Stufe 1, einfach): Aufgaben mit Fehlern noch einmal,
   * Schwächen (Typ/Thema mit vielen Fehlern in dieser Sitzung) zuerst.
   * Vor jede Aufgabe kommt die zugehörige Erklärseite (z. B. mit dem Foto).
   */
  function seitenZumUeben(d) {
    var falsch = ergebnisse(d).filter(function (e) { return e.erreicht < e.max; }).map(function (e) { return e.seite; });
    var sortiert = falsch
      .map(function (s, i) { return { s: s, i: i, g: EE.session.gewicht(s) }; })
      .sort(function (a, b) { return (b.g - a.g) || (a.i - b.i); })
      .map(function (x) { return x.s; });

    var alle = d.blatt.seiten;
    var liste = [];
    sortiert.forEach(function (s) {
      for (var j = alle.indexOf(s) - 1; j >= 0; j--) {
        if (alle[j].typ === "info") {
          if (liste.indexOf(alle[j]) === -1) liste.push(alle[j]);
          break;
        }
      }
      liste.push(s);
    });
    return liste;
  }

  init();
})();
