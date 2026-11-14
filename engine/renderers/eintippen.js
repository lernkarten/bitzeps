/*
 * Renderer "eintippen" – freie Texteingabe, Vergleich mit einer Liste erlaubter Antworten.
 * Tolerant: Groß-/Kleinschreibung, Leerzeichen und Satzzeichen am Ende werden ignoriert.
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  EE.renderers["eintippen"] = {
    bewertet: function () { return true; },
    maxPunkte: function (seite) { return seite.punkte || 1; },

    render: function (c, seite, api) {
      var ueberschrift = api.ueberschrift(seite.frage);
      ueberschrift.id = "frage-" + Math.random().toString(36).slice(2);
      c.appendChild(ueberschrift);
      api.bild(c, seite);

      var eingabe = el("input", {
        type: "text",
        class: "eingabe",
        "aria-labelledby": ueberschrift.id,
        placeholder: "Deine Antwort",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        spellcheck: "false",
        enterkeyhint: "done"
      });
      eingabe.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); api.pruefenAusloesen(); }
      });
      c.appendChild(eingabe);

      var erlaubt = seite.akzeptiert.map(EE.normalisiere);

      return {
        fehlt: function () { return eingabe.value.trim() ? null : "Schreibe zuerst eine Antwort in das Feld."; },
        pruefen: function () {
          eingabe.readOnly = true;
          var ok = erlaubt.indexOf(EE.normalisiere(eingabe.value)) !== -1;
          eingabe.classList.add(ok ? "ist-richtig" : "ist-falsch");
          var marke = ok
            ? el("p", { class: "marke-zeile ist-richtig", text: "✓ deine Antwort, richtig" })
            : el("p", { class: "marke-zeile ist-falsch", text: "✗ Richtig wäre: " + seite.akzeptiert[0] });
          eingabe.insertAdjacentElement("afterend", marke);
          var max = seite.punkte || 1;
          return { erreicht: ok ? max : 0, max: max };
        }
      };
    }
  };
})();
