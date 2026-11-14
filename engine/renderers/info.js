/*
 * Renderer "info" – Erklärseite ohne Wertung.
 *
 * Schnittstelle aller Renderer:
 *   bewertet(seite)  → true, wenn die Seite Punkte zählt
 *   maxPunkte(seite) → höchstmögliche Punktzahl
 *   render(container, seite, api) → Steuerobjekt:
 *       fehlt()   → null oder Hinweistext, wenn noch keine Antwort gegeben wurde
 *       pruefen() → { erreicht, max }; markiert dabei richtig/falsch in der Ansicht
 *   api (von app.js): ueberschrift(text), bild(container, seite), pruefenAusloesen(), antwort(richtig)
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  EE.renderers["info"] = {
    bewertet: function () { return false; },
    maxPunkte: function () { return 0; },

    render: function (c, seite, api) {
      if (seite.titel) c.appendChild(api.ueberschrift(seite.titel));
      api.bild(c, seite);
      if (seite.text) c.appendChild(el("p", { class: "fliesstext", text: seite.text }));
      if (seite.merksatz) {
        // Merkzettel: Kopfzeile „Symbol Merke: Begriff“, darunter der Merksatz groß
        c.appendChild(el("div", { class: "merksatz", role: "note" }, [
          el("div", { class: "merksatz-kopf" }, [
            seite.merksatz.symbol ? el("span", { class: "merksatz-symbol", "aria-hidden": "true", text: seite.merksatz.symbol }) : null,
            el("span", { class: "merksatz-begriff", text: "Merke: " + seite.merksatz.begriff })
          ]),
          el("p", { class: "merksatz-text", text: seite.merksatz.text })
        ]));
      }
      if (seite.textDanach) c.appendChild(el("p", { class: "fliesstext", text: seite.textDanach }));
      if (seite.abschnitte) {
        // Farbige Blöcke mit Symbol, Überschrift und kurzem Text
        var standardFarben = ["blau", "gruen", "gelb"];
        c.appendChild(el("div", { class: "abschnitte" }, seite.abschnitte.map(function (a, i) {
          return el("div", { class: "abschnitt abschnitt-" + (a.farbe || standardFarben[i % standardFarben.length]) }, [
            a.symbol ? el("span", { class: "abschnitt-symbol", "aria-hidden": "true", text: a.symbol }) : null,
            el("div", { class: "abschnitt-inhalt" }, [
              a.titel ? el("h3", { class: "abschnitt-titel", text: a.titel }) : null,
              el("p", { class: "abschnitt-text", text: a.text })
            ])
          ]);
        })));
      }
      if (seite.kasten) c.appendChild(el("div", { class: "info-kasten", text: seite.kasten }));
      if (seite.tippsAnzeigen) {
        // Die Tipps des Blatts (blatt.tipps) – dieselbe Liste wie hinter dem Knopf „💡 Tipps“
        c.appendChild(el("div", { class: "info-kasten tipps-kasten" }, [
          el("ul", { class: "tipps-liste" }, api.tipps().map(function (t) { return el("li", { text: t }); }))
        ]));
        c.appendChild(el("p", { class: "hinweis", text: "Diese Tipps kannst du jederzeit oben unter „💡 Tipps“ nachlesen." }));
      }
      if (seite.stichpunkte) {
        c.appendChild(el("ul", { class: "stichpunkte" }, seite.stichpunkte.map(function (s) {
          return el("li", { text: s });
        })));
      }
      return {};
    }
  };
})();
