/*
 * Renderer "ja-nein" – mehrere Aussagen auf einer Seite, jede mit „Ja“ / „Nein“.
 * Nach dem Prüfen steht unter jeder Aussage ✓/✗ und ihre eigene Erklärung.
 * Punkte: pro richtig beantworteter Aussage (seite.punkte, Standard 1).
 * Die Reihenfolge bleibt wie im Blatt (Aussagen bauen oft aufeinander auf).
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;
  var zaehler = 0;

  EE.renderers["ja-nein"] = {
    bewertet: function () { return true; },
    maxPunkte: function (seite) { return seite.aussagen.length * (seite.punkte || 1); },

    render: function (c, seite, api) {
      var labels = seite.antworten || ["Ja", "Nein"];
      var wahl = seite.aussagen.map(function () { return null; });
      var gesperrt = false;

      c.appendChild(api.ueberschrift(seite.frage));
      api.bild(c, seite);
      c.appendChild(el("p", { class: "hinweis", text: "Tippe bei jedem Satz auf „" + labels[0] + "“ oder „" + labels[1] + "“." }));

      var liste = el("ol", { class: "jn-liste" });
      var zeilen = seite.aussagen.map(function (aussage, i) {
        var textId = "jn-" + (++zaehler);
        var knoepfe = [true, false].map(function (wert, j) {
          var knopf = el("button", { type: "button", class: "jn-knopf", role: "radio", "aria-checked": "false", text: labels[j] });
          knopf.addEventListener("click", function () {
            if (gesperrt) return;
            wahl[i] = wert;
            aktualisiere(i);
          });
          return { wert: wert, knopf: knopf };
        });
        var inhalt = el("div", { class: "jn-inhalt" }, [
          el("p", { class: "jn-text", id: textId, text: aussage.text }),
          el("div", { class: "jn-knoepfe", role: "radiogroup", "aria-labelledby": textId }, knoepfe.map(function (k) { return k.knopf; }))
        ]);
        var zeile = el("li", { class: "jn-zeile" }, [
          el("span", { class: "jn-nummer", "aria-hidden": "true", text: String(i + 1) }),
          inhalt
        ]);
        liste.appendChild(zeile);
        return { zeile: zeile, inhalt: inhalt, knoepfe: knoepfe };
      });
      c.appendChild(liste);

      function aktualisiere(i) {
        var z = zeilen[i];
        z.knoepfe.forEach(function (k) { k.knopf.setAttribute("aria-checked", k.wert === wahl[i] ? "true" : "false"); });
        z.zeile.classList.add("beantwortet");
        z.zeile.classList.remove("offen");
      }

      return {
        fehlt: function () {
          var offen = [];
          zeilen.forEach(function (z, i) {
            z.zeile.classList.toggle("offen", wahl[i] === null);
            if (wahl[i] === null) offen.push(z);
          });
          if (!offen.length) return null;
          offen[0].zeile.scrollIntoView({ block: "nearest" });
          return offen.length === 1 ? "Ein Satz fehlt noch. Er ist gelb markiert." : offen.length + " Sätze fehlen noch. Sie sind gelb markiert.";
        },
        pruefen: function () {
          gesperrt = true;
          var anzahlRichtig = 0;
          seite.aussagen.forEach(function (aussage, i) {
            var z = zeilen[i];
            var ok = wahl[i] === aussage.richtig;
            if (ok) anzahlRichtig++;
            z.zeile.classList.add(ok ? "ist-richtig" : "ist-falsch");
            z.knoepfe.forEach(function (k) { k.knopf.disabled = true; });
            z.inhalt.appendChild(el("p", {
              class: "jn-ergebnis",
              text: ok ? "✓ Richtig" : "✗ Richtig wäre: " + labels[aussage.richtig ? 0 : 1]
            }));
            if (aussage.erklaerung) z.inhalt.appendChild(el("p", { class: "jn-erklaerung", text: aussage.erklaerung }));
          });
          var max = EE.renderers["ja-nein"].maxPunkte(seite);
          return { erreicht: anzahlRichtig * (seite.punkte || 1), max: max };
        }
      };
    }
  };
})();
