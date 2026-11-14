/*
 * Renderer "multiple-choice" – eine oder mehrere richtige Antworten.
 * Die Reihenfolge der Optionen wird bei jedem Anzeigen gemischt.
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  EE.renderers["multiple-choice"] = {
    bewertet: function () { return true; },
    maxPunkte: function (seite) { return seite.punkte || 1; },

    render: function (c, seite, api) {
      var mehrfach = Array.isArray(seite.richtig);
      var richtig = new Set(mehrfach ? seite.richtig : [seite.richtig]);
      var gewaehlt = new Set();
      var gesperrt = false;

      c.appendChild(api.ueberschrift(seite.frage));
      api.bild(c, seite);
      if (mehrfach) c.appendChild(el("p", { class: "hinweis", text: "Es können mehrere Antworten richtig sein." }));

      var liste = el("div", { class: "optionen", role: mehrfach ? "group" : "radiogroup", "aria-label": "Antworten" });
      var knoepfe = EE.mischen(seite.optionen.map(function (_, i) { return i; })).map(function (i) {
        var knopf = el("button", {
          type: "button",
          class: "option",
          role: mehrfach ? "checkbox" : "radio",
          "aria-checked": "false"
        }, [el("span", { class: "option-text", text: seite.optionen[i] })]);
        knopf.addEventListener("click", function () {
          if (gesperrt) return;
          if (mehrfach) {
            if (gewaehlt.has(i)) gewaehlt.delete(i); else gewaehlt.add(i);
          } else {
            gewaehlt.clear();
            gewaehlt.add(i);
          }
          aktualisiere();
        });
        liste.appendChild(knopf);
        return { i: i, knopf: knopf };
      });
      c.appendChild(liste);

      function aktualisiere() {
        knoepfe.forEach(function (k) {
          k.knopf.setAttribute("aria-checked", gewaehlt.has(k.i) ? "true" : "false");
        });
      }

      return {
        fehlt: function () {
          return gewaehlt.size ? null : (mehrfach ? "Tippe zuerst mindestens eine Antwort an." : "Tippe zuerst eine Antwort an.");
        },
        pruefen: function () {
          gesperrt = true;
          knoepfe.forEach(function (k) {
            var istRichtig = richtig.has(k.i), istGewaehlt = gewaehlt.has(k.i);
            k.knopf.disabled = true;
            var marke = null;
            if (istRichtig) {
              k.knopf.classList.add("ist-richtig");
              marke = istGewaehlt ? "✓ deine Antwort, richtig" : "✓ richtige Antwort";
            } else if (istGewaehlt) {
              k.knopf.classList.add("ist-falsch");
              marke = "✗ deine Antwort, falsch";
            }
            if (marke) k.knopf.appendChild(el("span", { class: "marke", text: marke }));
          });
          var allesRichtig = gewaehlt.size === richtig.size && Array.from(gewaehlt).every(function (i) { return richtig.has(i); });
          var max = seite.punkte || 1;
          return { erreicht: allesRichtig ? max : 0, max: max };
        }
      };
    }
  };
})();
