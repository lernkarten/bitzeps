/*
 * Renderer "quiz" – mehrere kleine Aufgaben untereinander auf einer Seite.
 *
 * Jede Teilaufgabe ist eine normale Aufgabe (multiple-choice, wahr-falsch, eintippen, ja-nein)
 * und wird von ihrem eigenen Renderer dargestellt. Ein gemeinsamer Knopf „Prüfen“ prüft alle;
 * jede Teilaufgabe zeigt danach ihre eigene „erklaerung“. Punkte = Summe der Teilaufgaben.
 * Fehlen in einer Teilaufgabe „thema“/„stufe“, gelten die Werte des Quiz.
 */
(function () {
  "use strict";
  var EE = window.EE, el = EE.el;

  EE.QUIZ_TYPEN = ["multiple-choice", "wahr-falsch", "eintippen", "ja-nein"];

  function teile(seite) { return Array.isArray(seite.aufgaben) ? seite.aufgaben : []; }

  EE.renderers["quiz"] = {
    bewertet: function () { return true; },
    maxPunkte: function (seite) {
      return teile(seite).reduce(function (summe, t) {
        var r = EE.renderers[t.typ];
        return summe + (r ? r.maxPunkte(t) : 0);
      }, 0);
    },

    render: function (c, seite, api) {
      if (seite.titel) c.appendChild(api.ueberschrift(seite.titel));

      // Teilaufgaben bekommen kleinere Überschriften, sonst dieselbe api
      var teilApi = Object.assign({}, api, {
        ueberschrift: function (text) { return el("h3", { class: "frage quiz-frage", text: text }); }
      });

      var steuerungen = teile(seite).map(function (teil, i) {
        var box = el("div", { class: "quiz-teil quiz-" + teil.typ });
        var kopf = el("span", { class: "quiz-nummer", "aria-hidden": "true", text: String(i + 1) });
        var inhalt = el("div", { class: "quiz-inhalt" });
        box.appendChild(kopf);
        box.appendChild(inhalt);
        c.appendChild(box);
        var ctrl = EE.renderers[teil.typ].render(inhalt, teil, teilApi) || {};
        return { teil: teil, box: box, inhalt: inhalt, ctrl: ctrl };
      });

      return {
        fehlt: function () {
          var offen = steuerungen.filter(function (s) { return s.ctrl.fehlt && s.ctrl.fehlt(); });
          steuerungen.forEach(function (s) { s.box.classList.toggle("offen", offen.indexOf(s) !== -1); });
          if (!offen.length) return null;
          var nummern = offen.map(function (s) { return steuerungen.indexOf(s) + 1; });
          return nummern.length === 1
            ? "Aufgabe " + nummern[0] + " fehlt noch."
            : "Die Aufgaben " + nummern.join(", ").replace(/, (\d+)$/, " und $1") + " fehlen noch.";
        },
        pruefen: function () {
          var erreicht = 0, max = 0;
          steuerungen.forEach(function (s) {
            var erg = s.ctrl.pruefen();
            erreicht += erg.erreicht;
            max += erg.max;
            s.box.classList.remove("offen");
            s.box.classList.add(erg.erreicht >= erg.max ? "ist-richtig" : "ist-falsch");
            if (s.teil.erklaerung) s.inhalt.appendChild(el("p", { class: "quiz-erklaerung", text: s.teil.erklaerung }));
          });
          return { erreicht: erreicht, max: max };
        }
      };
    }
  };
})();
