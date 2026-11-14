/*
 * Renderer "wahr-falsch" – eine Aussage, Antwort „Stimmt“ oder „Stimmt nicht“.
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  EE.renderers["wahr-falsch"] = {
    bewertet: function () { return true; },
    maxPunkte: function (seite) { return seite.punkte || 1; },

    render: function (c, seite, api) {
      var gewaehlt = null; // true | false | null
      var gesperrt = false;

      c.appendChild(api.ueberschrift("Stimmt das?"));
      api.bild(c, seite);
      c.appendChild(el("p", { class: "aussage", text: seite.aussage }));

      var liste = el("div", { class: "optionen optionen-nebeneinander", role: "radiogroup", "aria-label": "Antworten" });
      var knoepfe = [
        { wert: true, text: "Stimmt" },
        { wert: false, text: "Stimmt nicht" }
      ].map(function (o) {
        var knopf = el("button", { type: "button", class: "option", role: "radio", "aria-checked": "false" },
          [el("span", { class: "option-text", text: o.text })]);
        knopf.addEventListener("click", function () {
          if (gesperrt) return;
          gewaehlt = o.wert;
          knoepfe.forEach(function (k) { k.knopf.setAttribute("aria-checked", k.wert === gewaehlt ? "true" : "false"); });
        });
        liste.appendChild(knopf);
        return { wert: o.wert, knopf: knopf };
      });
      c.appendChild(liste);

      return {
        fehlt: function () { return gewaehlt === null ? "Tippe zuerst „Stimmt“ oder „Stimmt nicht“ an." : null; },
        pruefen: function () {
          gesperrt = true;
          knoepfe.forEach(function (k) {
            k.knopf.disabled = true;
            var istGewaehlt = k.wert === gewaehlt;
            if (k.wert === seite.richtig) {
              k.knopf.classList.add("ist-richtig");
              k.knopf.appendChild(el("span", { class: "marke", text: istGewaehlt ? "✓ deine Antwort, richtig" : "✓ richtige Antwort" }));
            } else if (istGewaehlt) {
              k.knopf.classList.add("ist-falsch");
              k.knopf.appendChild(el("span", { class: "marke", text: "✗ deine Antwort, falsch" }));
            }
          });
          var max = seite.punkte || 1;
          return { erreicht: gewaehlt === seite.richtig ? max : 0, max: max };
        }
      };
    }
  };
})();
