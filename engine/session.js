/*
 * session.js – Zustand der aktuellen Sitzung. NUR im Arbeitsspeicher.
 * Nach Neuladen oder Schließen der Seite ist alles weg. Das ist gewollt.
 */
(function () {
  "use strict";

  var EE = window.EE;

  EE.session = {
    name: "",

    // Fehlerstatistik für die Adaptivität: pro Aufgabentyp und pro Thema
    // { "zuordnen": { versuche: 3, fehler: 1 }, ... }
    statistik: { typ: {}, thema: {} },

    // Bestes Ergebnis pro Blatt in dieser Sitzung: { blattId: { punkte, max } }
    bestwerte: {},

    starte: function (name) {
      this.name = name;
      this.statistik = { typ: {}, thema: {} };
      this.bestwerte = {};
    },

    beende: function () {
      this.name = "";
      this.statistik = { typ: {}, thema: {} };
      this.bestwerte = {};
    },

    /** Nach einem vollständigen Durchgang aufrufen; behält das beste Ergebnis. */
    merkeErgebnis: function (blattId, punkte, max) {
      if (!max) return;
      var alt = this.bestwerte[blattId];
      if (!alt || punkte / max > alt.punkte / alt.max) this.bestwerte[blattId] = { punkte: punkte, max: max };
    },

    /** Nach jeder bewerteten Aufgabe aufrufen. */
    notiere: function (seite, erreicht, max) {
      var fehler = erreicht < max;
      [["typ", seite.typ], ["thema", seite.thema]].forEach(function (paar) {
        var bereich = this.statistik[paar[0]];
        var schluessel = paar[1] || "(ohne)";
        var eintrag = bereich[schluessel] || (bereich[schluessel] = { versuche: 0, fehler: 0 });
        eintrag.versuche++;
        if (fehler) eintrag.fehler++;
      }, this);
    },

    /**
     * Gewicht einer Aufgabe für das Ziehen/Sortieren: 1 + Fehlerquote von Typ und Thema.
     * Werte zwischen 1 (bisher alles richtig) und 3 (bisher alles falsch).
     */
    gewicht: function (seite) {
      function quote(eintrag) { return eintrag && eintrag.versuche ? eintrag.fehler / eintrag.versuche : 0; }
      return 1 + quote(this.statistik.typ[seite.typ]) + quote(this.statistik.thema[seite.thema]);
    }
  };
})();
