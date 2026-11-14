/*
 * Renderer "freies-html" – für Sonderfälle, die in keinen Standardtyp passen.
 *
 *   html      Text mit HTML (nur lokale Bilder/Dateien!)
 *   onMount   optional: function (container, api) { ... }
 *   bewertet  optional: true → Seite zählt Punkte. onMount MUSS dann api.antwort(true/false) aufrufen.
 *
 * Bei bewerteten Seiten zeigt die Engine keinen „Prüfen“-Knopf; die Seite meldet selbst über api.antwort().
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  EE.renderers["freies-html"] = {
    bewertet: function (seite) { return seite.bewertet === true; },
    maxPunkte: function (seite) { return seite.bewertet === true ? (seite.punkte || 1) : 0; },

    render: function (c, seite, api) {
      var box = el("div", { class: "freies-html" });
      box.innerHTML = seite.html;
      c.appendChild(box);
      if (typeof seite.onMount === "function") {
        seite.onMount(box, { antwort: api.antwort });
      }
      return {}; // kein pruefen() → Engine wartet auf api.antwort()
    }
  };
})();
